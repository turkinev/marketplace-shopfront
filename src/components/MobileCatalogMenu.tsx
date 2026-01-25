import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  subcategories: SubCategory[];
}

const categories: Category[] = [
  {
    id: "1",
    name: "Футболки",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
    subcategories: [
      { id: "1-1", name: "Мужские футболки" },
      { id: "1-2", name: "Женские футболки" },
      { id: "1-3", name: "Детские футболки" },
      { id: "1-4", name: "Спортивные футболки" },
    ],
  },
  {
    id: "2",
    name: "Джинсы",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
    subcategories: [
      { id: "2-1", name: "Мужские джинсы" },
      { id: "2-2", name: "Женские джинсы" },
      { id: "2-3", name: "Скинни" },
      { id: "2-4", name: "Прямые" },
    ],
  },
  {
    id: "3",
    name: "Куртки",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
    subcategories: [
      { id: "3-1", name: "Зимние куртки" },
      { id: "3-2", name: "Демисезонные" },
      { id: "3-3", name: "Ветровки" },
      { id: "3-4", name: "Пуховики" },
    ],
  },
  {
    id: "4",
    name: "Платья",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
    subcategories: [
      { id: "4-1", name: "Вечерние платья" },
      { id: "4-2", name: "Повседневные" },
      { id: "4-3", name: "Летние платья" },
      { id: "4-4", name: "Коктейльные" },
    ],
  },
  {
    id: "5",
    name: "Обувь",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    subcategories: [
      { id: "5-1", name: "Кроссовки" },
      { id: "5-2", name: "Туфли" },
      { id: "5-3", name: "Сапоги" },
      { id: "5-4", name: "Сандалии" },
    ],
  },
  {
    id: "6",
    name: "Аксессуары",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop",
    subcategories: [
      { id: "6-1", name: "Сумки" },
      { id: "6-2", name: "Ремни" },
      { id: "6-3", name: "Часы" },
      { id: "6-4", name: "Очки" },
    ],
  },
];

interface MobileCatalogMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string | null, categoryName: string | null) => void;
  storeName: string;
}

export const MobileCatalogMenu = ({
  isOpen,
  onClose,
  onSelectCategory,
  storeName,
}: MobileCatalogMenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onClose();
    }
  };

  const handleAllProducts = () => {
    onSelectCategory(null, null);
  };

  const handleSubcategoryClick = (subcategoryId: string, subcategoryName: string) => {
    onSelectCategory(subcategoryId, subcategoryName);
  };

  const handleCategoryAllProducts = () => {
    if (selectedCategory) {
      onSelectCategory(selectedCategory.id, selectedCategory.name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            {selectedCategory ? selectedCategory.name : "Каталог"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {!selectedCategory ? (
          // First level - Categories
          <div className="space-y-2">
            {/* All products */}
            <button
              onClick={handleAllProducts}
              className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">Все товары</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            
            {/* Categories */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="w-full flex items-center gap-4 p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <span className="text-sm font-medium text-foreground flex-1 text-left">{category.name}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          // Second level - Subcategories
          <div className="space-y-2">
            {/* All products in category */}
            <button
              onClick={handleCategoryAllProducts}
              className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">Все товары</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            
            {/* Subcategories */}
            {selectedCategory.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id, subcategory.name)}
                className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{subcategory.name}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
