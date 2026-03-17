import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Heart, ShoppingCart, Share2, ChevronRight, Truck, Shield, RotateCcw, MapPin, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock product data
const mockProduct = {
  id: "1",
  name: 'Кроссовки мужские Nike Air Max 270 React, цвет: черный/белый, размеры 40-46',
  brand: "Nike",
  price: 8990,
  oldPrice: 14990,
  rating: 4.7,
  reviewsCount: 1243,
  questionsCount: 89,
  ordersCount: 5600,
  images: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop",
  ],
  colors: [
    { id: "black", name: "Чёрный", hex: "#1a1a1a", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
    { id: "white", name: "Белый", hex: "#f5f5f5", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop" },
    { id: "red", name: "Красный", hex: "#dc2626", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&h=200&fit=crop" },
    { id: "blue", name: "Синий", hex: "#2563eb", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop" },
  ],
  sizes: [
    { id: "39", label: "39", available: true },
    { id: "40", label: "40", available: true },
    { id: "41", label: "41", available: true },
    { id: "42", label: "42", available: true },
    { id: "43", label: "43", available: false },
    { id: "44", label: "44", available: true },
    { id: "45", label: "45", available: true },
    { id: "46", label: "46", available: false },
  ],
  description: `Кроссовки Nike Air Max 270 React сочетают в себе два революционных решения Nike — амортизацию Air Max и пену React — для невероятного комфорта на каждый день.\n\nВерх из сетчатого материала обеспечивает лёгкость и воздухопроницаемость. Подошва с технологией Air Max 270 создаёт мягкую амортизацию при каждом шаге.\n\nОсобенности:\n• Пена React для мягкости и отзывчивости\n• Элемент Air Max 270 в области пятки\n• Сетчатый верх для вентиляции\n• Резиновая подмётка для сцепления`,
  characteristics: [
    { label: "Бренд", value: "Nike" },
    { label: "Модель", value: "Air Max 270 React" },
    { label: "Пол", value: "Мужской" },
    { label: "Сезон", value: "Демисезон" },
    { label: "Материал верха", value: "Текстиль, синтетика" },
    { label: "Материал подошвы", value: "Резина, пена React" },
    { label: "Тип застёжки", value: "Шнуровка" },
    { label: "Страна производства", value: "Вьетнам" },
    { label: "Артикул", value: "AO4971-003" },
  ],
  seller: {
    name: "Nike Official Store",
    rating: 4.9,
    ordersCount: 152000,
  },
  delivery: {
    date: "20–22 марта",
    address: "ул. Примерная, д. 1",
    free: true,
  },
  reviews: [
    {
      id: "r1",
      author: "Алексей К.",
      date: "12 февраля 2026",
      rating: 5,
      text: "Отличные кроссовки! Очень удобные, сели идеально по размеру. Амортизация супер, ноги не устают даже после долгих прогулок. Рекомендую!",
      likes: 24,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"],
    },
    {
      id: "r2",
      author: "Мария С.",
      date: "8 февраля 2026",
      rating: 4,
      text: "Хорошие кроссовки за свою цену. Единственное — немного узковаты, лучше брать на полразмера больше. В остальном всё отлично.",
      likes: 11,
      images: [],
    },
    {
      id: "r3",
      author: "Дмитрий В.",
      date: "1 февраля 2026",
      rating: 5,
      text: "Покупаю Nike уже не первый раз, и эта модель не разочаровала. Лёгкие, дышащие, стильно выглядят. Доставили быстро, упаковка целая.",
      likes: 8,
      images: [],
    },
  ],
};

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  const discount = mockProduct.oldPrice
    ? Math.round((1 - mockProduct.price / mockProduct.oldPrice) * 100)
    : 0;

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? mockProduct.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === mockProduct.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Главная</button>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <button onClick={() => navigate("/products")} className="hover:text-primary transition-colors">Обувь</button>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-foreground truncate">{mockProduct.brand}</span>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Image Gallery */}
        <div className="lg:w-[40%] lg:sticky lg:top-20 lg:self-start">
          {/* Desktop Gallery */}
          <div className="hidden lg:flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {mockProduct.images.map((img, i) => (
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

            {/* Main Image */}
            <div className="flex-1 relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20">
                <img
                  src={mockProduct.images[selectedImage]}
                  alt={mockProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Nav arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
              {/* Discount badge */}
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-lg">
                  -{discount}%
                </span>
              )}
              {/* Like button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-card transition-colors"
              >
                <Heart className={cn("h-5 w-5", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
              </button>
            </div>
          </div>

          {/* Mobile Gallery - swipeable */}
          <div className="lg:hidden relative">
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20">
              <img
                src={mockProduct.images[mobileImageIndex]}
                alt={mockProduct.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Discount badge */}
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
            {/* Like */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm shadow flex items-center justify-center"
            >
              <Heart className={cn("h-5 w-5", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {mockProduct.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileImageIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    mobileImageIndex === i ? "bg-primary w-5" : "bg-card/60"
                  )}
                />
              ))}
            </div>
            {/* Nav arrows */}
            <button
              onClick={() => setMobileImageIndex((p) => (p === 0 ? mockProduct.images.length - 1 : p - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/70 backdrop-blur-sm shadow flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => setMobileImageIndex((p) => (p === mockProduct.images.length - 1 ? 0 : p + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/70 backdrop-blur-sm shadow flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>

          {/* Mobile thumbnails */}
          <div className="lg:hidden flex gap-2 mt-3 overflow-x-auto pb-1">
            {mockProduct.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMobileImageIndex(i)}
                className={cn(
                  "w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                  mobileImageIndex === i ? "border-primary" : "border-transparent"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Product Info */}
        <div className="lg:w-[35%] flex flex-col gap-5">
          {/* Title */}
          <div>
            <p className="text-sm text-primary font-medium mb-1">{mockProduct.brand}</p>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight">
              {mockProduct.name}
            </h1>
          </div>

          {/* Rating & stats */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-rating text-rating" />
              <span className="font-semibold text-foreground">{mockProduct.rating}</span>
            </div>
            <button className="text-primary hover:underline">{mockProduct.reviewsCount} отзывов</button>
            <span className="text-muted-foreground">•</span>
            <button className="text-primary hover:underline">{mockProduct.questionsCount} вопросов</button>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{mockProduct.ordersCount.toLocaleString("ru-RU")} заказов</span>
          </div>

          {/* Color selector */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Цвет: <span className="text-muted-foreground font-normal">{mockProduct.colors.find((c) => c.id === selectedColor)?.name}</span>
            </p>
            <div className="flex gap-2">
              {mockProduct.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={cn(
                    "w-16 h-16 rounded-lg border-2 transition-all overflow-hidden",
                    selectedColor === color.id ? "border-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">
                Размер: {selectedSize && <span className="text-muted-foreground font-normal">{selectedSize}</span>}
              </p>
              <button className="text-xs text-primary hover:underline">Таблица размеров</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockProduct.sizes.map((size) => (
                <button
                  key={size.id}
                  disabled={!size.available}
                  onClick={() => setSelectedSize(size.id)}
                  className={cn(
                    "h-10 min-w-[3rem] px-3 rounded-lg border text-sm font-medium transition-all",
                    !size.available && "opacity-30 cursor-not-allowed line-through",
                    selectedSize === size.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brief characteristics */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Характеристики</p>
            <div className="space-y-0">
              {mockProduct.characteristics.slice(0, 5).map((char, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-baseline py-2 text-sm",
                    i !== 4 && "border-b border-border"
                  )}
                >
                  <span className="text-muted-foreground w-1/2 flex-shrink-0">{char.label}</span>
                  <span className="text-foreground">{char.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile only: Price + Cart + Delivery + Seller */}
          <div className="lg:hidden space-y-5">
            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(mockProduct.price)}
              </span>
              {mockProduct.oldPrice && (
                <span className="text-lg text-muted-foreground line-through mb-0.5">
                  {formatPrice(mockProduct.oldPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-destructive mb-1">-{discount}%</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 h-12 text-base font-semibold gap-2">
                <ShoppingCart className="h-5 w-5" />
                Добавить в корзину
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 flex-shrink-0"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("h-5 w-5", isLiked ? "fill-like text-like" : "text-muted-foreground")} />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0">
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            {/* Delivery info */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Доставка {mockProduct.delivery.date}</p>
                  <p className="text-xs text-muted-foreground">{mockProduct.delivery.free ? "Бесплатно" : "Платная доставка"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Пункт выдачи</p>
                  <p className="text-xs text-muted-foreground">{mockProduct.delivery.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">Возврат в течение 14 дней</p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">Гарантия подлинности</p>
              </div>
            </div>

            {/* Seller */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{mockProduct.seller.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                    <span className="text-xs font-medium text-foreground">{mockProduct.seller.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mockProduct.seller.ordersCount.toLocaleString("ru-RU")} заказов
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">Все товары</Button>
            </div>
          </div>
        </div>

        {/* Right: Purchase sidebar (desktop only) */}
        <div className="hidden lg:block lg:w-[25%] lg:sticky lg:top-20 lg:self-start">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            {/* Price */}
            <div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(mockProduct.price)}
                </span>
                {discount > 0 && (
                  <span className="text-sm font-bold text-destructive mb-1">-{discount}%</span>
                )}
              </div>
              {mockProduct.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(mockProduct.oldPrice)}
                </span>
              )}
            </div>

            {/* Add to cart */}
            <Button className="w-full h-12 text-base font-semibold gap-2">
              <ShoppingCart className="h-5 w-5" />
              В корзину
            </Button>

            {/* Like + Share */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-10 gap-2"
                onClick={() => setIsLiked(!isLiked)}
              >
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
                <div>
                  <p className="text-sm font-medium text-foreground">Доставка {mockProduct.delivery.date}</p>
                  <p className="text-xs text-muted-foreground">{mockProduct.delivery.free ? "Бесплатно" : "Платная доставка"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Пункт выдачи</p>
                  <p className="text-xs text-muted-foreground">{mockProduct.delivery.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">Возврат 14 дней</p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">Гарантия подлинности</p>
              </div>
            </div>

            {/* Seller */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">{mockProduct.seller.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-3.5 w-3.5 fill-rating text-rating" />
                <span className="text-xs font-medium text-foreground">{mockProduct.seller.rating}</span>
                <span className="text-xs text-muted-foreground">
                  {mockProduct.seller.ordersCount.toLocaleString("ru-RU")} заказов
                </span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">Все товары продавца</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Characteristics, Reviews */}
      <div className="mt-8 lg:mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 lg:px-6 py-3 text-sm lg:text-base"
            >
              Описание
            </TabsTrigger>
            <TabsTrigger
              value="characteristics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 lg:px-6 py-3 text-sm lg:text-base"
            >
              Характеристики
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 lg:px-6 py-3 text-sm lg:text-base"
            >
              Отзывы ({mockProduct.reviewsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="max-w-3xl">
              {mockProduct.description.split("\n").map((paragraph, i) => (
                <p key={i} className={cn("text-sm lg:text-base text-foreground leading-relaxed", paragraph === "" ? "h-3" : "mb-3")}>
                  {paragraph}
                </p>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="characteristics" className="mt-6">
            <div className="max-w-2xl">
              {mockProduct.characteristics.map((char, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-baseline py-3 text-sm lg:text-base",
                    i !== mockProduct.characteristics.length - 1 && "border-b border-border"
                  )}
                >
                  <span className="text-muted-foreground w-1/2 flex-shrink-0">{char.label}</span>
                  <span className="text-foreground font-medium">{char.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="max-w-3xl space-y-6">
              {/* Rating summary */}
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">{mockProduct.rating}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-4 w-4",
                          s <= Math.round(mockProduct.rating) ? "fill-rating text-rating" : "text-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{mockProduct.reviewsCount} отзывов</p>
                </div>
              </div>

              {/* Review list */}
              {mockProduct.reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{review.author[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-3.5 w-3.5",
                          s <= review.rating ? "fill-rating text-rating" : "text-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
                  {review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                      👍 {review.likes}
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Показать все отзывы
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
