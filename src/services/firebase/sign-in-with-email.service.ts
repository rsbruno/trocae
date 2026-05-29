import { signInWithEmailAndPassword, type UserCredential } from "firebase/auth";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import { getFirebaseAuth } from "@/infra/firebase/auth";

import { withAuthErrorMessage } from "./firebase.service";

export type SignInWithEmailInput = {
  email: string;
  password: string;
};

type UseSignInWithEmailOptions = Omit<UseMutationOptions<UserCredential, Error, SignInWithEmailInput>, "mutationFn">;

export const signInWithEmailService = async ({ password, email }: SignInWithEmailInput): Promise<UserCredential> => {
  return withAuthErrorMessage(async () => {
    return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  });
};

export function useSignInWithEmailService(options?: UseSignInWithEmailOptions) {
  return useMutation({
    mutationFn: signInWithEmailService,
    ...options
  });
}
