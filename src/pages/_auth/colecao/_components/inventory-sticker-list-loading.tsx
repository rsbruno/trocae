import { StickerInlineCard } from "@/components/v2026/stickers/inline";
import { ForEach } from "@/components/utils/foreach";

import { InventoryStickerListItemSkeleton } from "./skeleton/inventory-sticker-list-item-skeleton";

type InventoryStickerListLoadingProps = {
  count?: number;
};

export function InventoryStickerListLoading({ count = 10 }: InventoryStickerListLoadingProps) {
  return (
    <StickerInlineCard>
      <ForEach items={Array.from({ length: count })}>
        {(_, props) => <InventoryStickerListItemSkeleton key={props?.index} />}
      </ForEach>
    </StickerInlineCard>
  );
}
