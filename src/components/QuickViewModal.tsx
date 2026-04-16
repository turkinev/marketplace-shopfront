import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

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

// Mock data for quick view
const mockColors = [
  { id: "black", name: "Чёрный", hex: "#1a1a1a" },
  { id: "white", name: "Белый", hex: "#f5f5f5" },
  { id: "red", name: "Красный", hex: "#dc2626" },
];

const mockSizes = [
  { id: "xs", label: "XS", sub: "40-42" },
  { id: "s", label: "S", sub: "42-44" },
  { id: "m", label: "M", sub: "44-46" },
  { id: "l", label: "L", sub: "48-50" },
];

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(mockColors[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const handleGoToProduct = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  // Mobile: just navigate to the product page
  if (isMobile) {
    if (isOpen) {
      onClose();
      navigate(`/product/${product.id}`);
    }
    return null;
  }

  // Desktop: WB-style dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden [&>button]:hidden">
        <div className="flex">
          {/* Left: Image */}
          <div className="relative w-[45%] flex-shrink-0 bg-secondary/20">
            <div className="aspect-[3/4]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
            {/* Like */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-card transition-colors"
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
            </button>
            {/* "Похожие" button */}
            <button
              className="absolute bottom-4 left-4 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium text-foreground shadow flex items-center gap-2 hover:bg-card transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Похожие
            </button>
          </div>

          {/* Right: Info */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[80vh] space-y-4">
            {/* Brand */}
            <p className="text-sm text-muted-foreground">VICITA</p>

            {/* Title */}
            <h2 className="text-lg font-bold text-foreground leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 fill-rating text-rating" />
                <span className="font-medium">{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-muted-foreground">· {product.reviewsCount} оценок</span>
                )}
              </div>
            )}

            {/* Price */}
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
                Цвет: <span className="text-foreground font-medium">{mockColors.find(c => c.id === selectedColor)?.name}</span>
              </p>
              <div className="flex gap-2">
                {mockColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                      "w-14 h-14 rounded-lg border-2 transition-all overflow-hidden flex items-center justify-center",
                      selectedColor === color.id ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                    style={{ backgroundColor: color.hex }}
                  >
                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                  </button>
                ))}
                {/* Arrow for more */}
                <button className="w-14 h-14 rounded-lg border border-border flex items-center justify-center hover:border-primary/50 transition-colors">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Таблица размеров</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-2">
                {mockSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={cn(
                      "min-w-[3.5rem] px-3 py-2 rounded-lg border transition-all flex flex-col items-center",
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

            {/* Buy now */}
            <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl">
              Купить сейчас
            </Button>

            {/* Extra info */}
            <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <span>↩</span>
                <span>14 дней на возврат</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👗</span>
                <span>Есть примерка</span>
              </div>
            </div>

            {/* More info link */}
            <button
              onClick={handleGoToProduct}
              className="text-sm text-primary font-medium hover:underline"
            >
              Больше информации о товаре →
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
