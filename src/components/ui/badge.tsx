import { type VariantProps, cva } from "class-variance-authority";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { twMerge } from "tailwind-merge";

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all",
  {
    variants: {
      variant: {
        link: "text-accent-primary underline-offset-4 hover:underline",
        destructive: "bg-status-danger/15 text-status-danger",
        secondary: "bg-surface-alt text-ink-secondary",
        default: "bg-accent-primary text-bg",
        outline: "border-white/10 text-ink",
        ghost: "text-ink-muted"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Badge({
  variant = "default",
  className,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    props: mergeProps<"span">({ className: twMerge(badgeVariants({ variant }), className) }, props),
    state: { slot: "badge", variant },
    defaultTagName: "span",
    render
  });
}

export { badgeVariants };
