import { EmptyStateContent, EmptyStateTitle, EmptyStateRoot } from "@/components/ui/empty-state";

type InventoryTabErrorProps = {
  message: string | undefined;
  fallback: string;
};

export function InventoryTabError({ fallback, message }: InventoryTabErrorProps) {
  return (
    <EmptyStateRoot className="py-8" tone="danger">
      <EmptyStateContent>
        <EmptyStateTitle className="text-status-danger">{message ?? fallback}</EmptyStateTitle>
      </EmptyStateContent>
    </EmptyStateRoot>
  );
}
