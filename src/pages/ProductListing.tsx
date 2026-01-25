import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Share2, Loader2, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";

const ProductListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("category") || "Все товары";
  const storeName = "Grass - быстрая доставка";
  
  const { products, isLoading, hasMore, loadMore } = useInfiniteProducts();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-shrink-0 text-sm border-primary text-primary hover:bg-primary/5"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-shrink-0 text-sm hover:bg-primary/5 hover:border-primary hover:text-primary"
          >
            По популярности
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-shrink-0 text-sm hover:bg-primary/5 hover:border-primary hover:text-primary"
          >
            Цена
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-shrink-0 text-sm hover:bg-primary/5 hover:border-primary hover:text-primary"
          >
            Размер
            <ChevronDown className="h-4 w-4 ml-1" />
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
    </div>
  );
};

export default ProductListing;
