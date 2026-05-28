import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha.")
});

export type SignInInput = z.infer<typeof signInSchema>;
