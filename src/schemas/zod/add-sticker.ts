import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { STICKER_RARITY_OPTIONS } from "@/constants/options/sticker-rarity";

const stickerRaritySchema = z.enum(["common", "normal", "bronze", "silver", "gold"]);

const stickerRarityOptionSchema = z.object({
  data: z.discriminatedUnion("layout", [
    z.object({ layout: z.literal("player") }),
    z.object({
      variant: z.enum(["normal", "silver", "bronze", "gold"]),
      layout: z.literal("extra")
    })
  ]),
  value: stickerRaritySchema,
  label: z.string()
});

export const STICKER_CODE_LENGTH = 5;

export const addStickerSchema = z.object({
  code: z.string().max(STICKER_CODE_LENGTH, `O código deve ter no máximo ${STICKER_CODE_LENGTH} caracteres.`),
  variation: stickerRarityOptionSchema
});

export const resolver = zodResolver(addStickerSchema);

export type AddStickerFormData = z.infer<typeof addStickerSchema>;

export const EMPTY_DATA: AddStickerFormData = {
  variation: STICKER_RARITY_OPTIONS[0],
  code: ""
};
