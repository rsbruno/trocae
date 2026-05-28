import { ChevronRight, TrendingUp, Sparkles, Trophy, Bell } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

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
import { recentStickers, homeActivity, homeTeams } from "@/mocks/home";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { PageRoot } from "@/components/ui/page/root";
import { ShowIf } from "@/components/utils/show";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/home/")({
  component: HomePage
});

const activityIcons = {
  "trending-up": <TrendingUp size={14} />,
  sparkles: <Sparkles size={14} />,
  trophy: <Trophy size={14} />
} as const;

function HomePage() {
  const progress = 34.2;

  return (
    <PageRoot subtitle="Copa do Mundo 2026 · 218 figurinhas" title="Minha Coleção">
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
        <PageHeaderActions>
          <PageHeaderAction icon={<Bell size={18} />} badge={3} />
        </PageHeaderActions>
      </PageHeaderRoot>

      <div className="flex flex-col gap-7 px-4 pb-8">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <Typography className="tracking-tight" variant="bold" color="base" as="span" size="xl">
                218
              </Typography>
              <Typography color="subtle" as="span" size="sm">
                / 638
              </Typography>
            </div>
            <Typography
              className="bg-accent-primary/10 inline-flex items-center gap-1 rounded-full px-2 py-1"
              variant="medium"
              color="accent"
              as="span"
              size="xs"
            >
              {Math.round(progress)}%
            </Typography>
          </div>
          <Progress value={progress}>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/6">
            <ForEach
              items={[
                { label: "Coletadas", value: "218" },
                { label: "Repetidas", value: "47" },
                { label: "Faltando", value: "420" }
              ]}
            >
              {(s) => (
                <div className="flex flex-col items-center gap-0.5" key={s.label}>
                  <Typography variant="semibold" color="base" as="span" size="md">
                    {s.value}
                  </Typography>
                  <Typography className="tracking-wider uppercase" variant="medium" color="subtle" as="span" size="xs">
                    {s.label}
                  </Typography>
                </div>
              )}
            </ForEach>
          </div>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="medium" color="base" size="sm" as="h2">
              Últimas obtidas
            </Typography>
            <Link to="/inventory">
              <Typography variant="medium" color="accent" as="span" size="sm">
                Ver todas
              </Typography>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <ForEach items={recentStickers}>
              {(sticker) => {
                const avatar = (sticker as { avatar?: string }).avatar;

                return (
                  <div key={sticker.number} className="relative">
                    <div
                      className={`overflow-hidden shadow-lg transition-all active:scale-[0.985] ${sticker.isHolographic ? "border-accent-highlight/30 rounded-sm border-2" : ""}`}
                    >
                      <ShowIf if={sticker.type === "extra"}>
                        <ExtraStickerRoot variant={sticker.variant as "normal" | "silver" | "bronze" | "gold"} size="album">
                          <ExtraStickerLogo />
                          <ExtraStickerFlag src={sticker.flag ?? "/assets/png/flag-brazil.png"} alt="" />
                          <ExtraStickerPlayerAvatar
                            src={avatar ?? "/assets/png/soccer-player.png"}
                            alt={sticker.lastName ?? "Jogador"}
                          />
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
                              <StickerPlayerAvatar
                                src={avatar ?? "/assets/png/soccer-player.png"}
                                alt={sticker.lastName ?? "Jogador"}
                              />
                              <StickerSpecContainer mode="player">
                                <StickerPlayerName
                                  lastName={sticker.lastName ?? "sobrenome"}
                                  firstName={sticker.firstName ?? "nome"}
                                />
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
                  </div>
                );
              }}
            </ForEach>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="medium" color="base" size="sm" as="h2">
              Seleções
            </Typography>
            <Link to="/album">
              <Typography variant="medium" color="accent" as="span" size="sm">
                Ver álbum
              </Typography>
            </Link>
          </div>
          <Card className="flex flex-col divide-y divide-white/6 overflow-hidden p-0">
            <ForEach items={homeTeams}>
              {(team) => (
                <Link
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-white/4"
                  key={team.name}
                  to="/album"
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
                  <Progress value={team.progress} className="w-14">
                    <ProgressTrack className="h-1.5">
                      <ProgressIndicator />
                    </ProgressTrack>
                  </Progress>
                  <ChevronRight className="text-ink-muted" size={14} />
                </Link>
              )}
            </ForEach>
          </Card>
        </section>

        <section className="space-y-4">
          <Typography variant="medium" color="base" size="sm" as="h2">
            Atividade
          </Typography>
          <Card className="flex flex-col divide-y divide-white/6 overflow-hidden p-0">
            <ForEach items={homeActivity}>
              {(item, props) => (
                <div className="flex items-center gap-3 px-4 py-3" key={props?.index}>
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/6 ${item.color}`}>
                    {activityIcons[item.icon]}
                  </span>
                  <Typography className="flex-1" variant="medium" color="muted" size="sm" as="p">
                    {item.text}
                  </Typography>
                  <Typography variant="medium" color="subtle" as="span" size="xs">
                    {item.time}
                  </Typography>
                </div>
              )}
            </ForEach>
          </Card>
        </section>
      </div>
    </PageRoot>
  );
}
