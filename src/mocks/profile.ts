export type ProfileAchievementIcon = "trophy" | "star" | "flame" | "crown" | "target" | "award";

export type ProfileAchievement = {
  icon: ProfileAchievementIcon;
  label: string;
  unlocked: boolean;
};

export const profileAchievements: ProfileAchievement[] = [
  { label: "Primeira seleção", icon: "trophy", unlocked: true },
  { label: "100 figurinhas", unlocked: true, icon: "star" },
  { label: "7 dias streak", unlocked: true, icon: "flame" },
  { label: "Holográfica", unlocked: true, icon: "crown" },
  { label: "50% álbum", unlocked: false, icon: "target" },
  { label: "Mestre trocas", unlocked: false, icon: "award" }
];

export const profileConfederations = [
  { name: "CONMEBOL", collected: 45, total: 90 },
  { collected: 78, name: "UEFA", total: 216 },
  { name: "CONCACAF", collected: 32, total: 108 },
  { collected: 28, name: "AFC", total: 108 }
];
