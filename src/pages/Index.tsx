import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanners } from "@/components/PromoBanners";
import { ArrowLeft, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const mainBanner = {
  id: "promo-1",
  title: "Скидки до 50%",
  subtitle: "На всю электронику до конца недели",
  bgColor: "hsl(217, 91%, 50%)",
};

const smallBanners = [
  { id: "collection-1", title: "Хиты продаж", bgColor: "hsl(280, 65%, 50%)" },
  { id: "collection-2", title: "Новинки", bgColor: "hsl(160, 65%, 40%)" },
  { id: "collection-3", title: "До 1000₽", bgColor: "hsl(25, 85%, 55%)" },
];


const products = [
  {
    id: "1",
    name: "Беспроводные наушники с шумоподавлением Premium",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 4990,
    oldPrice: 7990,
    rating: 4.8,
    reviewsCount: 2453,
  },
  {
    id: "2",
    name: "Умные часы с пульсометром и GPS",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 12990,
    oldPrice: 15990,
    rating: 4.6,
    reviewsCount: 891,
  },
  {
    id: "3",
    name: "Портативная колонка водонепроницаемая",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    price: 3490,
    rating: 4.7,
    reviewsCount: 1256,
  },
  {
    id: "4",
    name: "Рюкзак для ноутбука 15.6 дюймов",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    price: 2990,
    oldPrice: 4490,
    rating: 4.5,
    reviewsCount: 678,
    isLiked: true,
  },
  {
    id: "5",
    name: "Механическая клавиатура с RGB подсветкой",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
    price: 5990,
    oldPrice: 8990,
    rating: 4.9,
    reviewsCount: 432,
  },
  {
    id: "6",
    name: "Беспроводная мышь эргономичная",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    price: 1990,
    rating: 4.4,
    reviewsCount: 567,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="container flex items-center gap-2 h-14 px-4">
          <Button variant="ghost" size="icon" className="text-foreground flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <SearchBar />
          </div>
          
          <div className="flex items-center flex-shrink-0">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-4 space-y-4">
        {/* Store Header */}
        <StoreHeader
          name="TechGadgets Pro"
          rating={4.8}
          ordersCount={125400}
          likesCount={45200}
        />

        {/* Promo Banners */}
        <PromoBanners
          mainBanner={mainBanner}
          smallBanners={smallBanners}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
