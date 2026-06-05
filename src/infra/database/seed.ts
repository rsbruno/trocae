import "dotenv/config";
import { type Firestore, FieldValue } from "firebase-admin/firestore";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { getAdminFirestore } from "@/infra/firebase/admin";

/**
 * Seeds write full document snapshots to Firestore — no DocumentReference fields.
 * Nested data (e.g. team.group, sticker.team) must be embedded in each JSON file.
 */
const databaseDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSeedsDir = path.join(databaseDir, "2026");

const seedFileOrder = ["groups.json", "teams.json", "matches.json", "stickers.json"];

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
  return [...fileNames].sort((left, right) => {
    const indexLeft = seedFileOrder.indexOf(left);
    const indexRight = seedFileOrder.indexOf(right);

    if (indexLeft === -1 && indexRight === -1) {
      return left.localeCompare(right);
    }

    if (indexLeft === -1) {
      return 1;
    }

    if (indexRight === -1) {
      return -1;
    }

    return indexLeft - indexRight;
  });
}

function assertSnapshotPayload(value: unknown, fieldPath = ""): void {
  if (value === null || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSnapshotPayload(item, `${fieldPath}[${index}]`));
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    const nestedPath = fieldPath ? `${fieldPath}.${key}` : key;

    if (key.endsWith("Ref") && typeof nested === "string") {
      throw new Error(
        `Campo "${nestedPath}" parece referência a outro documento. Seeds devem usar snapshots embutidos, sem *Ref.`
      );
    }

    assertSnapshotPayload(nested, nestedPath);
  }
}

function toSeedDocuments(content: unknown): Record<string, unknown>[] {
  if (Array.isArray(content)) {
    return content.filter(
      (item): item is Record<string, unknown> => item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  if (content !== null && typeof content === "object" && !Array.isArray(content)) {
    return [content].filter(
      (item): item is Record<string, unknown> => item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  throw new Error("JSON deve ser um objeto ou um array de objetos.");
}

async function listJsonFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  return sortSeedFiles(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name));
}

async function writeSnapshot(
  db: Firestore,
  collectionId: string,
  document: Record<string, unknown>
): Promise<SeedDocumentResult> {
  const documentId = document.id;

  if (typeof documentId !== "string" || documentId.length === 0) {
    throw new Error(`Documento sem "id" válido em ${collectionId}: ${JSON.stringify(document)}`);
  }

  assertSnapshotPayload(document);

  const docRef = db.collection(collectionId).doc(documentId);
  const snapshot = await docRef.get();
  const created = !snapshot.exists;

  if (created) {
    await docRef.set({
      ...document,
      createdAt: FieldValue.serverTimestamp()
    });
  } else {
    await docRef.set(document);
  }

  return {
    collectionId,
    documentId,
    created
  };
}

async function syncJsonFile(db: Firestore, seedsDir: string, fileName: string): Promise<SeedDocumentResult[]> {
  const collectionId = collectionIdFromJsonFile(fileName);
  const filePath = path.join(seedsDir, fileName);
  const raw = await readFile(filePath, "utf8");
  const documents = toSeedDocuments(JSON.parse(raw));
  const results: SeedDocumentResult[] = [];

  for (const document of documents) {
    results.push(await writeSnapshot(db, collectionId, document));
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
