import type { Group } from "./group";

export type Confederation = "CONMEBOL" | "CONCACAF" | "UEFA" | "AFC" | "CAF" | "OFC";

export type Team = {
  id: string;
  name: string;
  fifaCode: string;
  federationName: string;
  confederation: Confederation;
  flag: string;
  coach: string;
  primaryColor: string;
  secondaryColor: string;
  group: {
    id: string;
    name: string;
    code: GroupCode;
    order: number;
  };
};

export interface GroupedTeam extends Group {
  teams: Team[];
}
