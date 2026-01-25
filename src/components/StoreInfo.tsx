import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const tabsData = [
  {
    value: "description",
    label: "Описание",
    content: "Добро пожаловать в наш магазин! Мы предлагаем широкий ассортимент качественных товаров по доступным ценам. Все товары проходят тщательную проверку качества перед отправкой.",
  },
  {
    value: "sizing",
    label: "Размерная сетка",
    content: "Размеры указаны в соответствии с международной системой. Рекомендуем сверяться с таблицей размеров в карточке товара. При возникновении вопросов обращайтесь в поддержку.",
  },
];

export const StoreInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (value: string) => {
    setActiveTab(activeTab === value ? null : value);
  };

  const activeContent = tabsData.find((tab) => tab.value === activeTab);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      >
        Информация
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 animate-fade-in">
          <div className="flex gap-2">
            {tabsData.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value)}
                className={cn(
                  "flex-1 px-4 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap text-center",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeContent && (
            <div className="p-4 bg-card rounded-lg border border-border animate-fade-in">
              <p className="text-sm text-foreground leading-relaxed">
                {activeContent.content}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
