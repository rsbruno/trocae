import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getDoc, doc } from "firebase/firestore";

import type { User } from "@/@types/user";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export const getCurrentProfileQueryKeys = {
  byUserId: (userId: string) => [...getCurrentProfileQueryKeys.all(), userId] as const,
  all: () => ["use-get-current-profile"] as const
};

type UseGetUserByIdOptions = Omit<UseQueryOptions<User | null>, "queryKey" | "queryFn" | "enabled">;

export const getCurrentProfileService = async (id: string): Promise<User | null> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;
  const snapshot = await getDoc(doc(getFirestoreClient(), "users", id));

  if (!currentUser && !snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    fullName: data?.displayName ?? currentUser?.displayName ?? null,
    email: data?.email ?? currentUser?.email ?? null,
    photoURL: currentUser?.photoURL ?? null,
    nickname: data?.nickname ?? null,
    id: currentUser?.uid ?? id
  };
};

export function useGetCurrentProfile(userId: string | undefined, options?: UseGetUserByIdOptions) {
  return useQuery({
    queryKey: getCurrentProfileQueryKeys.byUserId(userId ?? ""),
    queryFn: () => getCurrentProfileService(userId!),
    enabled: Boolean(userId),
    ...options
  });
}
