import { type UserCredential, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import { getFirebaseAuth } from "@/infra/firebase/auth";

import { withAuthErrorMessage } from "./firebase.service";

type UseSignInWithGoogleOptions = Omit<UseMutationOptions<UserCredential, Error, void>, "mutationFn">;

export const signInWithGoogleService = async (): Promise<UserCredential> => {
  return withAuthErrorMessage(async () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(getFirebaseAuth(), provider).then((result) => result);
  });
};

export function useSignInWithGoogleService(options?: UseSignInWithGoogleOptions) {
  return useMutation({
    mutationFn: () => signInWithGoogleService(),
    ...options
  });
}
