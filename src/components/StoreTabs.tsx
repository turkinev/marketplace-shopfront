import { useState } from "react";
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

export const StoreTabs = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (value: string) => {
    setActiveTab(activeTab === value ? null : value);
  };

  const activeContent = tabsData.find((tab) => tab.value === activeTab);

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {tabsData.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              "px-3 py-2 text-sm rounded-lg transition-colors",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
  );
};
