import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Share2, Loader2, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const sortOptions = [
  { id: "popular", label: "По популярности" },
  { id: "price_asc", label: "Сначала дешевле" },
  { id: "price_desc", label: "Сначала дороже" },
  { id: "rating", label: "По рейтингу" },
  { id: "new", label: "Новинки" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { id: "black", label: "Чёрный", color: "#000000" },
  { id: "white", label: "Белый", color: "#FFFFFF" },
  { id: "red", label: "Красный", color: "#EF4444" },
  { id: "blue", label: "Синий", color: "#3B82F6" },
  { id: "green", label: "Зелёный", color: "#22C55E" },
];

const ProductListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("category") || "Все товары";
  const storeName = "Grass - быстрая доставка";
  
  const { products, isLoading, hasMore, loadMore } = useInfiniteProducts();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Sort & Filter state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore],
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
    setIsSortOpen(false);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors(prev => 
      prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const activeFiltersCount = selectedSizes.length + selectedColors.length + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);
  const currentSortLabel = sortOptions.find(s => s.id === selectedSort)?.label || "По популярности";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary shadow-sm">
        <div className="flex items-center gap-3 h-14 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground hover:bg-primary-foreground/10 flex-shrink-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <SearchBar />
          </div>

          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 flex-shrink-0">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Store Name */}
      <div className="bg-card border-b border-border px-4 py-3">
        <h1 className="text-base font-semibold text-foreground">{storeName}</h1>
        {categoryName !== "Все товары" && (
          <p className="text-sm text-muted-foreground mt-0.5">{categoryName}</p>
        )}
      </div>

      {/* Filters Bar */}
      <div className="sticky top-14 z-40 bg-background border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Sort Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-shrink-0 text-sm hover:bg-primary/5 hover:border-primary hover:text-primary"
            onClick={() => setIsSortOpen(true)}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {currentSortLabel}
          </Button>

          {/* Filter Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "flex-shrink-0 text-sm",
              activeFiltersCount > 0 
                ? "border-primary text-primary bg-primary/5" 
                : "hover:bg-primary/5 hover:border-primary hover:text-primary"
            )}
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Фильтры
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <main className="px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
          {!hasMore && products.length > 0 && (
            <p className="text-sm text-muted-foreground">Все товары загружены</p>
          )}
        </div>
      </main>

      {/* Sort Sheet (Bottom) */}
      <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-left">Сортировка</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSortSelect(option.id)}
                className={cn(
                  "w-full flex items-center justify-between py-3 px-2 rounded-lg transition-colors",
                  selectedSort === option.id 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary"
                )}
              >
                <span className="text-sm font-medium">{option.label}</span>
                {selectedSort === option.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Filter Sheet (Full Screen) */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="h-full max-h-[100dvh] rounded-t-xl flex flex-col">
          <SheetHeader className="pb-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left">Фильтры</SheetTitle>
              <button 
                onClick={resetFilters}
                className="text-sm text-primary hover:underline"
              >
                Сбросить
              </button>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Цена</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">от</span>
                    <span className="text-sm font-medium">{priceRange[0]} ₽</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">до</span>
                    <span className="text-sm font-medium">{priceRange[1]} ₽</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Размер</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                      selectedSizes.includes(size)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary hover:text-primary"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Цвет</h3>
              <div className="space-y-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className="w-full flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Checkbox 
                      checked={selectedColors.includes(color.id)}
                      className="pointer-events-none"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-sm">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex-shrink-0 border-t border-border pt-4 pb-safe">
            <Button 
              className="w-full" 
              size="lg"
              onClick={applyFilters}
            >
              Применить
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductListing;
