import { useState, useRef, useEffect, useCallback } from "react";
import colorRedImg from "@/assets/color-red.jpg";
import colorRedImg2 from "@/assets/color-red-2.jpg";
import colorWhiteImg from "@/assets/color-white.jpg";
import colorWhiteImg2 from "@/assets/color-white-2.jpg";
import colorBlackImg from "@/assets/color-black.jpg";
import colorBlackImg2 from "@/assets/color-black-2.jpg";
import colorBlueImg from "@/assets/color-blue.jpg";
import colorBlueImg2 from "@/assets/color-blue-2.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Heart, ShoppingCart, Share2, ChevronRight, Truck, Shield, RotateCcw, MapPin, ChevronLeft, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { SizeChartSheet } from "@/components/SizeChartSheet";

const mockProduct = {
  id: "1",
  name: 'Комплект белья Karolina',
  brand: "Karolina",
  price: 847,
  oldPrice: 974,
  rating: 4.7,
  reviewsCount: 1243,
  questionsCount: 89,
  ordersCount: 5600,
  colors: [
    { id: "red", name: "Красный", hex: "#dc2626", image: colorRedImg, images: [colorRedImg, colorRedImg2] },
    { id: "white", name: "Белый", hex: "#f5f5f5", image: colorWhiteImg, images: [colorWhiteImg, colorWhiteImg2] },
    { id: "black", name: "Чёрный", hex: "#1a1a1a", image: colorBlackImg, images: [colorBlackImg, colorBlackImg2] },
    { id: "blue", name: "Голубой", hex: "#7dd3fc", image: colorBlueImg, images: [colorBlueImg, colorBlueImg2] },
  ],
  sizes: [
    { id: "75b", label: "75B", supplierSize: "75B", available: true },
    { id: "75c", label: "75C", supplierSize: "75C", available: true },
    { id: "80b", label: "80B", supplierSize: "80B", available: true },
    { id: "80c", label: "80C", supplierSize: "80C", available: true },
    { id: "85b", label: "85B", supplierSize: "85B", available: true },
    { id: "85c", label: "85C", supplierSize: "85C", available: true },
  ],
  description: `Собственное производство\nТаблица размеров в карточке товара.\n\nИдеальный выбор для повседневного комфорта и стиля - базовый комплект нашего собственного производства. Модель на тонких бретелях формирует соблазнительную линию декольте за счет расстояния между чашками. Расширенный поясок для комфорта, сзади застежка на два крючка. Трусики-стринги будут незаметны под одеждой.\n\nКомплект идет размер в размер.\n\nПараметры модели: 90-66-98, рост 174 см\nРазмер на модели: 80В`,
  characteristics: [
    { label: "Пол", value: "Женский" },
    { label: "Материал", value: "Текстиль" },
    { label: "Бренд", value: "Karolina" },
  ],
  seller: {
    name: "Mandhary - Новая премиальная коллекция",
    rating: 4.9,
    ordersCount: 152000,
  },
  delivery: {
    date: "20–22 марта",
    address: "ул. Примерная, д. 1",
    free: true,
  },
  reviews: [
    { id: "r1", author: "Алексей К.", date: "12 февраля 2026", rating: 5, text: "Отличные кроссовки! Очень удобные, сели идеально по размеру. Амортизация супер, ноги не устают даже после долгих прогулок. Рекомендую!", likes: 24, images: [] },
    { id: "r2", author: "Мария С.", date: "8 февраля 2026", rating: 4, text: "Хорошие кроссовки за свою цену. Единственное — немного узковаты, лучше брать на полразмера больше. В остальном всё отлично.", likes: 11, images: [] },
    { id: "r3", author: "Дмитрий В.", date: "1 февраля 2026", rating: 5, text: "Покупаю Nike уже не первый раз, и эта модель не разочаровала. Лёгкие, дышащие, стильно выглядят. Доставили быстро, упаковка целая.", likes: 8, images: [] },
  ],
};

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
};

const ProductDetailOld = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const priceRef = useRef<HTMLDivElement>(null);
  const [isPriceVisible, setIsPriceVisible] = useState(true);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const colorsScrollRef = useRef<HTMLDivElement>(null);
  const sizesScrollRef = useRef<HTMLDivElement>(null);
  const [colorSearch, setColorSearch] = useState("");
  const [sizeSearch, setSizeSearch] = useState("");

  useEffect(() => {
    const refs = [reviewsScrollRef, colorsScrollRef, sizesScrollRef];
    const cleanups: (() => void)[] = [];
    refs.forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      el.classList.add('scrollbar-idle');
      let timer: ReturnType<typeof setTimeout>;
      const show = () => {
        el.classList.remove('scrollbar-idle');
        clearTimeout(timer);
        timer = setTimeout(() => el.classList.add('scrollbar-idle'), 2000);
      };
      el.addEventListener('scroll', show);
      el.addEventListener('touchstart', show);
      cleanups.push(() => {
        clearTimeout(timer);
        el.removeEventListener('scroll', show);
        el.removeEventListener('touchstart', show);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const el = priceRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPriceVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentColor = mockProduct.colors.find((c) => c.id === selectedColor) || mockProduct.colors[0];
  const currentImages = currentColor.images;

  const discount = mockProduct.oldPrice
    ? Math.round((1 - mockProduct.price / mockProduct.oldPrice) * 100)
    : 0;

  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
    setSelectedImage(0);
    setMobileImageIndex(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      setMobileImageIndex((p) => (p === currentImages.length - 1 ? 0 : p + 1));
    } else if (touchDeltaX.current > threshold) {
      setMobileImageIndex((p) => (p === 0 ? currentImages.length - 1 : p - 1));
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  const { products: relatedProducts, isLoading: relatedLoading, hasMore: relatedHasMore, loadMore: loadMoreRelated } = useInfiniteProducts();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (relatedLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && relatedHasMore) {
        loadMoreRelated();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [relatedLoading, relatedHasMore, loadMoreRelated]);

  // Filtered colors based on search
  const filteredColors = mockProduct.colors.filter(c =>
    c.name.toLowerCase().includes(colorSearch.toLowerCase())
  );

  // Filtered sizes based on search
  const filteredSizes = mockProduct.sizes.filter(s =>
    s.label.toLowerCase().includes(sizeSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto lg:container lg:px-4 py-0 lg:py-6">
      {/* Breadcrumbs */}
      <nav className="sr-only">
        <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Главная</button>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <button onClick={() => navigate("/products")} className="hover:text-primary transition-colors">Обувь</button>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-foreground truncate">{mockProduct.brand}</span>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
        {/* Left: Image Gallery */}
        <div className="lg:w-[45%] lg:sticky lg:top-20 lg:self-start">
          {/* Desktop Gallery */}
          <div className="hidden lg:flex gap-3">
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {currentImages.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelectedImage(i)}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === i ? "border-primary" : "border-transparent hover:border-primary/40"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative group">
              <div key={selectedColor} className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary/20 relative">
                {currentImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={mockProduct.name}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
                      selectedImage === i ? "opacity-100" : "opacity-0"
                    )}
                  />
                ))}
              </div>
              <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
              <button onClick={() => setIsLiked(!isLiked)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-card transition-colors">
                <Heart className={cn("h-5 w-5", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
              </button>
            </div>
          </div>

          {/* Mobile Gallery */}
          <div className="lg:hidden bg-card overflow-hidden">
            <div className="relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div key={selectedColor} className="aspect-[4/5] relative bg-secondary/20">
                {currentImages.map((img, i) => (
                  <img key={i} src={img} alt={mockProduct.name} className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out", mobileImageIndex === i ? "opacity-100" : "opacity-0")} />
                ))}
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => setIsLiked(!isLiked)} className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center">
                  <Heart className={cn("h-4 w-4", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
                </button>
                <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {currentImages.map((_, i) => (
                  <button key={i} onClick={() => setMobileImageIndex(i)} className={cn("w-2 h-2 rounded-full transition-all", mobileImageIndex === i ? "bg-primary w-5" : "bg-card/60")} />
                ))}
              </div>
            </div>
            <div ref={priceRef} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold" style={{ color: 'rgb(0, 105, 51)' }}>{formatPrice(mockProduct.price)}</span>
                  {mockProduct.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(mockProduct.oldPrice)}</span>
                  )}
                </div>
                <button onClick={() => setIsProductInfoOpen(true)} className="p-1 rounded-full hover:bg-secondary transition-colors">
                  <Info className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Product Info */}
        <div className="lg:w-[35%] flex flex-col gap-2 lg:gap-5">
          {/* Title - desktop only */}
          <div className="hidden lg:block">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight">{mockProduct.name}</h1>
          </div>

          {/* Rating & stats - desktop only */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-rating text-rating" />
            <span className="font-semibold text-foreground">{mockProduct.rating}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{mockProduct.reviewsCount} отзывов</span>
          </div>

          {/* Mobile: Selectors card */}
          <div className="max-lg:bg-card max-lg:rounded-xl max-lg:p-4 max-lg:space-y-4 lg:contents">
            {/* Color selector — inline search + scrollable chips */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="w-1/2 text-sm font-medium text-foreground truncate">
                  Цвет: <span className="text-muted-foreground font-normal">{mockProduct.colors.find((c) => c.id === selectedColor)?.name}</span>
                </p>
                <div className="relative w-1/2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Поиск..."
                    value={colorSearch}
                    onChange={(e) => setColorSearch(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
              <div ref={colorsScrollRef} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-fade" style={{ scrollSnapType: 'x mandatory' }}>
                {filteredColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    style={{ scrollSnapAlign: 'start' }}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap",
                      selectedColor === color.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    {color.name}
                  </button>
                ))}
                {filteredColors.length === 0 && (
                  <span className="text-sm text-muted-foreground py-2">Ничего не найдено</span>
                )}
              </div>
            </div>

            {/* Size selector — inline search + scrollable chips + size chart below */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="w-1/2 text-sm font-medium text-foreground truncate">
                  Размер: {selectedSize && <span className="text-muted-foreground font-normal">{selectedSize}</span>}
                </p>
                <div className="relative w-1/2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Поиск..."
                    value={sizeSearch}
                    onChange={(e) => setSizeSearch(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
              <div ref={sizesScrollRef} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-fade" style={{ scrollSnapType: 'x mandatory' }}>
                {filteredSizes.map((size) => (
                  <button
                    key={size.id}
                    disabled={!size.available}
                    onClick={() => setSelectedSize(size.id)}
                    style={{ scrollSnapAlign: 'start' }}
                    className={cn(
                      "flex-shrink-0 h-auto min-w-[3.5rem] px-3 py-1.5 rounded-lg border transition-all flex flex-col items-center",
                      !size.available && "opacity-30 cursor-not-allowed",
                      selectedSize === size.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    <span className="text-sm font-bold leading-tight">{size.label}</span>
                    <span className={cn(
                      "text-[11px] leading-tight",
                      selectedSize === size.id ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>{size.supplierSize}</span>
                  </button>
                ))}
                {filteredSizes.length === 0 && (
                  <span className="text-sm text-muted-foreground py-2">Ничего не найдено</span>
                )}
              </div>
              <button onClick={() => setIsSizeChartOpen(true)} className="text-xs text-muted-foreground mt-2">Таблица размеров</button>
            </div>
          </div>

          {/* Mobile: Title + Rating + Reviews card */}
          <div className="lg:hidden bg-card rounded-xl p-4 space-y-3">
            <h1 className="text-base font-bold text-foreground leading-tight">{mockProduct.name}</h1>
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-rating text-rating" />
              <span className="font-semibold text-foreground">{mockProduct.rating}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{mockProduct.reviewsCount} отзывов</span>
            </div>
            <div ref={reviewsScrollRef} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-fade" style={{ scrollSnapType: 'x mandatory' }}>
              {mockProduct.reviews.map((review) => (
                <div key={review.id} className="flex-shrink-0 w-[75%] bg-secondary/50 rounded-lg p-3 space-y-2" style={{ scrollSnapAlign: 'start' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-rating text-rating" : "text-border")} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.author}</span>
                  </div>
                  <p className="text-xs text-foreground line-clamp-3 leading-relaxed">{review.text}</p>
                  <button onClick={() => navigate(`/product-old/${id}/reviews`)} className="text-xs text-primary font-medium">Перейти к отзывам</button>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Description + Characteristics tabs + Seller card */}
          <div className="lg:hidden bg-card rounded-xl p-4 space-y-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-9">
                <TabsTrigger value="description" className="text-sm">Описание</TabsTrigger>
                <TabsTrigger value="characteristics" className="text-sm">Характеристики</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-3">
                <div className="space-y-3 text-sm text-foreground leading-relaxed">
                  <p>Собственное производство</p>
                  <p>Таблица размеров в карточке товара.</p>
                  <p>Идеальный выбор для повседневного комфорта и стиля - базовый комплект нашего собственного производства. Модель на тонких бретелях формирует соблазнительную линию декольте за счет расстояния между чашками. Расширенный поясок для комфорта, сзади застежка на два крючка. Трусики-стринги будут незаметны под одеждой.</p>
                  <p>Комплект идет размер в размер.</p>
                  <p>Параметры модели: 90-66-98, рост 174 см</p>
                  <p>Размер на модели: 80В</p>
                </div>
              </TabsContent>
              <TabsContent value="characteristics" className="mt-3">
                <div className="space-y-0">
                  {mockProduct.characteristics.slice(0, 5).map((char, i) => (
                    <div key={i} className={cn("flex items-baseline py-2 text-sm", i !== mockProduct.characteristics.slice(0, 5).length - 1 && "border-b border-border")}>
                      <span className="text-muted-foreground w-1/2 flex-shrink-0">{char.label}</span>
                      <span className="text-foreground">{char.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <button onClick={() => navigate("/")} className="w-full bg-secondary/50 rounded-lg p-3 flex items-center gap-3 text-left">
              <div>
                <p className="text-sm font-medium text-foreground">{mockProduct.seller.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                  <span className="text-xs font-medium text-foreground">{mockProduct.seller.rating}</span>
                </div>
              </div>
            </button>
          </div>

          <div className="hidden lg:block">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-9">
                <TabsTrigger value="description" className="text-sm">Описание</TabsTrigger>
                <TabsTrigger value="characteristics" className="text-sm">Характеристики</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-3">
                <div className="space-y-3 text-sm text-foreground leading-relaxed">
                  <p>Собственное производство</p>
                  <p>Таблица размеров в карточке товара.</p>
                  <p>Идеальный выбор для повседневного комфорта и стиля - базовый комплект нашего собственного производства. Модель на тонких бретелях формирует соблазнительную линию декольте за счет расстояния между чашками. Расширенный поясок для комфорта, сзади застежка на два крючка. Трусики-стринги будут незаметны под одеждой.</p>
                  <p>Комплект идет размер в размер.</p>
                  <p>Параметры модели: 90-66-98, рост 174 см</p>
                  <p>Размер на модели: 80В</p>
                </div>
              </TabsContent>
              <TabsContent value="characteristics" className="mt-3">
                <div className="space-y-0">
                  {mockProduct.characteristics.slice(0, 5).map((char, i) => (
                    <div key={i} className={cn("flex items-baseline py-2 text-sm", i !== 4 && "border-b border-border")}>
                      <span className="text-muted-foreground w-1/2 flex-shrink-0">{char.label}</span>
                      <span className="text-foreground">{char.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: Purchase sidebar (desktop only) */}
        <div className="hidden lg:block lg:w-[25%] lg:sticky lg:top-20 lg:self-start">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: 'rgb(0, 105, 51)' }}>
                {formatPrice(mockProduct.price)}
              </span>
              {mockProduct.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(mockProduct.oldPrice)}
                </span>
              )}
            </div>
            <Button className="w-full h-12 text-base font-semibold gap-2">
              <ShoppingCart className="h-5 w-5" />
              В корзину
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-10 gap-2" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={cn("h-4 w-4", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
                <span className="text-sm">В избранное</span>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">Доставка {mockProduct.delivery.date}</p>
              </div>
            </div>
            <button onClick={() => navigate("/store/1")} className="w-full bg-secondary/50 rounded-lg p-3 flex items-center gap-3 text-left">
              <div>
                <p className="text-sm font-medium text-foreground">{mockProduct.seller.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                  <span className="text-xs font-medium text-foreground">{mockProduct.seller.rating}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-6 lg:mt-10 px-2 lg:px-0">
        <h2 className="text-lg font-bold text-foreground mb-4">Смотрите также</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.imageUrl}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              isLiked={product.isLiked}
              characteristics={product.characteristics}
            />
          ))}
        </div>
        {relatedHasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {relatedLoading && (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-2 pb-safe overflow-hidden">
        <div className={cn(
          "flex items-baseline gap-2 transition-all duration-300 ease-out",
          isPriceVisible ? "max-h-0 opacity-0 translate-y-full" : "max-h-10 opacity-100 translate-y-0 mb-1"
        )}>
          <span className="text-base font-bold" style={{ color: 'rgb(0, 105, 51)' }}>{formatPrice(mockProduct.price)}</span>
          {mockProduct.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(mockProduct.oldPrice)}</span>
          )}
        </div>
        <Button className="w-full h-12 text-sm flex flex-col items-center justify-center gap-0">
          <span className="font-semibold leading-tight">В корзину</span>
          <span className="text-sm font-normal leading-tight opacity-80">{mockProduct.delivery.date}</span>
        </Button>
      </div>
      <div className="lg:hidden h-16" />

      {/* Product Info Bottom Sheet */}
      <Sheet open={isProductInfoOpen} onOpenChange={setIsProductInfoOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-left">Информация</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Комиссия</span>
              <span className="text-sm font-medium text-foreground">21% (не менее 20 р.)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Страна производитель</span>
              <span className="text-sm font-medium text-foreground">Россия</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SizeChartSheet open={isSizeChartOpen} onOpenChange={setIsSizeChartOpen} />

    </div>
  );
};

export default ProductDetailOld;
