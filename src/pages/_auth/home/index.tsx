import { CaretRight, PlusCircle, Package, Images, Bell } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";

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
  ExtraStickerPlayerAvatar,
  type ExtraStickerVariant,
  ExtraStickerPlayerName,
  ExtraStickerFlag,
  ExtraStickerLogo,
  ExtraStickerRoot
} from "@/components/v2026/stickers/extra";
import {
  buildCollectionStickerSummary,
  buildCollectionCountryGroups,
  buildCollectionOverview
} from "@/helpers/colecao/collection-overview";
import {
  PageHeaderSubtitle,
  PageHeaderActions,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeaderRoot
} from "@/components/ui/page/header";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { ProgressIndicator, ProgressTrack, Progress } from "@/components/ui/progress";
import { useFindAllStickers } from "@/services/stickers/find-all-stickers.service";
import { CollectionSummary } from "@/components/v2026/collections/summary";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { PageRoot } from "@/components/ui/page/root";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowIf } from "@/components/utils/show";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/home/")({
  component: HomePage
});

function HomePage() {
  const { isFetching: stickersFetching, data: stickers = [] } = useFindAllStickers();
  const { isFetching: collectionFetching, data: collectionItems = [] } = useFindAllCollectionItems();

  const summaries = buildCollectionStickerSummary(collectionItems);
  const groups = buildCollectionCountryGroups(stickers, summaries);
  const overview = buildCollectionOverview(groups);
  const recentItems = collectionItems.slice(0, 4);
  const activeCountries = groups
    .filter((group) => group.ownedUniqueCount > 0)
    .sort((left, right) => right.progress - left.progress || left.team.name.localeCompare(right.team.name, "pt-BR"))
    .slice(0, 5);
  const isLoading = stickersFetching || collectionFetching;

  return (
    <PageRoot subtitle="Resumo geral do álbum" title="Início">
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
        <PageHeaderActions>
          <PageHeaderAction icon={<Bell weight="regular" size={18} />} />
        </PageHeaderActions>
      </PageHeaderRoot>

      <div className="flex flex-col gap-7 px-4 pb-8">
        <CollectionSummary />

        <section className="grid grid-cols-2 gap-2">
          <Link to="/album">
            <SurfaceCardGhost className="flex h-full flex-col gap-3 p-3 transition-colors active:bg-white/4">
              <div className="bg-accent-primary/10 text-accent-primary flex size-9 items-center justify-center rounded-lg">
                <Images weight="duotone" size={18} />
              </div>
              <div className="min-w-0">
                <Typography variant="semibold" className="block" color="base" as="span" size="sm">
                  Ver álbum
                </Typography>
                <Typography className="block" variant="medium" color="subtle" as="span" size="xs">
                  {overview.pastedUniqueCount} coladas
                </Typography>
              </div>
            </SurfaceCardGhost>
          </Link>
          <Link to="/colecao">
            <SurfaceCardGhost className="flex h-full flex-col gap-3 p-3 transition-colors active:bg-white/4">
              <div className="bg-accent-highlight/10 text-accent-highlight flex size-9 items-center justify-center rounded-lg">
                <Package weight="duotone" size={18} />
              </div>
              <div className="min-w-0">
                <Typography variant="semibold" className="block" color="base" as="span" size="sm">
                  Ver coleção
                </Typography>
                <Typography className="block" variant="medium" color="subtle" as="span" size="xs">
                  {overview.repeatedCount} repetidas
                </Typography>
              </div>
            </SurfaceCardGhost>
          </Link>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="medium" color="base" size="sm" as="h2">
              Últimas obtidas
            </Typography>
            <Link to="/colecao">
              <Typography variant="medium" color="accent" as="span" size="sm">
                Ver todas
              </Typography>
            </Link>
          </div>

          <ShowIf if={collectionFetching}>
            <div className="grid grid-cols-2 gap-1">
              <ForEach items={Array.from({ length: 4 })}>
                {(_, props) => <StickerRoot key={props?.index} size="album" loading />}
              </ForEach>
            </div>
          </ShowIf>

          <ShowIf if={!collectionFetching && recentItems.length === 0}>
            <Card className="items-center gap-3 p-5 text-center">
              <div className="bg-surface-alt text-ink-muted flex size-10 items-center justify-center rounded-lg">
                <PlusCircle weight="duotone" size={20} />
              </div>
              <Typography variant="semibold" color="base" size="sm" as="h3">
                Nenhuma figurinha ainda
              </Typography>
              <Typography variant="medium" color="subtle" size="xs" as="p">
                Adicione figurinhas para começar a montar seu resumo.
              </Typography>
            </Card>
          </ShowIf>

          <ShowIf if={!collectionFetching && recentItems.length > 0}>
            <div className="grid grid-cols-2 gap-1">
              <ForEach items={recentItems}>
                {(item) => (
                  <div className="relative" key={item.id}>
                    <div className="overflow-hidden shadow-lg transition-all active:scale-[0.985]">
                      <ShowIf if={item.stickerRarity !== "common"}>
                        <ExtraStickerRoot variant={item.stickerRarity as ExtraStickerVariant} data={item.sticker} size="album">
                          <ExtraStickerLogo />
                          <ExtraStickerFlag />
                          <ExtraStickerPlayerAvatar />
                          <ExtraStickerPlayerName />
                        </ExtraStickerRoot>
                      </ShowIf>
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
                    </div>
                  </div>
                )}
              </ForEach>
            </div>
          </ShowIf>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="medium" color="base" size="sm" as="h2">
              Seleções em andamento
            </Typography>
            <Link to="/album">
              <Typography variant="medium" color="accent" as="span" size="sm">
                Ver álbum
              </Typography>
            </Link>
          </div>

          <ShowIf if={isLoading}>
            <Card className="flex flex-col gap-3 p-3">
              <ForEach items={Array.from({ length: 4 })}>
                {(_, props) => (
                  <div className="flex items-center gap-3" key={props?.index}>
                    <Skeleton className="size-9 shrink-0" rounded="md" tone="muted" />
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-3.5 w-24" tone="base" />
                      <Skeleton className="h-1.5 w-full" rounded="full" tone="muted" />
                    </div>
                    <Skeleton className="h-3 w-10" tone="muted" />
                  </div>
                )}
              </ForEach>
            </Card>
          </ShowIf>

          <ShowIf if={!isLoading && activeCountries.length === 0}>
            <Card className="items-center gap-2 p-5 text-center">
              <Typography variant="semibold" color="base" size="sm" as="h3">
                Nenhuma seleção iniciada
              </Typography>
              <Typography variant="medium" color="subtle" size="xs" as="p">
                As seleções aparecem aqui conforme sua coleção cresce.
              </Typography>
            </Card>
          </ShowIf>

          <ShowIf if={!isLoading && activeCountries.length > 0}>
            <Card className="flex flex-col divide-y divide-white/6 overflow-hidden p-0">
              <ForEach items={activeCountries}>
                {(group) => (
                  <Link
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-white/4"
                    params={() => ({ pais: group.team.fifaCode })}
                    to="/album/$pais"
                    key={group.key}
                  >
                    <div className="bg-surface-alt flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/8">
                      <img className="size-full object-cover" src={group.team.flag} alt={group.team.name} />
                    </div>
                    <Typography className="min-w-0 flex-1 truncate" variant="medium" color="base" as="span" size="sm">
                      {group.team.name}
                    </Typography>
                    <Typography className="tabular-nums" variant="medium" color="subtle" as="span" size="xs">
                      {group.ownedUniqueCount}/{group.totalCount}
                    </Typography>
                    <Progress value={group.progress} className="w-14">
                      <ProgressTrack className="h-1.5">
                        <ProgressIndicator />
                      </ProgressTrack>
                    </Progress>
                    <CaretRight className="text-ink-muted" weight="regular" size={14} />
                  </Link>
                )}
              </ForEach>
            </Card>
          </ShowIf>
        </section>
      </div>
    </PageRoot>
  );
}
