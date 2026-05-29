import type { ExtraStickerVariant } from "@/components/v2026/stickers/extra";
import type { Options } from "@/@types/option";

type StickerRarityOptionData = { layout: "player" } | { layout: "extra"; variant: ExtraStickerVariant };

export const STICKER_RARITY_OPTIONS = [
  { data: { layout: "player" }, label: "Normal", value: "common" },
  { data: { variant: "normal", layout: "extra" }, label: "Extra — Normal", value: "normal" },
  { data: { variant: "silver", layout: "extra" }, label: "Extra — Prata", value: "silver" },
  { data: { variant: "bronze", layout: "extra" }, label: "Extra — Bronze", value: "bronze" },
  { data: { layout: "extra", variant: "gold" }, label: "Extra — Ouro", value: "gold" }
] as const satisfies Options<StickerRarityOptionData>;

export type StickerRarityOption = (typeof STICKER_RARITY_OPTIONS)[number];
