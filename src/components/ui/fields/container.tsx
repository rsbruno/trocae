import type { ReactNode } from "react";

import { WarningCircle } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

export interface FieldContainerProps {
  children: ReactNode;
  className?: string;
  label?: string;
  error?: string;
  name: string;
  id?: string;
}

export function fieldInputClassName(hasError: boolean, className?: string) {
  return twMerge(
    "bg-surface-alt/70 text-ink placeholder:text-ink-muted w-full rounded-xl border px-4 py-3.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-200 outline-none",
    hasError
      ? "border-status-danger/50 focus:border-status-danger/70 focus:ring-2 focus:ring-status-danger/12"
      : "border-white/8 focus:border-accent-primary/45 focus:ring-2 focus:ring-accent-primary/12",
    "focus:bg-surface-alt",
    className
  );
}

export function FieldContainer({ className, children, label, error, name, id }: FieldContainerProps) {
  const inputId = id ?? name;
  const hasError = Boolean(error);

  return (
    <div className={twMerge("flex flex-col gap-1.5", className)} data-slot="field-container" data-error={hasError}>
      {label && (
        <label className="text-ink-secondary text-[0.6875rem] font-medium tracking-[0.07em] uppercase" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="relative">{children}</div>

      {error && (
        <p className="text-status-danger flex items-center gap-1.5 text-xs" id={`${inputId}-error`} role="alert">
          <WarningCircle className="shrink-0" weight="fill" size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
