import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanners } from "@/components/PromoBanners";
import { StoreTabs } from "@/components/StoreTabs";
import { ArrowLeft, Share2, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
const mainBanner = {
  id: "promo-1",
  title: "",
  imageUrl: "https://f63.63pokupki.ru/purchase-baner/x900/42face24b6e9de28615896071317791d6ce3h2t2mkgeking.webp",
};

const smallBanners = [
  {
    id: "collection-1",
    imageUrl:
      "data:image/png;base64,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",
  },
  { id: "collection-2", title: "Новинки", bgColor: "hsl(160, 65%, 40%)" },
  { id: "collection-3", title: "До 1000₽", bgColor: "hsl(25, 85%, 55%)" },
];

const Index = () => {
  const navigate = useNavigate();
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
        <StoreHeader
          name="Grass - быстрая доставка"
          rating={4.8}
          ordersCount={125400}
          likesCount={45200}
          onCatalogClick={() => navigate("/catalog")}
        />

        {/* Promo Banners */}
        <PromoBanners mainBanner={mainBanner} smallBanners={smallBanners} />

        {/* Store Tabs */}
        <StoreTabs />

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
