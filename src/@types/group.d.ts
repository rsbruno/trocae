import type { Team } from "./team";

export type GroupCode = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

export type Group = {
  id: string;
  name: string;
  code: GroupCode;
  order: number;
};

export type GroupWithTeams = Group & {
  teams: Team[];
};
