import { ArrowsLeftRight, PaperPlaneTilt, Sparkle, Plus } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeaderSubtitle, PageHeaderTitle, PageHeaderRoot } from "@/components/ui/page/header";
import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { wishlistItems, tradeHistory, tradeOffers } from "@/mocks/trades";
import { TabsTrigger, TabsList, Tabs } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/fields/search-input";
import { Typography } from "@/components/ui/typography";
import { PageRoot } from "@/components/ui/page/root";
import { ForEach } from "@/components/utils/foreach";
import { ButtonRoot } from "@/components/ui/button";
import { ShowIf } from "@/components/utils/show";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/trades/")({
  component: TradesPage
});

type Tab = "wishlist" | "offers" | "history";

function TradesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("wishlist");

  const tabs: { id: Tab; label: string }[] = [
    { label: "Wishlist", id: "wishlist" },
    { label: "Ofertas", id: "offers" },
    { label: "Histórico", id: "history" }
  ];

  return (
    <PageRoot className="mx-auto max-w-md pb-8" subtitle="2 ofertas pendentes" title="Trocas" showBack>
      <PageHeaderRoot>
        <div className="min-w-0 flex-1">
          <PageHeaderTitle />
          <PageHeaderSubtitle />
        </div>
      </PageHeaderRoot>
      <div className="flex flex-col gap-5 px-4">
        <Tabs onValueChange={(value) => setActiveTab(value as Tab)} value={activeTab}>
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

        <ShowIf if={activeTab === "wishlist"}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography color="subtle" as="span" size="sm">
                {wishlistItems.length} desejadas
              </Typography>
              <ButtonRoot className="gap-1.5 rounded-md px-3.5 py-2 text-xs active:scale-[0.98] active:opacity-90" type="button">
                <Plus weight="bold" size={13} />
                <Typography variant="semibold" color="inverse" as="span" size="xs">
                  Adicionar
                </Typography>
              </ButtonRoot>
            </div>
            <SearchInput placeholder="Buscar na wishlist..." name="wishlistSearch" />
            <div className="flex flex-col gap-2">
              <ForEach items={wishlistItems}>
                {(item) => (
                  <SurfaceCardGhost className="flex items-center gap-3 px-4 py-3" key={item.number}>
                    <div className="border-border bg-surface-alt flex size-10 items-center justify-center border">
                      <Typography variant="medium" color="muted" as="span" size="xs">
                        {String(item.number).padStart(3, "0")}
                      </Typography>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <Typography variant="medium" color="base" as="span" size="sm">
                          {item.name}
                        </Typography>
                        <ShowIf if={item.rarity === "rare"}>
                          <Typography color="highlight" as="span">
                            ★
                          </Typography>
                        </ShowIf>
                        <ShowIf if={item.rarity === "holographic"}>
                          <Sparkle className="text-accent-highlight" weight="fill" size={10} />
                        </ShowIf>
                      </div>
                      <Typography variant="medium" color="subtle" as="span" size="xs">
                        {item.flag} {item.country}
                      </Typography>
                    </div>
                    <ButtonRoot className="rounded-md px-3 py-1.5" variant="link" type="button" size="sm">
                      <Typography variant="medium" color="muted" as="span" size="xs">
                        Procurar
                      </Typography>
                    </ButtonRoot>
                  </SurfaceCardGhost>
                )}
              </ForEach>
            </div>
          </div>
        </ShowIf>

        <ShowIf if={activeTab === "offers"}>
          <div className="flex flex-col gap-3">
            <ForEach items={tradeOffers}>
              {(offer) => (
                <SurfaceCardRoot key={offer.id}>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary flex size-8 items-center justify-center border text-xs font-semibold">
                      {offer.avatar}
                    </div>
                    <Typography variant="medium" color="base" as="span" size="sm">
                      {offer.user}
                    </Typography>
                    <span
                      className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${offer.status === "pending" ? "bg-accent-highlight/10 text-accent-highlight" : "bg-accent-primary/10 text-accent-primary"}`}
                    >
                      <Typography
                        color={offer.status === "pending" ? "highlight" : "accent"}
                        variant="medium"
                        as="span"
                        size="xs"
                      >
                        {offer.status === "pending" ? "Pendente" : "Aceita"}
                      </Typography>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-alt flex-1 rounded-lg py-2.5 text-center">
                      <Typography variant="medium" color="subtle" size="xs" as="p">
                        Oferece
                      </Typography>
                      <Typography variant="semibold" color="accent" as="p">
                        #{String(offer.offering.number).padStart(3, "0")}
                      </Typography>
                      <Typography variant="medium" color="muted" size="xs" as="p">
                        {offer.offering.name}
                      </Typography>
                    </div>
                    <ArrowsLeftRight className="text-ink-muted" weight="regular" size={16} />
                    <div className="bg-surface-alt flex-1 rounded-lg py-2.5 text-center">
                      <Typography variant="medium" color="subtle" size="xs" as="p">
                        Quer
                      </Typography>
                      <Typography variant="semibold" color="highlight" as="p">
                        #{String(offer.requesting.number).padStart(3, "0")}
                      </Typography>
                      <Typography variant="medium" color="muted" size="xs" as="p">
                        {offer.requesting.name}
                      </Typography>
                    </div>
                  </div>
                  <ShowIf if={offer.status === "pending"}>
                    <div className="mt-3 flex gap-2">
                      <ButtonRoot className="flex-1 rounded-md py-2.5 active:scale-[0.98] active:opacity-90" type="button">
                        <Typography variant="medium" color="inverse" as="span" size="sm">
                          Aceitar
                        </Typography>
                      </ButtonRoot>
                      <ButtonRoot className="flex-1 rounded-md py-2.5" variant="secondary" type="button">
                        <Typography variant="medium" color="muted" as="span" size="sm">
                          Recusar
                        </Typography>
                      </ButtonRoot>
                    </div>
                  </ShowIf>
                </SurfaceCardRoot>
              )}
            </ForEach>
          </div>
        </ShowIf>

        <ShowIf if={activeTab === "history"}>
          <div className="flex flex-col gap-2">
            <ForEach items={tradeHistory}>
              {(trade, props) => (
                <Card className="flex items-center gap-3 rounded-lg px-3 py-3" key={props?.index}>
                  <span
                    className={`flex size-9 items-center justify-center border ${
                      trade.success ? "bg-accent-primary/10 text-accent-primary" : "bg-status-danger/10 text-status-danger"
                    }`}
                  >
                    {trade.success ? (
                      <ArrowsLeftRight weight="regular" size={14} />
                    ) : (
                      <PaperPlaneTilt weight="regular" size={14} />
                    )}
                  </span>
                  <div className="flex-1">
                    <Typography variant="medium" color="base" size="sm" as="p">
                      {trade.success ? `Troca com ${trade.user}` : "Oferta recusada"}
                    </Typography>
                    <Typography variant="medium" color="subtle" size="xs" as="p">
                      {trade.gave} → {trade.received}
                    </Typography>
                  </div>
                  <Typography variant="medium" color="subtle" as="span" size="xs">
                    {trade.date}
                  </Typography>
                </Card>
              )}
            </ForEach>
          </div>
        </ShowIf>
      </div>
    </PageRoot>
  );
}
