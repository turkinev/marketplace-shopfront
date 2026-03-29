import { ReviewsConfig } from "@/hooks/useStorefrontBlocks";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ReviewsBlockProps {
  config: ReviewsConfig;
}

const mockReviews = [
  { id: "r1", user: "Мария К.", rating: 5, text: "Отличное качество! Очень довольна покупкой, рекомендую всем.", date: "2 дня назад" },
  { id: "r2", user: "Алексей П.", rating: 4, text: "Хороший товар за свою цену. Доставка быстрая.", date: "5 дней назад" },
  { id: "r3", user: "Елена С.", rating: 5, text: "Заказываю уже не первый раз. Всегда всё на высоте!", date: "1 неделю назад" },
  { id: "r4", user: "Дмитрий В.", rating: 4, text: "Качество хорошее, упаковка аккуратная.", date: "2 недели назад" },
];

export const ReviewsBlock = ({ config }: ReviewsBlockProps) => {
  const navigate = useNavigate();
  const reviews = mockReviews.slice(0, config.showCount);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">{config.title}</h2>
        <Button variant="link" className="text-primary" onClick={() => navigate("/product/1/reviews")}>
          Все отзывы
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {review.user[0]}
              </div>
              <span className="text-sm font-medium text-foreground">{review.user}</span>
              <div className="flex ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-rating text-rating" : "text-muted"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            <span className="text-xs text-muted-foreground mt-2 block">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
