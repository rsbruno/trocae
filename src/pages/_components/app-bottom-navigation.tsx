import { ArrowLeftRight, Package, Album, Home, User } from "lucide-react";
import { useRouterState, Link } from "@tanstack/react-router";

import { Typography } from "@/components/ui/typography";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

type NavigationItem = {
  to: string;
  icon: typeof Album;
  label: string;
  isCenter?: boolean;
};

const navigationItems: NavigationItem[] = [
  { label: "Album", to: "/album", icon: Album },
  { to: "/inventory", label: "Colecao", icon: Package },
  { label: "Inicio", isCenter: true, icon: Home, to: "/" },
  { icon: ArrowLeftRight, label: "Trocas", to: "/trades" },
  { label: "Perfil", to: "/profile", icon: User }
];

function isNavigationItemActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to);
}

export function AppBottomNavigation() {
  const { location } = useRouterState();
  const currentPath = location.pathname;

  return (
    <nav className="absolute right-0 bottom-0 left-0 z-50 px-5 pb-5">
      <div className="bg-surface/75 mx-auto grid max-w-md grid-cols-5 items-end rounded-[20px] border border-white/10 px-2 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/5 backdrop-blur-xl">
        <ForEach items={navigationItems}>
          {(item) => {
            const Icon = item.icon;
            const isActive = isNavigationItemActive(currentPath, item.to);
            return (
              <>
                <ShowIf if={!!item.isCenter}>
                  <Link className="group flex flex-col items-center justify-center" key={item.to} to={item.to}>
                    <div
                      className={`-mt-8 mb-1 flex size-[52px] items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
                        isActive ? "bg-accent-primary shadow-lg" : "bg-surface-alt shadow-lg"
                      }`}
                    >
                      <Icon
                        className={isActive ? "text-bg" : "text-white/80 group-hover:text-white"}
                        strokeWidth={2.2}
                        size={24}
                      />
                    </div>
                    <Typography color={isActive ? "accent" : "subtle"} variant="medium" as="span" size="xs">
                      {item.label}
                    </Typography>
                  </Link>
                </ShowIf>

                <ShowIf if={!item.isCenter}>
                  <Link className="flex flex-col items-center gap-1.5" key={item.to} to={item.to}>
                    <Icon
                      className={`transition-colors ${isActive ? "text-accent-primary" : "text-white/60 hover:text-white/80"}`}
                      strokeWidth={isActive ? 2.2 : 1.6}
                      size={22}
                    />
                    <Typography color={isActive ? "accent" : "subtle"} variant="medium" as="span" size="xs">
                      {item.label}
                    </Typography>
                  </Link>
                </ShowIf>
              </>
            );
          }}
        </ForEach>
      </div>
    </nav>
  );
}
