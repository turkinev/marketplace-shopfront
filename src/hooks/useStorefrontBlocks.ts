import { useState, useCallback, useEffect } from "react";

export type BlockType = "shelf" | "tiles" | "banner" | "slider" | "reviews";

export interface ShelfConfig {
  title: string;
  productIds: string[];
}

export interface TileItem {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}

export interface TilesConfig {
  count: 2 | 4 | 6;
  tiles: TileItem[];
}

export type BannerSize = "S" | "M" | "L";

export interface BannerItem {
  id: string;
  imageUrl: string;
  mobileImageUrl: string;
  link: string;
}

export interface BannerConfig {
  size: BannerSize;
  banners: BannerItem[];
}

export interface ReviewsConfig {
  title: string;
  showCount: number;
}

export interface StorefrontBlock {
  id: string;
  type: BlockType;
  order: number;
  config: ShelfConfig | TilesConfig | BannerConfig | ReviewsConfig;
}

const STORAGE_KEY = "storefront_blocks";

function loadBlocks(): StorefrontBlock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveBlocks(blocks: StorefrontBlock[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

export const useStorefrontBlocks = () => {
  const [blocks, setBlocks] = useState<StorefrontBlock[]>(loadBlocks);

  useEffect(() => {
    saveBlocks(blocks);
  }, [blocks]);

  const addBlock = useCallback((type: BlockType) => {
    const id = crypto.randomUUID();
    const order = blocks.length;
    let config: StorefrontBlock["config"];

    switch (type) {
      case "shelf":
        config = { title: "", productIds: [] } as ShelfConfig;
        break;
      case "tiles":
        config = { count: 2, tiles: [{ id: crypto.randomUUID(), imageUrl: "", title: "", link: "" }, { id: crypto.randomUUID(), imageUrl: "", title: "", link: "" }] } as TilesConfig;
        break;
      case "banner":
        config = { size: "M", banners: [{ id: crypto.randomUUID(), imageUrl: "", link: "" }] } as BannerConfig;
        break;
      case "slider":
        config = { size: "M", banners: [{ id: crypto.randomUUID(), imageUrl: "", link: "" }, { id: crypto.randomUUID(), imageUrl: "", link: "" }] } as BannerConfig;
        break;
      case "reviews":
        config = { title: "Отзывы покупателей", showCount: 3 } as ReviewsConfig;
        break;
    }

    setBlocks((prev) => [...prev, { id, type, order, config }]);
    return id;
  }, [blocks.length]);

  const updateBlock = useCallback((id: string, config: StorefrontBlock["config"]) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, config } : b)));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })));
  }, []);

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);
      return sorted.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return { blocks: sortedBlocks, addBlock, updateBlock, removeBlock, reorderBlocks };
};
