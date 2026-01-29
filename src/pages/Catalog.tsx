import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

const categories: Category[] = [
  { id: "1", name: "Футболки", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" },
  { id: "2", name: "Джинсы", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop" },
  { id: "3", name: "Куртки", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop" },
  { id: "4", name: "Платья", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop" },
  { id: "5", name: "Обувь", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
  { id: "6", name: "Аксессуары", imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop" },
  { id: "7", name: "Спортивная одежда", imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100&h=100&fit=crop" },
  { id: "8", name: "Нижнее белье", imageUrl: "https://images.unsplash.com/photo-1617331140180-e8262094733a?w=100&h=100&fit=crop" },
];

const Catalog = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-foreground mb-4">Каталог</h1>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="w-full flex items-center gap-4 p-3 bg-card rounded-lg border border-border hover:bg-secondary/50 transition-colors"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <span className="text-sm font-medium text-foreground">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
