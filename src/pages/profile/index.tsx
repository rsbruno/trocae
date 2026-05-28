import { TrendingUp, Calendar, Settings, Share2, Target, Trophy, Award, Crown, Flame, Star } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  PageHeaderSubtitle,
  PageHeaderActions,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeaderRoot
} from "@/components/ui/page/header";
import { ProfileProgressRingRoot } from "@/pages/profile/_components/profile-progress-ring";
import { ProgressIndicator, ProgressTrack, Progress } from "@/components/ui/progress";
import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { profileConfederations, profileAchievements } from "@/mocks/profile";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { PageRoot } from "@/components/ui/page/root";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage
});

const achievementIcons = {
  trophy: <Trophy size={16} />,
  target: <Target size={16} />,
  flame: <Flame size={16} />,
  crown: <Crown size={16} />,
  award: <Award size={16} />,
  star: <Star size={16} />
} as const;

function ProfilePage() {
  return (
    <PageRoot className="mx-auto max-w-md pb-8" subtitle="Nível 7 · @bruno_col26" title="Perfil" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
        <PageHeaderActions>
          <PageHeaderAction icon={<Settings size={18} />} />
        </PageHeaderActions>
      </PageHeaderRoot>
      <div className="flex flex-col gap-5 px-4">
        <SurfaceCardRoot>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-accent-primary flex size-14 items-center justify-center rounded-lg">
                <Typography variant="semibold" color="inverse" as="span" size="md">
                  BS
                </Typography>
              </div>
              <Typography
                className="bg-accent-highlight/10 absolute -right-1 -bottom-1 inline-flex items-center rounded-full px-2 py-1"
                color="highlight"
                variant="medium"
                as="span"
                size="xs"
              >
                Nv.7
              </Typography>
            </div>
            <div className="flex-1">
              <Typography variant="semibold" color="base" size="md" as="h2">
                Bruno Santos
              </Typography>
              <Typography color="muted" size="sm" as="p">
                @bruno_col26
              </Typography>
              <div className="text-ink-muted mt-1 flex gap-3 text-xs leading-4 font-medium">
                <Typography className="flex items-center gap-1" variant="medium" color="subtle" as="span" size="xs">
                  <Calendar size={10} /> Mai 2026
                </Typography>
                <Typography className="flex items-center gap-1" variant="medium" color="subtle" as="span" size="xs">
                  <Flame className="text-accent-highlight" size={10} /> 12 dias
                </Typography>
              </div>
            </div>
            <button
              className="bg-surface-alt text-ink-secondary hover:bg-surface rounded-md p-2.5 transition-colors"
              type="button"
            >
              <Share2 size={14} />
            </button>
          </div>
        </SurfaceCardRoot>

        <SurfaceCardGhost className="flex items-center justify-around py-5">
          <div className="flex flex-col items-center">
            <ProfileProgressRingRoot progress={34.2} strokeWidth={4} size={52} />
            <Typography variant="medium" className="mt-1" color="subtle" as="span" size="xs">
              Completo
            </Typography>
          </div>
          <div className="bg-border h-10 w-px" />
          <div className="text-center">
            <Typography variant="semibold" color="base" size="xl" as="p">
              218
            </Typography>
            <Typography variant="medium" color="subtle" size="xs" as="p">
              Coletadas
            </Typography>
          </div>
          <div className="bg-border h-10 w-px" />
          <div className="text-center">
            <Typography variant="semibold" color="base" size="xl" as="p">
              14
            </Typography>
            <Typography variant="medium" color="subtle" size="xs" as="p">
              Trocas
            </Typography>
          </div>
          <div className="bg-border h-10 w-px" />
          <div className="text-center">
            <Typography className="flex items-center justify-center gap-0.5" variant="semibold" color="accent" size="xl" as="p">
              <TrendingUp size={14} /> 12
            </Typography>
            <Typography variant="medium" color="subtle" size="xs" as="p">
              Streak
            </Typography>
          </div>
        </SurfaceCardGhost>

        <section className="space-y-3.5">
          <Typography variant="semibold" color="base" size="sm" as="h3">
            Por confederação
          </Typography>
          <Card className="flex flex-col gap-3 p-3">
            <ForEach items={profileConfederations}>
              {(conf) => {
                const pct = Math.round((conf.collected / conf.total) * 100);
                return (
                  <div className="flex items-center gap-3" key={conf.name}>
                    <Typography variant="medium" className="w-20" color="muted" as="span" size="xs">
                      {conf.name}
                    </Typography>
                    <Progress className="flex-1" value={pct}>
                      <ProgressTrack className="h-1.5">
                        <ProgressIndicator />
                      </ProgressTrack>
                    </Progress>
                    <span className="w-12 text-right">
                      <Typography variant="medium" color="subtle" as="span" size="xs">
                        {conf.collected}/{conf.total}
                      </Typography>
                    </span>
                  </div>
                );
              }}
            </ForEach>
          </Card>
        </section>

        <section className="space-y-3.5">
          <Typography variant="semibold" color="base" size="sm" as="h3">
            Conquistas
          </Typography>
          <Card className="grid grid-cols-3 gap-2 p-2.5">
            <ForEach items={profileAchievements}>
              {(ach, props) => (
                <SurfaceCardGhost
                  className={`flex flex-col items-center gap-1.5 py-3.5 ${!ach.unlocked ? "opacity-35" : ""}`}
                  key={props?.index}
                >
                  <span className={ach.unlocked ? "text-accent-primary" : "text-ink-muted"}>{achievementIcons[ach.icon]}</span>
                  <Typography variant="medium" color="muted" as="span" size="xs">
                    {ach.label}
                  </Typography>
                </SurfaceCardGhost>
              )}
            </ForEach>
          </Card>
        </section>
      </div>
    </PageRoot>
  );
}
