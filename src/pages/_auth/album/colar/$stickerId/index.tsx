import type { Timestamp } from "firebase/firestore";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { StickerIcon } from "@phosphor-icons/react";

import type { Collection } from "@/@types/collection";

import {
  StickerSpecContainer,
  StickerPlayerAvatar,
  StickerSidebarGroup,
  StickerCountryName,
  StickerPlayerStats,
  StickerBackground,
  StickerPlayerName,
  StickerClubLabel,
  StickerContent,
  StickerSidebar,
  StickerColumn,
  StickerFlag,
  StickerLogo,
  StickerRoot
} from "@/components/v2026/stickers/normal";
import {
  removePastedCollectionItemFromAvailableCache,
  type OptimisticPasteCollectionContext,
  pasteCollectionItemInCollectionCache,
  pasteCollectionItemInPastedCache,
  usePasteCollectionItemService
} from "@/services/collections/paste-collection-item.service";
import {
  ExtraStickerPlayerAvatar,
  type ExtraStickerVariant,
  ExtraStickerPlayerName,
  ExtraStickerFlag,
  ExtraStickerLogo,
  ExtraStickerRoot
} from "@/components/v2026/stickers/extra";
import {
  findAvailableCollectionItemsByStickerQueryKeys,
  useFindAvailableCollectionItemsBySticker
} from "@/services/collections/find-available-collection-items-by-sticker.service";
import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { findAllPastedCollectionQueryKeys } from "@/services/collections/findall-pasted-collection.service";
import { findAllCollectionItemsQueryKeys } from "@/services/collections/find-all-collection-items.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeader } from "@/components/ui/page/header";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { PageContent } from "@/components/ui/page/content";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";
import { notify } from "@/components/ui/sonner";

import { PasteStickerInfoCardSkeleton, PasteStickerGridSkeleton } from "./_components/skeletons";

export const Route = createFileRoute("/_auth/album/colar/$stickerId/")({
  component: PasteStickerPage
});

function PasteStickerPage() {
  const { stickerId } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const { data: availableItems = [], isFetching, error } = useFindAvailableCollectionItemsBySticker(stickerId);
  const availableQueryKey = findAvailableCollectionItemsByStickerQueryKeys.detail(stickerId);
  const collectionQueryKey = findAllCollectionItemsQueryKeys.all();
  const pastedQueryKey = findAllPastedCollectionQueryKeys.all();
  const isPageFetching = isFetching;
  const referenceSticker = availableItems[0]?.sticker;

  const pasteCollectionItem = usePasteCollectionItemService<OptimisticPasteCollectionContext>({
    onMutate: ({ collectionItem }) => {
      if (!collectionItem) return { previousPastedQueries: [] } satisfies OptimisticPasteCollectionContext;

      void queryClient.cancelQueries({ queryKey: pastedQueryKey });
      void queryClient.cancelQueries({ queryKey: collectionQueryKey });
      void queryClient.cancelQueries({ queryKey: availableQueryKey });

      const pastedAt = new Date() as unknown as Timestamp;
      const previousAvailableItems = queryClient.getQueryData<Collection[]>(availableQueryKey);
      const previousCollectionItems = queryClient.getQueryData<Collection[]>(collectionQueryKey);
      const previousPastedQueries = queryClient.getQueriesData<Collection[]>({ queryKey: pastedQueryKey });

      queryClient.setQueryData<Collection[]>(availableQueryKey, (items) =>
        removePastedCollectionItemFromAvailableCache(items, collectionItem)
      );
      queryClient.setQueryData<Collection[]>(collectionQueryKey, (items) =>
        pasteCollectionItemInCollectionCache(items, collectionItem, pastedAt)
      );
      queryClient.setQueriesData<Collection[]>({ queryKey: pastedQueryKey }, (items) =>
        pasteCollectionItemInPastedCache(items, collectionItem, pastedAt)
      );

      return {
        previousCollectionItems,
        previousAvailableItems,
        previousPastedQueries
      } satisfies OptimisticPasteCollectionContext;
    },
    onError: (mutationError, _variables, context) => {
      queryClient.setQueryData(availableQueryKey, context?.previousAvailableItems);
      queryClient.setQueryData(collectionQueryKey, context?.previousCollectionItems);
      context?.previousPastedQueries.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
      notify("error", mutationError.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: pastedQueryKey });
      void queryClient.invalidateQueries({ queryKey: collectionQueryKey });
      void queryClient.invalidateQueries({ queryKey: availableQueryKey });
    }
  });

  const handlePasteSticker = (item: Collection) => {
    pasteCollectionItem.mutate({ collectionId: item.id, collectionItem: item, stickerId });
    notify("success", "Figurinha colada no álbum.");
    navigate({
      params: { pais: item.sticker.team.fifaCode },
      to: "/album/$pais"
    });
  };

  return (
    <PageRoot
      back={referenceSticker ? { params: { pais: referenceSticker.team.fifaCode }, to: "/album/$pais" } : { to: "/album" }}
      subtitle="Escolha uma cópia disponível"
      title="Colar figurinha"
    >
      <PageHeader>
        <PageHeaderTitle />
        <PageHeaderSubtitle />
      </PageHeader>

      <PageContent className="gap-5">
        <ShowIf if={Boolean(referenceSticker) && !isPageFetching}>
          <SurfaceCardGhost>
            <div className="flex items-center gap-4">
              <div className="bg-accent-primary flex size-14 items-center justify-center overflow-hidden rounded-lg">
                <img className="size-full object-cover" src={referenceSticker?.team.flag} alt={referenceSticker?.team.name} />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="semibold" color="base" size="md" as="h2">
                  {referenceSticker?.team.name}
                </Typography>
                <Typography color="muted" size="sm" as="p">
                  {referenceSticker?.code} · {referenceSticker?.player.name}
                </Typography>
                <Typography className="mt-1" variant="medium" color="subtle" size="xs" as="p">
                  {availableItems.length} disponível{availableItems.length === 1 ? "" : "is"} para colar
                </Typography>
              </div>
            </div>
          </SurfaceCardGhost>
        </ShowIf>

        <ShowIf if={isPageFetching}>
          <PasteStickerInfoCardSkeleton />
          <PasteStickerGridSkeleton />
        </ShowIf>

        <ShowIf if={Boolean(error) && !isPageFetching}>
          <EmptyStateRoot tone="danger">
            <EmptyStateContent>
              <EmptyStateTitle className="text-status-danger">
                {error?.message ?? "Não foi possível carregar as figurinhas."}
              </EmptyStateTitle>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={!isPageFetching && !error && availableItems.length === 0}>
          <EmptyStateRoot>
            <EmptyStateIcon>
              <StickerIcon weight="duotone" />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyStateTitle>Nenhuma figurinha disponível</EmptyStateTitle>
              <EmptyStateDescription>Adicione uma cópia na coleção antes de colar nesta posição</EmptyStateDescription>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={!isPageFetching && !error && availableItems.length > 0}>
          <div className="grid grid-cols-2 gap-1">
            <ForEach items={availableItems}>
              {(item) => (
                <button
                  className="group relative cursor-pointer rounded-xl text-left transition-transform outline-none active:scale-[0.98]"
                  aria-label={`Colar figurinha ${item.sticker.code}`}
                  onClick={() => handlePasteSticker(item)}
                  type="button"
                >
                  <ShowIf if={item.stickerRarity === "common"}>
                    <StickerRoot data={item.sticker} size="album">
                      <StickerBackground />
                      <StickerContent>
                        <StickerColumn>
                          <StickerPlayerAvatar />
                          <StickerSpecContainer mode="player">
                            <StickerPlayerName />
                            <StickerPlayerStats />
                          </StickerSpecContainer>
                        </StickerColumn>
                        <StickerSidebar>
                          <StickerLogo />
                          <StickerSidebarGroup>
                            <StickerFlag />
                            <StickerCountryName />
                          </StickerSidebarGroup>
                        </StickerSidebar>
                      </StickerContent>
                      <StickerSpecContainer mode="club">
                        <StickerClubLabel />
                      </StickerSpecContainer>
                    </StickerRoot>
                  </ShowIf>

                  <ShowIf if={item.stickerRarity !== "common"}>
                    <ExtraStickerRoot variant={item.stickerRarity as ExtraStickerVariant} data={item.sticker} size="album">
                      <ExtraStickerLogo />
                      <ExtraStickerFlag />
                      <ExtraStickerPlayerAvatar />
                      <ExtraStickerPlayerName />
                    </ExtraStickerRoot>
                  </ShowIf>
                </button>
              )}
            </ForEach>
          </div>
        </ShowIf>
      </PageContent>
    </PageRoot>
  );
}
