import { createFileRoute } from "@tanstack/react-router";

import {
  GroupListItemProgress,
  GroupListItemAction,
  GroupListItemStats,
  GroupListItemFlag,
  GroupListItemName,
  GroupListItemRoot,
  GroupListContent,
  GroupListHeader,
  GroupListRoot
} from "@/components/v2026/groups/list";
import { useFindAllPastedCollection } from "@/services/collections/findall-pasted-collection.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { useFindAllGroupedTeams } from "@/services/teams/find-all-grouped-teams.service";
import { PageRoot } from "@/components/ui/page/root";

export const Route = createFileRoute("/_auth/album/")({
  component: AlbumPage
});

const MAX_STICKERS_PER_TEAM = 20;

function AlbumPage() {
  const { isLoading: groupsLoading, data: groups } = useFindAllGroupedTeams();
  const { data: pasted } = useFindAllPastedCollection({
    select: (stickers) => {
      return stickers.reduce<Record<string, number>>((acc, item) => {
        const teamId = item.sticker.team.id;
        acc[teamId] = (acc[teamId] ?? 0) + 1;
        return acc;
      }, {});
    }
  });

  return (
    <PageRoot className="mx-auto max-w-md pb-8" subtitle="Todas as seleções" title="Álbum">
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>

      <div className="flex flex-col gap-7 px-4" aria-busy={groupsLoading}>
        {groupsLoading
          ? Array.from({ length: 3 }).map((_, i) => <GroupListRoot skeleton key={i} />)
          : groups?.map((group) => (
              <GroupListRoot key={group.id}>
                <GroupListHeader>Grupo {group.code}</GroupListHeader>
                <GroupListContent>
                  {group.teams.map((team) => (
                    <GroupListItemRoot key={team.id}>
                      <GroupListItemFlag src={team.flag} />
                      <GroupListItemName>{team.name}</GroupListItemName>
                      <GroupListItemStats>
                        {pasted?.[team.id] ?? 0}/{MAX_STICKERS_PER_TEAM}
                      </GroupListItemStats>
                      <GroupListItemProgress value={((pasted?.[team.id] ?? 0) / MAX_STICKERS_PER_TEAM) * 100} />
                      <GroupListItemAction />
                    </GroupListItemRoot>
                  ))}
                </GroupListContent>
              </GroupListRoot>
            ))}
      </div>
    </PageRoot>
  );
}
