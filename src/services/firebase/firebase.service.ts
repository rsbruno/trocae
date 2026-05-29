import { onAuthStateChanged, type Unsubscribe, type User } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { getFirebaseAuth } from "@/infra/firebase/auth";

const authErrorMessages: Record<string, string> = {
  "auth/account-exists-with-different-credential": "Este e-mail já está em uso com outro método de login.",
  "auth/popup-blocked": "O navegador bloqueou o popup. Permita popups e tente novamente.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde um momento e tente novamente.",
  "auth/invalid-login-credentials": "E-mail ou senha incorretos. Tente novamente.",
  "auth/invalid-credential": "E-mail ou senha incorretos. Tente novamente.",
  "auth/operation-not-allowed": "Cadastro por e-mail não está habilitado.",
  "auth/weak-password": "Senha muito fraca. Use pelo menos 8 caracteres.",
  "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
  "auth/user-not-found": "E-mail ou senha incorretos. Tente novamente.",
  "auth/wrong-password": "E-mail ou senha incorretos. Tente novamente.",
  "auth/cancelled-popup-request": "Aguarde o login anterior terminar.",
  "auth/popup-closed-by-user": "Login cancelado. Tente novamente.",
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/invalid-email": "E-mail inválido."
};

function toAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && authErrorMessages[error.code]) {
    return authErrorMessages[error.code];
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível continuar. Tente novamente.";
}

export async function withAuthErrorMessage<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw new Error(toAuthErrorMessage(error), { cause: error });
  }
}

export const authService = {
  subscribe(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(getFirebaseAuth(), callback);
  },

  getCurrentUser(): User | null {
    return getFirebaseAuth().currentUser;
  }
};
