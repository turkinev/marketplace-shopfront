import { useState, useRef } from "react";
import { useStorefrontBlocks, StorefrontBlock, BlockType, ShelfConfig, TilesConfig, BannerConfig, ReviewsConfig } from "@/hooks/useStorefrontBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical, Eye, LayoutGrid, Image, MessageSquare, ShoppingBag, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAllProducts } from "@/hooks/useInfiniteProducts";
import { cn } from "@/lib/utils";

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

// Shelf Editor
const ShelfEditor = ({ block, onUpdate }: { block: StorefrontBlock; onUpdate: (config: ShelfConfig) => void }) => {
  const config = block.config as ShelfConfig;
  const products = useAllProducts();

  const toggleProduct = (id: string) => {
    const ids = config.productIds.includes(id)
      ? config.productIds.filter((pid) => pid !== id)
      : [...config.productIds, id];
    onUpdate({ ...config, productIds: ids });
  };

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
      <div>
        <Label>Товары в подборке ({config.productIds.length} выбрано, мин. 5)</Label>
        <div className="grid grid-cols-1 gap-2 mt-2 max-h-[300px] overflow-y-auto">
          {products.map((p) => (
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
            <Label className="text-xs">URL изображения</Label>
            <Input value={tile.imageUrl} onChange={(e) => updateTile(i, "imageUrl", e.target.value)} placeholder="https://..." />
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

  const addBanner = () => {
    if (config.banners.length >= 5) return;
    onUpdate({ ...config, banners: [...config.banners, { id: crypto.randomUUID(), imageUrl: "", link: "" }] });
  };

  const removeBanner = (index: number) => {
    if (config.banners.length <= (isSlider ? 2 : 1)) return;
    onUpdate({ ...config, banners: config.banners.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Размер</Label>
        <Select value={config.size} onValueChange={(v) => onUpdate({ ...config, size: v as BannerConfig["size"] })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="S">S — узкий</SelectItem>
            <SelectItem value="M">M — широкий</SelectItem>
            <SelectItem value="L">L — вертикальный</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {config.size === "S" && "Моб: 686×290, ПК: 2832×600"}
          {config.size === "M" && "Моб: 686×560, ПК: 2832×600"}
          {config.size === "L" && "Моб: 686×924, ПК: 2832×600"}
        </p>
      </div>

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
            <Label className="text-xs">URL изображения</Label>
            <Input value={banner.imageUrl} onChange={(e) => updateBanner(i, "imageUrl", e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label className="text-xs">Ссылка (куда ведёт)</Label>
            <Input value={banner.link} onChange={(e) => updateBanner(i, "link", e.target.value)} placeholder="/products?category=..." />
          </div>
          {banner.imageUrl && (
            <img src={banner.imageUrl} alt="" className="w-full h-20 object-cover rounded bg-secondary" />
          )}
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
  const { blocks, addBlock, updateBlock, removeBlock, reorderBlocks } = useStorefrontBlocks();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
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
          <Button variant="outline" className="gap-2" onClick={() => { navigate("/"); toast.success("Предпросмотр открыт"); }}>
            <Eye className="h-4 w-4" /> Предпросмотр
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 flex gap-6 flex-col lg:flex-row">
        {/* Block List */}
        <div className="w-full lg:w-80 flex-shrink-0">
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
                        {(block.type === "banner" || block.type === "slider") && `Размер ${(block.config as BannerConfig).size}`}
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
