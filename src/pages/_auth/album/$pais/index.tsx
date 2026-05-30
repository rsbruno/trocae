import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

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
import { useFindAllStickersByCountry } from "@/services/stickers/find-all-stickers-by-country.service";
import { useFindAllPastedCollection } from "@/services/collections/findall-pasted-collection.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { ProfileProgressRingRoot } from "@/pages/_auth/profile/_components/profile-progress-ring";
import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { useFindTeamByCode } from "@/services/teams/find-team-by-code.service";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

export const Route = createFileRoute("/_auth/album/$pais/")({
  component: RouteComponent
});

type PastedStickerSummary = {
  stickerId: string;
  repeatedCount: number;
};

function buildPastedStickerSummaries(items: Collection[]) {
  return items.reduce<Record<string, PastedStickerSummary>>((acc, item) => {
    const current = acc[item.sticker.id];

    if (!current) {
      acc[item.sticker.id] = {
        stickerId: item.sticker.id,
        repeatedCount: 1
      };
      return acc;
    }

    current.repeatedCount += 1;
    return acc;
  }, {});
}

function RouteComponent() {
  const { pais: countryCode } = Route.useParams();

  const { data: countryStickers = [], isLoading: countryLoading } = useFindAllStickersByCountry(countryCode);
  const { data: pastedStickers = [], isLoading: pastedLoading } = useFindAllPastedCollection(countryCode);
  const { isLoading: teamLoading, data: team } = useFindTeamByCode(countryCode);

  const pastedSummaries = buildPastedStickerSummaries(pastedStickers);
  const pastedUniqueCount = Object.keys(pastedSummaries).length;
  const repeatedCount = pastedStickers.length - pastedUniqueCount;
  const totalStickers = countryStickers.length;
  const progress = totalStickers > 0 ? (pastedUniqueCount / totalStickers) * 100 : 0;

  const isLoading = teamLoading || countryLoading || pastedLoading;

  return (
    <PageRoot
      title={`Coleção ${team?.name} - ${team?.fifaCode}`}
      className="mx-auto max-w-md pb-8"
      subtitle="Detalhes da página"
      showBack
    >
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>

      <div className="flex flex-col gap-5 px-4">
        <ShowIf if={isLoading}>
          <SurfaceCardRoot>
            <div className="flex items-center gap-4">
              <div className="bg-surface-alt size-14 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="bg-surface-alt h-4 w-28 rounded-full" />
                <div className="bg-surface-alt h-3 w-32 rounded-full" />
                <div className="bg-surface-alt h-3 w-24 rounded-full" />
              </div>
            </div>
          </SurfaceCardRoot>

          <SurfaceCardGhost className="flex items-center justify-around py-5">
            <div className="flex flex-col items-center">
              <div className="bg-surface-alt size-[52px] rounded-full" />
              <div className="bg-surface-alt mt-1 h-3 w-14 rounded-full" />
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <div className="bg-surface-alt mx-auto h-6 w-10 rounded-full" />
              <div className="bg-surface-alt mt-1 h-3 w-14 rounded-full" />
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <div className="bg-surface-alt mx-auto h-6 w-10 rounded-full" />
              <div className="bg-surface-alt mt-1 h-3 w-14 rounded-full" />
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <div className="bg-surface-alt mx-auto h-6 w-10 rounded-full" />
              <div className="bg-surface-alt mt-1 h-3 w-14 rounded-full" />
            </div>
          </SurfaceCardGhost>
        </ShowIf>

        <ShowIf if={!isLoading}>
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

          <div className="grid grid-cols-2 gap-1">
            <ForEach items={countryStickers}>
              {(item) => {
                const pasted = pastedStickers.find((pasted) => pasted.sticker.id === item.id);
                return (
                  <Fragment>
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
                  </Fragment>
                );
              }}
            </ForEach>
          </div>
        </ShowIf>
      </div>
    </PageRoot>
  );
}
