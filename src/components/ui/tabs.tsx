"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { twMerge } from "tailwind-merge";

function mergeRootClassName(
  baseClassName: string,
  className: string | ((state: TabsPrimitive.Root.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: TabsPrimitive.Root.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeListClassName(
  baseClassName: string,
  className: string | ((state: TabsPrimitive.List.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: TabsPrimitive.List.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeTriggerClassName(
  baseClassName: string,
  className: string | ((state: TabsPrimitive.Tab.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: TabsPrimitive.Tab.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeContentClassName(
  baseClassName: string,
  className: string | ((state: TabsPrimitive.Panel.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: TabsPrimitive.Panel.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

export function Tabs({ orientation = "horizontal", className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={mergeRootClassName("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      data-orientation={orientation}
      data-slot="tabs"
      {...props}
    />
  );
}

const tabsListVariants = cva("inline-flex w-fit items-center justify-center rounded-lg p-1", {
  variants: {
    variant: {
      default: "border border-white/8 bg-surface-alt/90",
      line: "gap-1 bg-transparent"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function TabsList({
  variant = "default",
  className,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      className={mergeListClassName(tabsListVariants({ variant }), className)}
      data-variant={variant}
      data-slot="tabs-list"
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={mergeTriggerClassName(
        "text-ink-muted data-active:bg-surface data-active:text-ink relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-all",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={mergeContentClassName("flex-1 text-sm outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { tabsListVariants };
