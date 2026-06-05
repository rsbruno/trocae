import { createFileRoute, Link } from "@tanstack/react-router";

import {
  GroupListItemProgress,
  GroupListItemAction,
  GroupListItemStats,
  GroupListItemFlag,
  GroupListItemName,
  GroupListContent,
  GroupListHeader,
  GroupListRoot
} from "@/components/v2026/groups/list";
import { buildAlbumGlobalStats, buildAlbumPastedStats, MAX_STICKERS_PER_TEAM } from "@/helpers/album/album-stats";
import { useFindAllPastedCollection } from "@/services/collections/findall-pasted-collection.service";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { ProfileProgressRingRoot } from "@/pages/_auth/perfil/_components/profile-progress-ring";
import { useFindAllGroupedTeams } from "@/services/teams/find-all-grouped-teams.service";
import { SurfaceCardRoot } from "@/components/ui/surface-card";
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

  return (
    <PageRoot className="mx-auto max-w-md pb-8" subtitle="Todas as seleções" title="Meu álbum">
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>

      <div aria-busy={groupsFetching || pastedFetching || collectionFetching} className="flex flex-col gap-7 px-4">
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
            {(group) => (
              <GroupListRoot key={group.id}>
                <GroupListHeader>Grupo {group.code}</GroupListHeader>
                <GroupListContent>
                  <ForEach items={group.teams}>
                    {(team) => (
                      <Link
                        className="flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/4"
                        aria-label={`Ver detalhes de ${team.name}`}
                        params={() => ({ pais: team.fifaCode })}
                        to="/album/$pais"
                        key={team.id}
                      >
                        <GroupListItemFlag src={team.flag} />
                        <GroupListItemName>{team.name}</GroupListItemName>
                        <GroupListItemStats>
                          {pastedStats?.byTeam[team.id] ?? 0}/{MAX_STICKERS_PER_TEAM}
                        </GroupListItemStats>
                        <GroupListItemProgress value={((pastedStats?.byTeam[team.id] ?? 0) / MAX_STICKERS_PER_TEAM) * 100} />
                        <GroupListItemAction />
                      </Link>
                    )}
                  </ForEach>
                </GroupListContent>
              </GroupListRoot>
            )}
          </ForEach>
        </ShowIf>
      </div>
    </PageRoot>
  );
}
