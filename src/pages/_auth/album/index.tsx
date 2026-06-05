import { createFileRoute, Link } from "@tanstack/react-router";

import {
  GroupListItemProgress,
  GroupListItemAction,
  GroupListItemStats,
  GroupListItemFlag,
  GroupListItemName
} from "@/components/v2026/groups/list";
import { buildAlbumGlobalStats, buildAlbumPastedStats, MAX_STICKERS_PER_TEAM } from "@/helpers/album/album-stats";
import { useFindAllPastedCollection } from "@/services/collections/findall-pasted-collection.service";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { ProfileProgressRingRoot } from "@/pages/_auth/perfil/_components/profile-progress-ring";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeader } from "@/components/ui/page/header";
import { useFindAllGroupedTeams } from "@/services/teams/find-all-grouped-teams.service";
import { SurfaceCardRoot } from "@/components/ui/surface-card";
import { PageContent } from "@/components/ui/page/content";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { AlbumGroupsSkeleton, AlbumStatsSkeleton } from "./_components/skeletons";

export const Route = createFileRoute("/_auth/album/")({
  component: AlbumPage
});

function AlbumPage() {
  const { isFetching: groupsFetching, data: groups = [] } = useFindAllGroupedTeams();
  const { isFetching: collectionFetching, data: collectionItems = [] } = useFindAllCollectionItems();
  const { isFetching: pastedFetching, data: pastedStats } = useFindAllPastedCollection(undefined, {
    select: buildAlbumPastedStats
  });

  const albumStats = buildAlbumGlobalStats(groups, collectionItems, pastedStats?.uniqueCount ?? 0);
  const statsLoading = groupsFetching || pastedFetching || collectionFetching;

  function getTeamPastedCount(teamId: string) {
    return pastedStats?.byTeam[teamId] ?? 0;
  }

  function getGroupPastedCount(group: (typeof groups)[number]) {
    return group.teams.reduce((total, team) => total + getTeamPastedCount(team.id), 0);
  }

  return (
    <PageRoot subtitle="Todas as seleções" title="Meu álbum">
      <PageHeader>
        <PageHeaderTitle />
        <PageHeaderSubtitle />
      </PageHeader>

      <PageContent aria-busy={groupsFetching || pastedFetching || collectionFetching}>
        <ShowIf if={statsLoading}>
          <AlbumStatsSkeleton />
        </ShowIf>

        <ShowIf if={!statsLoading}>
          <SurfaceCardRoot className="flex items-center justify-around py-5">
            <div className="flex flex-col items-center">
              <ProfileProgressRingRoot progress={albumStats.progress} strokeWidth={4} size={52} />
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <Typography variant="semibold" color="success" size="xl" as="p">
                {albumStats.pastedUniqueCount}
              </Typography>
              <Typography variant="medium" color="success" size="xs" as="p">
                Coladas
              </Typography>
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <Typography variant="semibold" color="highlight" size="xl" as="p">
                {albumStats.repeatedCount}
              </Typography>
              <Typography color="highlight" variant="medium" size="xs" as="p">
                Repetidas
              </Typography>
            </div>
            <div className="bg-border h-10 w-px" />
            <div className="text-center">
              <Typography variant="semibold" color="info" size="xl" as="p">
                {albumStats.totalStickers}
              </Typography>
              <Typography variant="medium" color="info" size="xs" as="p">
                Total
              </Typography>
            </div>
          </SurfaceCardRoot>
        </ShowIf>

        <ShowIf if={groupsFetching}>
          <AlbumGroupsSkeleton />
        </ShowIf>

        <ShowIf if={!groupsFetching}>
          <ForEach items={groups}>
            {(group) => {
              const groupPastedCount = getGroupPastedCount(group);
              const groupTotalStickers = group.teams.length * MAX_STICKERS_PER_TEAM;

              return (
                <SurfaceCardRoot className="overflow-hidden p-0" key={group.id}>
                  <div className="border-b border-white/6 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <Typography variant="semibold" color="base" size="sm" as="h2">
                        Grupo {group.code}
                      </Typography>
                      <Typography className="tabular-nums" variant="medium" color="subtle" size="xs" as="span">
                        {groupPastedCount}/{groupTotalStickers}
                      </Typography>
                    </div>
                    <Typography variant="medium" color="subtle" size="xs" as="p">
                      {group.teams.length} seleções
                    </Typography>
                  </div>

                  <div className="divide-y divide-white/6">
                    <ForEach items={group.teams}>
                      {(team) => {
                        const pastedCount = getTeamPastedCount(team.id);

                        return (
                          <Link
                            className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/4"
                            aria-label={`Ver detalhes de ${team.name}`}
                            params={() => ({ pais: team.fifaCode })}
                            to="/album/$pais"
                            key={team.id}
                          >
                            <GroupListItemFlag src={team.flag} />
                            <GroupListItemName className="truncate">{team.name}</GroupListItemName>
                            <GroupListItemStats>
                              {pastedCount}/{MAX_STICKERS_PER_TEAM}
                            </GroupListItemStats>
                            <GroupListItemProgress value={(pastedCount / MAX_STICKERS_PER_TEAM) * 100} />
                            <GroupListItemAction />
                          </Link>
                        );
                      }}
                    </ForEach>
                  </div>
                </SurfaceCardRoot>
              );
            }}
          </ForEach>
        </ShowIf>
      </PageContent>
    </PageRoot>
  );
}
