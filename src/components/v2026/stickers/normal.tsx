import { type ComponentPropsWithRef, createContext, useContext } from "react";
import { type VariantProps, tv } from "tailwind-variants";

import { Typography } from "@/components/ui/typography";
import { twMerge } from "@/lib/tv";

export type StickerVariant = "forward" | "midfielder" | "defender" | "goalkeeper";

type StickerContextValue = {
  variant: StickerVariant;
};

const StickerContext = createContext<StickerContextValue | null>(null);

function useStickerContext() {
  const context = useContext(StickerContext);

  if (!context) {
    throw new Error("Sticker components must be used within StickerRoot");
  }

  return context;
}

export function useSticker() {
  return useStickerContext();
}

type StickerBackgroundProps = {
  primaryColor?: string;
  secondaryColor?: string;
};

const stickerSpecContainerVariants = tv({
  variants: {
    variant: {
      midfielder: "bg-sticker-midfielder",
      goalkeeper: "bg-sticker-goalkeeper",
      defender: "bg-sticker-defender",
      forward: "bg-sticker-forward"
    },
    mode: {
      player: "flex-col px-2 py-1.5",
      club: "flex-row px-1 py-0.5"
    }
  },
  base: "flex items-center justify-center rounded-full rounded-br-none",
  defaultVariants: {
    variant: "forward",
    mode: "player"
  }
});

type StickerRootProps = ComponentPropsWithRef<"section"> & {
  variant?: StickerVariant;
  size?: "album" | "compact";
};

const stickerSizeClasses = {
  compact: "h-[300px]",
  album: "h-[340px]"
} as const;

export function StickerRoot({ variant = "forward", size = "album", className, children, ...props }: StickerRootProps) {
  return (
    <StickerContext.Provider value={{ variant }}>
      <section
        className={twMerge(
          "bg-sticker border-sticker relative flex w-full flex-col gap-1.5 border p-3",
          stickerSizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </section>
    </StickerContext.Provider>
  );
}

export function StickerBackground({ secondaryColor, primaryColor }: StickerBackgroundProps) {
  return (
    <span className="absolute top-3 left-0 flex h-40 w-full items-center justify-center p-3 opacity-90">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 487 384" height="384" width="487" fill="none">
        <path
          d="M486.164 302.006C486.164 257.264 449.88 221.003 405.126 221.003H486.164C486.164 176.273 449.88 140 405.126 140H243.038C198.272 140 162 176.272 162 221.003V302.006V302.018C162 346.76 198.284 383.021 243.038 383.021H405.126C449.88 383.008 486.164 346.736 486.164 302.006Z"
          fill={secondaryColor}
        />
        <path
          d="M324.164 81.003C324.164 36.261 287.88 0 243.126 0H243.114H81.038C36.284 0 0 36.272 0 81.003H81.038C36.284 81.003 0 117.264 0 162.006V243.009L324.165 242.997V161.994H243.127C287.88 162.005 324.164 125.733 324.164 81.003Z"
          fill={primaryColor}
        />
      </svg>
    </span>
  );
}

export function StickerContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("z-10 flex flex-1 gap-1.5", className)} {...props} />;
}

export function StickerColumn({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("flex flex-1 flex-col gap-1.5", className)} {...props} />;
}

export function StickerPlayerAvatar({ className, ...props }: ComponentPropsWithRef<"img">) {
  return (
    <div className="flex-1 overflow-hidden rounded-bl-[40px]">
      <img className={twMerge("size-full object-cover grayscale", className)} {...props} />
    </div>
  );
}

type StickerSpecContainerProps = Omit<
  ComponentPropsWithRef<"div"> & VariantProps<typeof stickerSpecContainerVariants>,
  "variant"
>;

export function StickerSpecContainer({ className, mode, ...props }: StickerSpecContainerProps) {
  const { variant } = useStickerContext();

  return <div className={twMerge(stickerSpecContainerVariants({ variant, mode }), className)} {...props} />;
}

type StickerPlayerNameProps = {
  firstName: string;
  lastName: string;
  className?: string;
};

export function StickerPlayerName({ firstName, className, lastName }: StickerPlayerNameProps) {
  return (
    <Typography
      className={twMerge("font-sticker block uppercase", className)}
      variant="medium"
      color="inverse"
      as="span"
      size="xs"
    >
      {firstName}{" "}
      <Typography color="inverse" variant="bold" size="xs" as="b">
        {lastName}
      </Typography>
    </Typography>
  );
}

export function StickerPlayerStats({ className, children, ...props }: Omit<ComponentPropsWithRef<"small">, "color">) {
  return (
    <Typography
      className={twMerge("font-sticker block", className)}
      variant="medium"
      color="inverse"
      as="small"
      size="xs"
      {...props}
    >
      {children}
    </Typography>
  );
}

export function StickerClubLabel({ className, children, ...props }: Omit<ComponentPropsWithRef<"small">, "color">) {
  return (
    <Typography
      className={twMerge("font-sticker uppercase", className)}
      color="inverse"
      variant="bold"
      as="small"
      size="xs"
      {...props}
    >
      {children}
    </Typography>
  );
}

export function StickerSidebar({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("flex h-full w-9 flex-col items-center justify-between", className)} {...props} />;
}

export function StickerLogo({ className, ...props }: ComponentPropsWithRef<"img">) {
  return <img src="/assets/svgs/logo-monochrome-white.svg" className={className} alt="Logo" {...props} />;
}

export function StickerSidebarGroup({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("flex flex-col items-center justify-center gap-1", className)} {...props} />;
}

export function StickerFlag({ className, src, alt, ...props }: ComponentPropsWithRef<"img">) {
  return (
    <div className="border-sticker size-8 rounded-full rounded-br-none border-2">
      <img
        className={twMerge("size-full rounded-full rounded-br-none border border-white object-fill", className)}
        src={src}
        alt={alt}
        {...props}
      />
    </div>
  );
}

export function StickerCountryName({ className, children, ...props }: Omit<ComponentPropsWithRef<"span">, "color">) {
  return (
    <Typography
      className={twMerge(
        "font-country block max-w-5 text-4xl leading-9 whitespace-break-spaces text-transparent uppercase [-webkit-text-stroke:1px_var(--ink)]",
        className
      )}
      color="inverse"
      as="span"
      {...props}
    >
      {children}
    </Typography>
  );
}
