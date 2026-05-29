import type { ComponentPropsWithRef } from "react";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

type SearchInputRootProps = ComponentPropsWithRef<"div">;
type SearchInputFieldProps = Omit<ComponentPropsWithRef<"input">, "type">;

export function SearchInputRoot({ className, children, ...props }: SearchInputRootProps) {
  return (
    <div className={twMerge("relative", className)} {...props}>
      {children}
    </div>
  );
}

export function SearchInputIcon() {
  return <MagnifyingGlass className="text-ink-muted absolute top-1/2 left-3.5 -translate-y-1/2" weight="regular" size={16} />;
}

export function SearchInputField({ placeholder = "Buscar figurinha...", className, ...props }: SearchInputFieldProps) {
  return (
    <input
      className={twMerge(
        "bg-surface/85 text-ink placeholder:text-ink-muted focus:border-accent-primary/35 focus:ring-accent-primary/10 w-full rounded-lg border border-white/10 py-2.5 pr-4 pl-10 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all focus:ring-2 focus:outline-none",
        className
      )}
      placeholder={placeholder}
      type="search"
      {...props}
    />
  );
}
