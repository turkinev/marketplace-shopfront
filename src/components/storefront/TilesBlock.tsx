import { TilesConfig } from "@/hooks/useStorefrontBlocks";
import { useNavigate } from "react-router-dom";

interface TilesBlockProps {
  config: TilesConfig;
}

export const TilesBlock = ({ config }: TilesBlockProps) => {
  const navigate = useNavigate();

  if (config.tiles.length === 0) return null;

  const cols = config.count === 2 ? "grid-cols-2" : config.count === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3 md:grid-cols-6";

  return (
    <div className="mb-6">
      <div className={`grid ${cols} gap-3`}>
        {config.tiles.map((tile) => (
          <div
            key={tile.id}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-secondary"
            onClick={() => tile.link && navigate(tile.link)}
          >
            {tile.imageUrl && (
              <img src={tile.imageUrl} alt={tile.title} className="w-full h-full object-cover" />
            )}
            {tile.title && (
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-sm font-medium text-white drop-shadow">{tile.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
