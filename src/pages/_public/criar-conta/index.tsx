import { createFileRoute, Link } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";

import { PageStackFooter, PageStackMain, PageStackRoot } from "@/components/ui/page/stack";
import { signUpStep0Schema, type SignUpInput, signUpSchema } from "@/schemas/zod/sign-up";
import { PasswordField } from "@/components/ui/fields/password-field";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { PageBrandMark } from "@/components/ui/page/brand-mark";
import { TextField } from "@/components/ui/fields/text-field";
import { GoogleIcon } from "@/assets/icons/google-icon";
import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";
import { Svg } from "@/components/utils/svg";

export const Route = createFileRoute("/_public/criar-conta/")({
  component: CriarContaPage
});

type SignUpFieldErrors = Partial<Record<keyof SignUpInput, string>>;

function StepDots({ current, total }: { current: number; total: number }) {
  const dots = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="flex items-center gap-1.5">
      <ForEach items={dots}>
        {(i) => (
          <span
            style={{
              background: i === current ? "var(--accent-primary)" : "rgba(255,255,255,0.15)",
              width: i === current ? "16px" : "5px",
              height: "5px"
            }}
            className="rounded-full transition-all duration-300"
          />
        )}
      </ForEach>
    </div>
  );
}

function CriarContaPage() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({});

  const [form, setForm] = useState<SignUpInput>({
    confirmPassword: "",
    fullName: "",
    nickname: "",
    password: "",
    email: ""
  });

  const update = (field: keyof SignUpInput) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNext = () => {
    const result = signUpStep0Schema.safeParse(form);

    if (!result.success) {
      const { issues } = result.error;

      setFieldErrors({
        fullName: issues.find((issue) => issue.path[0] === "fullName")?.message,
        nickname: issues.find((issue) => issue.path[0] === "nickname")?.message
      });
      return;
    }

    setFieldErrors((prev) => ({ ...prev, fullName: undefined, nickname: undefined }));
    setStep(1);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = signUpSchema.safeParse(form);

    if (!result.success) {
      const { issues } = result.error;

      setFieldErrors({
        confirmPassword: issues.find((issue) => issue.path[0] === "confirmPassword")?.message,
        password: issues.find((issue) => issue.path[0] === "password")?.message,
        email: issues.find((issue) => issue.path[0] === "email")?.message
      });
      setGlobalError(null);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);
    setGlobalError(null);

    await new Promise((r) => setTimeout(r, 1800));
    setIsLoading(false);
    setGlobalError("Não foi possível criar sua conta. Tente novamente.");
  };

  return (
    <PageStackRoot>
      <PageStackMain>
        <div className="mb-10 flex w-full flex-col items-center">
          <PageBrandMark />
        </div>

        <div className="mb-6 flex w-full flex-col gap-1.5">
          <div className="relative flex min-h-8 w-full items-center justify-center">
            <ShowIf if={step === 1}>
              <ButtonRoot
                className="absolute top-1/2 left-0 -translate-y-1/2"
                onClick={() => setStep(0)}
                variant="link"
                type="button"
              >
                <Svg stroke="currentColor" className="size-4" strokeWidth={2} fill="none">
                  <Svg.Path d="M15 18l-6-6 6-6" />
                </Svg>
                <ButtonLabel>Voltar</ButtonLabel>
              </ButtonRoot>
            </ShowIf>
            <StepDots current={step} total={2} />
          </div>

          <Typography className="tracking-tight" variant="bold" size="xl" as="h1">
            <ShowIf if={step === 0}>Crie sua conta</ShowIf>
            <ShowIf if={step === 1}>Quase lá</ShowIf>
          </Typography>
          <Typography color="muted" size="sm" as="p">
            <ShowIf if={step === 0}>Como podemos te chamar?</ShowIf>
            <ShowIf if={step === 1}>Acesso e segurança</ShowIf>
          </Typography>
        </div>

        <ShowIf if={step === 0}>
          <div className="flex w-full flex-col gap-4">
            <TextField
              onChange={update("fullName")}
              error={fieldErrors.fullName}
              placeholder="João Silva"
              label="Nome completo"
              value={form.fullName}
              autoComplete="name"
              name="fullName"
            />
            <TextField
              onChange={update("nickname")}
              error={fieldErrors.nickname}
              placeholder="joao_col26"
              autoComplete="username"
              value={form.nickname}
              name="nickname"
              label="Apelido"
            />

            <ButtonRoot className="relative mt-1" onClick={handleNext} variant="primary" type="button" size="xl">
              <ButtonLabel>Continuar</ButtonLabel>
            </ButtonRoot>
          </div>
        </ShowIf>

        <ShowIf if={step === 1}>
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
            <PasswordField
              onChange={update("password")}
              error={fieldErrors.password}
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.password}
              name="password"
              label="Senha"
            />
            <PasswordField
              onChange={update("confirmPassword")}
              error={fieldErrors.confirmPassword}
              value={form.confirmPassword}
              autoComplete="new-password"
              label="Confirmar senha"
              name="confirmPassword"
              placeholder="••••••••"
            />

            <ShowIf if={Boolean(globalError)}>
              <Typography color="danger" role="alert" size="sm" as="p">
                {globalError}
              </Typography>
            </ShowIf>

            <ButtonRoot className="relative mt-1" disabled={isLoading} variant="primary" type="submit" size="xl">
              <ShowIf if={isLoading}>
                <span className="border-bg/30 border-t-bg size-4 animate-spin rounded-full border-2" />
              </ShowIf>
              <ShowIf if={!isLoading}>
                <ButtonLabel>Criar conta</ButtonLabel>
              </ShowIf>
            </ButtonRoot>
          </form>
        </ShowIf>

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
          Já tem conta?{" "}
          <ButtonRoot variant="link" asChild>
            <Link to="/entrar">
              <ButtonLabel>Entrar</ButtonLabel>
            </Link>
          </ButtonRoot>
        </Typography>
      </PageStackFooter>
    </PageStackRoot>
  );
}
