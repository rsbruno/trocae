import React, { type FC } from "react";

type SVGProps = React.SVGProps<SVGSVGElement>;

type PathProps = React.SVGProps<SVGPathElement>;

interface SvgFcComponent extends FC<SVGProps> {
  Circle: FC<PathProps>;
  Path: FC<PathProps>;
}

const Svg: SvgFcComponent = ({ children, ...props }: SVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      strokeLinejoin="round"
      stroke="currentColor"
      strokeLinecap="round"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1.4em"
      width="1.4em"
      {...props}
    >
      {children}
    </svg>
  );
};

Svg.Path = ({ className, d }: PathProps) => <path className={className} d={d} />;
Svg.Circle = ({ className, cx, cy, r }: PathProps) => <circle className={className} cx={cx} cy={cy} r={r} />;
Svg.Path.displayName = "Svg.Path";
Svg.displayName = "Svg";

export { Svg };
export type { PathProps, SVGProps };
