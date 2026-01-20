import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabsData = [
  {
    value: "description",
    label: "Описание",
    content: "Добро пожаловать в наш магазин! Мы предлагаем широкий ассортимент качественных товаров по доступным ценам. Все товары проходят тщательную проверку качества перед отправкой.",
  },
  {
    value: "conditions",
    label: "Условия",
    content: "Доставка осуществляется по всей России. Бесплатная доставка при заказе от 3000₽. Возврат товара возможен в течение 14 дней с момента получения. Оплата при получении или онлайн.",
  },
  {
    value: "certificates",
    label: "Сертификаты",
    content: "Все товары сертифицированы и соответствуют стандартам качества ГОСТ. Имеются сертификаты соответствия и декларации на всю продукцию. Документы предоставляются по запросу.",
  },
  {
    value: "sizing",
    label: "Размерная сетка",
    content: "Размеры указаны в соответствии с международной системой. Рекомендуем сверяться с таблицей размеров в карточке товара. При возникновении вопросов обращайтесь в поддержку.",
  },
];

export const StoreTabs = () => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        {tabsData.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-3 py-2 text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted text-muted-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsData.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-3 p-4 bg-card rounded-lg border border-border"
        >
          <p className="text-sm text-foreground leading-relaxed">{tab.content}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
};
