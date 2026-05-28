export type PaisSticker = {
  number: number;
  owned: boolean;
  type: "player" | "extra";
  variant: "midfielder" | "gold" | "normal" | "silver" | "bronze" | "forward" | "defender" | "goalkeeper";
  firstName?: string;
  lastName?: string;
  stats?: string;
  club?: string;
  flag?: string;
  countryCode?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isRare?: boolean;
};

export const paisStickers: PaisSticker[] = [
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    club: "Clube atual do jogador (BRA)",
    flag: "/assets/png/flag-brazil.png",
    stats: "16-2-2000 | 1,80m | 75kg",
    variant: "midfielder",
    firstName: "bruno",
    lastName: "santos",
    countryCode: "BRA",
    type: "player",
    owned: true,
    number: 1
  },
  {
    flag: "/assets/png/flag-brazil.png",
    firstName: "Bruno",
    lastName: "Santos",
    countryCode: "BRA",
    variant: "gold",
    type: "extra",
    isRare: true,
    owned: true,
    number: 2
  }
];
