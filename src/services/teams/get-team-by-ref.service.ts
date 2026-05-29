import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { type DocumentReference, getDoc } from "firebase/firestore";

import type { Team } from "@/@types/team";

type UseGetTeamByRefOptions = Omit<UseQueryOptions<Team | null>, "queryKey" | "queryFn" | "enabled">;

export const getTeamByRefService = async (teamRef: DocumentReference): Promise<Team | null> => {
  const snapshot = await getDoc(teamRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  if (!data) {
    return null;
  }

  return {
    federationName: data.federationName,
    secondaryColor: data.secondaryColor,
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

export function useGetTeamByRef(teamRef: DocumentReference | undefined, options?: UseGetTeamByRefOptions) {
  return useQuery({
    queryKey: ["use-get-team-by-ref", teamRef?.path],
    queryFn: () => getTeamByRefService(teamRef!),
    enabled: Boolean(teamRef),
    ...options
  });
}
