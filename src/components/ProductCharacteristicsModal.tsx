import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Выберите характеристики
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Product Name */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {productName}
          </p>

          {/* Characteristics */}
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
