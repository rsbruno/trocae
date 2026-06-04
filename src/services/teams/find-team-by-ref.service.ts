import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { type DocumentReference, getDoc } from "firebase/firestore";

import type { Team } from "@/@types/team";

export const findTeamByRefQueryKeys = {
  byRefPath: (path: string | undefined) => [...findTeamByRefQueryKeys.all(), path ?? null] as const,
  all: () => ["use-get-team-by-ref"] as const
};

type UseFindTeamByRefOptions = Omit<UseQueryOptions<Team | null>, "queryKey" | "queryFn" | "enabled">;

export const findTeamByRefService = async (teamRef: DocumentReference): Promise<Team | null> => {
  const snapshot = await getDoc(teamRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  if (!data) {
    return null;
  }

  return {
    stickerSecondary: data.stickerSecondary,
    federationName: data.federationName,
    secondaryColor: data.secondaryColor,
    stickerPrimary: data.stickerPrimary,
    confederation: data.confederation,
    primaryColor: data.primaryColor,
    fifaCode: data.fifaCode,
    coach: data.coach,
    group: data.group,
    id: snapshot.id,
    name: data.name,
    flag: data.flag
  };
};

export function useFindTeamByRef(teamRef: DocumentReference | undefined, options?: UseFindTeamByRefOptions) {
  return useQuery({
    queryKey: findTeamByRefQueryKeys.byRefPath(teamRef?.path),
    queryFn: () => findTeamByRefService(teamRef!),
    enabled: Boolean(teamRef),
    ...options
  });
}
