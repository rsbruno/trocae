import type { ComponentPropsWithRef } from "react";

import { Search } from "lucide-react";

import { twMerge } from "@/lib/tv";

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
  return <Search className="text-ink-muted absolute top-1/2 left-3.5 -translate-y-1/2" size={16} />;
}

export function SearchInputField({ placeholder = "Buscar figurinha...", className, ...props }: SearchInputFieldProps) {
  return (
    <input
      className={twMerge(
        "border-border bg-surface text-ink placeholder:text-ink-muted focus:border-accent-primary/30 focus:ring-accent-primary/8 w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none",
        className
      )}
      placeholder={placeholder}
      type="search"
      {...props}
    />
  );
}
