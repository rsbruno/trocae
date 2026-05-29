import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const signUpSchema = z
  .object({
    password: z.string().min(1, "Crie uma senha.").min(8, "Mínimo 8 caracteres."),
    email: z.string().min(1, "Informe seu e-mail.").email("E-mail inválido."),
    confirmPassword: z.string().min(1, "Confirme sua senha.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"]
  });

export const resolver = zodResolver(signUpSchema);

export const EMPTY_DATA: SignUpFormData = {
  confirmPassword: "",
  password: "",
  email: ""
};

export type SignUpFormData = z.infer<typeof signUpSchema>;
