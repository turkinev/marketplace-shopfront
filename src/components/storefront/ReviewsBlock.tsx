import { ReviewsConfig } from "@/hooks/useStorefrontBlocks";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

interface ReviewsBlockProps {
  config: ReviewsConfig;
}

const mockReviews = [
  { id: "r1", rating: 5, photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", name: "Куртка оверсайз", price: 4990, oldPrice: 7990 },
  { id: "r2", rating: 4, photo: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop", name: "Джинсы прямые", price: 3490, oldPrice: undefined },
  { id: "r3", rating: 5, photo: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop", name: "Худи базовое", price: 2990, oldPrice: 4490 },
  { id: "r4", rating: 4, photo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop", name: "Брюки карго", price: 3990, oldPrice: undefined },
  { id: "r5", rating: 5, photo: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop", name: "Футболка хлопок", price: 1490, oldPrice: 1990 },
];

export const ReviewsBlock = ({ config }: ReviewsBlockProps) => {
  const navigate = useNavigate();
  const reviews = mockReviews.slice(0, config.showCount);
  const [showScrollbar, setShowScrollbar] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollbar(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <Button variant="link" className="text-primary" onClick={() => navigate("/product/1/reviews")}>
          Все отзывы
        </Button>
      </div>
      <div
        className={`flex gap-3 overflow-x-auto pb-2 ${showScrollbar ? "" : "scrollbar-hide"}`}
        onTouchStart={() => setShowScrollbar(true)}
        onTouchEnd={() => setTimeout(() => setShowScrollbar(false), 2000)}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="min-w-[140px] max-w-[150px] shrink-0 rounded-xl overflow-hidden relative aspect-[3/4] bg-muted"
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              src={review.photo}
              alt={review.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < review.rating ? "fill-rating text-rating" : "text-white/40"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-white leading-tight line-clamp-1">{review.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{review.price.toLocaleString()} ₽</span>
                {review.oldPrice && (
                  <span className="text-xs text-white/50 line-through">{review.oldPrice.toLocaleString()} ₽</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
