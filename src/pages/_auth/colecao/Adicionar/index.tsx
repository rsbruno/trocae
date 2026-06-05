import { MagnifyingGlassIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Form } from "react-hook-form";
import { useEffect, useState } from "react";

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
  getCollectionStickerStatsQueryKeys,
  useGetCollectionStickerStats
} from "@/services/collections/get-sticker-collection-stats.service";
import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import {
  findAllCollectionItemsQueryKeys,
  useFindAllCollectionItems
} from "@/services/collections/find-all-collection-items.service";
import { type AddStickerFormData, STICKER_CODE_LENGTH, EMPTY_DATA, resolver } from "@/schemas/zod/add-sticker";
import { findAllPastedCollectionQueryKeys } from "@/services/collections/findall-pasted-collection.service";
import { useUpsertCollectionItemService } from "@/services/stickers/upsert-collection-item.service";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { useFindStickerByCode } from "@/services/stickers/find-sticker-by-code.service";
import { SearchInputControlled } from "@/components/ui/fields/controlled/search-input";
import { SelectFieldControlled } from "@/components/ui/fields/controlled/select-field";
import { STICKER_RARITY_OPTIONS } from "@/constants/options/sticker-rarity";
import { ButtonLabel, ButtonRoot } from "@/components/ui/button";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { PageContent } from "@/components/ui/page/content";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { useDebounce } from "@/hooks/use-debounce";
import { ShowIf } from "@/components/utils/show";
import { notify } from "@/components/ui/sonner";

import { AddStickerStatsBlockSkeleton } from "./_components/skeleton/stats-block-skeleton";

export const Route = createFileRoute("/_auth/colecao/Adicionar/")({
  component: AddStickerPage
});

function AddStickerPage() {
  const queryClient = useQueryClient();
  const { setValue, control, reset, watch } = useForm({ resolver });
  const [debouncedCode, setDebouncedCode] = useState("");
  const [codeWatch, variationWatch] = watch(["code", "variation"]);

  const debounceSearch = useDebounce(setDebouncedCode, 400);
  const stickerSearch = useFindStickerByCode(debouncedCode);
  const collectionStats = useGetCollectionStickerStats(stickerSearch.data?.id, variationWatch?.value);
  const pastedCollectionSearch = useFindAllCollectionItems({ search: debouncedCode }, { enabled: Boolean(stickerSearch.data) });
  const hasPastedInAlbum = pastedCollectionSearch.data?.some((item) => {
    return item.sticker.id === stickerSearch.data?.id && Boolean(item.pastedAt);
  });

  const upsertCollectionItem = useUpsertCollectionItemService({
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: getCollectionStickerStatsQueryKeys.all() });
      void queryClient.invalidateQueries({ queryKey: findAllCollectionItemsQueryKeys.all() });
      void queryClient.invalidateQueries({ queryKey: findAllPastedCollectionQueryKeys.all() });
      reset(EMPTY_DATA);
      setDebouncedCode("");
      notify("success", variables.pasteNow ? "Figurinha adicionada e colada no álbum." : "Figurinha adicionada à sua coleção.");
    },
    onError: (mutationError) => notify("error", mutationError.message)
  });

  useEffect(() => {
    debounceSearch((codeWatch ?? "").trim().toUpperCase());
  }, [codeWatch, debounceSearch]);

  useEffect(() => {
    if (stickerSearch.data) setValue("variation", EMPTY_DATA.variation);
  }, [stickerSearch.data, setValue]);

  const handleAddSticker = (data: AddStickerFormData, pasteNow = false) => {
    if (!stickerSearch.data) {
      return;
    }

    upsertCollectionItem.mutate({
      stickerRarity: data.variation.value,
      sticker: stickerSearch.data,
      pasteNow
    });
  };

  const handlePasteNow = () => {
    if (!stickerSearch.data || !variationWatch?.value) return;

    upsertCollectionItem.mutate({
      stickerRarity: variationWatch.value,
      sticker: stickerSearch.data,
      pasteNow: true
    });
  };

  return (
    <PageRoot subtitle="Procure pelo código da figurinha" title="Adicionar figurinha" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>

      <PageContent className="flex-1 gap-5">
        <SearchInputControlled
          placeholder="Digite o código..."
          maxLength={STICKER_CODE_LENGTH}
          label="Código da figurinha"
          className="uppercase"
          control={control}
          clearable={false}
          name="code"
        />

        <ShowIf if={debouncedCode.length === STICKER_CODE_LENGTH && stickerSearch.isFetching}>
          <div aria-label="Buscando figurinha" className="flex flex-col gap-5" aria-busy="true">
            <SelectFieldControlled
              options={STICKER_RARITY_OPTIONS}
              label="Variação da figurinha"
              placeholder="Selecione..."
              searchable={false}
              control={control}
              clearable={false}
              name="variation"
              loading
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-full max-w-[220px]">
                <ShowIf if={variationWatch?.data.layout === "player"}>
                  <StickerRoot size="album" loading />
                </ShowIf>
                <ShowIf if={variationWatch?.data.layout === "extra"}>
                  <ExtraStickerRoot
                    variant={variationWatch?.data.layout === "extra" ? variationWatch.data.variant : "normal"}
                    size="album"
                    loading
                  />
                </ShowIf>
              </div>
            </div>
            <AddStickerStatsBlockSkeleton />
            <ButtonRoot className="relative w-full" variant="primary" size="xl" skeleton />
          </div>
        </ShowIf>

        <ShowIf if={Boolean(stickerSearch.error) && !stickerSearch.isFetching}>
          <EmptyStateRoot className="py-8" tone="danger">
            <EmptyStateContent>
              <EmptyStateTitle className="text-status-danger">
                {stickerSearch.error?.message ?? "Não foi possível buscar a figurinha."}
              </EmptyStateTitle>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>

        <ShowIf
          if={
            debouncedCode.length === STICKER_CODE_LENGTH &&
            stickerSearch.isFetched &&
            !stickerSearch.isFetching &&
            !stickerSearch.data &&
            !stickerSearch.error
          }
        >
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

        <ShowIf if={debouncedCode.length === STICKER_CODE_LENGTH && Boolean(stickerSearch.data) && !stickerSearch.isFetching}>
          <SelectFieldControlled
            options={STICKER_RARITY_OPTIONS}
            label="Variação da figurinha"
            placeholder="Selecione..."
            searchable={false}
            control={control}
            clearable={false}
            name="variation"
          />

          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="w-full max-w-[220px]">
              <ShowIf if={variationWatch?.data.layout === "player"}>
                <StickerRoot data={stickerSearch.data ?? undefined} size="album">
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

              <ShowIf if={variationWatch?.data.layout === "extra"}>
                <ExtraStickerRoot
                  variant={variationWatch?.data.layout === "extra" ? variationWatch.data.variant : "normal"}
                  data={stickerSearch.data ?? undefined}
                  size="album"
                >
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
            <ShowIf if={collectionStats.isLoading}>
              <AddStickerStatsBlockSkeleton />
            </ShowIf>

            <ShowIf if={Boolean(collectionStats.error) && !collectionStats.isLoading}>
              <SurfaceCardGhost className="flex flex-col gap-3 py-4">
                <Typography variant="semibold" color="base" size="sm" as="p">
                  Na sua coleção
                </Typography>
                <Typography className="text-center" variant="medium" color="subtle" size="sm" as="p">
                  {collectionStats.error?.message ?? "Não foi possível carregar as estatísticas."}
                </Typography>
              </SurfaceCardGhost>
            </ShowIf>

            <ShowIf if={Boolean(collectionStats.data) && !collectionStats.isLoading}>
              <SurfaceCardGhost className="flex flex-col gap-3 py-4">
                <Typography variant="semibold" color="base" size="sm" as="p">
                  Na sua coleção
                </Typography>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface/70 flex flex-col items-center gap-1 rounded-lg border border-white/6 px-2 py-3">
                    <Typography variant="bold" color="base" as="span" size="xl">
                      {collectionStats.data?.ownedCount}
                    </Typography>
                    <Typography className="text-center" variant="medium" color="subtle" as="span" size="xs">
                      Nesta variação
                    </Typography>
                  </div>
                  <div className="bg-surface/70 flex flex-col items-center gap-1 rounded-lg border border-white/6 px-2 py-3">
                    <Typography variant="bold" color="base" as="span" size="xl">
                      {collectionStats.data?.ownedCountByStickerId}
                    </Typography>
                    <Typography className="text-center" variant="medium" color="subtle" as="span" size="xs">
                      Nessa categoria
                    </Typography>
                  </div>
                </div>

                <ShowIf if={collectionStats.data?.ownedCount === 0 && collectionStats.data?.ownedCountByStickerId === 0}>
                  <Typography className="text-center" variant="medium" color="subtle" size="sm" as="p">
                    Você não tem nenhuma desta.
                  </Typography>
                </ShowIf>

                <ShowIf if={collectionStats.data?.ownedCount === 0 && (collectionStats.data?.ownedCountByStickerId ?? 0) > 0}>
                  <Typography className="text-center" variant="medium" color="subtle" size="sm" as="p">
                    Você não tem nenhuma nesta variação
                  </Typography>
                </ShowIf>

                <ShowIf if={collectionStats.data?.ownedCount === 1}>
                  <Typography className="text-center" variant="medium" color="subtle" size="sm" as="p">
                    Você já tem 1 igual.
                  </Typography>
                </ShowIf>

                <ShowIf if={(collectionStats.data?.ownedCount ?? 0) > 1}>
                  <Typography className="text-center" variant="medium" color="subtle" size="sm" as="p">
                    Você já tem {collectionStats.data?.ownedCount} iguais.
                  </Typography>
                </ShowIf>
              </SurfaceCardGhost>
            </ShowIf>

            <ButtonRoot
              loading={upsertCollectionItem.isPending}
              className="relative w-full"
              variant="primary"
              type="submit"
              size="xl"
            >
              <ButtonLabel>Pegar figurinha</ButtonLabel>
            </ButtonRoot>

            <ShowIf if={!pastedCollectionSearch.isFetching && !hasPastedInAlbum}>
              <ButtonRoot
                loading={upsertCollectionItem.isPending}
                className="relative w-full"
                onClick={handlePasteNow}
                variant="secondary"
                type="button"
                size="xl"
              >
                <ButtonLabel>Colar agora</ButtonLabel>
              </ButtonRoot>
            </ShowIf>
          </Form>
        </ShowIf>

        <ShowIf if={debouncedCode.length < STICKER_CODE_LENGTH}>
          <EmptyStateRoot>
            <EmptyStateIcon>
              <PlusCircleIcon weight="duotone" />
            </EmptyStateIcon>
            <EmptyStateContent>
              <EmptyStateTitle>Busque uma figurinha</EmptyStateTitle>
              <EmptyStateDescription>Digite os {STICKER_CODE_LENGTH} caracteres do código</EmptyStateDescription>
            </EmptyStateContent>
          </EmptyStateRoot>
        </ShowIf>
      </PageContent>
    </PageRoot>
  );
}
