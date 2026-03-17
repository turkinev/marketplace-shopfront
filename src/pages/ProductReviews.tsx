import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductReviewsList } from "@/components/ProductReviewsList";
import { ProductCharacteristicsModal, ProductCharacteristic } from "@/components/ProductCharacteristicsModal";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const mockProduct = {
  name: "Комплект белья Karolina",
  price: 847,
  delivery: { date: "20–22 марта" },
  characteristics: [
    { name: "Цвет", options: ["Красный", "Белый", "Чёрный", "Голубой"] },
    { name: "Размер", options: ["75B", "75C", "80B", "80C", "85B", "85C"] },
  ] as ProductCharacteristic[],
};

const ProductReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (selectedOptions: Record<string, string>) => {
    toast({ title: "Товар добавлен в корзину", description: `${mockProduct.name} — ${Object.values(selectedOptions).join(", ")}` });
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      {/* Header with back arrow and product name */}
      <div className="sticky top-0 z-40 bg-card border-b border-border flex items-center gap-3 px-4 h-12">
        <button
          onClick={() => navigate(-1)}
          className="text-foreground -ml-1 p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-foreground truncate">{mockProduct.name}</span>
      </div>

      <div className="px-4 py-4 lg:py-6">
        <ProductReviewsList />
      </div>

      {/* Sticky cart button - mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-2 pb-safe">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-base font-bold" style={{ color: "rgb(0, 105, 51)" }}>{mockProduct.price} ₽</span>
          <span className="text-sm text-muted-foreground line-through">{mockProduct.oldPrice} ₽</span>
        </div>
        <Button
          className="w-full h-12 text-sm flex flex-col items-center justify-center gap-0"
          onClick={() => setIsCharModalOpen(true)}
        >
          <span className="font-semibold leading-tight">В корзину</span>
          <span className="text-sm font-normal leading-tight opacity-80">{mockProduct.delivery.date}</span>
        </Button>
      </div>

      <ProductCharacteristicsModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        productName={mockProduct.name}
        characteristics={mockProduct.characteristics}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductReviews;
