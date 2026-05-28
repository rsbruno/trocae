import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        destructive: "bg-status-danger/15 text-status-danger hover:bg-status-danger/25",
        outline: "border-white/10 bg-surface-alt/90 text-ink hover:bg-surface",
        secondary: "bg-surface-alt text-ink-secondary hover:bg-surface",
        ghost: "text-ink-secondary hover:bg-surface-alt hover:text-ink",
        link: "text-accent-primary underline-offset-4 hover:underline",
        default: "bg-accent-primary text-bg hover:opacity-90"
      },
      size: {
        sm: "h-8 gap-1 px-2.5 text-xs",
        default: "h-9 gap-1.5 px-3",
        lg: "h-10 gap-1.5 px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function mergeButtonClassName(baseClassName: string, className: ButtonPrimitive.Props["className"]) {
  if (typeof className === "function") {
    return (state: unknown) => twMerge(baseClassName, className(state as never));
  }

  return twMerge(baseClassName, className);
}

export function Button({
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={mergeButtonClassName(buttonVariants({ variant, size }), className)}
      data-slot="button"
      {...props}
    />
  );
}

export { buttonVariants };
