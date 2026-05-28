import { createFileRoute, Link } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";

import { PageStackFooter, PageStackMain, PageStackRoot } from "@/components/ui/page/stack";
import { type SignInInput, signInSchema } from "@/schemas/zod/sign-in";
import { PasswordField } from "@/components/ui/fields/password-field";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { PageBrandMark } from "@/components/ui/page/brand-mark";
import { TextField } from "@/components/ui/fields/text-field";
import { GoogleIcon } from "@/assets/icons/google-icon";
import { Typography } from "@/components/ui/typography";
import { ShowIf } from "@/components/utils/show";

export const Route = createFileRoute("/_public/entrar/")({
  component: EntrarPage
});

type SignInFieldErrors = Partial<Record<keyof SignInInput, string>>;

function EntrarPage() {
  const [form, setForm] = useState<SignInInput>({ password: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof SignInInput) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = signInSchema.safeParse(form);

    if (!result.success) {
      const { issues } = result.error;

      setFieldErrors({
        password: issues.find((issue) => issue.path[0] === "password")?.message,
        email: issues.find((issue) => issue.path[0] === "email")?.message
      });
      setError(null);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setError("E-mail ou senha incorretos. Tente novamente.");
  };

  return (
    <PageStackRoot>
      <PageStackMain>
        <div className="mb-10 flex w-full flex-col items-center">
          <PageBrandMark />
        </div>

        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <TextField
            placeholder="seu@email.com"
            onChange={update("email")}
            error={fieldErrors.email}
            autoComplete="email"
            value={form.email}
            label="E-mail"
            name="email"
            type="email"
          />
          <div className="flex flex-col gap-1.5">
            <PasswordField
              autoComplete="current-password"
              onChange={update("password")}
              error={fieldErrors.password}
              placeholder="••••••••"
              value={form.password}
              name="password"
              label="Senha"
            />
            <div className="flex justify-end">
              <ButtonRoot variant="link" type="button">
                <ButtonLabel>Esqueci minha senha</ButtonLabel>
              </ButtonRoot>
            </div>
          </div>

          <ShowIf if={Boolean(error)}>
            <Typography color="danger" role="alert" size="sm" as="p">
              {error}
            </Typography>
          </ShowIf>

          <ButtonRoot className="relative mt-1" disabled={isLoading} variant="primary" type="submit" size="xl">
            <ShowIf if={isLoading}>
              <span className="border-bg/30 border-t-bg size-4 animate-spin rounded-full border-2" />
            </ShowIf>
            <ShowIf if={!isLoading}>
              <ButtonLabel>Continuar</ButtonLabel>
            </ShowIf>
          </ButtonRoot>
        </form>

        <div className="my-6 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <Typography variant="medium" color="muted" as="span" size="xs">
            ou
          </Typography>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        <ButtonRoot variant="secondary" className="w-full" type="button" size="xl">
          <GoogleIcon />
          <ButtonLabel>Continuar com Google</ButtonLabel>
        </ButtonRoot>
      </PageStackMain>

      <PageStackFooter>
        <Typography color="muted" as="span" size="sm">
          Não tem conta?{" "}
          <ButtonRoot variant="link" asChild>
            <Link to="/criar-conta">
              <ButtonLabel>Criar conta</ButtonLabel>
            </Link>
          </ButtonRoot>
        </Typography>
      </PageStackFooter>
    </PageStackRoot>
  );
}
