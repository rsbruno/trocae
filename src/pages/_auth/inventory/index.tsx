import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "@phosphor-icons/react";
import { useState } from "react";

import {
  PageHeaderSubtitle,
  PageHeaderActions,
  PageHeaderAction,
  PageHeaderTitle,
  PageHeaderRoot
} from "@/components/ui/page/header";
import { TabsContent, TabsTrigger, TabsList, Tabs } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/fields/search-input";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickersTab } from "./_components/tabs/stickers-tab";
import { InventoryRepeatedTab } from "./_components/tabs/repeated-tab";

export const Route = createFileRoute("/_auth/inventory/")({
  component: InventoryPage
});

type InventoryTab = "todas" | "tenho" | "faltam" | "repetidas";

function InventoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<InventoryTab>("todas");

  const tabs: { id: InventoryTab; label: string }[] = [
    { label: "Todas", id: "todas" },
    { label: "Tenho", id: "tenho" },
    { label: "Faltam", id: "faltam" },
    { label: "Repetidas", id: "repetidas" }
  ];

  return (
    <PageRoot subtitle="218 coletadas · 47 repetidas" className="mx-auto max-w-md pb-8" title="Inventário" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
        <PageHeaderActions>
          <PageHeaderAction onClick={() => navigate({ to: "/inventory/add" })} icon={<Plus weight="bold" size={18} />} />
        </PageHeaderActions>
      </PageHeaderRoot>

      <div className="flex flex-col gap-5 px-4">
        <div className="grid grid-cols-3 gap-2">
          <ForEach
            items={[
              { color: "text-accent-primary", label: "Coletadas", value: "218" },
              { color: "text-accent-highlight", label: "Repetidas", value: "47" },
              { color: "text-ink-muted", label: "Faltando", value: "420" }
            ]}
          >
            {(summary) => (
              <SurfaceCardGhost className="flex flex-col items-center py-3" key={summary.label}>
                <Typography className={summary.color} variant="semibold" as="span" size="lg">
                  {summary.value}
                </Typography>
                <Typography variant="medium" color="subtle" as="span" size="xs">
                  {summary.label}
                </Typography>
              </SurfaceCardGhost>
            )}
          </ForEach>
        </div>

        <SearchInput placeholder="Buscar por número, nome ou país..." name="inventorySearch" />

        <Tabs onValueChange={(value) => setActiveTab(value as InventoryTab)} className="gap-4" value={activeTab}>
          <TabsList className="w-full">
            <ForEach items={tabs}>
              {(tab) => (
                <TabsTrigger className="flex-1" value={tab.id} key={tab.id}>
                  {tab.label}
                  <ShowIf if={tab.id === "repetidas"}>
                    <div className="bg-status-info ml-1 inline-block size-1.5 animate-pulse rounded-full" />
                  </ShowIf>
                </TabsTrigger>
              )}
            </ForEach>
          </TabsList>

          <TabsContent value="todas">{/* <InventoryMockList items={mockInventory} /> */}</TabsContent>
          <TabsContent value="tenho">
            <InventoryStickersTab />
          </TabsContent>
          <TabsContent value="faltam">{/* <InventoryMockList items={mockInventory.filter(i => !i.owned)} /> */}</TabsContent>
          <TabsContent value="repetidas">
            <InventoryRepeatedTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageRoot>
  );
}
