import { Typography } from "@/components/ui/typography";

export function PageBrandMark() {
  return (
    <div className="flex flex-col items-center gap-5" data-slot="page-brand-mark">
      <div className="relative">
        <div
          className="flex size-[72px] flex-col items-center justify-center rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,230,118,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
          style={{
            background: "linear-gradient(145deg, #1A2029 0%, #141920 100%)"
          }}
        >
          <span className="text-2xl leading-none select-none">⚽</span>
          <span
            className="mt-1 font-mono text-[0.5rem] font-bold tracking-widest"
            style={{ color: "var(--accent-primary)", opacity: 0.7 }}
          >
            001
          </span>
        </div>
        <span
          style={{
            border: "1px solid rgba(255,213,79,0.25)",
            background: "rgba(255,213,79,0.12)",
            color: "var(--accent-highlight)"
          }}
          className="absolute -top-2 -right-2 flex h-5 items-center rounded-full px-1.5 text-[0.5625rem] font-semibold tracking-wide"
        >
          2026
        </span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <Typography className="font-heading text-[2.25rem] leading-none tracking-tight" variant="bold" color="base" as="h1">
          trocaê
        </Typography>
        <Typography className="tracking-[0.06em] uppercase" variant="medium" color="subtle" size="xs" as="p">
          Copa do Mundo · 2026
        </Typography>
      </div>
    </div>
  );
}
