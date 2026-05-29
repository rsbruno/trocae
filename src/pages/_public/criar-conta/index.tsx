import type { UserCredential } from "firebase/auth";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Form } from "react-hook-form";

import { useSignInWithGoogleService } from "@/services/firebase/sign-in-with-google.service";
import { PasswordFieldControlled } from "@/components/ui/fields/controlled/password-field";
import { PageStackFooter, PageStackMain, PageStackRoot } from "@/components/ui/page/stack";
import { useSignUpWithEmailService } from "@/services/firebase/sign-up-with-email.service";
import { getCurrentProfileService } from "@/services/users/get-current-profile.service";
import { TextFieldControlled } from "@/components/ui/fields/controlled/text-field";
import { type SignUpFormData, EMPTY_DATA, resolver } from "@/schemas/zod/sign-up";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { PageBrandMark } from "@/components/ui/page/brand-mark";
import { GoogleIcon } from "@/assets/icons/google-icon";
import { Typography } from "@/components/ui/typography";
import { useAuthStore } from "@/stores/auth.store";
import { notify } from "@/components/ui/sonner";

export const Route = createFileRoute("/_public/criar-conta/")({
  component: SignUpPage
});

function SignUpPage() {
  const { control, reset } = useForm({ resolver });
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  const onSuccess = async (credential: UserCredential) => {
    const { user } = credential;
    const profile = await getCurrentProfileService(user.uid);

    setSession({
      accessToken: await user.getIdToken(),
      refreshToken: user.refreshToken
    });
    setUser(profile);
    reset(EMPTY_DATA);
  };

  const googleSignIn = useSignInWithGoogleService({
    onError: (error) => notify("error", error.message),
    onSuccess
  });

  const signUpWithEmail = useSignUpWithEmailService({
    onError: (error) => notify("error", error.message),
    onSuccess
  });

  const isSubmitting = signUpWithEmail.isPending || googleSignIn.isPending;

  const handleGoogleSignIn = () => {
    googleSignIn.mutate();
  };

  const handleSignUpWithEmail = (data: SignUpFormData) => {
    signUpWithEmail.mutate({ password: data.password, email: data.email });
  };

  return (
    <PageStackRoot>
      <PageStackMain>
        <div className="mb-10 flex w-full flex-col items-center">
          <PageBrandMark />
        </div>

        <div className="mb-6 flex w-full flex-col gap-1.5">
          <Typography className="tracking-tight" variant="bold" size="xl" as="h1">
            Crie sua conta
          </Typography>
          <Typography color="muted" size="sm" as="p">
            E-mail e senha para começar.
          </Typography>
        </div>

        <Form
          onSubmit={({ data }) => handleSignUpWithEmail(data)}
          className="flex w-full flex-col gap-4"
          control={control}
          noValidate
        >
          <TextFieldControlled
            placeholder="seu@email.com"
            autoComplete="email"
            control={control}
            label="E-mail"
            type="email"
            name="email"
          />
          <PasswordFieldControlled
            autoComplete="new-password"
            placeholder="••••••••"
            control={control}
            name="password"
            label="Senha"
          />
          <PasswordFieldControlled
            autoComplete="new-password"
            label="Confirmar senha"
            placeholder="••••••••"
            name="confirmPassword"
            control={control}
          />
          <ButtonRoot className="relative mt-1" disabled={isSubmitting} variant="primary" type="submit" size="xl">
            <ButtonLabel>Criar conta</ButtonLabel>
          </ButtonRoot>
        </Form>

        <div className="my-6 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <Typography variant="medium" color="muted" as="span" size="xs">
            ou
          </Typography>
          <div className="h-px flex-1 bg-white/8" />
        </div>

        <ButtonRoot
          onClick={handleGoogleSignIn}
          className="relative w-full"
          disabled={isSubmitting}
          variant="secondary"
          type="button"
          size="xl"
        >
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
