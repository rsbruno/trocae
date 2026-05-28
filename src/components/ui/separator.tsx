import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { twMerge } from "tailwind-merge";

function mergeSeparatorClassName(
  baseClassName: string,
  className: string | ((state: SeparatorPrimitive.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: SeparatorPrimitive.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      className={mergeSeparatorClassName(
        "bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      orientation={orientation}
      data-slot="separator"
      {...props}
    />
  );
}
