import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  isLiked?: boolean;
}

export const ProductCard = ({
  name,
  imageUrl,
  price,
  oldPrice,
  rating,
  reviewsCount,
  isLiked: initialLiked = false,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  };

  const discountPercent = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm animate-scale-in hover:shadow-md transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary/30">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-sm hover:bg-card transition-colors"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isLiked ? "fill-like text-like" : "text-muted-foreground"
            )}
          />
        </button>

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-discount text-discount-foreground text-xs font-semibold">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(price)}
          </span>
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm text-foreground line-clamp-2 mb-2 leading-snug">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-rating text-rating" />
            <span className="text-xs font-medium text-foreground">{rating}</span>
            {reviewsCount && (
              <span className="text-xs text-muted-foreground">
                ({reviewsCount})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
