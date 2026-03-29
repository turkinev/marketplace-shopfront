import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";

import { ProductsSidebar } from "@/components/ProductsSidebar";
import { StoreReviews } from "@/components/StoreReviews";
import { StoreQA } from "@/components/StoreQA";
import { MobileCatalogMenu } from "@/components/MobileCatalogMenu";
import { DeliveryStatusBadge } from "@/components/DeliveryStatusBadge";
import { Share2, Loader2, Star, Package, Heart, MessageCircle, Send, Info, Link, UserCircle, ChevronDown, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useStorefrontBlocks } from "@/hooks/useStorefrontBlocks";
import { StorefrontRenderer } from "@/components/storefront/StorefrontRenderer";
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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-foreground">{name}</h1>
              <DeliveryStatusBadge status="collecting" dateInfo="до 15 февраля" />
            </div>
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
          <div className="space-y-6">
            {/* Профиль продавца */}
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserCircle className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">Организатор Мария</p>
                <p className="text-xs text-muted-foreground">Продавец с 2020 года</p>
              </div>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>

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

            {/* Информация о доставке и условиях */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Комиссия</span>
                <span className="text-sm font-medium text-foreground">5%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Страна производитель</span>
                <span className="text-sm font-medium text-foreground">Китай</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Ориентировочная дата доставки</span>
                <span className="text-sm font-medium text-foreground">15–20 февраля</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Средний срок доставки</span>
                <span className="text-sm font-medium text-foreground">12–18 дней</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Средний % отказов</span>
                <span className="text-sm font-medium text-foreground">2.3%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Откуда поедет груз</span>
                <span className="text-sm font-medium text-foreground">Гуанчжоу, Китай</span>
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


const sortOptions = [
  { id: "popular", label: "По популярности" },
  { id: "price_asc", label: "Сначала дешевле" },
  { id: "price_desc", label: "Сначала дороже" },
  { id: "rating", label: "По рейтингу" },
  { id: "new", label: "Новинки" },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const { products, isLoading, hasMore, loadMore } = useInfiniteProducts();
  const { blocks: storefrontBlocks } = useStorefrontBlocks();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const currentSortLabel = sortOptions.find(s => s.id === selectedSort)?.label || "По популярности";

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
    <div>
      {/* Main Content */}
      <main className="px-0 md:container md:px-4 py-4 md:py-6 max-w-7xl mx-auto">
        {/* Mobile: Store Header */}
        <div className="lg:hidden mb-4">
          <StoreHeader
            name="Grass - быстрая доставка"
            rating={4.8}
            ordersCount={125400}
            likesCount={45200}
            deliveryStatus="collecting"
            deliveryStatusDate="до 15 февраля"
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

        {/* Dynamic Storefront Blocks */}

        {/* Dynamic Storefront Blocks */}
        <StorefrontRenderer blocks={storefrontBlocks} />

        {/* Products Section with Sidebar on Desktop */}
        <div className="mt-6 flex gap-6">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <ProductsSidebar />
          </div>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              {/* Mobile: Title */}
              <h2 className="lg:hidden text-lg font-bold text-foreground">Все товары</h2>
              
              {/* Desktop: Sort Dropdown */}
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 text-base font-semibold hover:bg-transparent px-0">
                      {currentSortLabel}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-popover">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setSelectedSort(option.id)}
                        className="flex items-center justify-between"
                      >
                        <span>{option.label}</span>
                        {selectedSort === option.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Products Grid - Adjusted columns for sidebar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
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
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <StoreReviews />
        </div>

        {/* Q&A Section */}
        <div className="mt-8">
          <StoreQA />
        </div>
      </main>

      {/* Mobile Catalog Menu */}
      <MobileCatalogMenu 
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectCategory={handleCatalogSelect}
        storeName="Grass - быстрая доставка"
      />

      {isPreview && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            className="shadow-lg gap-2 rounded-full px-6"
            onClick={() => navigate("/admin")}
          >
            <ChevronLeft className="h-4 w-4" /> Вернуться в админку
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
