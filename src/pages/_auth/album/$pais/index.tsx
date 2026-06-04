import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "@phosphor-icons/react";

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
  StickerEmptyBackground,
  StickerEmptyPlayerName,
  StickerEmptyLabel,
  StickerEmptyRoot
} from "@/components/v2026/stickers/empty";
import {
  buildPastedStickerSummaries,
  useFindAllPastedCollection
} from "@/services/collections/findall-pasted-collection.service";
import { buildAvailableStickerCounts, useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { useFindAllStickersByCountry } from "@/services/stickers/find-all-stickers-by-country.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { ProfileProgressRingRoot } from "@/pages/_auth/profile/_components/profile-progress-ring";
import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { useFindTeamByCode } from "@/services/teams/find-team-by-code.service";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ButtonRoot } from "@/components/ui/button";
import { ShowIf } from "@/components/utils/show";

import {
  CountryStickersGridSkeleton,
  CountryPageHeaderSkeleton,
  CountryTeamCardSkeleton,
  CountryStatsSkeleton
} from "./_components/skeletons";

export const Route = createFileRoute("/_auth/album/$pais/")({
  component: RouteComponent
});

function RouteComponent() {
  const { pais: countryCode } = Route.useParams();

  const { data: countryStickers = [], isLoading: countryLoading } = useFindAllStickersByCountry(countryCode);
  const { data: pastedStickers = [], isLoading: pastedLoading } = useFindAllPastedCollection(countryCode);
  const { isLoading: collectionLoading, data: collectionItems = [] } = useFindAllCollectionItems();
  const { isLoading: teamLoading, data: team } = useFindTeamByCode(countryCode);

  const pastedSummaries = buildPastedStickerSummaries(pastedStickers);
  const availableStickerCounts = buildAvailableStickerCounts(collectionItems);
  const pastedUniqueCount = Object.keys(pastedSummaries).length;
  const repeatedCount = pastedStickers.length - pastedUniqueCount;
  const totalStickers = countryStickers.length;
  const progress = totalStickers > 0 ? (pastedUniqueCount / totalStickers) * 100 : 0;

  return (
    <PageRoot
      title={`Coleção ${team?.name} - ${team?.fifaCode}`}
      className="mx-auto max-w-md pb-8"
      subtitle="Detalhes da página"
      showBack
    >
      <PageHeaderRoot>
        <ShowIf if={teamLoading}>
          <CountryPageHeaderSkeleton />
        </ShowIf>
        <ShowIf if={!teamLoading}>
          <div className="min-w-0 flex-1">
            <PageHeaderTitle />
            <PageHeaderSubtitle />
          </div>
        </ShowIf>
      </PageHeaderRoot>

      <div className="flex flex-col gap-5 px-4">
        <ShowIf if={teamLoading}>
          <CountryTeamCardSkeleton />
        </ShowIf>

        <ShowIf if={!teamLoading}>
          <SurfaceCardGhost>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-accent-primary flex size-14 items-center justify-center overflow-hidden rounded-lg">
                  <img className="size-full object-cover" src={team?.flag} alt={team?.name} />
                </div>
              </div>
              <div className="flex-1">
                <Typography variant="semibold" color="base" size="md" as="h2">
                  {team?.name}
                </Typography>
                <Typography color="muted" size="sm" as="p">
                  {team?.federationName}
                </Typography>
                <div className="text-ink-muted mt-1 flex gap-3 text-xs leading-4 font-medium">
                  <Typography className="flex items-center gap-1" variant="medium" color="subtle" as="span" size="xs">
                    {team?.coach}
                  </Typography>
                  <Typography className="flex items-center gap-1" variant="medium" color="subtle" as="span" size="xs">
                    {team?.confederation} · Grupo {team?.group?.code}
                  </Typography>
                </div>
              </div>
            </div>
          </SurfaceCardGhost>
        </ShowIf>

        <ShowIf if={countryLoading || pastedLoading}>
          <CountryStatsSkeleton />
        </ShowIf>

        <ShowIf if={!countryLoading && !pastedLoading}>
          <SurfaceCardRoot className="flex items-center justify-around py-5">
            <div className="flex flex-col items-center">
              <ProfileProgressRingRoot progress={progress} strokeWidth={4} size={52} />
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <Typography variant="semibold" color="success" size="xl" as="p">
                {pastedUniqueCount}
              </Typography>
              <Typography variant="medium" color="success" size="xs" as="p">
                Coladas
              </Typography>
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <Typography
                className="flex items-center justify-center gap-0.5"
                variant="semibold"
                color="highlight"
                size="xl"
                as="p"
              >
                {repeatedCount}
              </Typography>
              <Typography color="highlight" variant="medium" size="xs" as="p">
                Repetidas
              </Typography>
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <Typography variant="semibold" color="info" size="xl" as="p">
                {totalStickers}
              </Typography>
              <Typography variant="medium" color="info" size="xs" as="p">
                Total
              </Typography>
            </div>
          </SurfaceCardRoot>
        </ShowIf>

        <ShowIf if={countryLoading || pastedLoading || collectionLoading}>
          <CountryStickersGridSkeleton />
        </ShowIf>

        <ShowIf if={!countryLoading && !pastedLoading && !collectionLoading}>
          <div className="grid grid-cols-2 gap-1">
            <ForEach items={countryStickers}>
              {(item) => {
                const pasted = pastedStickers.find((pasted) => pasted.sticker.id === item.id);
                const availableCount = availableStickerCounts[item.id] ?? 0;
                const canPaste = availableCount > 0;

                if (canPaste) {
                  return (
                    <Link
                      className="group relative block rounded-xl transition-transform outline-none active:scale-[0.98]"
                      aria-label={`Colar figurinha ${item.code}`}
                      params={{ stickerId: item.id }}
                      to="/album/colar/$stickerId"
                    >
                      <ShowIf if={Boolean(pasted) && pasted?.stickerRarity === "common"}>
                        <StickerRoot size="album" data={item}>
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

                      <ShowIf if={Boolean(pasted) && pasted?.stickerRarity !== "common"}>
                        <ExtraStickerRoot variant={pasted?.stickerRarity as ExtraStickerVariant} size="album" data={item}>
                          <ExtraStickerLogo />
                          <ExtraStickerFlag />
                          <ExtraStickerPlayerAvatar />
                          <ExtraStickerPlayerName />
                        </ExtraStickerRoot>
                      </ShowIf>

                      <ShowIf if={!pasted}>
                        <StickerEmptyRoot data={item}>
                          <StickerEmptyBackground />
                          <StickerEmptyLabel />
                          <StickerEmptyPlayerName />
                        </StickerEmptyRoot>
                      </ShowIf>

                      <ButtonRoot className="absolute top-1 right-1 z-10">
                        <PlusIcon className="size-5" weight="bold" />
                      </ButtonRoot>
                    </Link>
                  );
                }

                return (
                  <div aria-label={item.code} className="relative">
                    <ShowIf if={Boolean(pasted) && pasted?.stickerRarity === "common"}>
                      <StickerRoot size="album" data={item}>
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

                    <ShowIf if={Boolean(pasted) && pasted?.stickerRarity !== "common"}>
                      <ExtraStickerRoot variant={pasted?.stickerRarity as ExtraStickerVariant} size="album" data={item}>
                        <ExtraStickerLogo />
                        <ExtraStickerFlag />
                        <ExtraStickerPlayerAvatar />
                        <ExtraStickerPlayerName />
                      </ExtraStickerRoot>
                    </ShowIf>

                    <ShowIf if={!pasted}>
                      <StickerEmptyRoot data={item}>
                        <StickerEmptyBackground />
                        <StickerEmptyLabel />
                        <StickerEmptyPlayerName />
                      </StickerEmptyRoot>
                    </ShowIf>
                  </div>
                );
              }}
            </ForEach>
          </div>
        </ShowIf>
      </div>
    </PageRoot>
  );
}
