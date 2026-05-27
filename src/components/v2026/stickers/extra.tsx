import { type ComponentPropsWithRef, createContext, useContext } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

const variants = tv({
  variants: {
    variant: {
      normal: {
        root: "border-sticker-normal/30",
        content: "bg-sticker-normal"
      },
      silver: {
        root: "border-sticker-silver/30",
        content: "bg-sticker-silver"
      },
      bronze: {
        root: "border-sticker-bronze/30",
        content: "bg-sticker-bronze"
      },
      gold: {
        root: "border-sticker-gold/30",
        content: "bg-sticker-gold"
      }
    }
  },
  slots: {
    content: "bg-sticker-normal size-full relative flex flex-col items-end justify-end",
    root: "relative flex h-72 w-full flex-col gap-1.5 bg-sticker p-3 bg-white border"
  },
  defaultVariants: {
    variant: "normal"
  }
});

const StickerContext = createContext<VariantProps<typeof variants> | null>(null);

function useStickerContext() {
  const context = useContext(StickerContext);

  if (!context) {
    throw new Error("ExtraSticker components must be used within StickerRoot");
  }

  return context;
}

export function useSticker() {
  return useStickerContext();
}

type StickerRootProps = ComponentPropsWithRef<"section"> & VariantProps<typeof variants>;

export function ExtraStickerRoot({ children, variant, ...props }: StickerRootProps) {
  const { content, root } = variants({ variant });

  return (
    <StickerContext.Provider value={{ variant }}>
      <section className={root()} {...props}>
        <div className={content()}>{children}</div>
      </section>
    </StickerContext.Provider>
  );
}

export function ExtraStickerLogo({ className, ...props }: ComponentPropsWithRef<"img">) {
  return (
    <span className="absolute top-2 left-2 z-10 block w-10">
      <img src="/assets/svgs/logo-monochrome-white.svg" className={className} alt="Logo" {...props} />
    </span>
  );
}

export function ExtraStickerPlayerName({ className, ...props }: ComponentPropsWithRef<"span">) {
  return (
    <span
      className={twMerge(
        "font-sticker bg-sticker-extra absolute bottom-3 mx-[5%] block w-[90%] rounded-tr-xl rounded-bl-xl py-1 text-center text-[10px] leading-none font-bold text-white uppercase",
        className
      )}
      {...props}
    />
  );
}

export function ExtraStickerFlag({ className, ...props }: ComponentPropsWithRef<"img">) {
  return (
    <div className="absolute top-5 aspect-square w-full rounded-full p-5">
      <img className={twMerge("size-full rounded-full rounded-tr-none border border-white object-fill", className)} {...props} />
    </div>
  );
}

export function ExtraStickerPlayerAvatar({ className, src, alt, ...props }: ComponentPropsWithRef<"img">) {
  return (
    <div className="h-54 overflow-hidden">
      <img className={twMerge("size-full object-cover grayscale", className)} src={src} alt={alt} {...props} />
    </div>
  );
}
