import { type ReactElement, isValidElement, createContext, Children, use } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, tv } from "tailwind-variants";

import { type TypographyProps, Typography } from "@/components/ui/typography";

const button = tv({
  variants: {
    variant: {
      link: {
        root: "border-0 bg-transparent p-0 text-ink-muted shadow-none hover:bg-transparent hover:text-accent-primary active:scale-100 disabled:opacity-50",
        label: "text-inherit"
      },
      primary: {
        root: "border-transparent bg-accent-primary shadow-[0_4px_20px_rgba(0,230,118,0.25)] hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      },
      secondary: {
        root: "border-white/10 bg-white/[0.03] hover:bg-white/4 active:scale-[0.98] disabled:opacity-60"
      }
    },
    size: {
      xl: { root: "h-12 w-full gap-3 rounded-xl", label: "tracking-wide" },
      icon: { root: "size-9 rounded-md p-0", label: "sr-only" },
      default: { root: "h-9 gap-1.5 rounded-md px-3" },
      lg: { root: "h-10 gap-1.5 rounded-md px-4" },
      sm: { root: "h-8 gap-1 rounded-md px-2.5" }
    }
  },
  slots: {
    root: "inline-flex shrink-0 cursor-pointer items-center justify-center border font-primary font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    label: "leading-none"
  },
  compoundVariants: [
    {
      class: {
        root: "h-auto min-h-0 w-auto rounded-none underline-offset-4 hover:underline"
      },
      variant: "link"
    }
  ],
  defaultVariants: {
    variant: "primary",
    size: "default"
  }
});

type ButtonVariant = NonNullable<VariantProps<typeof button>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof button>["size"]>;

const buttonLabelPropsByVariant = {
  primary: { variant: "semibold", color: "inverse" },
  secondary: { variant: "medium", color: "muted" },
  link: { variant: "medium" }
} as const satisfies Record<ButtonVariant, Partial<TypographyProps<"span">>>;

const buttonLabelPropsBySize = {
  default: { size: "sm" },
  icon: { size: "sm" },
  sm: { size: "xs" },
  lg: { size: "sm" },
  xl: { size: "sm" }
} as const satisfies Record<ButtonSize, Partial<TypographyProps<"span">>>;

export type ButtonContextValue = {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
  labelProps: Partial<TypographyProps<"span">>;
};

const ButtonContext = createContext<ButtonContextValue | null>(null);

function useButtonContext() {
  const context = use(ButtonContext);

  if (!context) {
    throw new Error("Button compound components must be used within ButtonRoot");
  }

  return context;
}

export type ButtonLabelProps = Omit<TypographyProps<"span">, "as">;

export type ButtonRootProps = ButtonPrimitive.Props &
  VariantProps<typeof button> & {
    asChild?: boolean;
  };

export function ButtonLabel({ className, children, ...props }: ButtonLabelProps) {
  const { labelProps, disabled, variant, size } = useButtonContext();
  const { label } = button({
    class: typeof className === "string" ? className : undefined,
    variant,
    size
  });

  return (
    <Typography
      {...labelProps}
      data-slot="button-label"
      aria-disabled={disabled}
      className={label()}
      font="primary"
      as="span"
      {...props}
    >
      {children}
    </Typography>
  );
}

export function ButtonRoot({
  variant = "primary",
  size = "default",
  type = "button",
  asChild = false,
  nativeButton,
  className,
  children,
  disabled,
  render,
  ...props
}: ButtonRootProps) {
  const resolvedVariant = variant ?? "primary";
  const resolvedSize = size ?? "default";
  const { root } = button({
    class: typeof className === "string" ? className : undefined,
    variant: resolvedVariant,
    size: resolvedSize
  });

  const contextValue: ButtonContextValue = {
    labelProps: {
      ...buttonLabelPropsByVariant[resolvedVariant],
      ...buttonLabelPropsBySize[resolvedSize]
    },
    variant: resolvedVariant,
    size: resolvedSize,
    disabled
  };

  const rootClassName = typeof className === "function" ? className : root();
  const resolvedNativeButton = nativeButton ?? !asChild;

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      throw new Error("ButtonRoot with asChild expects a single valid React element as child.");
    }

    return (
      <ButtonContext value={contextValue}>
        <ButtonPrimitive
          render={child as ReactElement<Record<string, unknown>>}
          nativeButton={resolvedNativeButton}
          className={rootClassName}
          disabled={disabled}
          data-slot="button"
          {...(resolvedNativeButton ? { type } : {})}
          {...props}
        />
      </ButtonContext>
    );
  }

  return (
    <ButtonContext value={contextValue}>
      <ButtonPrimitive
        nativeButton={resolvedNativeButton}
        className={rootClassName}
        disabled={disabled}
        data-slot="button"
        render={render}
        type={type}
        {...props}
      >
        {children}
      </ButtonPrimitive>
    </ButtonContext>
  );
}

export { button, button as buttonVariants, useButtonContext };
