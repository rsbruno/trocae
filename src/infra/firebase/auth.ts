import { type Auth, getAuth } from "firebase/auth";

import { getFirebaseApp } from "./client";

let firebaseAuth: Auth | undefined;

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }

  return firebaseAuth;
}
