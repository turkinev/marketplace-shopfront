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
    <div className="space-y-3 animate-fade-in">
      {/* Main Banner */}
      <div
        className="relative w-full h-32 md:h-48 lg:h-56 rounded-xl overflow-hidden cursor-pointer hover-scale"
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
          <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-center">
            {mainBanner.title && <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl drop-shadow-md">{mainBanner.title}</h3>}
            {mainBanner.subtitle && (
              <p className="text-white/80 text-sm md:text-base mt-1 drop-shadow-md">{mainBanner.subtitle}</p>
            )}
          </div>
        )}
        <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white/80 drop-shadow-md" />
        </div>
      </div>

      {/* Small Banners Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {smallBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative h-24 md:h-28 lg:h-32 rounded-lg overflow-hidden cursor-pointer hover-scale"
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
              <div className="absolute inset-0 p-2 flex flex-col justify-end">
                <h4 className="text-white font-semibold text-xs md:text-sm leading-tight drop-shadow-md">
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
