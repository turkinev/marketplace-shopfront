import { useState, useRef, useCallback, useEffect } from "react";
import { Star, ThumbsUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ReviewPhoto {
  id: string;
  url: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  text: string;
  photos?: ReviewPhoto[];
  likes: number;
  isLiked?: boolean;
  size?: string;
  color?: string;
}

const mockProductReviews: Review[] = [
  {
    id: "1",
    userName: "Алексей К.",
    rating: 5,
    date: "12 февраля 2026",
    text: "Отличные кроссовки! Очень удобные, сели идеально по размеру. Амортизация супер, ноги не устают даже после долгих прогулок. Рекомендую!",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop" },
    ],
    likes: 24,
    isLiked: false,
    size: "80B",
    color: "Красный",
  },
  {
    id: "2",
    userName: "Мария С.",
    rating: 4,
    date: "8 февраля 2026",
    text: "Хорошие кроссовки за свою цену. Единственное — немного узковаты, лучше брать на полразмера больше. В остальном всё отлично.",
    likes: 11,
    isLiked: true,
    size: "75C",
    color: "Белый",
  },
  {
    id: "3",
    userName: "Дмитрий В.",
    rating: 5,
    date: "1 февраля 2026",
    text: "Покупаю уже не первый раз, и эта модель не разочаровала. Лёгкие, дышащие, стильно выглядят. Доставили быстро, упаковка целая.",
    photos: [
      { id: "p2", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop" },
      { id: "p3", url: "https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=200&h=200&fit=crop" },
    ],
    likes: 8,
    isLiked: false,
    size: "85B",
    color: "Чёрный",
  },
  {
    id: "4",
    userName: "Ольга Н.",
    rating: 3,
    date: "25 января 2026",
    text: "В целом нормально, но ожидала большего за эту цену. Ткань тоньше, чем на фото. Размер подошёл.",
    likes: 3,
    isLiked: false,
    size: "75B",
    color: "Голубой",
  },
];

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating ? "fill-rating text-rating" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

const RatingSummary = ({ reviews }: { reviews: Review[] }) => {
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (r) => reviews.filter((review) => review.rating === r).length
  );

  return (
    <div className="flex items-start gap-6 p-4 bg-secondary/30 rounded-lg">
      <div className="text-center">
        <div className="text-4xl font-bold text-foreground">{avgRating.toFixed(1)}</div>
        <StarRating rating={Math.round(avgRating)} size="md" />
        <div className="text-sm text-muted-foreground mt-1">{reviews.length} отзывов</div>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <div key={rating} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-3">{rating}</span>
            <Star className="h-3 w-3 fill-rating text-rating" />
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-rating rounded-full transition-all"
                style={{ width: `${(ratingCounts[index] / reviews.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-6">{ratingCounts[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({ review, onLike }: { review: Review; onLike: (id: string) => void }) => {
  const [showFullText, setShowFullText] = useState(false);
  const isLongText = review.text.length > 200;

  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {review.userName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{review.userName}</div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size & color info */}
      {(review.size || review.color) && (
        <div className="flex gap-3 mb-2 text-xs text-muted-foreground">
          {review.size && <span>Размер: {review.size}</span>}
          {review.color && <span>Цвет: {review.color}</span>}
        </div>
      )}

      <p className="text-sm text-foreground leading-relaxed mb-3">
        {isLongText && !showFullText ? review.text.slice(0, 200) + "..." : review.text}
        {isLongText && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-primary hover:underline ml-1"
          >
            {showFullText ? "Свернуть" : "Читать полностью"}
          </button>
        )}
      </p>

      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt="Фото отзыва"
              className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => onLike(review.id)}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-colors",
            review.isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", review.isLiked && "fill-current")} />
          <span>{review.likes}</span>
        </button>
      </div>
    </div>
  );
};

export const ProductReviewsList = () => {
  const [reviews, setReviews] = useState<Review[]>(mockProductReviews);
  const [sortBy, setSortBy] = useState("date");
  const [filterRating, setFilterRating] = useState("all");
  const [showWithPhotos, setShowWithPhotos] = useState(false);

  const handleLike = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  };

  const filteredReviews = reviews
    .filter((r) => {
      if (filterRating !== "all" && r.rating !== parseInt(filterRating)) return false;
      if (showWithPhotos && (!r.photos || r.photos.length === 0)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "likes") return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="space-y-4">
      <RatingSummary reviews={reviews} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">По дате</SelectItem>
            <SelectItem value="rating">По рейтингу</SelectItem>
            <SelectItem value="likes">По полезности</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Все оценки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все оценки</SelectItem>
            <SelectItem value="5">5 звёзд</SelectItem>
            <SelectItem value="4">4 звезды</SelectItem>
            <SelectItem value="3">3 звезды</SelectItem>
            <SelectItem value="2">2 звезды</SelectItem>
            <SelectItem value="1">1 звезда</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showWithPhotos ? "default" : "outline"}
          size="sm"
          onClick={() => setShowWithPhotos(!showWithPhotos)}
          className="gap-1.5"
        >
          <ImageIcon className="h-4 w-4" />
          С фото
        </Button>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onLike={handleLike} />
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Отзывов с выбранными фильтрами не найдено
          </div>
        )}
      </div>

      {filteredReviews.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" className="gap-2">
            <ChevronDown className="h-4 w-4" />
            Показать ещё отзывы
          </Button>
        </div>
      )}
    </div>
  );
};
