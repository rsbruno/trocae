import { CheckCircle, Warning, XCircle } from "@phosphor-icons/react";
import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      toastOptions={{
        classNames: {
          toast:
            "w-full flex items-start gap-3 rounded-xl border border-white/8 bg-surface/95 px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm font-[var(--font-body)]",
          description: "text-[0.6875rem] leading-[1rem] text-ink-secondary mt-0.5",
          title: "text-[0.8125rem] leading-[1.125rem] font-medium text-ink"
        },
        unstyled: true
      }}
      position="top-center"
      duration={4000}
      gap={8}
    />
  );
}

const icons = {
  success: <CheckCircle className="text-accent-primary mt-px shrink-0" weight="fill" size={16} />,
  warning: <Warning className="text-accent-highlight mt-px shrink-0" weight="fill" size={16} />,
  error: <XCircle className="text-status-danger mt-px shrink-0" weight="fill" size={16} />
} as const;

const borderByType = {
  warning: "border-accent-highlight/20",
  success: "border-accent-primary/20",
  error: "border-status-danger/20"
} as const;

type NotifyType = keyof typeof icons;

type NotifyOptions = {
  description?: string;
  duration?: number;
};

export function notify(type: NotifyType, message: string, options?: NotifyOptions) {
  toast(message, {
    ...options,
    classNames: {
      toast: `w-full flex items-start gap-3 rounded-xl border ${borderByType[type]} bg-surface/95 px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm font-[var(--font-body)]`,
      description: "text-[0.6875rem] leading-[1rem] text-ink-secondary mt-0.5",
      title: "text-[0.8125rem] leading-[1.125rem] font-medium text-ink"
    },
    icon: icons[type]
  });
}
