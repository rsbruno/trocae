import { type ServiceAccount, initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

function loadServiceAccount(): ServiceAccount {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    const raw = readFileSync(serviceAccountPath, "utf8");
    return JSON.parse(raw) as ServiceAccount;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Para o seed, defina FIREBASE_SERVICE_ACCOUNT_PATH ou FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.");
  }

  return { clientEmail, privateKey, projectId };
}

export function getAdminFirestore() {
  if (getApps().length === 0) {
    initializeApp({ credential: cert(loadServiceAccount()) });
  }

  return getFirestore();
}
