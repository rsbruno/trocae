import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { Team } from "@/@types/team";

import { getFirestoreClient } from "@/infra/firebase/client";

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
  const normalizedCode = code?.trim().toUpperCase();

  return useQuery({
    queryFn: () => findTeamByCodeService(normalizedCode),
    queryKey: ["use-find-team-by-code", normalizedCode],
    enabled: normalizedCode?.length > 0,
    ...options
  });
}
