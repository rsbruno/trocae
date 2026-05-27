import { createFileRoute } from "@tanstack/react-router";

import {
  StickerSpecContainer,
  StickerPlayerAvatar,
  StickerSidebarGroup,
  StickerCountryName,
  StickerPlayerStats,
  StickerBackground,
  StickerPlayerName,
  StickerClubLabel,
  StickerContent,
  StickerSidebar,
  StickerColumn,
  StickerFlag,
  StickerLogo,
  StickerRoot
} from "@/components/v2026/stickers/normal";
import {
  ExtraStickerPlayerAvatar,
  ExtraStickerPlayerName,
  ExtraStickerFlag,
  ExtraStickerLogo,
  ExtraStickerRoot
} from "@/components/v2026/stickers/extra";

export const Route = createFileRoute("/album/$id/$pais/")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <section className="h-dvh w-full p-1">
      <div className="mx-auto grid h-full w-full max-w-md grid-cols-2 gap-3">
        <StickerRoot variant="midfielder">
          <StickerBackground secondaryColor="#FEDF00" primaryColor="#009B3A" />
          <StickerContent>
            <StickerColumn>
              <StickerPlayerAvatar src="/assets/png/soccer-player.png" alt="Bruno Santos" />
              <StickerSpecContainer mode="player">
                <StickerPlayerName firstName="bruno" lastName="santos" />
                <StickerPlayerStats>16-2-2000 | 1,80m | 75kg</StickerPlayerStats>
              </StickerSpecContainer>
            </StickerColumn>

            <StickerSidebar>
              <StickerLogo />
              <StickerSidebarGroup>
                <StickerFlag src="/assets/png/flag-brazil.png" alt="Bandeira do Brasil" />
                <StickerCountryName>b r a</StickerCountryName>
              </StickerSidebarGroup>
            </StickerSidebar>
          </StickerContent>

          <StickerSpecContainer mode="club">
            <StickerClubLabel>Clube atual do jogador (BRA)</StickerClubLabel>
          </StickerSpecContainer>
        </StickerRoot>

        <ExtraStickerRoot variant="gold">
          <ExtraStickerLogo />
          <ExtraStickerFlag src="/assets/png/flag-brazil.png" alt="Bandeira do Brasil" />
          <ExtraStickerPlayerAvatar src="/assets/png/soccer-player.png" alt="Bruno Santos" />
          <ExtraStickerPlayerName>Bruno Santos</ExtraStickerPlayerName>
        </ExtraStickerRoot>
      </div>
    </section>
  );
}
