import { type ComponentPropsWithRef, createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

import type { Sticker } from "@/@types/sticker";

import { Typography } from "@/components/ui/typography";

export type ExtraStickerVariant = "normal" | "silver" | "bronze" | "gold";

type ExtraStickerContextValue = {
  data: Sticker;
  variant: ExtraStickerVariant;
};

const variants = tv({
  variants: {
    variant: {
      normal: {
        content: "bg-sticker-normal"
      },
      silver: {
        content: "bg-sticker-silver"
      },
      bronze: {
        content: "bg-sticker-bronze"
      },
      gold: {
        content: "bg-sticker-gold"
      }
    }
  },
  slots: {
    content: "bg-sticker-normal size-full relative flex flex-col items-end justify-end",
    root: "relative flex w-full flex-col gap-1.5 bg-sticker p-3 bg-white"
  },
  defaultVariants: {
    variant: "normal"
  }
});

const ExtraStickerContext = createContext<ExtraStickerContextValue | null>(null);

function useExtraStickerContext() {
  const context = useContext(ExtraStickerContext);

  if (!context) {
    throw new Error("ExtraSticker components must be used within ExtraStickerRoot");
  }

  return context;
}

export function useExtraSticker() {
  return useExtraStickerContext();
}

type ExtraStickerRootProps = ComponentPropsWithRef<"section"> & {
  data: Sticker;
  variant?: ExtraStickerVariant;
  size?: "album" | "compact";
};

const extraStickerSizeClasses = {
  compact: "h-[300px]",
  album: "h-[340px]"
} as const;

export function ExtraStickerRoot({ size = "album", className, children, variant, data, ...props }: ExtraStickerRootProps) {
  const resolvedVariant = variant ?? "normal";
  const { content, root } = variants({ variant: resolvedVariant });

  return (
    <ExtraStickerContext.Provider value={{ variant: resolvedVariant, data }}>
      <section className={twMerge(root(), extraStickerSizeClasses[size], className)} {...props}>
        <div className={content()}>{children}</div>
      </section>
    </ExtraStickerContext.Provider>
  );
}

export function ExtraStickerLogo({ className, ...props }: ComponentPropsWithRef<"img">) {
  return (
    <span className="absolute top-2 left-2 z-10 block w-10">
      <img src="/assets/svgs/logo-monochrome-white.svg" className={className} alt="Logo" {...props} />
    </span>
  );
}

export function ExtraStickerPlayerName({ className, children, ...props }: Omit<ComponentPropsWithRef<"span">, "color">) {
  const { data } = useExtraStickerContext();
  const playerNameParts = data.player.name.trim().split(/\s+/);
  const lastName = playerNameParts.length > 1 ? (playerNameParts[playerNameParts.length - 1] ?? "") : (playerNameParts[0] ?? "");
  const firstName = playerNameParts.length > 1 ? playerNameParts.slice(0, -1).join(" ") : "";
  const displayFirstName = data.type === "player" ? firstName : data.player.name;
  const displayLastName = data.type === "player" ? lastName : "";
  const displayName = [displayFirstName, displayLastName].filter(Boolean).join(" ");

  return (
    <Typography
      className={twMerge(
        "font-sticker bg-sticker-extra absolute bottom-3 mx-[5%] block w-[90%] rounded-tr-xl rounded-bl-xl py-1 text-center uppercase",
        className
      )}
      color="inverse"
      variant="bold"
      as="span"
      size="xs"
      {...props}
    >
      {children ?? displayName}
    </Typography>
  );
}

export function ExtraStickerFlag({ className, src, alt, ...props }: ComponentPropsWithRef<"img">) {
  const { data } = useExtraStickerContext();

  return (
    <div className="absolute top-5 aspect-square w-full rounded-full p-5">
      <img
        className={twMerge("size-full rounded-full rounded-tr-none border border-white object-fill", className)}
        src={src ?? data.team.flag}
        alt={alt ?? data.team.name}
        {...props}
      />
    </div>
  );
}

export function ExtraStickerPlayerAvatar({ className, src, alt, ...props }: ComponentPropsWithRef<"img">) {
  const { data } = useExtraStickerContext();
  const fallbackSrc = "/assets/png/soccer-player.png";

  return (
    <div className="h-54 overflow-hidden">
      <img
        className={twMerge("size-full object-cover grayscale", className)}
        alt={alt ?? data.player.name}
        src={src ?? fallbackSrc}
        {...props}
      />
    </div>
  );
}
