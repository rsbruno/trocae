import { z } from "zod";

const signUpFieldsSchema = z.object({
  nickname: z
    .string()
    .min(1, "Escolha um apelido.")
    .min(3, "Mínimo 3 caracteres.")
    .regex(/^[a-z0-9_.]+$/i, "Apenas letras, números, _ e ."),
  password: z.string().min(1, "Crie uma senha.").min(8, "Mínimo 8 caracteres."),
  email: z.string().min(1, "Informe seu e-mail.").email("E-mail inválido."),
  fullName: z.string().trim().min(1, "Informe seu nome completo."),
  confirmPassword: z.string().min(1, "Confirme sua senha.")
});

export const signUpStep0Schema = signUpFieldsSchema.pick({ fullName: true, nickname: true });

export const signUpSchema = signUpFieldsSchema.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"]
});

export type SignUpInput = z.infer<typeof signUpFieldsSchema>;
