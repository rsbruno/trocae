import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

import { getFirebaseConfig } from "./config";

let firebaseApp: FirebaseApp | undefined;
let firestoreClient: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = getApps()[0] ?? initializeApp(getFirebaseConfig());
  }

  return firebaseApp;
}

export function getFirestoreClient(): Firestore {
  if (!firestoreClient) {
    firestoreClient = getFirestore(getFirebaseApp());
  }

  return firestoreClient;
}
