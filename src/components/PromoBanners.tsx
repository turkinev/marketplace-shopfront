import { ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  bgColor: string;
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
        className="relative w-full h-32 rounded-xl overflow-hidden cursor-pointer hover-scale"
        style={{ backgroundColor: mainBanner.bgColor }}
        onClick={() => onBannerClick?.(mainBanner.id)}
      >
        <div className="absolute inset-0 p-4 flex flex-col justify-center">
          <h3 className="text-white font-bold text-lg">{mainBanner.title}</h3>
          {mainBanner.subtitle && (
            <p className="text-white/80 text-sm mt-1">{mainBanner.subtitle}</p>
          )}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronRight className="h-6 w-6 text-white/60" />
        </div>
      </div>

      {/* Small Banners Grid */}
      <div className="grid grid-cols-3 gap-2">
        {smallBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover-scale"
            style={{ backgroundColor: banner.bgColor }}
            onClick={() => onBannerClick?.(banner.id)}
          >
            <div className="absolute inset-0 p-2 flex flex-col justify-end">
              <h4 className="text-white font-semibold text-xs leading-tight">
                {banner.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
