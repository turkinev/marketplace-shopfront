import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanners } from "@/components/PromoBanners";
import { MobileCatalogMenu } from "@/components/MobileCatalogMenu";
import { ArrowLeft, Share2, Loader2, Star, Package, Heart, MessageCircle, Send, Info, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Desktop Store Bar Component
const DesktopStoreBar = ({ 
  name, 
  rating, 
  ordersCount, 
  likesCount 
}: { 
  name: string; 
  rating: number; 
  ordersCount: number; 
  likesCount: number; 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(likesCount);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    setFavoriteCount(prev => isFavorite ? prev - 1 : prev + 1);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Ссылка скопирована");
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Магазин ${name}`);
    const links: Record<string, string> = {
      vk: `https://vk.com/share.php?url=${url}`,
      tg: `https://t.me/share/url?url=${url}&text=${text}`,
      wa: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[platform], "_blank");
  };

  return (
    <>
      <div className="hidden lg:flex items-center justify-between bg-card rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              GR
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-bold text-foreground">{name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-rating text-rating" />
                {rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4 text-primary" />
                {formatNumber(ordersCount)} заказов
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Написать */}
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Написать
          </Button>

          {/* Избранное */}
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-like text-like" : ""}`} />
            {formatNumber(favoriteCount)}
          </Button>

          {/* Поделиться */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link className="h-4 w-4 mr-2" />
                Скопировать ссылку
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("vk")}>
                <span className="w-4 h-4 mr-2 flex items-center justify-center font-bold text-xs">VK</span>
                ВКонтакте
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("tg")}>
                <Send className="h-4 w-4 mr-2" />
                Telegram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("wa")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Информация */}
          <Button variant="outline" size="icon" onClick={() => setIsInfoOpen(true)}>
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Store Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Статистика */}
            <div className="flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-rating text-rating" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-semibold">{formatNumber(ordersCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-like text-like" />
                <span className="font-semibold">{formatNumber(likesCount)}</span>
              </div>
            </div>

            {/* Описание */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Описание</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Добро пожаловать в наш магазин! Мы предлагаем широкий ассортимент качественных товаров по доступным ценам. Все товары проходят тщательную проверку качества перед отправкой.
              </p>
            </div>

            {/* Условия */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Условия</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Доставка осуществляется в течение 3-7 рабочих дней. Возврат товара возможен в течение 14 дней с момента получения. Оплата при получении или онлайн.
              </p>
            </div>

            {/* Размерная сетка */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Размерная сетка</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Размеры указаны в соответствии с международной системой. Рекомендуем сверяться с таблицей размеров в карточке товара. При возникновении вопросов обращайтесь в поддержку.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
  {
    id: "collection-2",
    imageUrl:
      "data:image/jpeg;base64,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",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  
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

  const handleCatalogSelect = (categoryId: string | null, categoryName: string | null) => {
    setIsCatalogOpen(false);
    navigate(`/products${categoryName ? `?category=${encodeURIComponent(categoryName)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Ozon style */}
      <header className="sticky top-0 z-50 bg-primary shadow-sm">
        <div className="container flex items-center gap-3 h-14 px-4 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 flex-shrink-0 lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Logo for desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">O</span>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div className="flex items-center flex-shrink-0 gap-1">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Category Navigation - Ozon style horizontal menu */}
      <nav className="hidden lg:block bg-card border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-foreground hover:bg-primary/10 hover:text-primary px-4 h-9"
              onClick={() => navigate("/catalog")}
            >
              <span className="text-sm font-medium">Каталог</span>
            </Button>
            <div className="w-px h-6 bg-border" />
            {["Электроника", "Одежда", "Дом и сад", "Красота", "Спорт", "Детские товары", "Авто", "Книги"].map((cat) => (
              <Button 
                key={cat}
                variant="ghost" 
                className="text-foreground hover:bg-primary/10 hover:text-primary px-3 h-9 text-sm whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container px-4 py-4 md:py-6 max-w-7xl mx-auto">
        {/* Mobile: Store Header */}
        <div className="lg:hidden mb-4">
          <StoreHeader
            name="Grass - быстрая доставка"
            rating={4.8}
            ordersCount={125400}
            likesCount={45200}
            onCatalogClick={() => setIsCatalogOpen(true)}
          />
        </div>

        {/* Desktop: Store info bar */}
        <DesktopStoreBar 
          name="Grass - быстрая доставка"
          rating={4.8}
          ordersCount={125400}
          likesCount={45200}
        />

        {/* Promo Banners - Full width on desktop */}
        <PromoBanners mainBanner={mainBanner} smallBanners={smallBanners} />

        {/* Products Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-foreground">Все товары</h2>
          </div>

          {/* Products Grid - More columns on desktop Ozon style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
            {!hasMore && products.length > 0 && <p className="text-sm text-muted-foreground">Все товары загружены</p>}
          </div>
        </div>
      </main>

      {/* Mobile Catalog Menu */}
      <MobileCatalogMenu 
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectCategory={handleCatalogSelect}
        storeName="Grass - быстрая доставка"
      />
    </div>
  );
};

export default Index;
