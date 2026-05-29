import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const completeProfileSchema = z.object({
  fullName: z.string().min(1, "Informe seu nome completo."),
  nickname: z.string().min(1, "Informe seu nickname.")
});

export const resolver = zodResolver(completeProfileSchema);

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export const EMPTY_DATA: CompleteProfileFormData = {
  fullName: "",
  nickname: ""
};
