import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ProductCharacteristic {
  name: string;
  options: string[];
}

interface ProductCharacteristicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  characteristics: ProductCharacteristic[];
  onAddToCart: (selectedOptions: Record<string, string>) => void;
}

export const ProductCharacteristicsModal = ({
  isOpen,
  onClose,
  productName,
  characteristics,
  onAddToCart,
}: ProductCharacteristicsModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const isMobile = useIsMobile();

  const handleOptionSelect = (characteristicName: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [characteristicName]: option,
    }));
  };

  const handleAddToCart = () => {
    onAddToCart(selectedOptions);
    onClose();
    setSelectedOptions({});
  };

  const allCharacteristicsSelected = characteristics.every(
    char => selectedOptions[char.name]
  );

  const content = (
    <>
      {/* Product Name */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {productName}
      </p>

      {/* Characteristics */}
      <div className="space-y-6">
        {characteristics.map((characteristic) => (
          <div key={characteristic.name} className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              {characteristic.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {characteristic.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(characteristic.name, option)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    selectedOptions[characteristic.name] === option
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary hover:text-primary"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="rounded-t-xl flex flex-col max-h-[85dvh]">
          <SheetHeader className="pb-4 border-b border-border flex-shrink-0">
            <SheetTitle className="text-left text-lg font-semibold">
              Выберите характеристики
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {content}
          </div>

          {/* Add to Cart Button */}
          <div className="flex-shrink-0 border-t border-border pt-4 pb-safe">
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleAddToCart}
              disabled={!allCharacteristicsSelected}
            >
              <ShoppingCart className="h-4 w-4" />
              В корзину
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Modal Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Выберите характеристики
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {content}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleAddToCart}
          disabled={!allCharacteristicsSelected}
        >
          <ShoppingCart className="h-4 w-4" />
          В корзину
        </Button>
      </DialogContent>
    </Dialog>
  );
};