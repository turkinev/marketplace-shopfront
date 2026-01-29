import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  children?: CategoryItem[];
}

const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Одежда",
    count: 1250,
    children: [
      { id: "1-1", name: "Мужская одежда", count: 420 },
      { id: "1-2", name: "Женская одежда", count: 580 },
      { id: "1-3", name: "Детская одежда", count: 250 },
    ],
  },
  {
    id: "2",
    name: "Обувь",
    count: 840,
    children: [
      { id: "2-1", name: "Мужская обувь", count: 320 },
      { id: "2-2", name: "Женская обувь", count: 520 },
    ],
  },
  {
    id: "3",
    name: "Электроника",
    count: 560,
    children: [
      { id: "3-1", name: "Смартфоны", count: 180 },
      { id: "3-2", name: "Ноутбуки", count: 120 },
      { id: "3-3", name: "Аксессуары", count: 260 },
    ],
  },
  {
    id: "4",
    name: "Дом и сад",
    count: 720,
  },
  {
    id: "5",
    name: "Красота",
    count: 480,
  },
  {
    id: "6",
    name: "Спорт",
    count: 340,
  },
];

interface CategoryTreeItemProps {
  category: CategoryItem;
  level?: number;
  selectedId?: string;
  onSelect: (id: string) => void;
}

const CategoryTreeItem = ({ category, level = 0, selectedId, onSelect }: CategoryTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center gap-2 py-2 px-2 text-left hover:bg-secondary rounded-md transition-colors text-sm",
          isSelected && "bg-primary/10 text-primary font-medium"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onSelect(category.id);
        }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}
        <span className="flex-1 truncate">{category.name}</span>
        {category.count && (
          <span className="text-xs text-muted-foreground">{category.count}</span>
        )}
      </button>
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductsSidebarProps {
  onCategorySelect?: (categoryId: string) => void;
  onFiltersChange?: (filters: any) => void;
}

export const ProductsSidebar = ({ onCategorySelect, onFiltersChange }: ProductsSidebarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    onCategorySelect?.(id);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleReset = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  return (
    <div className="w-64 flex-shrink-0 space-y-6">
      {/* Categories */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-3">Категории</h3>
        <div className="space-y-0.5">
          {categories.map((category) => (
            <CategoryTreeItem
              key={category.id}
              category={category}
              selectedId={selectedCategory}
              onSelect={handleCategorySelect}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Фильтры</h3>
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={handleReset}>
            Сбросить
          </Button>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Цена, ₽</h4>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} ₽</span>
            <span>{priceRange[1].toLocaleString()} ₽</span>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Размер</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                  selectedSizes.includes(size)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          />
          <label htmlFor="in-stock" className="text-sm text-foreground cursor-pointer">
            Только в наличии
          </label>
        </div>

        {/* Apply Button */}
        <Button className="w-full" size="sm">
          Применить
        </Button>
      </div>
    </div>
  );
};
