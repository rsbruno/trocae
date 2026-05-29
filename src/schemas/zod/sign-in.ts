import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("E-mail inválido.").min(1, "Informe seu e-mail."),
  password: z.string().min(1, "Informe sua senha.")
});

export const resolver = zodResolver(signInSchema);

export const EMPTY_DATA: SignInFormData = {
  password: "",
  email: ""
};

export type SignInFormData = z.infer<typeof signInSchema>;
