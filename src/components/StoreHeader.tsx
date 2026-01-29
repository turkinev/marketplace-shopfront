import { useState } from "react";
import { Star, Package, Heart, MessageCircle, Share2, Info, Link, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreInfo } from "@/components/StoreInfo";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface StoreHeaderProps {
  name: string;
  avatarUrl?: string;
  rating: number;
  ordersCount: number;
  likesCount: number;
  onCatalogClick?: () => void;
  onContactClick?: () => void;
}

export const StoreHeader = ({
  name,
  avatarUrl,
  rating,
  ordersCount,
  likesCount,
  onCatalogClick,
  onContactClick,
}: StoreHeaderProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(likesCount);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const isMobile = useIsMobile();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
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

  const StoreInfoContent = () => (
    <div className="space-y-6">
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
  );

  return (
    <>
      <div className="bg-card rounded-lg p-4 lg:p-5 shadow-sm animate-fade-in">
        {/* Store Info Row */}
        <div className="mb-2">
          <div className="min-w-0">
            {/* Store name with info icon for mobile */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold text-foreground leading-tight">{name}</h1>
              {isMobile && (
                <button 
                  onClick={() => setIsInfoOpen(true)}
                  className="p-1 rounded-full hover:bg-secondary transition-colors"
                >
                  <Info className="h-5 w-5 text-primary" />
                </button>
              )}
            </div>
            {/* Show tabs only on desktop */}
            {!isMobile && (
              <div className="mt-1">
                <StoreInfo />
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-2 py-3 px-2 bg-secondary/50 rounded-lg">
          {/* Rating */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-rating text-rating" />
              <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Рейтинг</span>
          </div>

          <div className="w-px h-8 bg-border" />

          {/* Orders */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{formatNumber(ordersCount)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Заказов</span>
          </div>

          <div className="w-px h-8 bg-border" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          {isMobile ? (
            <>
              <Button className="flex-1" variant="default" onClick={onCatalogClick}>
                Каталог
              </Button>
              <Button variant="outline" size="icon" onClick={onContactClick}>
                <MessageCircle className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              {/* Написать */}
              <Button className="flex-1 gap-2" variant="default" onClick={onContactClick}>
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
            </>
          )}
        </div>
      </div>

      {/* Mobile: Full-screen Sheet */}
      {isMobile ? (
        <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <SheetContent side="bottom" className="h-full max-h-[100dvh] rounded-t-xl">
            <SheetHeader className="pb-4 border-b border-border">
              <SheetTitle className="text-left">{name}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-4">
              <StoreInfoContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop: Regular Dialog */
        <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
            </DialogHeader>
            <StoreInfoContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
