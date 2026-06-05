type ProfileProgressRingRootProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function ProfileProgressRingRoot({ strokeWidth = 4, size = 72, className, progress }: ProfileProgressRingRootProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
      <svg className="-rotate-90" height={size} width={size}>
        <circle stroke="var(--surface-alt)" strokeWidth={strokeWidth} cx={size / 2} cy={size / 2} fill="none" r={radius} />
        <circle
          className="transition-all duration-700 ease-out"
          strokeDasharray={circumference}
          stroke="var(--accent-primary)"
          strokeWidth={strokeWidth}
          strokeDashoffset={offset}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
        />
      </svg>
      <ProfileProgressRingValue progress={progress} />
    </div>
  );
}

export function ProfileProgressRingValue({ progress }: { progress: number }) {
  return (
    <div className="absolute flex flex-col items-center">
      <span className="text-ink text-sm font-semibold tracking-tight">{Math.round(progress)}%</span>
    </div>
  );
}
