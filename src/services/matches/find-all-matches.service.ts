import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { GroupedMatch, Match } from "@/@types/match";

import { getFirestoreClient } from "@/infra/firebase/client";
import { sortBy } from "@/helpers/sort-by";

export const findAllMatchesQueryKeys = {
  all: () => ["use-find-all-matches"] as const
};

export const findAllMatchesService = async (): Promise<GroupedMatch[]> => {
  const matchesRef = collection(getFirestoreClient(), "matches");
  const matchesSnapshot = await getDocs(query(matchesRef, orderBy("order", "asc")));
  const matches = matchesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: data.id ?? doc.id
    } as Match;
  });

  const groups = new Map<string, GroupedMatch>();

  for (const match of matches) {
    if (!groups.has(match.group.id)) {
      groups.set(match.group.id, {
        ...match.group,
        matches: []
      });
    }

    groups.get(match.group.id)!.matches.push(match);
  }

  return sortBy(Array.from(groups.values()), "order");
};

export function useFindAllMatches(options?: Omit<UseQueryOptions<GroupedMatch[], Error>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: findAllMatchesQueryKeys.all(),
    queryFn: findAllMatchesService,
    ...options
  });
}
