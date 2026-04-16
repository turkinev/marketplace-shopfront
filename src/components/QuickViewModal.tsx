import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
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

function useScrollbarFade(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;

    const show = () => {
      el.classList.remove("scrollbar-idle");
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.add("scrollbar-idle"), 2000);
    };

    timer = setTimeout(() => el.classList.add("scrollbar-idle"), 500);
    el.addEventListener("scroll", show);
    el.addEventListener("touchstart", show);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", show);
      el.removeEventListener("touchstart", show);
    };
  }, [ref]);
}

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(mockColors[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const colorsScrollRef = useRef<HTMLDivElement>(null);
  const sizesScrollRef = useRef<HTMLDivElement>(null);

  const colorsScrollRefMobile = useRef<HTMLDivElement>(null);
  const sizesScrollRefMobile = useRef<HTMLDivElement>(null);

  useScrollbarFade(colorsScrollRef);
  useScrollbarFade(sizesScrollRef);
  useScrollbarFade(colorsScrollRefMobile);
  useScrollbarFade(sizesScrollRefMobile);

  const currentColor = mockColors.find((color) => color.id === selectedColor) || mockColors[0];

  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobile, isOpen, onClose]);

  const handleGoToProduct = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const sharedContent = (
    <>
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/20">
          <img src={currentColor.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-card/80 shadow backdrop-blur-sm"
          >
            <Heart className={cn("h-3 w-3", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
          </button>
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-base font-bold leading-tight text-foreground line-clamp-2">{product.name}</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-rating text-rating" />
              <span className="font-medium">{product.rating}</span>
              {product.reviewsCount && <span className="text-muted-foreground">· {product.reviewsCount} оценок</span>}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Цвет: <span className="font-medium text-foreground">{currentColor.name}</span>
        </p>
        <div
          ref={colorsScrollRef}
          className="scrollbar-fade -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {mockColors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => setSelectedColor(color.id)}
              className={cn(
                "h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                selectedColor === color.id ? "border-primary" : "border-border hover:border-primary/50",
              )}
              style={{ scrollSnapAlign: "start" }}
            >
              <img src={color.image} alt={color.name} className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Таблица размеров</p>
        <div
          ref={sizesScrollRef}
          className="scrollbar-fade -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {mockSizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setSelectedSize(size.id)}
              className={cn(
                "flex min-w-[3.5rem] flex-shrink-0 flex-col items-center rounded-lg border px-3 py-2 transition-all",
                selectedSize === size.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50",
              )}
              style={{ scrollSnapAlign: "start" }}
            >
              <span className="text-sm font-bold leading-tight">{size.label}</span>
              <span
                className={cn(
                  "text-[11px] leading-tight",
                  selectedSize === size.id ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {size.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button className="h-12 w-full gap-2 rounded-xl text-base font-semibold">
        <ShoppingCart className="h-5 w-5" />
        Добавить в корзину
      </Button>

      <button
        type="button"
        onClick={handleGoToProduct}
        className="w-full text-center text-sm font-bold text-foreground"
      >
        Больше информации о товаре
      </button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerTitle className="sr-only">{product.name}</DrawerTitle>
          <DrawerDescription className="sr-only">Быстрый просмотр товара</DrawerDescription>
          <div className="space-y-4 overflow-y-auto p-4 pb-8">
            {sharedContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`quick-view-title-${product.id}`}
        aria-describedby={`quick-view-description-${product.id}`}
        className="fixed left-1/2 top-1/2 z-[60] flex max-h-[80vh] w-[min(960px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть быстрый просмотр"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 shadow backdrop-blur-sm transition-colors hover:bg-card"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>

        <div className="relative flex w-[45%] flex-shrink-0 items-center justify-center bg-secondary/20">
          <div className="aspect-[3/4] w-full">
            <img src={currentColor.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Heart className={cn("h-4 w-4", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
          </button>
        </div>

        <div className="max-h-[80vh] flex-1 space-y-4 overflow-y-auto p-6 pt-12">
          <h2 id={`quick-view-title-${product.id}`} className="text-lg font-bold leading-tight text-foreground">
            {product.name}
          </h2>
          <p id={`quick-view-description-${product.id}`} className="sr-only">
            Окно быстрого просмотра товара {product.name} с выбором характеристик и кнопкой добавления в корзину.
          </p>

          {product.rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-rating text-rating" />
              <span className="font-medium">{product.rating}</span>
              {product.reviewsCount && <span className="text-muted-foreground">· {product.reviewsCount} оценок</span>}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Цвет: <span className="font-medium text-foreground">{currentColor.name}</span>
            </p>
            <div
              ref={colorsScrollRef}
              className="scrollbar-fade -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {mockColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={cn(
                    "h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    selectedColor === color.id ? "border-primary" : "border-border hover:border-primary/50",
                  )}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <img src={color.image} alt={color.name} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Таблица размеров</p>
            <div
              ref={sizesScrollRef}
              className="scrollbar-fade -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {mockSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size.id)}
                  className={cn(
                    "flex min-w-[3.5rem] flex-shrink-0 flex-col items-center rounded-lg border px-3 py-2 transition-all",
                    selectedSize === size.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50",
                  )}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <span className="text-sm font-bold leading-tight">{size.label}</span>
                  <span
                    className={cn(
                      "text-[11px] leading-tight",
                      selectedSize === size.id ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {size.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button className="h-12 w-full gap-2 rounded-xl text-base font-semibold">
            <ShoppingCart className="h-5 w-5" />
            Добавить в корзину
          </Button>

          <button
            type="button"
            onClick={handleGoToProduct}
            className="w-full text-center text-sm font-bold text-foreground"
          >
            Больше информации о товаре
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
