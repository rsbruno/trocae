import type { Sticker } from "@/@types/sticker";

import { Typography } from "@/components/ui/typography";
import { Progress } from "@/components/ui/progress";

type CountryProgressHeaderTeam = Pick<Sticker["team"], "flag" | "name">;

type CountryProgressHeaderProps = {
  team: CountryProgressHeaderTeam;
  currentCount: number;
  totalCount: number;
  progress?: number;
};

export function CountryProgressHeader({ currentCount, totalCount, progress, team }: CountryProgressHeaderProps) {
  const progressValue = progress ?? (totalCount > 0 ? (currentCount / totalCount) * 100 : 0);

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="bg-surface-alt flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/8">
        <img className="size-full object-cover" src={team.flag} alt={team.name} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Typography className="block truncate" variant="semibold" color="base" size="sm" as="h2">
            {team.name}
          </Typography>
          <Typography className="shrink-0 tabular-nums" variant="medium" color="subtle" as="span" size="xs">
            {currentCount}/{totalCount}
          </Typography>
        </div>
        <Progress value={progressValue} />
      </div>
    </div>
  );
}
