import { ProductCard } from "@/components/ProductCard";
import { WriteReviewDialog } from "@/components/WriteReviewDialog";
import { ShoppingBag, Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const purchasedProducts = [
  {
    id: "1",
    name: "Зубная паста GRASS Crispi для чувствительных зубов с дозатором 250мл",
    imageUrl: "https://i256.63pokupki.ru/item/x256/136055624f3ebdb2e80c5817d0321ecd18bq4fzqfmbuj2nqc.jpg",
    price: 184,
    oldPrice: 263,
    rating: 4.8,
    reviewsCount: 2453,
    purchaseDate: "15 мар",
    status: "delivered" as const,
  },
  {
    id: "2",
    name: "Мыло жидкое хозяйственное с маслом кедра (1000 мл)",
    imageUrl: "https://i256.63pokupki.ru/item/x256/033ac89c7084a4add05ab228d1749711imwhzzwlr6fpj91.jpg",
    price: 110,
    oldPrice: 177,
    rating: 4.6,
    reviewsCount: 891,
    purchaseDate: "10 мар",
    status: "delivered" as const,
  },
  {
    id: "5",
    name: "Механическая клавиатура с RGB подсветкой",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
    price: 5990,
    oldPrice: 8990,
    rating: 4.9,
    reviewsCount: 432,
    purchaseDate: "22 мар",
    status: "in_transit" as const,
  },
  {
    id: "7",
    name: "Умные часы с пульсометром",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 4590,
    oldPrice: 6990,
    rating: 4.6,
    reviewsCount: 1234,
    purchaseDate: "20 мар",
    status: "in_transit" as const,
  },
  {
    id: "9",
    name: "Термокружка из нержавеющей стали 500мл",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    price: 890,
    oldPrice: 1290,
    rating: 4.5,
    reviewsCount: 456,
    purchaseDate: "5 мар",
    status: "delivered" as const,
  },
  {
    id: "11",
    name: "Зарядное устройство быстрое 65W",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    price: 1790,
    oldPrice: 2490,
    rating: 4.7,
    reviewsCount: 567,
    purchaseDate: "1 мар",
    status: "delivered" as const,
  },
];

const statusLabels: Record<string, { text: string; className: string }> = {
  delivered: { text: "Доставлен", className: "bg-success/90 text-success-foreground" },
  in_transit: { text: "В пути", className: "bg-warning/90 text-warning-foreground" },
};

const PurchaseCardWrapper = ({ product, onStarClick }: { 
  product: typeof purchasedProducts[0]; 
  onStarClick: (id: string, name: string, star: number) => void;
}) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <ProductCard
        id={product.id}
        name={product.name}
        imageUrl={product.imageUrl}
        price={product.price}
        oldPrice={product.oldPrice}
        rating={product.rating}
        reviewsCount={product.reviewsCount}
      />
      {/* Rate stars below card on white bg */}
      <div className="flex items-center justify-between bg-card px-2 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={(e) => {
              e.stopPropagation();
              onStarClick(product.id, product.name, star);
            }}
            className="flex-1 flex items-center justify-center p-0.5"
          >
            <Star className="h-5 w-5 text-muted-foreground/30 hover:fill-rating hover:text-rating transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

const MyPurchases = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string; initialRating: number } | null>(null);

  const handleStarClick = (productId: string, productName: string, star: number) => {
    if (isMobile) {
      navigate(`/write-review?name=${encodeURIComponent(productName)}&rating=${star}`);
    } else {
      setReviewProduct({ id: productId, name: productName, initialRating: star });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Мои покупки</h1>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 lg:gap-4">
          {purchasedProducts.map((product) => (
            <PurchaseCardWrapper
              key={product.id}
              product={product}
              onStarClick={handleStarClick}
            />
          ))}
        </div>
      </div>

      {/* Desktop review dialog */}
      {reviewProduct && (
        <WriteReviewDialog
          isOpen={!!reviewProduct}
          onClose={() => setReviewProduct(null)}
          productName={reviewProduct.name}
          initialRating={reviewProduct.initialRating}
          onSubmit={(data) => {
            console.log("Review for", reviewProduct.id, data);
            setReviewProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default MyPurchases;
