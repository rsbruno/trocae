import { MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useWatch, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import type { PlayerPosition } from "@/@types/sticker";
import type { Option } from "@/@types/option";

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
import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { useFindStickerByCode } from "@/services/stickers/find-sticker-by-code.service";
import { SearchInputControlled } from "@/components/ui/fields/controlled/search-input";
import { SelectFieldControlled } from "@/components/ui/fields/controlled/select-field";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { EMPTY_DATA, resolver } from "@/schemas/zod/add-sticker";
import { PageRoot } from "@/components/ui/page/root";
import { useDebounce } from "@/hooks/use-debounce";
import { ShowIf } from "@/components/utils/show";

export const Route = createFileRoute("/_auth/inventory/add/")({
  component: AddStickerPage
});

type StickerVariationType = "normal" | "extra-normal" | "extra-silver" | "extra-bronze" | "extra-gold";

const VARIATION_OPTIONS: Option<{ type: StickerVariationType }>[] = [
  { data: { type: "normal" }, label: "Normal", value: "normal" },
  { data: { type: "extra-normal" }, label: "Extra — Normal", value: "extra-normal" },
  { data: { type: "extra-silver" }, label: "Extra — Prata", value: "extra-silver" },
  { data: { type: "extra-bronze" }, label: "Extra — Bronze", value: "extra-bronze" },
  { data: { type: "extra-gold" }, label: "Extra — Ouro", value: "extra-gold" }
];

const positionVariantMap: Record<PlayerPosition, StickerVariant> = {
  CDM: "midfielder",
  CAM: "midfielder",
  GK: "goalkeeper",
  CM: "midfielder",
  CB: "defender",
  RB: "defender",
  LB: "defender",
  "": "forward",
  RW: "forward",
  LW: "forward",
  ST: "forward",
  CF: "forward"
};

function AddStickerPage() {
  const { setValue, control } = useForm({ defaultValues: { variation: EMPTY_DATA.variation, code: "BRA02" }, resolver });
  const [debouncedCode, setDebouncedCode] = useState("");

  const code = useWatch({ name: "code", control });
  const variation = useWatch({ name: "variation", control });

  const debounceSearch = useDebounce(setDebouncedCode, 400);

  const { data: found, isFetching, isFetched, error } = useFindStickerByCode(debouncedCode);

  const extraVariantByValue: Record<string, "normal" | "silver" | "bronze" | "gold"> = {
    "extra-normal": "normal",
    "extra-silver": "silver",
    "extra-bronze": "bronze",
    "extra-gold": "gold"
  };

  const isExtra = variation?.value.startsWith("extra") ?? false;
  const extraVariant = variation?.value ? (extraVariantByValue[variation.value] ?? "normal") : "normal";
  const hasMinQuery = debouncedCode.length >= 2;
  const showResult = hasMinQuery && Boolean(found);
  const showNotFound = hasMinQuery && isFetched && !isFetching && !found && !error;
  const showLoading = hasMinQuery && isFetching;
  const showEmpty = !hasMinQuery;

  useEffect(() => {
    debounceSearch((code ?? "").trim().toUpperCase());
  }, [code, debounceSearch]);

  useEffect(() => {
    if (found) {
      setValue("variation", EMPTY_DATA.variation);
    }
  }, [found, setValue]);

  const stickerVariant = found ? positionVariantMap[found.sticker.playerPosition] : "forward";

  const playerNameParts = found?.sticker.playerName.trim().split(/\s+/) ?? [];
  const lastName = playerNameParts.length > 1 ? (playerNameParts[playerNameParts.length - 1] ?? "") : (playerNameParts[0] ?? "");
  const firstName = playerNameParts.length > 1 ? playerNameParts.slice(0, -1).join(" ") : "";

  const birthDateParts = found?.sticker.birthDate.split("-") ?? [];
  const formattedBirth = birthDateParts.length === 3 ? `${birthDateParts[2]}-${birthDateParts[1]}-${birthDateParts[0]}` : "";

  const formattedHeight =
    found && found.sticker.height > 0 ? `${(found.sticker.height / 100).toFixed(2).replace(".", ",")}m` : "";
  const formattedWeight = found && found.sticker.weight > 0 ? `${found.sticker.weight}kg` : "";
  const playerStats = [formattedBirth, formattedHeight, formattedWeight].filter(Boolean).join(" | ");

  const displayFirstName = found?.sticker.type === "player" ? firstName : (found?.sticker.name ?? "");
  const displayLastName = found?.sticker.type === "player" ? lastName : "";

  return (
    <PageRoot subtitle="Procure pelo código da figurinha" className="mx-auto max-w-md pb-8" title="Adicionar figurinha" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>

      <div className="flex flex-1 flex-col gap-5 px-4">
        <SearchInputControlled
          placeholder="Digite o código..."
          label="Código da figurinha"
          className="uppercase"
          control={control}
          clearable={false}
          name="code"
        />

        <ShowIf if={showLoading}>
          <EmptyStateRoot className="py-12">
            <EmptyStateContent>
              <EmptyStateTitle>Buscando figurinha...</EmptyStateTitle>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={Boolean(error)}>
          <EmptyStateRoot className="py-8" tone="danger">
            <EmptyStateContent>
              <EmptyStateTitle className="text-status-danger">
                {error?.message ?? "Não foi possível buscar a figurinha."}
              </EmptyStateTitle>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={showNotFound}>
          <EmptyStateRoot>
            <EmptyStateIcon>
              <MagnifyingGlassIcon weight="duotone" />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyStateTitle>Figurinha não encontrada</EmptyStateTitle>
              <EmptyStateDescription>Verifique o código e tente novamente</EmptyStateDescription>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf if={showResult && !!found}>
          <SelectFieldControlled
            label="Variação da figurinha"
            options={VARIATION_OPTIONS}
            placeholder="Selecione..."
            searchable={false}
            control={control}
            clearable={false}
            name="variation"
          />

          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="w-full max-w-[220px]">
              <ShowIf if={!isExtra}>
                <StickerRoot variant={stickerVariant} size="album">
                  <StickerBackground
                    secondaryColor={found?.team?.secondaryColor ?? ""}
                    primaryColor={found?.team?.primaryColor ?? ""}
                  />
                  <StickerContent>
                    <StickerColumn>
                      <StickerPlayerAvatar alt={displayLastName || found?.sticker.name} src="/assets/png/soccer-player.png" />
                      <StickerSpecContainer mode="player">
                        <StickerPlayerName lastName={displayLastName || found?.sticker.name || ""} firstName={displayFirstName} />
                        <StickerPlayerStats>{playerStats || "—"}</StickerPlayerStats>
                      </StickerSpecContainer>
                    </StickerColumn>
                    <StickerSidebar>
                      <StickerLogo />
                      <StickerSidebarGroup>
                        <StickerFlag src={found?.team?.flag ?? ""} alt={found?.team?.name ?? ""} />
                        <StickerCountryName>{(found?.team?.fifaCode ?? "").split("").join(" ")}</StickerCountryName>
                      </StickerSidebarGroup>
                    </StickerSidebar>
                  </StickerContent>
                  <StickerSpecContainer mode="club">
                    <StickerClubLabel>{found?.sticker.currentClub || found?.team?.name}</StickerClubLabel>
                  </StickerSpecContainer>
                </StickerRoot>
              </ShowIf>

              <ShowIf if={isExtra}>
                <ExtraStickerRoot variant={extraVariant} size="album">
                  <ExtraStickerLogo />
                  <ExtraStickerFlag src={found?.team?.flag ?? ""} alt={found?.team?.name ?? ""} />
                  <ExtraStickerPlayerAvatar alt={displayLastName || found?.sticker.name} src="/assets/png/soccer-player.png" />
                  <ExtraStickerPlayerName>
                    {displayFirstName} {displayLastName}
                  </ExtraStickerPlayerName>
                </ExtraStickerRoot>
              </ShowIf>
            </div>
          </div>

          <ButtonRoot className="relative w-full" variant="primary" type="button" size="xl">
            <ButtonLabel>Pegar figurinha</ButtonLabel>
          </ButtonRoot>
        </ShowIf>

        <ShowIf if={showEmpty}>
          <EmptyStateRoot>
            <EmptyStateIcon>
              <PlusCircleIcon weight="duotone" />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyStateTitle>Busque uma figurinha</EmptyStateTitle>
              <EmptyStateDescription>Digite o código para começar</EmptyStateDescription>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>
      </div>
    </PageRoot>
  );
}
