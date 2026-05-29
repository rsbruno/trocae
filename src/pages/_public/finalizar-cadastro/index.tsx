import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { useForm, Form } from "react-hook-form";

import { type CompleteProfileFormData, EMPTY_DATA, resolver } from "@/schemas/zod/complete-profile";
import { PageStackFooter, PageStackMain, PageStackRoot } from "@/components/ui/page/stack";
import { useUpsertUserProfileService } from "@/services/users/upsert-user-profile.service";
import { TextFieldControlled } from "@/components/ui/fields/controlled/text-field";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { PageBrandMark } from "@/components/ui/page/brand-mark";
import { Typography } from "@/components/ui/typography";
import { useAuthStore } from "@/stores/auth.store";
import { ShowIf } from "@/components/utils/show";
import { notify } from "@/components/ui/sonner";

export const Route = createFileRoute("/_public/finalizar-cadastro/")({
  beforeLoad: async () => {
    if (!useAuthStore.persist.hasHydrated())
      await new Promise<void>((resolve) => {
        useAuthStore.persist.onFinishHydration(() => resolve());
      });

    const { session, user } = useAuthStore.getState();
    if (!session) throw redirect({ to: "/" });
    if (user?.fullName && user?.nickname) throw redirect({ to: "/home" });
  },
  component: CompleteProfilePage
});

function CompleteProfilePage() {
  const navigate = useNavigate();
  const { control, reset } = useForm({ resolver });
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const upsertUserProfile = useUpsertUserProfileService({
    onSuccess: async (updatedUser) => {
      setUser(updatedUser);
      reset(EMPTY_DATA);
      notify("success", "Cadastro finalizado com sucesso.");
      await navigate({ to: "/home" });
    },
    onError: (error) => notify("error", error.message)
  });

  const handleCompleteProfile = (data: CompleteProfileFormData) => {
    upsertUserProfile.mutate({
      fullName: data.fullName,
      nickname: data.nickname
    });
  };

  return (
    <PageStackRoot>
      <PageStackMain>
        <div className="mb-10 flex w-full flex-col items-center">
          <ShowIf if={Boolean(user?.photoURL)}>
            <img
              className="size-[72px] rounded-2xl border border-white/10 object-cover"
              referrerPolicy="no-referrer"
              src={user?.photoURL ?? ""}
              alt="Foto de perfil"
            />
          </ShowIf>
          <ShowIf if={!user?.photoURL}>
            <PageBrandMark />
          </ShowIf>
        </div>

        <div className="mb-6 flex w-full flex-col gap-1.5">
          <Typography className="tracking-tight" variant="bold" size="xl" as="h1">
            Finalizar cadastro
          </Typography>
          <Typography color="muted" size="sm" as="p">
            Preencha seu nome completo e nickname.
          </Typography>
        </div>

        <Form
          onSubmit={({ data }) => handleCompleteProfile(data)}
          className="flex w-full flex-col gap-4"
          control={control}
          noValidate
        >
          <TextFieldControlled
            placeholder="Seu nome completo"
            label="Nome completo"
            autoComplete="name"
            control={control}
            name="fullName"
          />
          <TextFieldControlled placeholder="@seu_nickname" control={control} label="Nickname" name="nickname" />

          <ButtonRoot disabled={upsertUserProfile.isPending} className="relative mt-1" variant="primary" type="submit" size="xl">
            <ButtonLabel>Finalizar cadastro</ButtonLabel>
          </ButtonRoot>
        </Form>
      </PageStackMain>

      <PageStackFooter>
        <Typography color="muted" as="span" size="sm">
          Já finalizou?{" "}
          <ButtonRoot variant="link" asChild>
            <Link to="/">
              <ButtonLabel>Entrar</ButtonLabel>
            </Link>
          </ButtonRoot>
        </Typography>
      </PageStackFooter>
    </PageStackRoot>
  );
}
