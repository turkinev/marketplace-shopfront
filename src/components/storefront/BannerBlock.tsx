import { BannerConfig } from "@/hooks/useStorefrontBlocks";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BannerBlockProps {
  config: BannerConfig;
  isSlider?: boolean;
}

const sizeClasses: Record<string, string> = {
  S: "h-[145px] md:h-[200px] lg:h-[250px]",
  M: "h-[145px] md:h-[200px] lg:h-[250px]",
  L: "h-[145px] md:h-[200px] lg:h-[250px]",
};

export const BannerBlock = ({ config, isSlider }: BannerBlockProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heightClass = sizeClasses[config.size] || sizeClasses.M;

  if (config.banners.length === 0) return null;

  const renderBanner = (banner: BannerConfig["banners"][0]) => {
    const src = isMobile
      ? (banner.mobileImageUrl || banner.imageUrl)
      : (banner.imageUrl || banner.mobileImageUrl);

    return (
      <div
        key={banner.id}
        className={`relative w-full ${heightClass} rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity bg-secondary`}
        onClick={() => banner.link && navigate(banner.link)}
      >
        {src && (
          <img src={src} alt="" className="w-full h-full object-cover" />
        )}
      </div>
    );
  };

  if (isSlider && config.banners.length > 1) {
    return (
      <div className="mb-3">
        <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}>
          <CarouselContent>
            {config.banners.map((banner) => (
              <CarouselItem key={banner.id}>
                {renderBanner(banner)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/30 border-none text-white hover:bg-black/50" />
          <CarouselNext className="right-2 bg-black/30 border-none text-white hover:bg-black/50" />
        </Carousel>
      </div>
    );
  }

  return <div className="mb-3">{renderBanner(config.banners[0])}</div>;
};
