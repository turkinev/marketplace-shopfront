import { useState } from "react";
import { ArrowLeft, ChevronRight, LayoutGrid, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubCategory {
  id: string;
  name: string;
  imageUrl: string;
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
      { id: "1-1", name: "Мужские футболки", imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=100&h=100&fit=crop" },
      { id: "1-2", name: "Женские футболки", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop" },
      { id: "1-3", name: "Детские футболки", imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=100&h=100&fit=crop" },
      { id: "1-4", name: "Спортивные футболки", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "2",
    name: "Джинсы",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
    subcategories: [
      { id: "2-1", name: "Мужские джинсы", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=100&fit=crop" },
      { id: "2-2", name: "Женские джинсы", imageUrl: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=100&h=100&fit=crop" },
      { id: "2-3", name: "Скинни", imageUrl: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=100&h=100&fit=crop" },
      { id: "2-4", name: "Прямые", imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "3",
    name: "Куртки",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
    subcategories: [
      { id: "3-1", name: "Зимние куртки", imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&h=100&fit=crop" },
      { id: "3-2", name: "Демисезонные", imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd628b1?w=100&h=100&fit=crop" },
      { id: "3-3", name: "Ветровки", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop" },
      { id: "3-4", name: "Пуховики", imageUrl: "https://images.unsplash.com/photo-1547624643-3bf761b09502?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "4",
    name: "Платья",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
    subcategories: [
      { id: "4-1", name: "Вечерние платья", imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100&h=100&fit=crop" },
      { id: "4-2", name: "Повседневные", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop" },
      { id: "4-3", name: "Летние платья", imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=100&h=100&fit=crop" },
      { id: "4-4", name: "Коктейльные", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "5",
    name: "Обувь",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    subcategories: [
      { id: "5-1", name: "Кроссовки", imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop" },
      { id: "5-2", name: "Туфли", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop" },
      { id: "5-3", name: "Сапоги", imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=100&h=100&fit=crop" },
      { id: "5-4", name: "Сандалии", imageUrl: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=100&h=100&fit=crop" },
    ],
  },
  {
    id: "6",
    name: "Аксессуары",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop",
    subcategories: [
      { id: "6-1", name: "Сумки", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop" },
      { id: "6-2", name: "Ремни", imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=100&h=100&fit=crop" },
      { id: "6-3", name: "Часы", imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=100&h=100&fit=crop" },
      { id: "6-4", name: "Очки", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop" },
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
              className="w-full flex items-center gap-4 p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">Все товары</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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
              className="w-full flex items-center gap-4 p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Grid3X3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">Все товары</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </button>
            
            {/* Subcategories */}
            {selectedCategory.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id, subcategory.name)}
                className="w-full flex items-center gap-4 p-3 bg-card rounded-lg border border-border hover:bg-primary/5 transition-colors"
              >
                <img
                  src={subcategory.imageUrl}
                  alt={subcategory.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <span className="text-sm font-medium text-foreground flex-1 text-left">{subcategory.name}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
