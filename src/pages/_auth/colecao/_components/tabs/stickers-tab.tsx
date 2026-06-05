import { StickerIcon } from "@phosphor-icons/react";

import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { StickerInlineCard } from "@/components/v2026/stickers/inline";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickerListLoading } from "../inventory-sticker-list-loading";
import { InventoryStickerRow } from "../inventory-sticker-row";
import { InventoryTabError } from "../inventory-tab-error";

type InventoryStickersTabProps = {
  search?: string;
};

export function InventoryStickersTab({ search }: InventoryStickersTabProps) {
  const { isLoading, error, data } = useFindAllCollectionItems({ search });
  const items = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <ShowIf if={isLoading}>
        <InventoryStickerListLoading />
      </ShowIf>

      <ShowIf if={Boolean(error) && !isLoading}>
        <InventoryTabError fallback="Não foi possível carregar suas figurinhas." message={error?.message} />
      </ShowIf>

      <ShowIf if={!isLoading && !error && items.length === 0}>
        <EmptyStateRoot>
          <EmptyStateIcon>
            <StickerIcon weight="duotone" />
          </EmptyStateIcon>
          <EmptyStateContent>
            <EmptyStateTitle>Nenhuma figurinha ainda</EmptyStateTitle>
            <EmptyStateDescription>Adicione figurinhas ao inventário para vê-las aqui</EmptyStateDescription>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!isLoading && !error && items.length > 0}>
        <StickerInlineCard>
          <ForEach items={items}>{(item) => <InventoryStickerRow rarity={item.stickerRarity} sticker={item.sticker} />}</ForEach>
        </StickerInlineCard>
      </ShowIf>
    </div>
  );
}
