import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCharacteristicsModal, ProductCharacteristic } from "./ProductCharacteristicsModal";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  isLiked?: boolean;
  characteristics?: ProductCharacteristic[];
}

export const ProductCard = ({
  name,
  imageUrl,
  price,
  oldPrice,
  rating,
  reviewsCount,
  isLiked: initialLiked = false,
  characteristics,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isCharacteristicsModalOpen, setIsCharacteristicsModalOpen] = useState(false);

  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If product has characteristics, open the modal
    if (characteristics && characteristics.length > 0) {
      setIsCharacteristicsModalOpen(true);
    } else {
      // Add directly to cart if no characteristics
      console.log("Added to cart without characteristics");
    }
  };

  const handleAddToCartWithCharacteristics = (selectedOptions: Record<string, string>) => {
    console.log("Added to cart with characteristics:", selectedOptions);
  };

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-sm animate-scale-in hover:shadow-md transition-shadow duration-200">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary/30">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain"
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
          <h3 className="text-sm text-foreground line-clamp-2 mb-2 leading-snug min-h-[2.5rem]">
            {name}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-rating text-rating" />
              <span className="text-xs font-medium text-foreground">{rating}</span>
              {reviewsCount && (
                <span className="text-xs text-muted-foreground">
                  ({reviewsCount})
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button 
            size="sm" 
            className="w-full gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            В корзину
          </Button>
        </div>
      </div>

      {/* Characteristics Modal */}
      {characteristics && characteristics.length > 0 && (
        <ProductCharacteristicsModal
          isOpen={isCharacteristicsModalOpen}
          onClose={() => setIsCharacteristicsModalOpen(false)}
          productName={name}
          characteristics={characteristics}
          onAddToCart={handleAddToCartWithCharacteristics}
        />
      )}
    </>
  );
};
