import { CalendarDotsIcon, SoccerBallIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";

import type { MatchTeam, Match } from "@/@types/match";

import { EmptyStateContent, EmptyStateTitle, EmptyStateIcon, EmptyStateRoot } from "@/components/ui/empty-state";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeader } from "@/components/ui/page/header";
import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { useFindAllMatches } from "@/services/matches/find-all-matches.service";
import { PageContent } from "@/components/ui/page/content";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowIf } from "@/components/utils/show";

export const Route = createFileRoute("/_auth/partidas/")({
  component: MatchesPage
});

function TeamBadge({ align = "left", team }: { team: MatchTeam; align?: "left" | "right" }) {
  return (
    <div
      className={
        align === "right" ? "flex min-w-0 flex-1 flex-row-reverse items-center gap-2" : "flex min-w-0 flex-1 items-center gap-2"
      }
    >
      <span className="bg-surface-alt flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/8">
        <img className="size-full object-cover" src={team.flag} alt={team.name} />
      </span>
      <div className={align === "right" ? "min-w-0 text-right" : "min-w-0"}>
        <Typography className="block truncate" variant="medium" color="base" size="sm" as="span">
          {team.name}
        </Typography>
        <Typography className="block tabular-nums" variant="medium" color="subtle" size="xs" as="span">
          {team.fifaCode}
        </Typography>
      </div>
    </div>
  );
}

function MatchRow({ match }: { match: Match }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-3.5">
      <TeamBadge team={match.homeTeam} />
      <div className="flex flex-col items-center gap-1">
        <span className="border-border bg-bg text-ink-muted flex size-9 items-center justify-center rounded-full border text-[0.625rem] font-semibold">
          VS
        </span>
        <Typography className="tabular-nums" variant="medium" color="subtle" size="xxs" as="span">
          R{match.matchday}
        </Typography>
      </div>
      <TeamBadge team={match.awayTeam} align="right" />
    </div>
  );
}

function MatchesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <ForEach items={Array.from({ length: 3 })}>
        {(_, props) => (
          <SurfaceCardRoot key={props?.index} className="p-0">
            <div className="border-b border-white/6 px-4 py-3">
              <Skeleton className="h-4 w-24" tone="base" />
              <Skeleton className="mt-2 h-3 w-36" tone="muted" />
            </div>
            <ForEach items={Array.from({ length: 3 })}>
              {(_, rowProps) => (
                <div className="flex items-center gap-3 px-4 py-3.5" key={rowProps?.index}>
                  <Skeleton className="size-8 shrink-0" rounded="md" tone="muted" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-24" tone="base" />
                    <Skeleton className="mt-2 h-3 w-10" tone="muted" />
                  </div>
                  <Skeleton className="size-9 shrink-0" rounded="full" tone="muted" />
                  <div className="flex-1">
                    <Skeleton className="ml-auto h-3.5 w-24" tone="base" />
                    <Skeleton className="mt-2 ml-auto h-3 w-10" tone="muted" />
                  </div>
                  <Skeleton className="size-8 shrink-0" rounded="md" tone="muted" />
                </div>
              )}
            </ForEach>
          </SurfaceCardRoot>
        )}
      </ForEach>
    </div>
  );
}

function MatchesPage() {
  const { data: groups = [], isFetching, error } = useFindAllMatches();
  const totalMatches = groups.reduce((sum, group) => sum + group.matches.length, 0);

  return (
    <PageRoot subtitle="Confrontos da fase de grupos" title="Partidas">
      <PageHeader>
        <PageHeaderTitle />
        <PageHeaderSubtitle />
      </PageHeader>

      <PageContent aria-busy={isFetching}>
        <SurfaceCardGhost className="flex items-center gap-3 p-3">
          <div className="bg-accent-primary/10 text-accent-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <CalendarDotsIcon weight="duotone" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <Typography variant="semibold" color="base" size="sm" as="p">
              {totalMatches || 72} partidas de grupo
            </Typography>
            <Typography variant="medium" color="subtle" size="xs" as="p">
              Todos contra todos dentro de cada grupo
            </Typography>
          </div>
        </SurfaceCardGhost>

        <ShowIf if={isFetching}>
          <MatchesSkeleton />
        </ShowIf>

        <ShowIf if={Boolean(error) && !isFetching}>
          <EmptyStateRoot tone="danger">
            <EmptyStateContent>
              <EmptyStateTitle className="text-status-danger">
                {error?.message ?? "Não foi possível carregar as partidas."}
              </EmptyStateTitle>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={!isFetching && !error && groups.length === 0}>
          <EmptyStateRoot>
            <EmptyStateIcon>
              <SoccerBallIcon weight="duotone" />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyStateTitle>Nenhuma partida cadastrada</EmptyStateTitle>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={!isFetching && !error && groups.length > 0}>
          <ForEach items={groups}>
            {(group) => (
              <SurfaceCardRoot className="overflow-hidden p-0" key={group.id}>
                <div className="border-b border-white/6 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <Typography variant="semibold" color="base" size="sm" as="h2">
                      Grupo {group.code}
                    </Typography>
                    <Typography className="tabular-nums" variant="medium" color="subtle" size="xs" as="span">
                      {group.matches.length} jogos
                    </Typography>
                  </div>
                  <Typography variant="medium" color="subtle" size="xs" as="p">
                    Rodadas 1, 2 e 3
                  </Typography>
                </div>
                <div className="divide-y divide-white/6">
                  <ForEach items={group.matches}>{(match) => <MatchRow match={match} />}</ForEach>
                </div>
              </SurfaceCardRoot>
            )}
          </ForEach>
        </ShowIf>
      </PageContent>
    </PageRoot>
  );
}
