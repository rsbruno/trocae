import { RepeatIcon } from "@phosphor-icons/react";

import {
  StickerInlineRepeatedCount,
  StickerInlinePlayerName,
  StickerInlineTeamFlag,
  StickerInlineTeamName,
  StickerInlineContent,
  StickerInlineRarity,
  StickerInlineCard,
  StickerInlineCode,
  StickerInlineRoot,
  StickerInlineEnd
} from "@/components/v2026/stickers/inline";
import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { useFindRepeatedCollectionItems } from "@/services/collections/find-repeated-collection-items.service";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickerListItemSkeleton } from "../skeleton/inventory-sticker-list-item-skeleton";

export function InventoryRepeatedTab() {
  const { isLoading, error, data } = useFindRepeatedCollectionItems();

  const totalRepeated = data?.reduce((sum, item) => sum + item.repeatedCount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <ShowIf if={isLoading}>
        <StickerInlineCard>
          {Array.from({ length: 10 }).map((_, index) => (
            <InventoryStickerListItemSkeleton key={index} />
          ))}
        </StickerInlineCard>
      </ShowIf>

      <ShowIf if={Boolean(error) && !isLoading}>
        <EmptyStateRoot className="py-8" tone="danger">
          <EmptyStateContent>
            <EmptyStateTitle className="text-status-danger">
              {error?.message ?? "Não foi possível carregar as repetidas."}
            </EmptyStateTitle>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!isLoading && !error && data?.length === 0}>
        <EmptyStateRoot>
          <EmptyStateIcon className="bg-surface-alt/50 relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 scale-150 rotate-45 bg-linear-to-tr from-transparent via-white/5 to-transparent" />
            <RepeatIcon className="text-white/20" weight="duotone" />
          </EmptyStateIcon>
          <EmptyStateContent className="relative z-10">
            <EmptyStateTitle>Sem repetidas</EmptyStateTitle>
            <EmptyStateDescription>Você não possui figurinhas em duplicidade para trocar.</EmptyStateDescription>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!isLoading && !error && data?.length > 0}>
        <div className="flex items-center justify-between px-1">
          <Typography variant="medium" color="subtle" as="span" size="xs">
            {data?.length} {data?.length === 1 ? "figurinha repetida" : "figurinhas repetidas"}
          </Typography>
          <Typography className="text-accent-highlight/70 tabular-nums" variant="semibold" as="span" size="xs">
            {totalRepeated} {totalRepeated === 1 ? "extra" : "extras"} no total
          </Typography>
        </div>

        <StickerInlineCard>
          <ForEach items={data}>
            {(item) => (
              <StickerInlineRoot rarity={item.stickerRarity} data={item.sticker}>
                <StickerInlineTeamFlag />
                <StickerInlineContent>
                  <StickerInlinePlayerName />
                  <StickerInlineTeamName />
                </StickerInlineContent>
                <StickerInlineEnd>
                  <StickerInlineCode />
                  <StickerInlineRarity />
                </StickerInlineEnd>
                <StickerInlineRepeatedCount>{item.repeatedCount}</StickerInlineRepeatedCount>
              </StickerInlineRoot>
            )}
          </ForEach>
        </StickerInlineCard>
      </ShowIf>
    </div>
  );
}
