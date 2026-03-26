import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const masonryProducts = [
  {
    id: "m1",
    name: "Кожаная сумка ручной работы",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=600&fit=crop",
    price: 4590,
    oldPrice: 6990,
    rating: 4.8,
    reviewsCount: 312,
  },
  {
    id: "m2",
    name: "Набор кистей для макияжа 12шт",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    price: 1290,
    oldPrice: 1890,
    rating: 4.6,
    reviewsCount: 891,
  },
  {
    id: "m3",
    name: "Винтажный фотоаппарат Polaroid",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=500&fit=crop",
    price: 8990,
    oldPrice: 12990,
    rating: 4.9,
    reviewsCount: 156,
  },
  {
    id: "m4",
    name: "Ароматическая свеча Лаванда",
    imageUrl: "https://images.unsplash.com/photo-1602607753498-63e0e4f4a17e?w=400&h=400&fit=crop",
    price: 590,
    rating: 4.5,
    reviewsCount: 2034,
  },
  {
    id: "m5",
    name: "Керамическая ваза ручной работы",
    imageUrl: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=650&fit=crop",
    price: 2390,
    oldPrice: 3490,
    rating: 4.7,
    reviewsCount: 89,
  },
  {
    id: "m6",
    name: "Солнцезащитные очки Ray-Ban",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=280&fit=crop",
    price: 7990,
    oldPrice: 11990,
    rating: 4.8,
    reviewsCount: 1567,
  },
  {
    id: "m7",
    name: "Плед из мериносовой шерсти",
    imageUrl: "https://images.unsplash.com/photo-1580301762395-21ce6d555b43?w=400&h=550&fit=crop",
    price: 3990,
    oldPrice: 5490,
    rating: 4.9,
    reviewsCount: 234,
  },
  {
    id: "m8",
    name: "Настольная лампа минимализм",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=350&fit=crop",
    price: 2790,
    rating: 4.4,
    reviewsCount: 678,
  },
  {
    id: "m9",
    name: "Кожаный ремень премиум",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=250&fit=crop",
    price: 1990,
    oldPrice: 2990,
    rating: 4.6,
    reviewsCount: 445,
  },
  {
    id: "m10",
    name: "Комнатное растение Монстера",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45571cf291b?w=400&h=700&fit=crop",
    price: 1490,
    rating: 4.7,
    reviewsCount: 923,
  },
  {
    id: "m11",
    name: "Беспроводные наушники",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 5990,
    oldPrice: 8990,
    rating: 4.8,
    reviewsCount: 3421,
  },
  {
    id: "m12",
    name: "Набор для рисования акварелью",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    price: 2190,
    oldPrice: 3290,
    rating: 4.5,
    reviewsCount: 178,
  },
];

const formatPrice = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";

const MasonryCard = ({ product }: { product: typeof masonryProducts[0] }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer break-inside-avoid mb-3 lg:mb-4"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-sm hover:bg-card transition-colors"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isLiked ? "fill-like text-like" : "text-muted-foreground"
            )}
          />
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <h3 className="text-sm text-foreground line-clamp-2 mb-2 leading-snug">{product.name}</h3>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-rating text-rating" />
            <span className="text-xs font-medium text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewsCount})</span>
          </div>
        )}
        <Button size="sm" className="w-full gap-2" onClick={(e) => e.stopPropagation()}>
          <ShoppingCart className="h-4 w-4" />
          В корзину
        </Button>
      </div>
    </div>
  );
};

const MasonryGrid = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-foreground">Masonry сетка</h1>
        </div>

        <div className="columns-2 lg:columns-4 xl:columns-5 gap-3 lg:gap-4">
          {masonryProducts.map((product) => (
            <MasonryCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasonryGrid;
