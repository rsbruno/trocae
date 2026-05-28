import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { twMerge } from "tailwind-merge";

function mergeProgressClassName(
  baseClassName: string,
  className: string | ((state: ProgressPrimitive.Root.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: ProgressPrimitive.Root.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeTrackClassName(
  baseClassName: string,
  className: string | ((state: ProgressPrimitive.Track.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: ProgressPrimitive.Track.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeIndicatorClassName(
  baseClassName: string,
  className: string | ((state: ProgressPrimitive.Indicator.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: ProgressPrimitive.Indicator.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeLabelClassName(
  baseClassName: string,
  className: string | ((state: ProgressPrimitive.Label.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: ProgressPrimitive.Label.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

function mergeValueClassName(
  baseClassName: string,
  className: string | ((state: ProgressPrimitive.Value.State) => string | undefined) | undefined
) {
  if (typeof className === "function") {
    return (state: ProgressPrimitive.Value.State) => twMerge(baseClassName, className(state));
  }

  return twMerge(baseClassName, className);
}

export function Progress({ className, children, value, ...props }: ProgressPrimitive.Root.Props) {
  const hasCustomChildren = children != null;

  return (
    <ProgressPrimitive.Root
      className={mergeProgressClassName("flex flex-wrap gap-2", className)}
      data-slot="progress"
      value={value}
      {...props}
    >
      {hasCustomChildren ? (
        children
      ) : (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
    </ProgressPrimitive.Root>
  );
}

export function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={mergeTrackClassName(
        "bg-surface-alt relative flex h-[5px] w-full items-center overflow-hidden rounded-full",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

export function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      className={mergeIndicatorClassName(
        "from-accent-primary-strong to-accent-primary h-full rounded-full bg-gradient-to-r transition-all",
        className
      )}
      data-slot="progress-indicator"
      {...props}
    />
  );
}

export function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={mergeLabelClassName("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

export function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={mergeValueClassName("text-ink-muted ml-auto text-sm tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  );
}
