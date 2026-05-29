import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import { getFirebaseAuth } from "@/infra/firebase/auth";

import { withAuthErrorMessage } from "./firebase.service";

type UseSignInWithGoogleOptions = Omit<UseMutationOptions<User, Error, void>, "mutationFn">;

export const signInWithGoogleService = async (): Promise<User> => {
  return withAuthErrorMessage(async () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(getFirebaseAuth(), provider).then((result) => result.user);
  });
};

export function useSignInWithGoogleService(options?: UseSignInWithGoogleOptions) {
  return useMutation({
    mutationFn: () => signInWithGoogleService(),
    ...options
  });
}
