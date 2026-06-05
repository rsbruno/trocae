import { ShareNetwork, Gear } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";

import {
  PageHeaderSubtitle,
  PageHeaderActions,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeaderRoot
} from "@/components/ui/page/header";
import { useGetCurrentProfile } from "@/services/users/get-current-profile.service";
import { CollectionSummary } from "@/components/v2026/collections/summary";
import { SurfaceCardRoot } from "@/components/ui/surface-card";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { useAuthStore } from "@/stores/auth.store";
import { ShowIf } from "@/components/utils/show";

export const Route = createFileRoute("/_auth/perfil/")({
  component: ProfilePage
});

function ProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const profileQuery = useGetCurrentProfile(authUser?.id);
  const profile = profileQuery.data ?? authUser;
  const fullName = profile?.fullName ?? "Usuário";
  const nickname = profile?.nickname;
  const email = profile?.email;
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <PageRoot
      subtitle={nickname ? "@" + nickname : (email ?? undefined)}
      className="mx-auto max-w-md pb-8"
      title="Perfil"
      showBack
    >
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
        <PageHeaderActions>
          <PageHeaderAction icon={<Gear weight="regular" size={18} />} />
        </PageHeaderActions>
      </PageHeaderRoot>

      <div className="flex flex-col gap-5 px-4">
        <SurfaceCardRoot>
          <div className="flex items-center gap-4">
            <div className="bg-accent-primary flex size-14 items-center justify-center overflow-hidden rounded-lg">
              <ShowIf if={Boolean(profile?.photoURL)}>
                <img className="size-full object-cover" src={profile?.photoURL ?? ""} alt={fullName} />
              </ShowIf>
              <ShowIf if={!profile?.photoURL}>
                <Typography variant="semibold" color="inverse" as="span" size="md">
                  {initials || "US"}
                </Typography>
              </ShowIf>
            </div>
            <div className="min-w-0 flex-1">
              <Typography
                loading={profileQuery.isFetching}
                className="block truncate"
                variant="semibold"
                color="base"
                size="md"
                as="h2"
              >
                {fullName}
              </Typography>
              <Typography loading={profileQuery.isFetching} className="block truncate" color="muted" size="sm" as="p">
                {nickname ? "@" + nickname : email}
              </Typography>
            </div>
            <button
              className="bg-surface-alt text-ink-secondary hover:bg-surface rounded-md p-2.5 transition-colors"
              type="button"
            >
              <ShareNetwork weight="regular" size={14} />
            </button>
          </div>
        </SurfaceCardRoot>

        <CollectionSummary />
      </div>
    </PageRoot>
  );
}
