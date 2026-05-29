import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { setDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

import type { User } from "@/@types/user";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export type UpsertUserProfileInput = {
  fullName: string;
  nickname: string;
};

type UseUpsertUserProfileOptions = Omit<UseMutationOptions<User, Error, UpsertUserProfileInput>, "mutationFn">;

export const upsertUserProfileService = async ({ fullName, nickname }: UpsertUserProfileInput): Promise<User> => {
  const currentUser = getFirebaseAuth().currentUser;
  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  await updateProfile(currentUser, { displayName: fullName });
  await setDoc(
    doc(getFirestoreClient(), "users", currentUser.uid),
    {
      email: currentUser.email,
      displayName: fullName,
      nickname
    },
    { merge: true }
  );

  return {
    photoURL: currentUser.photoURL,
    email: currentUser.email,
    id: currentUser.uid,
    fullName,
    nickname
  };
};

export function useUpsertUserProfileService(options?: UseUpsertUserProfileOptions) {
  return useMutation({
    mutationFn: upsertUserProfileService,
    ...options
  });
}
