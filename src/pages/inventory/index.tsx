import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownUp, Check, Hash } from "lucide-react";
import { useState } from "react";

import { SearchInputField, SearchInputIcon, SearchInputRoot } from "@/components/ui/fields/search-input";
import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { TabsTrigger, TabsList, Tabs } from "@/components/ui/tabs";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { mockInventory } from "@/mocks/inventory";
import { ShowIf } from "@/components/utils/show";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/inventory/")({
  component: InventoryPage
});

type FilterTab = "all" | "owned" | "missing" | "repeated";

function InventoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [sortAsc, setSortAsc] = useState(true);

  const tabs: { id: FilterTab; label: string }[] = [
    { label: "Todas", id: "all" },
    { label: "Tenho", id: "owned" },
    { label: "Faltam", id: "missing" },
    { label: "Repetidas", id: "repeated" }
  ];

  const filtered = mockInventory.filter((s) => {
    if (activeTab === "owned") return s.owned;
    if (activeTab === "missing") return !s.owned;
    if (activeTab === "repeated") return s.repeated > 0;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => (sortAsc ? a.number - b.number : b.number - a.number));

  return (
    <PageRoot subtitle="218 coletadas · 47 repetidas" className="mx-auto max-w-md pb-8" title="Inventário" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
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
            {(s) => (
              <SurfaceCardGhost className="flex flex-col items-center py-3" key={s.label}>
                <Typography className={s.color} variant="semibold" as="span" size="lg">
                  {s.value}
                </Typography>
                <Typography variant="medium" color="subtle" as="span" size="xs">
                  {s.label}
                </Typography>
              </SurfaceCardGhost>
            )}
          </ForEach>
        </div>

        <SearchInputRoot>
          <SearchInputIcon />
          <SearchInputField placeholder="Buscar por número, nome ou país..." />
        </SearchInputRoot>

        <div className="flex items-center gap-2">
          <Tabs onValueChange={(value) => setActiveTab(value as FilterTab)} className="flex-1" value={activeTab}>
            <TabsList className="w-full">
              <ForEach items={tabs}>
                {(tab) => (
                  <TabsTrigger className="flex-1" value={tab.id} key={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                )}
              </ForEach>
            </TabsList>
          </Tabs>
          <Button
            className="text-ink-secondary rounded-md"
            onClick={() => setSortAsc(!sortAsc)}
            variant="outline"
            type="button"
            size="icon"
          >
            <ArrowDownUp size={14} />
          </Button>
        </div>

        <Card className="flex flex-col divide-y divide-white/6 overflow-hidden p-0">
          <ForEach items={sorted}>
            {(sticker) => (
              <div className={`flex items-center gap-3 px-4 py-3.5 ${sticker.owned ? "" : "opacity-50"}`} key={sticker.number}>
                <div className="bg-surface-alt flex size-10 shrink-0 items-center justify-center rounded-md">
                  <Typography variant="medium" color="muted" as="span" size="xs">
                    {String(sticker.number).padStart(3, "0")}
                  </Typography>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Typography variant="medium" color="base" as="span" size="sm">
                      {sticker.name}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <Typography as="span">{sticker.flag}</Typography>
                    <Typography variant="medium" color="subtle" as="span" size="xs">
                      {sticker.country}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShowIf if={sticker.owned}>
                    <span className="bg-accent-primary/10 text-accent-primary flex size-7 items-center justify-center rounded-full">
                      <Check strokeWidth={2.5} size={13} />
                    </span>
                  </ShowIf>
                  <ShowIf if={!sticker.owned}>
                    <span className="bg-surface-alt text-ink-muted flex size-7 items-center justify-center rounded-full">
                      <Hash size={12} />
                    </span>
                  </ShowIf>
                </div>
              </div>
            )}
          </ForEach>
        </Card>
      </div>
    </PageRoot>
  );
}
