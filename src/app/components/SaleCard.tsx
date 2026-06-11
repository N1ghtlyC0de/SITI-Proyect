import { formatCurrency, formatTime } from "../lib/utils";
import { ChevronRight } from "lucide-react";

interface SaleCardProps {
  id: string;
  total: number;
  time: Date;
  itemCount: number;
  products?: any[];
  onClick?: () => void;
}

export function SaleCard({ id, total, time, itemCount, products = [], onClick }: SaleCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">{formatTime(time)}</span>
        </div>
        {products.length > 0 ? (
          <div className="space-y-0.5">
            {products.map((product, idx) => (
              <p key={`${product.id}-${idx}`} className="text-sm">
                {product.name} <span className="text-xs text-muted-foreground">x{product.quantity}</span> - {formatCurrency(product.price * product.quantity)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{itemCount} {itemCount === 1 ? "producto" : "productos"}</p>
        )}
      </div>
      <div className="text-right">
        <p className="font-semibold tabular-nums">{formatCurrency(total)}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
    </button>
  );
}
