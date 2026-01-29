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

  return (
    <>
      <div className="bg-card rounded-lg p-4 lg:p-5 shadow-sm animate-fade-in">
        {/* Store Info Row */}
        <div className="mb-2">
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-bold text-foreground leading-tight">{name}</h1>
            <div className="mt-1">
              <StoreInfo />
            </div>
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

      {/* Store Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-rating text-rating" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">Рейтинг</span>
              </div>
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-semibold">{formatNumber(ordersCount)}</span>
                <span className="text-muted-foreground">Заказов</span>
              </div>
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-like text-like" />
                <span className="font-semibold">{formatNumber(likesCount)}</span>
                <span className="text-muted-foreground">Нравится</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Магазин предлагает широкий ассортимент качественных товаров. 
                Быстрая доставка и отличный сервис.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
