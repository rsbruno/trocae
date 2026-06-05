import { RepeatIcon } from "@phosphor-icons/react";

import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { useFindRepeatedCollectionItems } from "@/services/collections/find-repeated-collection-items.service";
import { StickerInlineCard } from "@/components/v2026/stickers/inline";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickerListLoading } from "../inventory-sticker-list-loading";
import { InventoryStickerRow } from "../inventory-sticker-row";
import { InventoryTabError } from "../inventory-tab-error";

type InventoryRepeatedTabProps = {
  search?: string;
};

export function InventoryRepeatedTab({ search }: InventoryRepeatedTabProps) {
  const { isLoading, error, data } = useFindRepeatedCollectionItems({ search });

  const totalRepeated = data?.reduce((sum, item) => sum + item.repeatedCount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <ShowIf if={isLoading}>
        <InventoryStickerListLoading />
      </ShowIf>

      <ShowIf if={Boolean(error) && !isLoading}>
        <InventoryTabError fallback="Não foi possível carregar as repetidas." message={error?.message} />
      </ShowIf>

      <ShowIf if={!isLoading && !error && (data?.length ?? 0) === 0}>
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

      <ShowIf if={!isLoading && !error && (data?.length ?? 0) > 0}>
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
              <InventoryStickerRow repeatedCount={item.repeatedCount} rarity={item.stickerRarity} sticker={item.sticker} />
            )}
          </ForEach>
        </StickerInlineCard>
      </ShowIf>
    </div>
  );
}
