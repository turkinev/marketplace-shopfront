import { useEffect, useRef, useCallback } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanners } from "@/components/PromoBanners";
import { ArrowLeft, Share2, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";

const mainBanner = {
  id: "promo-1",
  title: "Скидки до 50%",
  subtitle: "На всю электронику до конца недели",
  imageUrl: "https://f63.63pokupki.ru/purchase-baner/x900/42face24b6e9de28615896071317791d6ce3h2t2mkgeking.webp",
};

const smallBanners = [
  { id: "collection-1", title: "Хиты продаж", bgColor: "hsl(280, 65%, 50%)" },
  { id: "collection-2", title: "Новинки", bgColor: "hsl(160, 65%, 40%)" },
  { id: "collection-3", title: "До 1000₽", bgColor: "hsl(25, 85%, 55%)" },
];

const Index = () => {
  const { products, isLoading, hasMore, loadMore } = useInfiniteProducts();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="container flex items-center gap-2 h-14 px-4">
          <Button variant="ghost" size="icon" className="text-foreground flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <SearchBar />
          </div>

          <div className="flex items-center flex-shrink-0">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4 space-y-4">
        {/* Store Header */}
        <StoreHeader name="Grass - быстрая доставка" rating={4.8} ordersCount={125400} likesCount={45200} />

        {/* Promo Banners */}
        <PromoBanners mainBanner={mainBanner} smallBanners={smallBanners} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
          {!hasMore && products.length > 0 && <p className="text-sm text-muted-foreground">Все товары загружены</p>}
        </div>
      </main>
    </div>
  );
};

export default Index;
