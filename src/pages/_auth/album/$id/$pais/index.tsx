import { createFileRoute } from "@tanstack/react-router";

import {
  StickerSpecContainer,
  StickerPlayerAvatar,
  StickerSidebarGroup,
  type StickerVariant,
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
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { PageRoot } from "@/components/ui/page/root";
import { ShowIf } from "@/components/utils/show";
import { paisStickers } from "@/mocks/pais";

export const Route = createFileRoute("/_auth/album/$id/$pais/")({
  component: RouteComponent
});

function RouteComponent() {
  const stickers = paisStickers;

  const renderStickerTile = (sticker: (typeof stickers)[number]) => {
    const avatar = (sticker as { avatar?: string }).avatar;

    return (
      <div className="relative">
        <div className="overflow-hidden">
          <ShowIf if={sticker.type === "extra"}>
            <ExtraStickerRoot variant={sticker.variant as "normal" | "silver" | "bronze" | "gold"} size="album">
              <ExtraStickerLogo />
              <ExtraStickerFlag src={sticker.flag ?? "/assets/png/flag-brazil.png"} alt="" />
              <ExtraStickerPlayerAvatar src={avatar ?? "/assets/png/soccer-player.png"} alt={sticker.lastName ?? "Jogador"} />
              <ExtraStickerPlayerName>
                {sticker.firstName} {sticker.lastName}
              </ExtraStickerPlayerName>
            </ExtraStickerRoot>
          </ShowIf>
          <ShowIf if={sticker.type === "player"}>
            <StickerRoot variant={sticker.variant as StickerVariant} size="album">
              <StickerBackground
                primaryColor={sticker.primaryColor ?? "var(--accent-primary-strong)"}
                secondaryColor={sticker.secondaryColor ?? "var(--accent-highlight)"}
              />
              <StickerContent>
                <StickerColumn>
                  <StickerPlayerAvatar src={avatar ?? "/assets/png/soccer-player.png"} alt={sticker.lastName ?? "Jogador"} />
                  <StickerSpecContainer mode="player">
                    <StickerPlayerName lastName={sticker.lastName ?? "sobrenome"} firstName={sticker.firstName ?? "nome"} />
                    <StickerPlayerStats>{sticker.stats ?? "—"}</StickerPlayerStats>
                  </StickerSpecContainer>
                </StickerColumn>
                <StickerSidebar>
                  <StickerLogo />
                  <StickerSidebarGroup>
                    <StickerFlag src={sticker.flag ?? "/assets/png/flag-brazil.png"} alt="" />
                    <StickerCountryName>{(sticker.countryCode ?? "BRA").split("").join(" ")}</StickerCountryName>
                  </StickerSidebarGroup>
                </StickerSidebar>
              </StickerContent>
              <StickerSpecContainer mode="club">
                <StickerClubLabel>{sticker.club ?? "Clube do jogador"}</StickerClubLabel>
              </StickerSpecContainer>
            </StickerRoot>
          </ShowIf>
        </div>
      </div>
    );
  };

  return (
    <PageRoot className="mx-auto max-w-md pb-6" subtitle="Seleção Brasileira" title="Brasil" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>
      <div className="grid grid-cols-2">
        {renderStickerTile(stickers[0])}
        {renderStickerTile(stickers[1])}
      </div>
    </PageRoot>
  );
}
