import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanners } from "@/components/PromoBanners";
import { MobileCatalogMenu } from "@/components/MobileCatalogMenu";
import { DesktopHeader } from "@/components/DesktopHeader";
import { ArrowLeft, Share2, Loader2, Star, Package, Heart, MessageCircle, Send, Info, Link, Bell, User, ShoppingCart, Mail, Gift, ListChecks, UserCircle, QrCode, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
      "data:image/png;base64,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"
  },
  {
    id: "collection-2",
    imageUrl:
      "data:image/jpeg;base64,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"
  },
  {
    id: "collection-3",
    imageUrl:
      "https://4team.by/upload/iblock/4b6/ic0evv6jc71m1grkltt1udrw3293senx/image-13-02-20-02-46.jpeg"
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Top Navigation */}
      <header className="lg:hidden sticky top-0 z-50 bg-primary shadow-sm">
        {/* First row: Logo and Icons */}
        <div className="container flex items-center justify-between h-12 px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LOGO</span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9"
              onClick={() => setIsProfileMenuOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center px-0.5">
                3
              </span>
            </Button>
          </div>
        </div>
        
        {/* Second row: Search */}
        <div className="container px-4 pb-3 max-w-7xl mx-auto">
          <SearchBar placeholder="Искать в магазине" />
        </div>
      </header>

      {/* Mobile Profile Menu - Full Screen */}
      <Sheet open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0">
          <SheetHeader className="p-4 border-b border-border bg-primary text-primary-foreground">
            <SheetTitle className="text-primary-foreground text-left">Профиль</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-[calc(100%-60px)] overflow-y-auto bg-background">
            {/* User Info */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">Иван Иванов</p>
                  <p className="text-sm text-muted-foreground">ivan@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1">
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Личные сообщения</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Избранные закупки</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Gift className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Список желаний</span>
              </button>

              <div className="h-2 bg-secondary" />

              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <ListChecks className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Личный кабинет</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Профиль</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Все заказы</span>
              </button>

              <div className="h-2 bg-secondary" />

              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">QR-код для получения заказа</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors border-b border-border"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col items-start">
                  <span className="text-foreground">Пункт выдачи</span>
                  <span className="text-sm text-muted-foreground">ул. Примерная, д. 1</span>
                </div>
              </button>

              <div className="h-2 bg-secondary" />

              <button 
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary transition-colors text-destructive"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>Выход</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
