import { useState } from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryTabsProps {
  categories: Category[];
  onSelect?: (categoryId: string) => void;
}

export const CategoryTabs = ({ categories, onSelect }: CategoryTabsProps) => {
  const [activeId, setActiveId] = useState(categories[0]?.id);

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelect?.(id);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleSelect(category.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
            activeId === category.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-card text-foreground hover:bg-secondary"
          )}
        >
          {category.name}
          {category.count !== undefined && (
            <span className={cn(
              "ml-1.5",
              activeId === category.id 
                ? "text-primary-foreground/80" 
                : "text-muted-foreground"
            )}>
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
