import { type ComponentPropsWithoutRef, createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";

import type { Sticker } from "@/@types/sticker";

import { type TypographyProps, Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

type StickerInlineContextValue = {
  data?: Sticker;
  rarity?: string;
};

const StickerInlineContext = createContext<StickerInlineContextValue | null>(null);

export function useStickerInlineContext() {
  const context = useContext(StickerInlineContext);
  if (!context) throw new Error("Sticker components must be used within StickerInlineRoot");
  return context;
}

export type StickerInlineRootProps = ComponentPropsWithoutRef<"div"> & {
  data?: Sticker;
  rarity?: string;
};

export function StickerInlineRoot({ className, children, rarity, data, ...props }: StickerInlineRootProps) {
  return (
    <StickerInlineContext.Provider value={{ rarity, data }}>
      <div className={twMerge("flex items-center gap-3 px-4 py-3.5", className)} {...props}>
        {children}
      </div>
    </StickerInlineContext.Provider>
  );
}

export function StickerInlineCard({ className, ...props }: ComponentPropsWithoutRef<typeof Card>) {
  return <Card className={twMerge("flex flex-col divide-y divide-white/6 overflow-hidden p-0", className)} {...props} />;
}

export function StickerInlineTeamFlag({ className, src, alt, ...props }: ComponentPropsWithoutRef<"img">) {
  const { data } = useStickerInlineContext();

  return (
    <div
      className={twMerge(
        "bg-surface-alt flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md",
        className
      )}
    >
      <img alt={alt ?? data?.player?.name} src={src ?? data?.team?.flag} {...props} />
    </div>
  );
}

export function StickerInlineContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={twMerge("min-w-0 flex-1", className)} {...props} />;
}

export function StickerInlinePlayerName({ className, children, ...props }: TypographyProps<"span">) {
  const { data } = useStickerInlineContext();

  return (
    <Typography className={twMerge("block truncate", className)} variant="medium" color="base" as="span" size="sm" {...props}>
      {children ?? data?.player?.name}
    </Typography>
  );
}

export function StickerInlineTeamName({ className, children, ...props }: TypographyProps<"span">) {
  const { data } = useStickerInlineContext();

  return (
    <Typography className={twMerge("block truncate", className)} variant="medium" color="subtle" as="span" size="xs" {...props}>
      {children ?? data?.team?.name}
    </Typography>
  );
}

export function StickerInlineEnd({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={twMerge("flex shrink-0 flex-col items-end gap-0.5", className)} {...props} />;
}

export function StickerInlineRarity({ className, children, ...props }: TypographyProps<"span">) {
  const { rarity } = useStickerInlineContext();

  if (!rarity && !children) return null;

  return (
    <Typography className={twMerge("block", className)} variant="medium" color="subtle" as="span" size="xs" {...props}>
      {children ?? rarity}
    </Typography>
  );
}

export function StickerInlineCode({ className, children, ...props }: TypographyProps<"span">) {
  const { data } = useStickerInlineContext();

  return (
    <Typography className={twMerge("block", className)} variant="medium" color="muted" as="span" size="xs" {...props}>
      {children ?? data?.code}
    </Typography>
  );
}

export function StickerInlineRepeatedCount({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={twMerge(
        "border-accent-primary/30 bg-accent-primary/15 text-accent-primary flex size-7 items-center justify-center rounded-full border text-[12px] leading-none font-bold tabular-nums",
        className
      )}
      {...props}
    >
      <Typography variant="medium" color="success" as="span" size="xs">
        ×{children}
      </Typography>
    </div>
  );
}
