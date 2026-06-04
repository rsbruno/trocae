import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { Team } from "@/@types/team";

import { getFirestoreClient } from "@/infra/firebase/client";
import { normalize } from "@/helpers/strings";

export const findTeamByCodeQueryKeys = {
  byCode: (code: string | undefined) => [...findTeamByCodeQueryKeys.all(), normalize(code)] as const,
  all: () => ["use-find-team-by-code"] as const
};

type UseFindTeamByCodeOptions = Omit<UseQueryOptions<Team | null, Error, Team | null>, "queryKey" | "queryFn" | "enabled">;

export const findTeamByCodeService = async (code: string): Promise<Team | null> => {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) return null;

  const teamsRef = collection(getFirestoreClient(), "teams");
  const teamsSnapshot = await getDocs(query(teamsRef, where("fifaCode", "==", normalizedCode), limit(1)));
  if (teamsSnapshot.empty) return null;

  const teamDoc = teamsSnapshot.docs[0];
  const data = teamDoc.data();
  if (!data) return null;

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
    name: data.name,
    flag: data.flag,
    id: teamDoc.id
  };
};

export function useFindTeamByCode(code: string | undefined, options?: UseFindTeamByCodeOptions) {
  return useQuery({
    queryFn: () => findTeamByCodeService(normalize(code)),
    queryKey: findTeamByCodeQueryKeys.byCode(code),
    enabled: Boolean(code?.length),
    ...options
  });
}
