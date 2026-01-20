import { useState, useCallback } from "react";

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  isLiked?: boolean;
}

const allProducts: Product[] = [
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
  {
    id: "7",
    name: "Умные часы с пульсометром",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 4590,
    oldPrice: 6990,
    rating: 4.6,
    reviewsCount: 1234,
  },
  {
    id: "8",
    name: "Наушники беспроводные с шумоподавлением",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 7990,
    rating: 4.8,
    reviewsCount: 2341,
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
    id: "10",
    name: "Фитнес-браслет с трекером сна",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    price: 2490,
    rating: 4.3,
    reviewsCount: 789,
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
  {
    id: "12",
    name: "Подставка для ноутбука алюминиевая",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    price: 2290,
    rating: 4.4,
    reviewsCount: 321,
  },
];

const ITEMS_PER_PAGE = 4;

export const useInfiniteProducts = () => {
  const [products, setProducts] = useState<Product[]>(allProducts.slice(0, ITEMS_PER_PAGE));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const currentLength = products.length;
      const nextProducts = allProducts.slice(currentLength, currentLength + ITEMS_PER_PAGE);

      if (nextProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...nextProducts]);
        if (currentLength + nextProducts.length >= allProducts.length) {
          setHasMore(false);
        }
      }
      setIsLoading(false);
    }, 500);
  }, [products.length, isLoading, hasMore]);

  return { products, isLoading, hasMore, loadMore };
};
