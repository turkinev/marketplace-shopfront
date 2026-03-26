import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, ImagePlus, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const WriteReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productName = searchParams.get("name") || "Товар";
  const initialRating = Number(searchParams.get("rating") || 0);

  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoAdd = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setPhotos((prev) => [...prev, ev.target?.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    console.log("Review submitted:", { rating, text, photos });
    navigate("/my-purchases");
  };

  return (
    <div className="min-h-screen bg-background -mt-12 lg:-mt-0 relative z-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/my-purchases")}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Оценить товар</h1>
      </div>

      <div className="px-4 py-5 space-y-5">
        <p className="text-sm text-muted-foreground line-clamp-2">{productName}</p>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  rating >= star
                    ? "fill-rating text-rating"
                    : "text-muted-foreground/30"
                )}
              />
            </button>
          ))}
        </div>

        {/* Text */}
        <Textarea
          placeholder="Расскажите о товаре..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        {/* Photos */}
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-background/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={handlePhotoAdd}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
          Отправить отзыв
        </Button>
      </div>
    </div>
  );
};

export default WriteReview;
