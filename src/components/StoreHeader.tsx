import { Star, Package, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StoreInfo } from "@/components/StoreInfo";

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
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
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

        {/* Likes */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 fill-like text-like" />
            <span className="font-semibold text-foreground">{formatNumber(likesCount)}</span>
          </div>
          <span className="text-xs text-muted-foreground">Нравится</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button className="flex-1" variant="default" onClick={onCatalogClick}>
          Каталог
        </Button>
        <Button variant="outline" size="icon" onClick={onContactClick}>
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
