import { CheckCircle } from "@phosphor-icons/react";

import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { buildCollectionStickerSummary, filterMissingStickers } from "@/helpers/colecao/collection-overview";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { useFindAllStickers } from "@/services/stickers/find-all-stickers.service";
import { StickerInlineCard } from "@/components/v2026/stickers/inline";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickerListLoading } from "../inventory-sticker-list-loading";
import { InventoryStickerRow } from "../inventory-sticker-row";
import { InventoryTabError } from "../inventory-tab-error";

type InventoryMissingTabProps = {
  search?: string;
};

export function InventoryMissingTab({ search }: InventoryMissingTabProps) {
  const { isFetching: stickersFetching, error: stickersError, data: stickers = [] } = useFindAllStickers({ search });
  const {
    isFetching: collectionFetching,
    data: collectionItems = [],
    error: collectionError
  } = useFindAllCollectionItems({ search });

  const summaries = buildCollectionStickerSummary(collectionItems);
  const items = filterMissingStickers(stickers, summaries);
  const error = stickersError ?? collectionError;
  const isLoading = stickersFetching || collectionFetching;

  return (
    <div className="flex flex-col gap-4">
      <ShowIf if={isLoading}>
        <InventoryStickerListLoading />
      </ShowIf>

      <ShowIf if={Boolean(error) && !isLoading}>
        <InventoryTabError fallback="Não foi possível carregar as figurinhas faltantes." message={error?.message} />
      </ShowIf>

      <ShowIf if={!isLoading && !error && items.length === 0}>
        <EmptyStateRoot>
          <EmptyStateIcon className="bg-status-success/10 border-status-success/20 border">
            <CheckCircle className="text-status-success" weight="duotone" />
          </EmptyStateIcon>
          <EmptyStateContent>
            <EmptyStateTitle>Álbum completo</EmptyStateTitle>
            <EmptyStateDescription>Você já possui todas as figurinhas cadastradas.</EmptyStateDescription>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!isLoading && !error && items.length > 0}>
        <div className="flex items-center justify-between px-1">
          <Typography variant="medium" color="subtle" as="span" size="xs">
            {items.length} {items.length === 1 ? "figurinha faltante" : "figurinhas faltantes"}
          </Typography>
          <Typography className="text-ink-muted tabular-nums" variant="medium" as="span" size="xs">
            lista oficial
          </Typography>
        </div>

        <StickerInlineCard>
          <ForEach items={items}>
            {(item) => (
              <InventoryStickerRow
                className="opacity-65 grayscale"
                rarityClassName="text-ink-muted"
                rarity="Faltando"
                sticker={item}
              />
            )}
          </ForEach>
        </StickerInlineCard>
      </ShowIf>
    </div>
  );
}
