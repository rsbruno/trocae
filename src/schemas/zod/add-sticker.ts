import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const stickerVariationTypeSchema = z.enum(["normal", "extra-normal", "extra-silver", "extra-bronze", "extra-gold"]);

const variationOptionSchema = z.object({
  data: z.object({
    type: stickerVariationTypeSchema
  }),
  label: z.string(),
  value: z.string()
});

export const addStickerSchema = z.object({
  variation: variationOptionSchema,
  code: z.string()
});

export const resolver = zodResolver(addStickerSchema);

export type AddStickerFormData = z.infer<typeof addStickerSchema>;

export const EMPTY_DATA: AddStickerFormData = {
  variation: {
    data: { type: "normal" },
    label: "Normal",
    value: "normal"
  },
  code: ""
};
