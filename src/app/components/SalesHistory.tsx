import { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { SaleRow } from "./SaleRow";
import { SaleDetailSheet } from "./SaleDetailSheet";
import { formatCurrency } from "../lib/utils";

interface Sale {
  id: string;
  time: Date;
  total: number;
  paymentMethod: string;
  products: any[];
  status?: "ok" | "cancelled";
  vendorName?: string;
  amountReceived?: number;
  change?: number;
}

interface SalesHistoryProps {
  sales: Sale[];
  onBack: () => void;
  onCancelSale?: (saleId: string) => void;
}

type Filter = "Todos" | "Efectivo" | "Transferencia" | "Nequi" | "Daviplata" | "Tarjeta" | "Anuladas";

export function SalesHistory({ sales, onBack, onCancelSale }: SalesHistoryProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filters: Filter[] = ["Todos", "Efectivo", "Transferencia", "Nequi", "Daviplata", "Tarjeta", "Anuladas"];

  // Filtrar ventas
  const filteredSales = sales.filter(sale => {
    // Filtro por estado/método
    if (activeFilter === "Anuladas" && sale.status !== "cancelled") return false;
    if (activeFilter !== "Todos" && activeFilter !== "Anuladas") {
      // Si el filtro es "Tarjeta", incluir tanto "Tarjeta débito" como "Tarjeta crédito"
      if (activeFilter === "Tarjeta") {
        if (!sale.paymentMethod.includes("Tarjeta")) return false;
      } else if (sale.paymentMethod !== activeFilter) {
        return false;
      }
    }

    // Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = sale.id.toLowerCase().includes(query);
      const matchesAmount = sale.total.toString().includes(query);
      const matchesProduct = sale.products.some(p => p.name.toLowerCase().includes(query));

      if (!matchesId && !matchesAmount && !matchesProduct) return false;
    }

    return true;
  });

  // Calcular totales
  const okSales = sales.filter(s => s.status !== "cancelled");
  const cancelledSales = sales.filter(s => s.status === "cancelled");
  const totalOk = okSales.reduce((sum, s) => sum + s.total, 0);
  const totalCancelled = cancelledSales.reduce((sum, s) => sum + s.total, 0);
  const totalShift = totalOk;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#F4F4F2", width: "100%" }}
    >
      {/* Header verde */}
      <div
        className="sticky top-0 z-30"
        style={{
          backgroundColor: "#2F6B3E",
          padding: "16px",
          flexShrink: 0
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="flex items-center gap-1">
            <ChevronLeft className="size-5" style={{ color: "rgba(255,255,255,0.85)" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              Volver
            </span>
          </button>
        </div>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "2px" }}>
            Historial de ventas
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
            Turno actual
          </div>
        </div>
      </div>

      {/* Barra de filtros */}
      <div
        style={{
          backgroundColor: "#F4F4F2",
          padding: "10px 16px",
          borderBottom: "0.5px solid #E8E8E5",
          overflowX: "auto",
          whiteSpace: "nowrap"
        }}
      >
        <div className="flex gap-2">
          {filters.map(filter => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  backgroundColor: isActive ? "#2F6B3E" : "#fff",
                  color: isActive ? "white" : "#3D3D3B",
                  border: isActive ? "1px solid #2F6B3E" : "1px solid #E8E8E5",
                  borderRadius: "20px",
                  padding: "5px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buscador */}
      <div style={{ padding: "8px 16px" }}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ width: "16px", height: "16px", color: "#757572" }}
            aria-hidden="true"
          />
          <label htmlFor="search-sales" className="sr-only">
            Buscar ventas
          </label>
          <input
            id="search-sales"
            type="text"
            placeholder="Buscar por ID, producto o monto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 10px 10px 36px",
              fontSize: "13px",
              borderRadius: "10px",
              border: "1px solid #E8E8E5",
              backgroundColor: "white",
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="flex-1 overflow-y-auto" style={{ marginBottom: "70px" }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "14px 14px 0 0",
          margin: "0 16px",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
        }}>
          {filteredSales.length > 0 ? (
            filteredSales.map((sale, idx) => (
              <SaleRow
                key={sale.id}
                id={sale.id}
                time={sale.time}
                total={sale.total}
                paymentMethod={sale.paymentMethod}
                products={sale.products}
                status={sale.status}
                onClick={() => setSelectedSale(sale)}
              />
            ))
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
              <div style={{ fontSize: "13px", color: "#757572" }}>
                No se encontraron ventas
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen sticky */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          backgroundColor: "#fff",
          borderTop: "0.5px solid #E8E8E5",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px"
        }}
      >
        <div className="flex-1">
          <div style={{ fontSize: "10px", color: "#757572", marginBottom: "2px" }}>
            Ventas OK
          </div>
          <div style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1A1A19",
            fontVariantNumeric: "tabular-nums"
          }}>
            {okSales.length}
          </div>
        </div>

        <div className="flex-1">
          <div style={{ fontSize: "10px", color: "#757572", marginBottom: "2px" }}>
            Anuladas
          </div>
          <div style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#B71C1C",
            fontVariantNumeric: "tabular-nums"
          }}>
            {cancelledSales.length}
          </div>
        </div>

        <div className="flex-1">
          <div style={{ fontSize: "10px", color: "#757572", marginBottom: "2px" }}>
            Total turno
          </div>
          <div style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#2F6B3E",
            fontVariantNumeric: "tabular-nums"
          }}>
            {formatCurrency(totalShift)}
          </div>
        </div>
      </div>

      {/* Modal detalle de venta */}
      {selectedSale && (
        <SaleDetailSheet
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onCancel={(saleId) => {
            onCancelSale?.(saleId);
            setSelectedSale(null);
          }}
        />
      )}
    </div>
  );
}
