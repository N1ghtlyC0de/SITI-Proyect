import { ChevronRight } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { StatusBadge } from "./atoms/StatusBadge";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  emoji?: string;
}

interface SaleRowProps {
  id: string;
  time: Date;
  total: number;
  paymentMethod: string;
  products: Product[];
  status?: "ok" | "cancelled";
  onClick?: () => void;
}

export function SaleRow({ id, time, total, paymentMethod, products, status = "ok", onClick }: SaleRowProps) {
  const displayId = `V-${id}`;
  const timeStr = time.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  // Mostrar máximo 3 productos, si hay más agregar "+ X más"
  const visibleProducts = products.slice(0, 3);
  const remainingCount = products.length - 3;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 border-b border-border transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset min-h-[44px]"
      type="button"
      aria-label={`Venta ${displayId}, ${formatCurrency(total)}, ${timeStr}, ${status === "cancelled" ? "anulada" : "completada"}`}
    >
      {/* Fila superior */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1 flex-1">
          <span className="text-xs font-semibold text-foreground">
            {displayId}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {timeStr}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {paymentMethod}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatCurrency(total)}
          </span>
          <StatusBadge status={status} size="sm" showIcon={false} />
          <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      {/* Fila inferior - Productos */}
      <div className="flex flex-wrap gap-1.5">
        {visibleProducts.map((product, idx) => (
          <span
            key={`${product.id}-${idx}`}
            className="bg-muted rounded-md px-2 py-0.5 text-xs text-muted-foreground"
          >
            <span aria-hidden="true">{product.emoji}</span> {product.name} ×{product.quantity}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="bg-muted-foreground/10 rounded-md px-2 py-0.5 text-xs text-foreground font-semibold">
            + {remainingCount} más
          </span>
        )}
      </div>
    </button>
  );
}
