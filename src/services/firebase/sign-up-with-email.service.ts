import { createUserWithEmailAndPassword, type UserCredential } from "firebase/auth";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import { getFirebaseAuth } from "@/infra/firebase/auth";

import { withAuthErrorMessage } from "./firebase.service";

export type SignUpWithEmailInput = {
  email: string;
  password: string;
};

type UseSignUpWithEmailOptions = Omit<UseMutationOptions<UserCredential, Error, SignUpWithEmailInput>, "mutationFn">;

export const signUpWithEmailService = async ({ password, email }: SignUpWithEmailInput): Promise<UserCredential> => {
  return withAuthErrorMessage(async () => {
    return await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  });
};

export function useSignUpWithEmailService(options?: UseSignUpWithEmailOptions) {
  return useMutation({
    mutationFn: signUpWithEmailService,
    ...options
  });
}
