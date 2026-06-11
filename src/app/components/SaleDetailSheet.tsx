import { useState } from "react";
import { formatCurrency } from "../lib/utils";
import { StatusBadge } from "./atoms/StatusBadge";
import { Modal } from "./molecules/Modal";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  emoji?: string;
}

interface Sale {
  id: string;
  time: Date;
  total: number;
  paymentMethod: string;
  products: Product[];
  status?: "ok" | "cancelled";
  vendorName?: string;
  amountReceived?: number;
  change?: number;
}

interface SaleDetailSheetProps {
  sale: Sale;
  onClose: () => void;
  onCancel?: (saleId: string) => void;
}

export function SaleDetailSheet({ sale, onClose, onCancel }: SaleDetailSheetProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const displayId = `V-${sale.id.substring(0, 3).toUpperCase()}`;
  const fullDate = sale.time.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const timeStr = sale.time.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const subtotal = sale.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const vendorName = sale.vendorName || "María López";

  const handleCancel = () => {
    onCancel?.(sale.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sale-detail-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col bg-card rounded-t-2xl w-full max-w-[375px] max-h-[85vh] pb-8 animate-slide-up"
      >
        {/* Handle */}
        <div className="w-9 h-1 bg-border rounded-full mx-auto mt-3" aria-hidden="true" />

        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <h3 id="sale-detail-title" className="text-base font-bold text-foreground">
              Detalle de venta
            </h3>
            <StatusBadge status={sale.status || "ok"} size="sm" showIcon={false} />
          </div>
          <p className="text-xs text-muted-foreground">
            {displayId} · {fullDate} · {timeStr} · {vendorName}
          </p>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto">
          {/* Productos */}
          <div className="p-4 pb-2">
            <h4 className="text-xs uppercase text-muted-foreground font-semibold tracking-wide mb-2">
              Productos vendidos
            </h4>

            <div>
              {sale.products.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className={`py-2.5 flex items-center justify-between ${
                    idx < sale.products.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl" aria-hidden="true">{product.emoji || "📦"}</span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        × {product.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(product.price)} c/u
                    </div>
                    <div className="text-sm font-bold text-foreground tabular-nums">
                      {formatCurrency(product.price * product.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-muted rounded-card mx-4 my-3 p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Método de pago</span>
                <span className="text-sm font-semibold">
                  {sale.paymentMethod}
                </span>
              </div>

              {sale.paymentMethod === "Efectivo" && sale.amountReceived && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monto recibido</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(sale.amountReceived)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cambio entregado</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(sale.change || 0)}
                    </span>
                  </div>
                </>
              )}

              <div className="border-t border-border mt-2 pt-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">
                  TOTAL
                </span>
                <span className="text-base font-bold text-foreground tabular-nums">
                  {formatCurrency(sale.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Auditoría */}
          <div className="p-4">
            <h4 className="text-xs uppercase text-muted-foreground font-semibold tracking-wide mb-2">
              Trazabilidad
            </h4>

            <div className="space-y-1">
              <p className="text-xs text-foreground">
                Registrada por · {vendorName}
              </p>
              <p className="text-xs text-muted-foreground">
                Timestamp · {sale.time.toISOString()}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                ID interno · {sale.id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {sale.status === "ok" ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              aria-label="Anular esta venta"
              type="button"
              className="w-full bg-destructive/10 border-2 border-destructive text-destructive rounded-card p-4 min-h-[56px] text-base font-bold transition-all hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive"
            >
              Anular venta
            </button>
          ) : (
            <div className="bg-destructive/10 text-destructive text-sm font-semibold p-2.5 rounded-card text-center">
              <span aria-hidden="true">✕</span> Esta venta fue anulada
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de anulación */}
      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        size="sm"
        showCloseButton={false}
      >
        <div className="text-center">
          <div className="text-6xl mb-4" role="img" aria-label="Advertencia">⚠️</div>
          <h3 className="text-xl font-bold text-foreground mb-4 leading-tight">
            ¿Estás seguro que deseas cancelar la venta?
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Los productos volverán al inventario y la venta se marcará como anulada. Esta acción quedará registrada en el historial.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCancel}
              aria-label="Confirmar cancelación de venta"
              type="button"
              className="w-full rounded-lg font-bold bg-destructive text-destructive-foreground min-h-[56px] px-6 py-4 transition-all hover:bg-destructive/90 focus:outline-none focus:ring-4 focus:ring-destructive/30"
            >
              Sí, cancelar la venta
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              aria-label="No cancelar venta"
              type="button"
              className="w-full rounded-lg font-semibold border-2 border-border bg-card text-foreground min-h-[56px] px-6 py-4 transition-all hover:bg-muted focus:outline-none focus:ring-4 focus:ring-border"
            >
              No, mantener venta
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
