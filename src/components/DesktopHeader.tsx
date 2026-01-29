import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Heart, Bell, ShoppingCart, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const DesktopHeader = () => {
  const navigate = useNavigate();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isByPurchases, setIsByPurchases] = useState(false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsCatalogOpen(false);
    navigate(`/products?category=${categoryId}`);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setIsCatalogOpen(false);
    navigate(`/products?subcategory=${subcategoryId}`);
  };

  return (
    <>
      {/* Main Header */}
      <header className="hidden lg:block sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-16">
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-32 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">LOGO</span>
              </div>
            </div>

            {/* Catalog Button */}
            <Button
              variant="secondary"
              className="flex items-center gap-2 h-10 px-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="font-medium">Каталог</span>
            </Button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  placeholder="Искать товары"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-4 pr-12 bg-primary-foreground text-foreground border-0 rounded-lg placeholder:text-muted-foreground"
                />
                <Button 
                  type="submit"
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/90"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Action Icons */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10"
                onClick={() => navigate("/profile")}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-primary-foreground/10 h-10 w-10 relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center px-1">
                  3
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Catalog Mega Menu */}
      {isCatalogOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="hidden lg:block fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsCatalogOpen(false)}
          />
          
          {/* Menu */}
          <div className="hidden lg:block fixed top-16 left-0 right-0 z-50">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="bg-card rounded-b-lg shadow-xl border border-border flex min-h-[400px] max-h-[calc(100vh-100px)] overflow-hidden">
                {/* Left Column - Categories or Purchases */}
                <div className="w-64 border-r border-border flex flex-col">
                  {/* Tabs Switch */}
                  <div className="p-3 border-b border-border">
                    <Tabs value={isByPurchases ? "purchases" : "products"} onValueChange={(v) => setIsByPurchases(v === "purchases")}>
                      <TabsList className="w-full">
                        <TabsTrigger value="products" className="flex-1 text-xs">
                          По товарам
                        </TabsTrigger>
                        <TabsTrigger value="purchases" className="flex-1 text-xs">
                          По закупкам
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Categories List - Same for both modes */}
                  <div className="flex-1 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary transition-colors ${
                          hoveredCategory?.id === category.id ? "bg-secondary" : ""
                        }`}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <span className="text-sm font-medium text-foreground">{category.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column - Subcategories */}
                <div className="flex-1 p-6 overflow-y-auto bg-background">
                  {hoveredCategory ? (
                    !isByPurchases ? (
                      // By Products - Hierarchical list with items
                      <div className="grid grid-cols-3 gap-8">
                        {hoveredCategory.subcategories.map((subcategory) => (
                          <div key={subcategory.id}>
                            <button
                              className="text-sm font-semibold text-foreground hover:text-primary mb-3 text-left"
                              onClick={() => handleSubcategoryClick(subcategory.id)}
                            >
                              {subcategory.name}
                            </button>
                            {subcategory.items && (
                              <ul className="space-y-2">
                                {subcategory.items.map((item) => (
                                  <li key={item.id}>
                                    <button
                                      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                                      onClick={() => {
                                        setIsCatalogOpen(false);
                                        navigate(`/products?item=${item.id}`);
                                      }}
                                    >
                                      {item.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // By Purchases - Subcategories as image + name cards
                      <div className="grid grid-cols-4 gap-4">
                        {hoveredCategory.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-secondary transition-colors text-center group"
                            onClick={() => handleSubcategoryClick(subcategory.id)}
                          >
                            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                              <span className="text-3xl">📦</span>
                            </div>
                            <span className="text-sm font-medium text-foreground line-clamp-2">
                              {subcategory.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Наведите на категорию для просмотра подкатегорий
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
