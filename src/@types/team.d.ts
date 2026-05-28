export type Confederation = "CONMEBOL" | "CONCACAF" | "UEFA" | "AFC" | "CAF" | "OFC";

import type { DocumentReference } from "firebase/firestore";

import type { Group } from "./group";

export type Team = {
  id: string;
  name: string;
  fifaCode: string;
  federationName: string;
  confederation: Confederation;
  flag: string;
  groupRef: DocumentReference<Group>;
  coach: string;
  primaryColor: string;
  secondaryColor: string;
};

export type TeamSeed = Omit<Team, "groupRef"> & {
  groupRef: string;
};
