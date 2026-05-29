import { CaretRight, Funnel } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  StickerSpecContainer,
  StickerPlayerAvatar,
  StickerSidebarGroup,
  type StickerVariant,
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
  ExtraStickerPlayerName,
  ExtraStickerFlag,
  ExtraStickerLogo,
  ExtraStickerRoot
} from "@/components/v2026/stickers/extra";
import {
  PageHeaderSubtitle,
  PageHeaderActions,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeaderRoot
} from "@/components/ui/page/header";
import { ProgressIndicator, ProgressTrack, Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/fields/search-input";
import { brazilAlbumStickers, albumGroups } from "@/mocks/album";
import { SurfaceCardRoot } from "@/components/ui/surface-card";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/album/")({
  component: AlbumPage
});

function AlbumPage() {
  const [view, setView] = useState<"groups" | "team">("groups");
  const [selectedTeam, setSelectedTeam] = useState<(typeof albumGroups)[number]["teams"][number] | null>(null);

  const stickers =
    selectedTeam?.fifaCode === "BRA"
      ? brazilAlbumStickers
      : brazilAlbumStickers.map((s, i) => ({ ...s, number: i + 1, owned: i < 6 }));

  const renderStickerTile = (sticker: (typeof brazilAlbumStickers)[number]) => {
    const avatar = (sticker as { avatar?: string }).avatar;

    if (!sticker.owned) {
      return (
        <button
          className="border-border bg-surface-alt hover:bg-surface-alt/80 flex min-h-[340px] w-full flex-col items-center justify-center rounded-sm border border-dashed transition-colors"
          style={{ minHeight: "340px" }}
          type="button"
        >
          <Typography className="font-heading opacity-25" variant="bold" color="subtle" as="span" size="xl">
            ?
          </Typography>
          <Typography
            className="bg-surface mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1"
            variant="medium"
            color="subtle"
            as="span"
            size="xs"
          >
            {String(sticker.number).padStart(3, "0")}
          </Typography>
          <Typography className="mt-1.5" variant="medium" color="subtle" as="span" size="xs">
            Faltando
          </Typography>
        </button>
      );
    }

    return (
      <div className="relative">
        <button
          className={`block w-full ${sticker.isHolographic ? "border-accent-highlight/30 rounded-sm border-2" : ""}`}
          type="button"
        >
          <div className="overflow-hidden shadow-lg transition-all active:scale-[0.985]">
            <ShowIf if={sticker.type === "extra"}>
              <ExtraStickerRoot variant={sticker.variant as "normal" | "silver" | "bronze" | "gold"} size="album">
                <ExtraStickerLogo />
                <ExtraStickerFlag src={sticker.flag ?? "/assets/png/flag-brazil.png"} alt="" />
                <ExtraStickerPlayerAvatar src={avatar ?? "/assets/png/soccer-player.png"} alt={sticker.lastName ?? "Jogador"} />
                <ExtraStickerPlayerName>
                  {sticker.firstName} {sticker.lastName}
                </ExtraStickerPlayerName>
              </ExtraStickerRoot>
            </ShowIf>
            <ShowIf if={sticker.type === "player"}>
              <StickerRoot variant={sticker.variant as StickerVariant} size="album">
                <StickerBackground
                  primaryColor={sticker.primaryColor ?? "var(--accent-primary-strong)"}
                  secondaryColor={sticker.secondaryColor ?? "var(--accent-highlight)"}
                />
                <StickerContent>
                  <StickerColumn>
                    <StickerPlayerAvatar src={avatar ?? "/assets/png/soccer-player.png"} alt={sticker.lastName ?? "Jogador"} />
                    <StickerSpecContainer mode="player">
                      <StickerPlayerName lastName={sticker.lastName ?? "sobrenome"} firstName={sticker.firstName ?? "nome"} />
                      <StickerPlayerStats>{sticker.stats ?? "—"}</StickerPlayerStats>
                    </StickerSpecContainer>
                  </StickerColumn>
                  <StickerSidebar>
                    <StickerLogo />
                    <StickerSidebarGroup>
                      <StickerFlag src={sticker.flag ?? "/assets/png/flag-brazil.png"} alt="" />
                      <StickerCountryName>{(sticker.countryCode ?? "BRA").split("").join(" ")}</StickerCountryName>
                    </StickerSidebarGroup>
                  </StickerSidebar>
                </StickerContent>
                <StickerSpecContainer mode="club">
                  <StickerClubLabel>{sticker.club ?? "Clube do jogador"}</StickerClubLabel>
                </StickerSpecContainer>
              </StickerRoot>
            </ShowIf>
          </div>
        </button>
      </div>
    );
  };

  return (
    <PageRoot
      subtitle={view === "groups" ? "Todas as seleções" : `${selectedTeam?.collected}/${selectedTeam?.total} figurinhas`}
      title={view === "groups" ? "Álbum" : (selectedTeam?.name ?? "Álbum")}
      className="mx-auto max-w-md pb-8"
      onBack={() => setView("groups")}
      showBack={view === "team"}
    >
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
        <PageHeaderActions>
          <PageHeaderAction icon={<Funnel weight="regular" size={18} />} />
        </PageHeaderActions>
      </PageHeaderRoot>
      <div className="mb-5 px-4">
        <SearchInput placeholder="Buscar por número ou jogador..." name="albumSearch" />
      </div>

      <ShowIf if={view === "groups"}>
        <div className="flex flex-col gap-7 px-4">
          <ForEach items={albumGroups}>
            {(group) => (
              <section key={group.code}>
                <Typography className="mb-3 tracking-[0.08em] uppercase" variant="medium" color="accent" size="xs" as="p">
                  Grupo {group.code}
                </Typography>
                <Card className="flex flex-col divide-y divide-white/6 overflow-hidden p-0">
                  <ForEach items={group.teams}>
                    {(team) => {
                      const progress = Math.round((team.collected / team.total) * 100);
                      return (
                        <button
                          onClick={() => {
                            setSelectedTeam(team);
                            setView("team");
                          }}
                          className="flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/4"
                          key={team.fifaCode}
                          type="button"
                        >
                          <Typography as="span" size="lg">
                            {team.flag}
                          </Typography>
                          <Typography className="flex-1" variant="medium" color="base" as="span" size="sm">
                            {team.name}
                          </Typography>
                          <Typography className="tabular-nums" variant="medium" color="subtle" as="span" size="xs">
                            {team.collected}/{team.total}
                          </Typography>
                          <Progress value={progress} className="w-14">
                            <ProgressTrack className="h-1.5">
                              <ProgressIndicator />
                            </ProgressTrack>
                          </Progress>
                          <CaretRight className="text-ink-muted" weight="regular" size={14} />
                        </button>
                      );
                    }}
                  </ForEach>
                </Card>
              </section>
            )}
          </ForEach>
        </div>
      </ShowIf>

      <ShowIf if={view === "team" && !!selectedTeam}>
        <div className="space-y-6 px-4">
          <SurfaceCardRoot className="flex items-center gap-4">
            <Typography as="span" size="xl">
              {selectedTeam?.flag}
            </Typography>
            <div className="flex-1">
              <Typography variant="medium" color="base" size="md" as="h2">
                {selectedTeam?.name}
              </Typography>
              <Typography variant="medium" color="subtle" size="sm" as="p">
                {selectedTeam?.collected} de {selectedTeam?.total} figurinhas
              </Typography>
            </div>
            <Typography className="tabular-nums" variant="bold" color="accent" as="span" size="lg">
              {Math.round(((selectedTeam?.collected ?? 0) / (selectedTeam?.total ?? 1)) * 100)}%
            </Typography>
          </SurfaceCardRoot>

          <div className="grid grid-cols-2 gap-1">
            <ForEach items={stickers}>{(sticker) => <div key={sticker.number}>{renderStickerTile(sticker)}</div>}</ForEach>
          </div>
        </div>
      </ShowIf>
    </PageRoot>
  );
}
