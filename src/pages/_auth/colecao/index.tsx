import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "@phosphor-icons/react";
import { useState } from "react";

import {
  PageHeaderSubtitle,
  PageHeaderActions,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeader
} from "@/components/ui/page/header";
import { TabsContent, TabsTrigger, TabsList, Tabs } from "@/components/ui/tabs";
import { CollectionSummary } from "@/components/v2026/collections/summary";
import { SearchInput } from "@/components/ui/fields/search-input";
import { PageContent } from "@/components/ui/page/content";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickersTab } from "./_components/tabs/stickers-tab";
import { InventoryRepeatedTab } from "./_components/tabs/repeated-tab";
import { InventoryMissingTab } from "./_components/tabs/missing-tab";
import { InventoryAllTab } from "./_components/tabs/all-tab";

export const Route = createFileRoute("/_auth/colecao/")({
  component: InventoryPage
});

type InventoryTab = "todas" | "tenho" | "faltam" | "repetidas";

function InventoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<InventoryTab>("todas");
  const [search, setSearch] = useState("");

  const tabs: { id: InventoryTab; label: string }[] = [
    { label: "Todas", id: "todas" },
    { label: "Tenho", id: "tenho" },
    { label: "Faltam", id: "faltam" },
    { label: "Repetidas", id: "repetidas" }
  ];

  return (
    <PageRoot subtitle="Todas as figurinhas que você ja coletou ou ainda faltam" title="Minha coleção">
      <PageHeader>
        <PageHeaderTitle />
        <PageHeaderSubtitle />
        <PageHeaderActions>
          <PageHeaderAction onClick={() => navigate({ to: "/colecao/Adicionar" })} icon={<Plus weight="bold" size={18} />} />
        </PageHeaderActions>
      </PageHeader>

      <PageContent className="gap-5">
        <CollectionSummary />

        <SearchInput
          placeholder="Buscar por número, nome ou país..."
          name="inventorySearch"
          onChange={setSearch}
          value={search}
        />

        <Tabs onValueChange={(value) => setActiveTab(value as InventoryTab)} className="gap-4" value={activeTab}>
          <TabsList className="w-full">
            <ForEach items={tabs}>
              {(tab) => (
                <TabsTrigger className="flex-1 cursor-pointer" value={tab.id} key={tab.id}>
                  {tab.label}
                  <ShowIf if={tab.id === "repetidas"}>
                    <div className="bg-status-info ml-1 inline-block size-1.5 animate-pulse rounded-full" />
                  </ShowIf>
                </TabsTrigger>
              )}
            </ForEach>
          </TabsList>

          <TabsContent value="todas">
            <InventoryAllTab search={search} />
          </TabsContent>
          <TabsContent value="tenho">
            <InventoryStickersTab search={search} />
          </TabsContent>
          <TabsContent value="faltam">
            <InventoryMissingTab search={search} />
          </TabsContent>
          <TabsContent value="repetidas">
            <InventoryRepeatedTab search={search} />
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageRoot>
  );
}
