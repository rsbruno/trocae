import { MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { useWatch, useForm, Form } from "react-hook-form";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { StickerRarity } from "@/@types/sticker";
import type { Option } from "@/@types/option";

import {
  StickerSpecContainer,
  StickerPlayerAvatar,
  StickerSidebarGroup,
  StickerCountryName,
  StickerPlayerStats,
  StickerBackground,
  StickerPlayerName,
  StickerTeamLabel,
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
import { useUpsertCollectionItemService } from "@/services/stickers/upsert-collection-item.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { type AddStickerFormData, EMPTY_DATA, resolver } from "@/schemas/zod/add-sticker";
import { useFindStickerByCode } from "@/services/stickers/find-sticker-by-code.service";
import { SearchInputControlled } from "@/components/ui/fields/controlled/search-input";
import { SelectFieldControlled } from "@/components/ui/fields/controlled/select-field";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { PageRoot } from "@/components/ui/page/root";
import { useDebounce } from "@/hooks/use-debounce";
import { ShowIf } from "@/components/utils/show";
import { notify } from "@/components/ui/sonner";

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

const variationToStickerRarity: Record<StickerVariationType, StickerRarity> = {
  "extra-normal": "normal",
  "extra-silver": "silver",
  "extra-bronze": "bronze",
  "extra-gold": "gold",
  normal: "normal"
};

function AddStickerPage() {
  const { setValue, control, reset } = useForm({ resolver });
  const [debouncedCode, setDebouncedCode] = useState("");

  const code = useWatch({ name: "code", control });
  const variation = useWatch({ name: "variation", control });

  const debounceSearch = useDebounce(setDebouncedCode, 400);

  const { data: found, isFetching, isFetched, error } = useFindStickerByCode(debouncedCode);

  const upsertCollectionItem = useUpsertCollectionItemService({
    onSuccess: () => {
      reset(EMPTY_DATA);
      setDebouncedCode("");
      notify("success", "Figurinha adicionada à sua coleção.");
    },
    onError: (mutationError) => notify("error", mutationError.message)
  });

  const isSubmitting = upsertCollectionItem.isPending;

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

  const handleAddSticker = (data: AddStickerFormData) => {
    if (!found) {
      return;
    }

    upsertCollectionItem.mutate({
      stickerRarity: variationToStickerRarity[data.variation.data.type],
      sticker: found
    });
  };

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

        {showResult && found ? (
          <>
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
                  <StickerRoot data={found} size="album">
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
                      <StickerTeamLabel />
                    </StickerSpecContainer>
                  </StickerRoot>
                </ShowIf>

                <ShowIf if={isExtra}>
                  <ExtraStickerRoot variant={extraVariant} data={found} size="album">
                    <ExtraStickerLogo />
                    <ExtraStickerFlag />
                    <ExtraStickerPlayerAvatar />
                    <ExtraStickerPlayerName />
                  </ExtraStickerRoot>
                </ShowIf>
              </div>
            </div>

            <Form
              onSubmit={({ data }) => handleAddSticker(data)}
              className="flex w-full flex-col gap-4"
              control={control}
              noValidate
            >
              <ButtonRoot className="relative w-full" disabled={isSubmitting} variant="primary" type="submit" size="xl">
                <ButtonLabel>{isSubmitting ? "Adicionando..." : "Pegar figurinha"}</ButtonLabel>
              </ButtonRoot>
            </Form>
          </>
        ) : null}

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
