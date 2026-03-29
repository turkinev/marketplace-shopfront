import { BannerConfig } from "@/hooks/useStorefrontBlocks";
import { useNavigate } from "react-router-dom";
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
  M: "h-[280px] md:h-[350px] lg:h-[400px]",
  L: "h-[462px] md:h-[500px] lg:h-[600px]",
};

export const BannerBlock = ({ config, isSlider }: BannerBlockProps) => {
  const navigate = useNavigate();
  const heightClass = sizeClasses[config.size] || sizeClasses.M;

  if (config.banners.length === 0) return null;

  const renderBanner = (banner: BannerConfig["banners"][0]) => (
    <div
      key={banner.id}
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity bg-secondary`}
      onClick={() => banner.link && navigate(banner.link)}
    >
      {banner.imageUrl && (
        <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
      )}
    </div>
  );

  if (isSlider && config.banners.length > 1) {
    return (
      <div className="mb-6">
        <Carousel className="w-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 10000, stopOnInteraction: false })]}>
          <CarouselContent>
            {config.banners.map((banner) => (
              <CarouselItem key={banner.id}>
                {renderBanner(banner)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    );
  }

  return <div className="mb-6">{renderBanner(config.banners[0])}</div>;
};
