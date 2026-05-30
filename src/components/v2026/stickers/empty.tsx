import { type ComponentPropsWithRef, type ReactNode, createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";

import type { Sticker } from "@/@types/sticker";

import { Typography } from "@/components/ui/typography";
import { ShowIf } from "@/components/utils/show";

type StickerEmptyContextValue = {
  data: Sticker;
};

export const StickerEmptyContext = createContext<StickerEmptyContextValue | null>(null);

export function useStickerEmptyContext() {
  const context = useContext(StickerEmptyContext);

  if (!context) {
    throw new Error("StickerEmpty components must be used within StickerEmptyRoot");
  }

  return context;
}

export const stickerFrameClassName = "bg-sticker relative flex w-full flex-col items-center justify-between pt-20 pb-15 gap-1.5";

export const stickerSizeClasses = {
  compact: "h-[300px]",
  album: "h-[340px]"
} as const;

type StickerEmptyRootProps = ComponentPropsWithRef<"div"> & {
  data: Sticker;
  children?: ReactNode;
  size?: keyof typeof stickerSizeClasses;
};

export function StickerEmptyRoot({ size = "album", className, children, data, ...props }: StickerEmptyRootProps) {
  return (
    <StickerEmptyContext.Provider value={{ data }}>
      <div
        className={twMerge(stickerFrameClassName, stickerSizeClasses[size], className)}
        style={{ background: data.team.stickerPrimary }}
        {...props}
      >
        {children}
      </div>
    </StickerEmptyContext.Provider>
  );
}

export function StickerEmptyBackground() {
  return (
    <span className="absolute inset-0 flex size-full items-center justify-center p-3 opacity-90">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 325 508" height="508" width="325" fill="none">
        <path
          d="M324.164 426.006C324.164 381.264 287.88 345.003 243.126 345.003H324.164C324.164 300.273 287.88 264 243.126 264H81.038C36.272 264 0 300.272 0 345.003V426.006V426.018C0 470.76 36.284 507.021 81.038 507.021H243.126C287.88 507.008 324.164 470.736 324.164 426.006Z"
          fill="white"
        />
        <path
          d="M324.164 81.003C324.164 36.261 287.88 0 243.126 0H243.114H81.038C36.284 0 0 36.272 0 81.003H81.038C36.284 81.003 0 117.264 0 162.006V243.009L324.165 242.997V161.994H243.127C287.88 162.005 324.164 125.733 324.164 81.003Z"
          fill="white"
        />
      </svg>
    </span>
  );
}

export function StickerEmptyLabel({ className, children, ...props }: Omit<ComponentPropsWithRef<"strong">, "color">) {
  const { data } = useStickerEmptyContext();
  const code = data.code.slice(0, 3);

  return (
    <Typography
      className={twMerge("font-sticker z-10 block text-center leading-6 uppercase", className)}
      style={{ color: data.team.stickerPrimary }}
      variant="bold"
      as="strong"
      size="xl"
      {...props}
    >
      <ShowIf if={!children}>
        {code}
        <br />
        {data.order}
      </ShowIf>
      <ShowIf if={Boolean(children)}>{children}</ShowIf>
    </Typography>
  );
}

export function StickerEmptyPlayerName({ className, children, ...props }: Omit<ComponentPropsWithRef<"strong">, "color">) {
  const { data } = useStickerEmptyContext();

  return (
    <Typography
      className={twMerge("font-sticker z-10 block max-w-1/2 text-center leading-4 uppercase", className)}
      style={{ color: data.team.stickerPrimary }}
      variant="bold"
      as="strong"
      size="md"
      {...props}
    >
      {children ?? data.player.name}
    </Typography>
  );
}
