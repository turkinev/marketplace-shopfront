import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryL3 {
  id: string;
  name: string;
}

interface CategoryL2 {
  id: string;
  name: string;
  children: CategoryL3[];
}

interface CategoryL1 {
  id: string;
  name: string;
  children: CategoryL2[];
}

const catalogData: CategoryL1[] = [
  {
    id: "clothes",
    name: "Одежда",
    children: [
      {
        id: "men-clothes",
        name: "Мужская одежда",
        children: [
          { id: "tshirts-m", name: "Футболки" },
          { id: "shirts-m", name: "Рубашки" },
          { id: "jeans-m", name: "Джинсы" },
          { id: "pants-m", name: "Брюки" },
          { id: "jackets-m", name: "Куртки" },
        ],
      },
      {
        id: "women-clothes",
        name: "Женская одежда",
        children: [
          { id: "dresses", name: "Платья" },
          { id: "blouses", name: "Блузки" },
          { id: "skirts", name: "Юбки" },
          { id: "pants-w", name: "Брюки" },
          { id: "jackets-w", name: "Куртки" },
        ],
      },
      {
        id: "kids-clothes",
        name: "Детская одежда",
        children: [
          { id: "jackets-k", name: "Куртки" },
          { id: "pants-k", name: "Штаны" },
        ],
      },
    ],
  },
  {
    id: "shoes",
    name: "Обувь",
    children: [
      {
        id: "sneakers",
        name: "Кроссовки",
        children: [
          { id: "sneakers-m", name: "Мужские кроссовки" },
          { id: "sneakers-w", name: "Женские кроссовки" },
          { id: "sneakers-k", name: "Детские кроссовки" },
        ],
      },
      {
        id: "formal-shoes",
        name: "Туфли",
        children: [
          { id: "shoes-m", name: "Мужские туфли" },
          { id: "shoes-w", name: "Женские туфли" },
        ],
      },
      {
        id: "boots",
        name: "Сапоги",
        children: [
          { id: "boots-w", name: "Женские сапоги" },
          { id: "boots-m", name: "Мужские сапоги" },
          { id: "boots-k", name: "Детские сапоги" },
          { id: "boots-winter", name: "Зимние сапоги" },
        ],
      },
    ],
  },
  {
    id: "accessories",
    name: "Аксессуары",
    children: [
      {
        id: "bags",
        name: "Сумки",
        children: [
          { id: "bags-w", name: "Женские сумки" },
          { id: "bags-m", name: "Мужские сумки" },
          { id: "backpacks", name: "Рюкзаки" },
          { id: "clutches", name: "Клатчи" },
        ],
      },
      {
        id: "belts",
        name: "Ремни",
        children: [
          { id: "belts-m", name: "Мужские ремни" },
          { id: "belts-w", name: "Женские ремни" },
        ],
      },
      {
        id: "watches",
        name: "Часы",
        children: [
          { id: "watches-m", name: "Мужские часы" },
          { id: "watches-w", name: "Женские часы" },
          { id: "watches-smart", name: "Смарт-часы" },
        ],
      },
    ],
  },
];

const L3_VISIBLE_LIMIT = 3;

interface MobileCatalogMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string | null, categoryName: string | null) => void;
  storeName: string;
}

const RadioCircle = ({ selected }: { selected: boolean }) => (
  <div
    className={cn(
      "ml-auto mr-4 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
      selected
        ? "border-primary bg-primary"
        : "border-muted-foreground/40"
    )}
  >
    {selected && <Check className="h-3 w-3 text-primary-foreground" />}
  </div>
);

export const MobileCatalogMenu = ({
  isOpen,
  onClose,
  onSelectCategory,
  storeName,
}: MobileCatalogMenuProps) => {
  const [expandedL3, setExpandedL3] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, name: string) => {
    setSelectedId(id);
    onSelectCategory(id, name);
  };

  const handleAllProducts = () => {
    setSelectedId("all");
    onSelectCategory(null, null);
  };

  const toggleExpandL3 = (l2Id: string) => {
    setExpandedL3((prev) => {
      const next = new Set(prev);
      if (next.has(l2Id)) {
        next.delete(l2Id);
      } else {
        next.add(l2Id);
      }
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Каталог</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="py-2">
          {/* Все товары */}
          <button
            onClick={handleAllProducts}
            className="w-full flex items-center py-2.5 pl-4 pr-2 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground">Все товары</span>
            <RadioCircle selected={selectedId === "all"} />
          </button>

          {/* L1 */}
          {catalogData.map((l1) => (
            <div key={l1.id}>
              <button
                onClick={() => handleSelect(l1.id, l1.name)}
                className="w-full flex items-center py-2.5 pl-4 pr-2 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground">{l1.name}</span>
                <RadioCircle selected={selectedId === l1.id} />
              </button>

              {/* L2 */}
              {l1.children.map((l2) => (
                <div key={l2.id}>
                  <button
                    onClick={() => handleSelect(l2.id, l2.name)}
                    className="w-full flex items-center py-2.5 pl-8 pr-2 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm text-foreground">{l2.name}</span>
                    <RadioCircle selected={selectedId === l2.id} />
                  </button>

                  {/* L3 */}
                  {l2.children.length > 0 && (() => {
                    const isExpanded = expandedL3.has(l2.id);
                    const visibleL3 = isExpanded
                      ? l2.children
                      : l2.children.slice(0, L3_VISIBLE_LIMIT);
                    const hasMore = l2.children.length > L3_VISIBLE_LIMIT;

                    return (
                      <>
                        {visibleL3.map((l3) => (
                          <button
                            key={l3.id}
                            onClick={() => handleSelect(l3.id, l3.name)}
                            className="w-full flex items-center py-2 pl-12 pr-2 hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-sm text-muted-foreground">{l3.name}</span>
                            <RadioCircle selected={selectedId === l3.id} />
                          </button>
                        ))}
                        {hasMore && (
                          <button
                            onClick={() => toggleExpandL3(l2.id)}
                            className="w-full text-left py-2 pl-12 pr-2"
                          >
                            <span className="text-sm text-primary">
                              {isExpanded ? "Скрыть" : "Показать ещё"}
                            </span>
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
