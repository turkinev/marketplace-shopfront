import { StorefrontBlock, ShelfConfig, TilesConfig, BannerConfig, ReviewsConfig } from "@/hooks/useStorefrontBlocks";
import { ShelfBlock } from "./ShelfBlock";
import { TilesBlock } from "./TilesBlock";
import { BannerBlock } from "./BannerBlock";
import { ReviewsBlock } from "./ReviewsBlock";

interface StorefrontRendererProps {
  blocks: StorefrontBlock[];
}

export const StorefrontRenderer = ({ blocks }: StorefrontRendererProps) => {
  if (blocks.length === 0) return null;

  return (
    <div className="mt-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "shelf":
            return <ShelfBlock key={block.id} config={block.config as ShelfConfig} />;
          case "tiles":
            return <TilesBlock key={block.id} config={block.config as TilesConfig} />;
          case "banner":
            return <BannerBlock key={block.id} config={block.config as BannerConfig} />;
          case "slider":
            return <BannerBlock key={block.id} config={block.config as BannerConfig} isSlider />;
          case "reviews":
            return <ReviewsBlock key={block.id} config={block.config as ReviewsConfig} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
