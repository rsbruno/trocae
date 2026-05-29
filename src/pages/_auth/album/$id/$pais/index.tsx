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
    return (
      <div className="relative">
        <div className="overflow-hidden">
          <ShowIf if={sticker.layout === "extra"}>
            <ExtraStickerRoot variant={sticker.extraVariant} data={sticker.sticker} size="album">
              <ExtraStickerLogo />
              <ExtraStickerFlag />
              <ExtraStickerPlayerAvatar />
              <ExtraStickerPlayerName />
            </ExtraStickerRoot>
          </ShowIf>
          <ShowIf if={sticker.layout === "player"}>
            <StickerRoot variant={sticker.playerVariant} data={sticker.sticker} size="album">
              <StickerBackground />
              <StickerContent>
                <StickerColumn>
                  <StickerPlayerAvatar />
                  <StickerSpecContainer mode="player">
                    <StickerPlayerName />
                    <StickerPlayerStats />
                  </StickerSpecContainer>
                </StickerColumn>
                <StickerSidebar>
                  <StickerLogo />
                  <StickerSidebarGroup>
                    <StickerFlag />
                    <StickerCountryName />
                  </StickerSidebarGroup>
                </StickerSidebar>
              </StickerContent>
              <StickerSpecContainer mode="club">
                <StickerClubLabel />
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
