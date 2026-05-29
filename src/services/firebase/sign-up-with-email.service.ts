import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, type User } from "firebase/auth";

import { getFirebaseAuth } from "@/infra/firebase/auth";

import { withAuthErrorMessage } from "./firebase.service";

export type SignUpWithEmailInput = {
  email: string;
  password: string;
};

type UseSignUpWithEmailOptions = Omit<UseMutationOptions<User, Error, SignUpWithEmailInput>, "mutationFn">;

export const signUpWithEmailService = async ({ password, email }: SignUpWithEmailInput): Promise<User> => {
  return withAuthErrorMessage(async () => {
    const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);

    return user;
  });
};

export function useSignUpWithEmailService(options?: UseSignUpWithEmailOptions) {
  return useMutation({
    mutationFn: signUpWithEmailService,
    ...options
  });
}
