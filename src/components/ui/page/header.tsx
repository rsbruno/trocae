import { useRouter } from "@tanstack/react-router";
import { type ReactNode, useContext } from "react";
import { ChevronLeft } from "lucide-react";

import { Typography } from "@/components/ui/typography";
import { ShowIf } from "@/components/utils/show";

import { PageContext } from "./context";

type HeaderActionProps = {
  icon: ReactNode;
  onClick?: () => void;
  badge?: number;
};

export function PageHeaderAction({ onClick, badge, icon }: HeaderActionProps) {
  return (
    <button
      className="relative flex size-9 items-center justify-center rounded-xl bg-white/6 text-white/70 transition-colors active:bg-white/10"
      onClick={onClick}
      type="button"
    >
      {icon}
      <ShowIf if={badge != null && badge > 0}>
        <Typography
          className="bg-accent-primary absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full"
          color="inverse"
          variant="bold"
          as="span"
          size="xs"
        >
          {badge && badge > 9 ? "9+" : badge}
        </Typography>
      </ShowIf>
    </button>
  );
}

export function PageHeaderBackButton() {
  const router = useRouter();
  const { onBack } = useContext(PageContext);

  const handleBack = () => {
    if (onBack) return onBack();
    router.history.back();
  };

  return (
    <button
      className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white/70 transition-colors active:bg-white/10"
      onClick={handleBack}
      type="button"
    >
      <ChevronLeft strokeWidth={2.2} size={20} />
    </button>
  );
}

export function PageHeaderTitle({ children }: { children?: ReactNode }) {
  const { title } = useContext(PageContext);
  return (
    <Typography className="truncate tracking-tight" variant="semibold" color="base" size="lg" as="h1">
      {children ?? title}
    </Typography>
  );
}

export function PageHeaderSubtitle({ children }: { children?: ReactNode }) {
  const { subtitle } = useContext(PageContext);
  const content = children ?? subtitle;
  return (
    <ShowIf if={!!content}>
      <Typography className="mt-0.5 truncate" variant="medium" color="subtle" size="xs" as="p">
        {content}
      </Typography>
    </ShowIf>
  );
}

export function PageHeaderActions({ children }: { children: ReactNode }) {
  return <div className="flex shrink-0 items-center gap-2">{children}</div>;
}

type HeaderRootProps = {
  children?: ReactNode;
};

export function PageHeaderRoot({ children }: HeaderRootProps) {
  const { showBack } = useContext(PageContext);

  return (
    <header className="border-border bg-bg sticky top-0 z-40 mb-5 border-b px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3">
        <ShowIf if={!!showBack}>
          <PageHeaderBackButton />
        </ShowIf>
        {children}
      </div>
    </header>
  );
}
