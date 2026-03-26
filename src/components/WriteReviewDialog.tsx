import { useState } from "react";
import { Star, ImagePlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface WriteReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onSubmit: (data: { rating: number; text: string; photos: string[] }) => void;
}

export const WriteReviewDialog = ({ isOpen, onClose, productName, onSubmit }: WriteReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
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
    onSubmit({ rating, text, photos });
    setRating(0);
    setText("");
    setPhotos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Оценить товар</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground line-clamp-2">{productName}</p>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hoveredStar || rating) >= star
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
          className="min-h-[100px] resize-none"
        />

        {/* Photos */}
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
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
            className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
          Отправить отзыв
        </Button>
      </DialogContent>
    </Dialog>
  );
};
