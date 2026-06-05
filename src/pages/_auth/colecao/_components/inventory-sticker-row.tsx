import { CircleDashed } from "@phosphor-icons/react";

import type { Sticker } from "@/@types/sticker";

import {
  StickerInlineRepeatedCount,
  StickerInlinePlayerName,
  StickerInlineTeamFlag,
  StickerInlineTeamName,
  StickerInlineContent,
  StickerInlineRarity,
  StickerInlineCode,
  StickerInlineRoot,
  StickerInlineEnd
} from "@/components/v2026/stickers/inline";

type InventoryStickerRowProps = {
  sticker: Sticker;
  rarity?: string;
  className?: string;
  rarityClassName?: string;
  repeatedCount?: number;
  showMissingIndicator?: boolean;
};

export function InventoryStickerRow({
  showMissingIndicator = false,
  rarityClassName,
  repeatedCount,
  className,
  sticker,
  rarity
}: InventoryStickerRowProps) {
  return (
    <StickerInlineRoot className={className} rarity={rarity} data={sticker}>
      <StickerInlineTeamFlag />
      <StickerInlineContent>
        <StickerInlinePlayerName>
          {showMissingIndicator ? <CircleDashed className="mr-1 inline text-white/35" weight="bold" size={13} /> : null}
          {sticker.player.name}
        </StickerInlinePlayerName>
        <StickerInlineTeamName />
      </StickerInlineContent>
      <StickerInlineEnd>
        <StickerInlineCode />
        <StickerInlineRarity className={rarityClassName} />
      </StickerInlineEnd>
      {repeatedCount ? <StickerInlineRepeatedCount>{repeatedCount}</StickerInlineRepeatedCount> : null}
    </StickerInlineRoot>
  );
}
