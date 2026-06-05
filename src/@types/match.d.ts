import type { Group } from "./group";

export type MatchStatus = "scheduled" | "live" | "finished";
export type MatchStage = "group";

export type MatchTeam = {
  id: string;
  name: string;
  fifaCode: string;
  flag: string;
  primaryColor: string;
  secondaryColor: string;
  stickerPrimary: string;
  stickerSecondary: string;
};

export type Match = {
  id: string;
  stage: MatchStage;
  status: MatchStatus;
  order: number;
  matchday: 1 | 2 | 3;
  groupMatchIndex: number;
  group: Group;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
};

export type GroupedMatch = Group & {
  matches: Match[];
};
