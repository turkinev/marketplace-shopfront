import { ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  bgColor?: string;
  imageUrl?: string;
}

interface PromoBannersProps {
  mainBanner: Banner;
  smallBanners: Banner[];
  onBannerClick?: (bannerId: string) => void;
}

export const PromoBanners = ({
  mainBanner,
  smallBanners,
  onBannerClick,
}: PromoBannersProps) => {
  return (
    <div className="w-full space-y-3 lg:space-y-4 animate-fade-in">
      {/* Main Banner - Larger on desktop Ozon style */}
      <div
        className="relative w-full h-32 md:h-48 lg:h-64 xl:h-72 rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer hover-scale"
        style={{ backgroundColor: mainBanner.bgColor || '#374151' }}
        onClick={() => onBannerClick?.(mainBanner.id)}
      >
        {mainBanner.imageUrl && (
          <img
            src={mainBanner.imageUrl}
            alt={mainBanner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {(mainBanner.title || mainBanner.subtitle) && (
          <div className="absolute inset-0 p-4 md:p-6 lg:p-8 flex flex-col justify-center">
            {mainBanner.title && <h3 className="text-white font-bold text-lg md:text-xl lg:text-3xl drop-shadow-md">{mainBanner.title}</h3>}
            {mainBanner.subtitle && (
              <p className="text-white/80 text-sm md:text-base lg:text-lg mt-1 lg:mt-2 drop-shadow-md">{mainBanner.subtitle}</p>
            )}
          </div>
        )}
        <div className="absolute right-3 md:right-6 lg:right-8 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white/80 drop-shadow-md" />
        </div>
      </div>

      {/* Small Banners - evenly distributed across full width */}
      <div className="flex gap-2 md:gap-3 lg:gap-4">
        {smallBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative flex-1 aspect-square rounded-lg lg:rounded-xl overflow-hidden cursor-pointer hover-scale"
            style={{ backgroundColor: banner.bgColor || '#374151' }}
            onClick={() => onBannerClick?.(banner.id)}
          >
            {banner.imageUrl && (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {banner.title && (
              <div className="absolute inset-0 p-2 lg:p-3 flex flex-col justify-end">
                <h4 className="text-white font-semibold text-xs md:text-sm lg:text-base leading-tight drop-shadow-md">
                  {banner.title}
                </h4>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
