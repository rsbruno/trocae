import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { collection, getDocs, query } from "firebase/firestore";

import type { GroupedTeam, Team } from "@/@types/team";

import { getFirestoreClient } from "@/infra/firebase/client";
import { sortBy } from "@/helpers/sort-by";

export const findAllGroupedTeamsService = async (): Promise<GroupedTeam[]> => {
  const teamsRef = collection(getFirestoreClient(), "teams");
  const teamsQuery = query(teamsRef);

  const snapshot = await getDocs(teamsQuery);
  const teams = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Team[];

  const groups = new Map();

  for (const team of teams) {
    if (!groups.has(team.group.id)) {
      groups.set(team.group.id, {
        ...team.group,
        teams: []
      });
    }
    groups.get(team.group.id).teams.push(team);
  }

  return sortBy(Array.from(groups.values()), "order");
};

export function useFindAllGroupedTeams(options?: Omit<UseQueryOptions<GroupedTeam[], Error>, "queryKey" | "queryFn">) {
  return useQuery({
    queryFn: findAllGroupedTeamsService,
    queryKey: ["use-find-all-teams"],
    ...options
  });
}
