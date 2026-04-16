import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import colorRedImg from "@/assets/color-red.jpg";
import colorWhiteImg from "@/assets/color-white.jpg";
import colorBlackImg from "@/assets/color-black.jpg";
import colorBlueImg from "@/assets/color-blue.jpg";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    oldPrice?: number;
    rating?: number;
    reviewsCount?: number;
  };
}

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
};

const mockColors = [
  { id: "red", name: "Красный", image: colorRedImg },
  { id: "white", name: "Белый", image: colorWhiteImg },
  { id: "black", name: "Чёрный", image: colorBlackImg },
  { id: "blue", name: "Голубой", image: colorBlueImg },
];

const mockSizes = [
  { id: "75b", label: "75B", sub: "75B" },
  { id: "75c", label: "75C", sub: "75C" },
  { id: "80b", label: "80B", sub: "80B" },
  { id: "80c", label: "80C", sub: "80C" },
  { id: "85b", label: "85B", sub: "85B" },
  { id: "85c", label: "85C", sub: "85C" },
];

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(mockColors[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const currentColor = mockColors.find(c => c.id === selectedColor) || mockColors[0];

  const handleGoToProduct = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  if (isMobile) {
    if (isOpen) {
      onClose();
      navigate(`/product/${product.id}`);
    }
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden [&>button]:hidden">
        <div className="flex">
          {/* Left: Image */}
          <div className="relative w-[45%] flex-shrink-0 bg-secondary/20">
            <div className="aspect-[3/4]">
              <img
                src={currentColor.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-card transition-colors"
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
            </button>
          </div>

          {/* Right: Info */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[80vh] space-y-4">
            <p className="text-sm text-muted-foreground">Karolina</p>

            <h2 className="text-lg font-bold text-foreground leading-tight">
              {product.name}
            </h2>

            {product.rating && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-rating text-rating" />
                <span className="font-medium">{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-muted-foreground">· {product.reviewsCount} оценок</span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Color selector */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Цвет: <span className="text-foreground font-medium">{currentColor.name}</span>
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {mockColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                      "w-14 h-14 rounded-lg border-2 transition-all overflow-hidden flex-shrink-0",
                      selectedColor === color.id ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <button className="text-sm text-muted-foreground mb-2 flex items-center gap-1 hover:text-foreground transition-colors">
                Таблица размеров <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {mockSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={cn(
                      "min-w-[3.5rem] px-3 py-2 rounded-lg border transition-all flex flex-col items-center flex-shrink-0",
                      selectedSize === size.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    <span className="text-sm font-bold leading-tight">{size.label}</span>
                    <span className={cn(
                      "text-[11px] leading-tight",
                      selectedSize === size.id ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>{size.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <Button className="w-full h-12 text-base font-semibold gap-2 rounded-xl">
              <ShoppingCart className="h-5 w-5" />
              Добавить в корзину
            </Button>

            {/* More info */}
            <p
              onClick={handleGoToProduct}
              className="text-sm font-bold text-foreground text-center cursor-pointer"
            >
              Больше информации о товаре
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
