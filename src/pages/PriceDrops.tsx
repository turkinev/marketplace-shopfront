import { ProductCard } from "@/components/ProductCard";
import { TrendingDown } from "lucide-react";

const priceDropProducts = [
  {
    id: "1",
    name: "Зубная паста GRASS Crispi для чувствительных зубов с дозатором 250мл",
    imageUrl: "https://i256.63pokupki.ru/item/x256/136055624f3ebdb2e80c5817d0321ecd18bq4fzqfmbuj2nqc.jpg",
    price: 184,
    oldPrice: 263,
    rating: 4.8,
    reviewsCount: 2453,
  },
  {
    id: "2",
    name: "Мыло жидкое хозяйственное с маслом кедра (1000 мл)",
    imageUrl: "https://i256.63pokupki.ru/item/x256/033ac89c7084a4add05ab228d1749711imwhzzwlr6fpj91.jpg",
    price: 110,
    oldPrice: 177,
    rating: 4.6,
    reviewsCount: 891,
  },
  {
    id: "5",
    name: "Механическая клавиатура с RGB подсветкой",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop",
    price: 5990,
    oldPrice: 8990,
    rating: 4.9,
    reviewsCount: 432,
    characteristics: [
      { name: "Тип переключателей", options: ["Red", "Blue", "Brown"] },
      { name: "Раскладка", options: ["RU", "EN", "RU+EN"] },
    ],
  },
  {
    id: "7",
    name: "Умные часы с пульсометром",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 4590,
    oldPrice: 6990,
    rating: 4.6,
    reviewsCount: 1234,
    characteristics: [
      { name: "Размер ремешка", options: ["S/M", "M/L"] },
      { name: "Цвет корпуса", options: ["Чёрный", "Серебро", "Розовое золото"] },
    ],
  },
  {
    id: "9",
    name: "Термокружка из нержавеющей стали 500мл",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    price: 890,
    oldPrice: 1290,
    rating: 4.5,
    reviewsCount: 456,
  },
  {
    id: "11",
    name: "Зарядное устройство быстрое 65W",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    price: 1790,
    oldPrice: 2490,
    rating: 4.7,
    reviewsCount: 567,
  },
];

const PriceDrops = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Стало дешевле</h1>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 lg:gap-4">
          {priceDropProducts.map((product) => (
              <div key={product.id} className="ring-2 ring-success/60 rounded-lg overflow-hidden">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                  characteristics={product.characteristics}
                />
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceDrops;
