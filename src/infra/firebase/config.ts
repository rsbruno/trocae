import type { FirebaseOptions } from "firebase/app";

export type FirebaseClientConfig = FirebaseOptions & {
  measurementId?: string;
};

type FirebaseEnvKey =
  | "FIREBASE_API_KEY"
  | "FIREBASE_AUTH_DOMAIN"
  | "FIREBASE_PROJECT_ID"
  | "FIREBASE_STORAGE_BUCKET"
  | "FIREBASE_MESSAGING_SENDER_ID"
  | "FIREBASE_APP_ID"
  | "FIREBASE_MEASUREMENT_ID";

export type FirebaseEnvSource = Partial<Record<FirebaseEnvKey, string | undefined>>;

function requireEnv(source: FirebaseEnvSource, name: Exclude<FirebaseEnvKey, "FIREBASE_MEASUREMENT_ID">): string {
  const value = source[name];

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

export function buildFirebaseConfig(source: FirebaseEnvSource): FirebaseClientConfig {
  const config: FirebaseClientConfig = {
    messagingSenderId: requireEnv(source, "FIREBASE_MESSAGING_SENDER_ID"),
    storageBucket: requireEnv(source, "FIREBASE_STORAGE_BUCKET"),
    authDomain: requireEnv(source, "FIREBASE_AUTH_DOMAIN"),
    projectId: requireEnv(source, "FIREBASE_PROJECT_ID"),
    apiKey: requireEnv(source, "FIREBASE_API_KEY"),
    appId: requireEnv(source, "FIREBASE_APP_ID")
  };

  const measurementId = source.FIREBASE_MEASUREMENT_ID;

  if (measurementId) {
    config.measurementId = measurementId;
  }

  return config;
}

export function getFirebaseConfig(): FirebaseClientConfig {
  return buildFirebaseConfig(import.meta.env);
}
