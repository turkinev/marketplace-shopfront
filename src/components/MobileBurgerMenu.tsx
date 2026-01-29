import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ChevronRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subcategory {
  id: string;
  name: string;
  imageUrl?: string;
  items?: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  subcategories: Subcategory[];
}

const categories: Category[] = [
  {
    id: "1",
    name: "Одежда",
    subcategories: [
      { 
        id: "1-1", 
        name: "Мужская одежда",
        items: [
          { id: "1-1-1", name: "Футболки" },
          { id: "1-1-2", name: "Рубашки" },
          { id: "1-1-3", name: "Джинсы" },
          { id: "1-1-4", name: "Брюки" },
        ]
      },
      { 
        id: "1-2", 
        name: "Женская одежда",
        items: [
          { id: "1-2-1", name: "Платья" },
          { id: "1-2-2", name: "Блузки" },
          { id: "1-2-3", name: "Юбки" },
          { id: "1-2-4", name: "Брюки" },
        ]
      },
      { 
        id: "1-3", 
        name: "Детская одежда",
        items: [
          { id: "1-3-1", name: "Для мальчиков" },
          { id: "1-3-2", name: "Для девочек" },
          { id: "1-3-3", name: "Для малышей" },
        ]
      },
    ],
  },
  {
    id: "2",
    name: "Обувь",
    subcategories: [
      { 
        id: "2-1", 
        name: "Мужская обувь",
        items: [
          { id: "2-1-1", name: "Кроссовки" },
          { id: "2-1-2", name: "Туфли" },
          { id: "2-1-3", name: "Ботинки" },
        ]
      },
      { 
        id: "2-2", 
        name: "Женская обувь",
        items: [
          { id: "2-2-1", name: "Кроссовки" },
          { id: "2-2-2", name: "Туфли" },
          { id: "2-2-3", name: "Сапоги" },
        ]
      },
    ],
  },
  {
    id: "3",
    name: "Электроника",
    subcategories: [
      { 
        id: "3-1", 
        name: "Смартфоны",
        items: [
          { id: "3-1-1", name: "Apple" },
          { id: "3-1-2", name: "Samsung" },
          { id: "3-1-3", name: "Xiaomi" },
        ]
      },
      { 
        id: "3-2", 
        name: "Ноутбуки",
        items: [
          { id: "3-2-1", name: "Apple" },
          { id: "3-2-2", name: "ASUS" },
          { id: "3-2-3", name: "Lenovo" },
        ]
      },
      { 
        id: "3-3", 
        name: "Аксессуары",
        items: [
          { id: "3-3-1", name: "Наушники" },
          { id: "3-3-2", name: "Чехлы" },
          { id: "3-3-3", name: "Зарядные устройства" },
        ]
      },
    ],
  },
  {
    id: "4",
    name: "Дом и сад",
    subcategories: [
      { 
        id: "4-1", 
        name: "Мебель",
        items: [
          { id: "4-1-1", name: "Диваны" },
          { id: "4-1-2", name: "Кровати" },
          { id: "4-1-3", name: "Столы" },
        ]
      },
      { 
        id: "4-2", 
        name: "Декор",
        items: [
          { id: "4-2-1", name: "Картины" },
          { id: "4-2-2", name: "Вазы" },
          { id: "4-2-3", name: "Светильники" },
        ]
      },
    ],
  },
  {
    id: "5",
    name: "Красота",
    subcategories: [
      { 
        id: "5-1", 
        name: "Косметика",
        items: [
          { id: "5-1-1", name: "Для лица" },
          { id: "5-1-2", name: "Для глаз" },
          { id: "5-1-3", name: "Для губ" },
        ]
      },
      { 
        id: "5-2", 
        name: "Уход",
        items: [
          { id: "5-2-1", name: "Кремы" },
          { id: "5-2-2", name: "Маски" },
          { id: "5-2-3", name: "Сыворотки" },
        ]
      },
    ],
  },
  {
    id: "6",
    name: "Спорт",
    subcategories: [
      { 
        id: "6-1", 
        name: "Одежда для спорта",
        items: [
          { id: "6-1-1", name: "Футболки" },
          { id: "6-1-2", name: "Шорты" },
          { id: "6-1-3", name: "Костюмы" },
        ]
      },
      { 
        id: "6-2", 
        name: "Инвентарь",
        items: [
          { id: "6-2-1", name: "Гантели" },
          { id: "6-2-2", name: "Коврики" },
          { id: "6-2-3", name: "Мячи" },
        ]
      },
    ],
  },
];

export const MobileBurgerMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isByPurchases, setIsByPurchases] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setExpandedSubcategories(new Set());
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setIsOpen(false);
    setSelectedCategory(null);
    navigate(`/products?subcategory=${subcategoryId}`);
  };

  const handleItemClick = (itemId: string) => {
    setIsOpen(false);
    setSelectedCategory(null);
    navigate(`/products?item=${itemId}`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setExpandedSubcategories(new Set());
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 flex-shrink-0"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="left" className="w-full sm:max-w-full p-0">
          <SheetHeader className="p-4 border-b border-border bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              {selectedCategory ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2"
                  onClick={handleBack}
                >
                  <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
                  Назад
                </Button>
              ) : (
                <SheetTitle className="text-primary-foreground text-left">Каталог</SheetTitle>
              )}
            </div>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100%-60px)] overflow-hidden bg-background">
            {/* Tabs */}
            <div className="p-3 border-b border-border bg-card">
              <Tabs 
                value={isByPurchases ? "purchases" : "products"} 
                onValueChange={(v) => setIsByPurchases(v === "purchases")}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="products" className="flex-1">
                    По товарам
                  </TabsTrigger>
                  <TabsTrigger value="purchases" className="flex-1">
                    По закупкам
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!selectedCategory ? (
                // Level 1 - Categories list
                <div className="divide-y divide-border">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full flex items-center justify-between px-4 py-4 hover:bg-secondary transition-colors"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <span className="font-medium text-foreground">{category.name}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              ) : (
                // Level 2 - Subcategories
                <div>
                  {/* Category title */}
                  <div className="px-4 py-3 bg-secondary/50 border-b border-border">
                    <h3 className="font-semibold text-foreground">{selectedCategory.name}</h3>
                  </div>

                  {!isByPurchases ? (
                    // By Products - Hierarchical list with expandable items
                    <div className="divide-y divide-border">
                      {selectedCategory.subcategories.map((subcategory) => {
                        const isExpanded = expandedSubcategories.has(subcategory.id);
                        return (
                          <div key={subcategory.id}>
                            <button
                              className="w-full flex items-center justify-between px-4 py-4 hover:bg-secondary transition-colors"
                              onClick={() => toggleSubcategory(subcategory.id)}
                            >
                              <span className="font-medium text-foreground">{subcategory.name}</span>
                              {subcategory.items && subcategory.items.length > 0 && (
                                <ChevronDown 
                                  className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? '' : '-rotate-90'}`} 
                                />
                              )}
                            </button>
                            {subcategory.items && isExpanded && (
                              <div className="bg-secondary/30 border-t border-border">
                                {subcategory.items.map((item) => (
                                  <button
                                    key={item.id}
                                    className="w-full text-left px-8 py-3 hover:bg-secondary transition-colors text-muted-foreground"
                                    onClick={() => handleItemClick(item.id)}
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // By Purchases - Subcategories as image + name cards
                    <div className="grid grid-cols-3 gap-3 p-4">
                      {selectedCategory.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-colors text-center"
                          onClick={() => handleSubcategoryClick(subcategory.id)}
                        >
                          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                          </div>
                          <span className="text-xs font-medium text-foreground line-clamp-2">
                            {subcategory.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
