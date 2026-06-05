import { type ComponentPropsWithoutRef, type ReactNode, isValidElement, useContext, Children } from "react";
import { type LinkProps, Link } from "@tanstack/react-router";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

import { Typography } from "@/components/ui/typography";
import { ShowIf } from "@/components/utils/show";

import { PageContext } from "./context";

export type PageHeaderActionProps = ComponentPropsWithoutRef<"button"> & {
  icon: ReactNode;
  badge?: number;
};

export function PageHeaderAction({ type = "button", className, badge, icon, ...props }: PageHeaderActionProps) {
  return (
    <button
      className={twMerge(
        "relative flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white/6 text-white/70 transition-colors active:bg-white/10",
        className
      )}
      data-slot="page-header-action"
      type={type}
      {...props}
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

export type PageHeaderBackButtonProps = Omit<LinkProps, "children"> & {
  className?: string;
};

export function PageHeaderBackButton({ className, ...props }: PageHeaderBackButtonProps) {
  return (
    <Link
      className={twMerge(
        "flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/6 text-white/70 transition-colors active:bg-white/10",
        className
      )}
      data-slot="page-header-back-button"
      aria-label="Voltar"
      {...props}
    >
      <CaretLeftIcon weight="bold" size={20} />
    </Link>
  );
}

export type PageHeaderTitleProps = {
  children?: ReactNode;
  className?: string;
};

export function PageHeaderTitle({ className, children }: PageHeaderTitleProps) {
  const { title } = useContext(PageContext);
  return (
    <Typography
      className={twMerge("truncate tracking-tight", className)}
      data-slot="page-header-title"
      variant="semibold"
      color="base"
      size="lg"
      as="h1"
    >
      {children ?? title}
    </Typography>
  );
}

export type PageHeaderSubtitleProps = {
  children?: ReactNode;
  className?: string;
};

export function PageHeaderSubtitle({ className, children }: PageHeaderSubtitleProps) {
  const { subtitle } = useContext(PageContext);
  const content = children ?? subtitle;
  return (
    <ShowIf if={!!content}>
      <Typography
        className={twMerge("mt-0.5 truncate", className)}
        data-slot="page-header-subtitle"
        variant="medium"
        color="subtle"
        size="xs"
        as="p"
      >
        {content}
      </Typography>
    </ShowIf>
  );
}

export type PageHeaderActionsProps = ComponentPropsWithoutRef<"div">;

export function PageHeaderActions({ className, children, ...props }: PageHeaderActionsProps) {
  return (
    <div className={twMerge("flex shrink-0 items-center gap-2", className)} data-slot="page-header-actions" {...props}>
      {children}
    </div>
  );
}

export type PageHeaderProps = ComponentPropsWithoutRef<"header">;

export function PageHeader({ className, children, ...props }: PageHeaderProps) {
  const { back } = useContext(PageContext);
  const headerChildren = Children.toArray(children);
  const actions = headerChildren.filter((child) => isValidElement(child) && child.type === PageHeaderActions);
  const content = headerChildren.filter((child) => !(isValidElement(child) && child.type === PageHeaderActions));

  return (
    <header
      className={twMerge(
        "bg-bg/80 sticky top-0 z-40 mb-5 border-b border-white/8 px-9 pt-[env(safe-area-inset-top)] backdrop-blur-xl",
        className
      )}
      data-slot="page-header"
      {...props}
    >
      <div className="flex h-14 items-center gap-3">
        <ShowIf if={!!back}>{back ? <PageHeaderBackButton {...back} /> : null}</ShowIf>
        <ShowIf if={content.length > 0}>
          <div data-slot="page-header-content" className="min-w-0 flex-1">
            {content}
          </div>
        </ShowIf>
        {actions}
      </div>
    </header>
  );
}
