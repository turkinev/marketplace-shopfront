import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronDown, Filter, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface SellerReply {
  text: string;
  date: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  text: string;
  photos?: ReviewPhoto[];
  likes: number;
  isLiked?: boolean;
  productName: string;
  productUrl: string;
  sellerReply?: SellerReply;
}

// Mock data
const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Анна К.",
    rating: 5,
    date: "15 января 2025",
    text: "Отличное качество! Заказывала платье для дочери, пришло точно по размеру. Ткань приятная, швы ровные. Доставка была быстрой. Обязательно буду заказывать ещё!",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop" },
      { id: "p2", url: "https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=200&h=200&fit=crop" },
    ],
    likes: 24,
    isLiked: false,
    productName: "Платье детское летнее",
    productUrl: "/products/1",
    sellerReply: {
      text: "Спасибо за отзыв! Рады, что вам понравилось. Ждём вас снова!",
      date: "16 января 2025",
    },
  },
  {
    id: "2",
    userName: "Михаил П.",
    rating: 4,
    date: "12 января 2025",
    text: "Хороший товар за свои деньги. Единственное — доставка немного задержалась, но продавец предупредил заранее. В целом доволен покупкой.",
    likes: 8,
    isLiked: true,
    productName: "Кроссовки мужские",
    productUrl: "/products/2",
  },
  {
    id: "3",
    userName: "Елена В.",
    rating: 5,
    date: "10 января 2025",
    text: "Уже не первый раз заказываю в этом магазине. Всегда отличное качество и быстрая обработка заказа. Рекомендую!",
    photos: [
      { id: "p3", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop" },
    ],
    likes: 15,
    isLiked: false,
    productName: "Блузка женская",
    productUrl: "/products/3",
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
      {/* Header */}
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

      {/* Product Link */}
      <a
        href={review.productUrl}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-2"
      >
        <span className="text-muted-foreground">Товар:</span> {review.productName}
      </a>

      {/* Text */}
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

      {/* Photos */}
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

      {/* Seller Reply */}
      {review.sellerReply && (
        <div className="bg-secondary/50 rounded-lg p-3 mb-3 ml-4 border-l-2 border-primary">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">Ответ продавца</Badge>
            <span className="text-xs text-muted-foreground">{review.sellerReply.date}</span>
          </div>
          <p className="text-sm text-foreground">{review.sellerReply.text}</p>
        </div>
      )}

      {/* Actions */}
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

export const StoreReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
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
    <div className="bg-card rounded-lg p-4 lg:p-6 shadow-sm">
      <h2 className="text-lg lg:text-xl font-bold text-foreground mb-4">
        Отзывы о магазине
      </h2>

      {/* Rating Summary */}
      <RatingSummary reviews={reviews} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
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

      {/* Load More */}
      {filteredReviews.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" className="gap-2">
            <ChevronDown className="h-4 w-4" />
            Показать ещё отзывы
          </Button>
        </div>
      )}
    </div>
  );
};
