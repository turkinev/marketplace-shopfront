import { ShelfConfig } from "@/hooks/useStorefrontBlocks";
import { ProductCard } from "@/components/ProductCard";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ShelfBlockProps {
  config: ShelfConfig;
}

export const ShelfBlock = ({ config }: ShelfBlockProps) => {
  const { products: allProducts } = useInfiniteProducts();

  const shelfProducts = config.productIds.length > 0
    ? allProducts.filter((p) => config.productIds.includes(p.id))
    : allProducts.slice(0, 8);

  if (shelfProducts.length < 5) return null;

  return (
    <div className="mb-6">
      {config.title && (
        <h2 className="text-lg font-bold text-foreground mb-3">{config.title}</h2>
      )}
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4">
          {shelfProducts.map((product) => (
            <div key={product.id} className="w-[160px] md:w-[180px] flex-shrink-0">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
