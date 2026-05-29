import "dotenv/config";
import { type Firestore, FieldValue } from "firebase-admin/firestore";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { getAdminFirestore } from "@/infra/firebase/admin";

const databaseDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSeedsDir = path.join(databaseDir, "2026");

const seedFileOrder = ["groups.json", "teams.json"];

const referenceFieldCollections: Record<string, string> = {
  groupRef: "groups",
  teamRef: "teams"
};

export type SeedDocumentResult = {
  collectionId: string;
  documentId: string;
  created: boolean;
};

export type SeedCollectionResult = {
  collectionId: string;
  created: number;
  updated: number;
  total: number;
};

function collectionIdFromJsonFile(fileName: string) {
  return path.basename(fileName, ".json");
}

function sortSeedFiles(fileNames: string[]) {
  return [...fileNames].sort((a, b) => {
    const indexA = seedFileOrder.indexOf(a);
    const indexB = seedFileOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    if (indexA === -1) {
      return 1;
    }

    if (indexB === -1) {
      return -1;
    }

    return indexA - indexB;
  });
}

function resolveReferences(db: Firestore, data: Record<string, unknown>): Record<string, unknown> {
  const resolved: Record<string, unknown> = { ...data };

  for (const [field, collectionId] of Object.entries(referenceFieldCollections)) {
    const value = resolved[field];

    if (typeof value === "string" && value.length > 0) {
      resolved[field] = db.collection(collectionId).doc(value);
    }
  }

  return resolved;
}

function toSeedDocuments(content: unknown): Record<string, unknown>[] {
  if (Array.isArray(content)) {
    return content.filter(
      (item): item is Record<string, unknown> => item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  if (content !== null && typeof content === "object" && !Array.isArray(content)) {
    return [content as Record<string, unknown>];
  }

  throw new Error("JSON deve ser um objeto ou um array de objetos.");
}

async function listJsonFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  return sortSeedFiles(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name));
}

async function syncJsonFile(db: Firestore, seedsDir: string, fileName: string): Promise<SeedDocumentResult[]> {
  const collectionId = collectionIdFromJsonFile(fileName);
  const filePath = path.join(seedsDir, fileName);
  const raw = await readFile(filePath, "utf8");
  const documents = toSeedDocuments(JSON.parse(raw));
  const results: SeedDocumentResult[] = [];

  for (const document of documents) {
    const documentId = document.id;

    if (typeof documentId !== "string" || documentId.length === 0) {
      throw new Error(`Documento sem "id" válido em ${fileName}: ${JSON.stringify(document)}`);
    }

    const docRef = db.collection(collectionId).doc(documentId);
    const snapshot = await docRef.get();
    const created = !snapshot.exists;
    const payload = resolveReferences(db, document);

    if (created) {
      await docRef.set({ ...payload, createdAt: FieldValue.serverTimestamp() }, { merge: true });
    } else {
      await docRef.set(payload, { merge: true });
    }

    results.push({
      collectionId,
      documentId,
      created
    });
  }

  return results;
}

export async function syncFirestoreSeeds(seedsDir = defaultSeedsDir): Promise<SeedCollectionResult[]> {
  const db = getAdminFirestore();
  const jsonFiles = await listJsonFiles(seedsDir);
  const collectionResults = new Map<string, SeedCollectionResult>();

  for (const fileName of jsonFiles) {
    const documentResults = await syncJsonFile(db, seedsDir, fileName);

    for (const result of documentResults) {
      const current = collectionResults.get(result.collectionId) ?? {
        collectionId: result.collectionId,
        created: 0,
        updated: 0,
        total: 0
      };

      current.total += 1;

      if (result.created) {
        current.created += 1;
      } else {
        current.updated += 1;
      }

      collectionResults.set(result.collectionId, current);
    }
  }

  return [...collectionResults.values()];
}

async function main() {
  const results = await syncFirestoreSeeds();

  for (const result of results) {
    process.stdout.write(
      `[${result.collectionId}] ${result.total} documentos (${result.created} criados, ${result.updated} atualizados)\n`
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
