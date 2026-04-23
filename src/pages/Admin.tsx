import { useState, useRef } from "react";
import { useStorefrontBlocks, StorefrontBlock, BlockType, ShelfConfig, TilesConfig, BannerConfig, ReviewsConfig } from "@/hooks/useStorefrontBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical, Eye, LayoutGrid, Image, MessageSquare, ShoppingBag, ChevronLeft, Upload, ChevronRight, Search, Save, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAllProducts } from "@/hooks/useInfiniteProducts";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const blockTypeLabels: Record<BlockType, string> = {
  shelf: "Полка",
  tiles: "Плитки",
  banner: "Баннер",
  slider: "Слайдер",
  reviews: "Отзывы",
};

const blockTypeIcons: Record<BlockType, React.ReactNode> = {
  shelf: <ShoppingBag className="h-5 w-5" />,
  tiles: <LayoutGrid className="h-5 w-5" />,
  banner: <Image className="h-5 w-5" />,
  slider: <Image className="h-5 w-5" />,
  reviews: <MessageSquare className="h-5 w-5" />,
};

const blockTypeDescriptions: Record<BlockType, string> = {
  shelf: "Горизонтальная подборка товаров. Минимум 5 товаров.",
  tiles: "Плитки с категориями, брендами или товарами.",
  banner: "Одиночный рекламный баннер.",
  slider: "Карусель из 2–5 баннеров.",
  reviews: "Блок с отзывами покупателей.",
};

// Category tree data
interface Category {
  label: string;
  children?: Category[];
}

const categoryTree: Category[] = [
  {
    label: "Одежда и обувь для детей",
    children: [
      { label: "Одежда для детей" },
      { label: "Детский трикотаж" },
    ],
  },
  {
    label: "Одежда и обувь для женщин",
    children: [
      { label: "Бельё, купальники, колготки, носки для женщин" },
      { label: "Трусы женские" },
      { label: "Домашняя одежда для женщин" },
      { label: "Сорочки пижамы" },
      { label: "Халаты, туники" },
    ],
  },
  {
    label: "Одежда для женщин",
    children: [
      { label: "Лонгсливы" },
      { label: "Брюки" },
      { label: "Футболки" },
      { label: "Платья" },
      { label: "Блузки" },
    ],
  },
  {
    label: "Одежда и обувь для мужчин",
    children: [
      { label: "Футболки мужские" },
      { label: "Брюки мужские" },
      { label: "Куртки мужские" },
    ],
  },
  {
    label: "Электроника и аксессуары",
    children: [
      { label: "Наушники" },
      { label: "Зарядные устройства" },
      { label: "Клавиатуры и мыши" },
    ],
  },
  {
    label: "Товары для дома",
    children: [
      { label: "Бытовая химия" },
      { label: "Посуда" },
    ],
  },
];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "26/92", "26/98", "28/104", "44-54"];

// CategoryTree component
const CategoryTree = ({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (cat: string | null) => void;
}) => {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-2 w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
          selected === null ? "text-primary font-semibold" : "text-foreground hover:bg-secondary/50"
        )}
      >
        Выбрать все
      </button>
      <Accordion type="multiple" className="w-full">
        {categoryTree.map((cat, i) => (
          <AccordionItem key={i} value={`cat-${i}`} className="border-none">
            <AccordionTrigger className="py-1.5 px-2 text-sm font-normal hover:no-underline hover:bg-secondary/50 rounded-md">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(cat.label);
                }}
                className={cn(
                  "text-left flex-1",
                  selected === cat.label && "text-primary font-semibold"
                )}
              >
                {cat.label}
              </span>
            </AccordionTrigger>
            {cat.children && (
              <AccordionContent className="pb-0 pl-4">
                {cat.children.map((child, j) => (
                  <button
                    key={j}
                    onClick={() => onSelect(child.label)}
                    className={cn(
                      "flex items-center gap-2 w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                      selected === child.label ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {child.label}
                  </button>
                ))}
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Shelf Editor with categories and filters
const ShelfEditor = ({ block, onUpdate }: { block: StorefrontBlock; onUpdate: (config: ShelfConfig) => void }) => {
  const config = block.config as ShelfConfig;
  const products = useAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));

  const toggleProduct = (id: string) => {
    const ids = config.productIds.includes(id)
      ? config.productIds.filter((pid) => pid !== id)
      : [...config.productIds, id];
    onUpdate({ ...config, productIds: ids });
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = products.filter((p) => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Название полки</Label>
        <Input
          value={config.title}
          onChange={(e) => onUpdate({ ...config, title: e.target.value })}
          placeholder="Например, «Мужская обувь»"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        {/* Left sidebar: category tree + filters */}
        <div className="space-y-4">
          {/* Category tree */}
          <div className="border border-border rounded-lg p-3">
            <h4 className="text-sm font-semibold text-foreground mb-2">Каталоги товаров</h4>
            <ScrollArea className="max-h-[250px]">
              <CategoryTree selected={selectedCategory} onSelect={setSelectedCategory} />
            </ScrollArea>
          </div>

          {/* Price range filter */}
          <div className="border border-border rounded-lg p-3 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Ценовой диапазон</h4>
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              min={minPrice}
              max={maxPrice}
              step={10}
              className="mt-2"
            />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="h-8 text-xs"
                  placeholder={`Мин: ${minPrice}`}
                />
              </div>
              <span className="text-muted-foreground text-sm">—</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="h-8 text-xs"
                  placeholder={`${maxPrice}`}
                />
              </div>
            </div>
          </div>

          {/* Size filter */}
          <div className="border border-border rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Размер</h4>
            <ScrollArea className="max-h-[180px]">
              <div className="space-y-1">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="accent-primary rounded"
                    />
                    <span className="text-sm text-foreground">{size}</span>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right: product list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Товары ({config.productIds.length} выбрано, мин. 5)</Label>
            <span className="text-xs text-primary">{filteredProducts.length} товаров</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию..."
              className="pl-9 h-9"
            />
          </div>

          <ScrollArea className="max-h-[400px]">
            <div className="grid grid-cols-1 gap-2">
              {filteredProducts.map((p) => (
                <label key={p.id} className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors",
                  config.productIds.includes(p.id) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                )}>
                  <input
                    type="checkbox"
                    checked={config.productIds.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className="accent-primary"
                  />
                  <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded object-cover bg-secondary" />
                  <span className="text-sm text-foreground truncate flex-1">{p.name}</span>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{p.price} ₽</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

// Tiles Editor
const TilesEditor = ({ block, onUpdate }: { block: StorefrontBlock; onUpdate: (config: TilesConfig) => void }) => {
  const config = block.config as TilesConfig;

  const setCount = (count: string) => {
    const c = Number(count) as 2 | 4 | 6;
    const tiles = [...config.tiles];
    while (tiles.length < c) tiles.push({ id: crypto.randomUUID(), imageUrl: "", title: "", link: "" });
    onUpdate({ count: c, tiles: tiles.slice(0, c) });
  };

  const updateTile = (index: number, field: string, value: string) => {
    const tiles = [...config.tiles];
    tiles[index] = { ...tiles[index], [field]: value };
    onUpdate({ ...config, tiles });
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateTile(index, "imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Количество плиток</Label>
        <Select value={String(config.count)} onValueChange={setCount}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 плитки</SelectItem>
            <SelectItem value="4">4 плитки</SelectItem>
            <SelectItem value="6">6 плиток</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {config.tiles.map((tile, i) => (
        <div key={tile.id} className="p-3 border border-border rounded-lg space-y-2">
          <p className="text-sm font-medium text-foreground">Плитка {i + 1}</p>
          <div>
            <Label className="text-xs">Заголовок</Label>
            <Input value={tile.title} onChange={(e) => updateTile(i, "title", e.target.value)} placeholder="Название" />
          </div>
          <div>
            <Label className="text-xs">Изображение</Label>
            {tile.imageUrl ? (
              <div className="relative group w-full h-24 rounded-lg overflow-hidden border border-border">
                <img src={tile.imageUrl} alt={tile.title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => updateTile(i, "imageUrl", "")}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                >
                  Удалить
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1 block">Загрузить фото</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(i, e)} />
              </label>
            )}
          </div>
          <div>
            <Label className="text-xs">Ссылка (куда ведёт)</Label>
            <Input value={tile.link} onChange={(e) => updateTile(i, "link", e.target.value)} placeholder="/products?category=..." />
          </div>
        </div>
      ))}
    </div>
  );
};

// Banner/Slider Editor
const BannerEditor = ({ block, onUpdate }: { block: StorefrontBlock; onUpdate: (config: BannerConfig) => void }) => {
  const config = block.config as BannerConfig;
  const isSlider = block.type === "slider";

  const updateBanner = (index: number, field: string, value: string) => {
    const banners = [...config.banners];
    banners[index] = { ...banners[index], [field]: value };
    onUpdate({ ...config, banners });
  };

  const handleBannerImageUpload = (index: number, field: "imageUrl" | "mobileImageUrl", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateBanner(index, field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addBanner = () => {
    if (config.banners.length >= 5) return;
    onUpdate({ ...config, banners: [...config.banners, { id: crypto.randomUUID(), imageUrl: "", mobileImageUrl: "", link: "" }] });
  };

  const removeBanner = (index: number) => {
    if (config.banners.length <= (isSlider ? 2 : 1)) return;
    onUpdate({ ...config, banners: config.banners.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {config.banners.map((banner, i) => (
        <div key={banner.id} className="p-3 border border-border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Баннер {i + 1}</p>
            {config.banners.length > (isSlider ? 2 : 1) && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeBanner(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
          <div>
            <Label className="text-xs">ПК версия</Label>
            {banner.imageUrl ? (
              <div className="relative group w-full h-24 rounded-lg overflow-hidden border border-border">
                <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => updateBanner(i, "imageUrl", "")}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                >
                  Удалить
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1 block">Загрузить фото</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerImageUpload(i, "imageUrl", e)} />
              </label>
            )}
          </div>
          <div>
            <Label className="text-xs">Мобильная версия</Label>
            {banner.mobileImageUrl ? (
              <div className="relative group w-full h-24 rounded-lg overflow-hidden border border-border">
                <img src={banner.mobileImageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => updateBanner(i, "mobileImageUrl", "")}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                >
                  Удалить
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1 block">Загрузить фото</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerImageUpload(i, "mobileImageUrl", e)} />
              </label>
            )}
          </div>
          <div>
            <Label className="text-xs">Ссылка (куда ведёт)</Label>
            <Input value={banner.link} onChange={(e) => updateBanner(i, "link", e.target.value)} placeholder="/products?category=..." />
          </div>
        </div>
      ))}

      {isSlider && config.banners.length < 5 && (
        <Button variant="outline" size="sm" onClick={addBanner} className="w-full gap-2">
          <Plus className="h-4 w-4" /> Добавить баннер
        </Button>
      )}
    </div>
  );
};

// Reviews Editor
const ReviewsEditor = ({ block, onUpdate }: { block: StorefrontBlock; onUpdate: (config: ReviewsConfig) => void }) => {
  const config = block.config as ReviewsConfig;

  return (
    <div className="space-y-4">
      <div>
        <Label>Заголовок блока</Label>
        <Input value={config.title} onChange={(e) => onUpdate({ ...config, title: e.target.value })} />
      </div>
      <div>
        <Label>Количество отзывов</Label>
        <Select value={String(config.showCount)} onValueChange={(v) => onUpdate({ ...config, showCount: Number(v) })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const Admin = () => {
  const {
    blocks, addBlock, updateBlock, removeBlock, reorderBlocks,
    templates, activeTemplateId,
    saveAsTemplate, loadTemplate, deleteTemplate,
  } = useStorefrontBlocks();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const navigate = useNavigate();

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const handleAdd = (type: BlockType) => {
    const id = addBlock(type);
    setSelectedBlockId(id);
    setAddDialogOpen(false);
    toast.success(`Блок «${blockTypeLabels[type]}» добавлен`);
  };

  const handleDelete = (id: string) => {
    removeBlock(id);
    if (selectedBlockId === id) setSelectedBlockId(null);
    toast.success("Блок удалён");
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      reorderBlocks(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    saveAsTemplate(newTemplateName.trim());
    setNewTemplateName("");
    setSaveDialogOpen(false);
    toast.success("Шаблон сохранён");
  };

  const handleLoadTemplate = (templateId: string) => {
    loadTemplate(templateId);
    toast.success("Шаблон загружен");
  };

  const renderEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Выберите блок для редактирования
        </div>
      );
    }

    const onUpdate = (config: StorefrontBlock["config"]) => updateBlock(selectedBlock.id, config);

    switch (selectedBlock.type) {
      case "shelf":
        return <ShelfEditor block={selectedBlock} onUpdate={onUpdate as (c: ShelfConfig) => void} />;
      case "tiles":
        return <TilesEditor block={selectedBlock} onUpdate={onUpdate as (c: TilesConfig) => void} />;
      case "banner":
      case "slider":
        return <BannerEditor block={selectedBlock} onUpdate={onUpdate as (c: BannerConfig) => void} />;
      case "reviews":
        return <ReviewsEditor block={selectedBlock} onUpdate={onUpdate as (c: ReviewsConfig) => void} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Конструктор витрины</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => { navigate("/?preview=1"); toast.success("Предпросмотр открыт"); }}>
            <Eye className="h-4 w-4" /> Предпросмотр
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 flex gap-6 flex-col lg:flex-row">
        {/* Block List */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          {/* Store selector */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Мои магазины
            </h3>

            <Select
              value={activeTemplateId || ""}
              onValueChange={(v) => handleLoadTemplate(v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Выберите магазин..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.blocks.length} блоков</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Save className="h-3.5 w-3.5" /> Сохранить витрину
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Сохранить витрину магазина</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-2">
                    <Input
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="Название магазина..."
                      onKeyDown={(e) => e.key === "Enter" && handleSaveTemplate()}
                    />
                    <Button onClick={handleSaveTemplate} className="w-full" disabled={!newTemplateName.trim()}>
                      Сохранить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {activeTemplateId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    deleteTemplate(activeTemplateId);
                    toast.success("Магазин удалён");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Blocks list */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Блоки</h2>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Добавить</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить блок</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {(["shelf", "tiles", "banner", "slider", "reviews"] as BlockType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleAdd(type)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {blockTypeIcons[type]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{blockTypeLabels[type]}</p>
                          <p className="text-xs text-muted-foreground">{blockTypeDescriptions[type]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {blocks.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Нет добавленных блоков.<br />Нажмите «Добавить» чтобы начать.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors",
                      selectedBlockId === block.id && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {blockTypeIcons[block.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {blockTypeLabels[block.type]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {block.type === "shelf" && (block.config as ShelfConfig).title}
                        {block.type === "tiles" && `${(block.config as TilesConfig).count} плиток`}
                        {(block.type === "banner") && `Баннер`}
                        {(block.type === "slider") && `${(block.config as BannerConfig).banners.length} баннеров`}
                        {block.type === "reviews" && (block.config as ReviewsConfig).title}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); handleDelete(block.id); }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1">
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 min-h-[400px]">
            {selectedBlock && (
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                {blockTypeIcons[selectedBlock.type]}
                Настройки: {blockTypeLabels[selectedBlock.type]}
              </h3>
            )}
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
