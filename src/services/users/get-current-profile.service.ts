import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getDoc, doc } from "firebase/firestore";

import type { User } from "@/@types/user";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

type UseGetUserByIdOptions = Omit<UseQueryOptions<User | null>, "queryKey" | "queryFn" | "enabled">;

export const getCurrentProfileService = async (id: string): Promise<User | null> => {
  const { currentUser } = getFirebaseAuth();
  const snapshot = await getDoc(doc(getFirestoreClient(), "users", id));
  if (!currentUser && !snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    fullName: data?.displayName ?? currentUser?.displayName ?? null,
    photoURL: currentUser?.photoURL ?? null,
    email: currentUser?.email ?? null,
    nickname: data?.nickname ?? null,
    id: currentUser?.uid ?? id
  };
};

export function useGetCurrentProfile(userId: string, options?: UseGetUserByIdOptions) {
  return useQuery({
    queryFn: () => getCurrentProfileService(userId),
    queryKey: ["use-get-current-profile", userId],
    enabled: Boolean(userId),
    ...options
  });
}
