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
  transferApp?: string;
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
      } else if (activeFilter === "Nequi" || activeFilter === "Daviplata") {
        if (sale.paymentMethod !== "Transferencia" || sale.transferApp !== activeFilter) return false;
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
          padding: "16px 0",
          flexShrink: 0
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left-side titles unified under a single flexbox wrapper */}
          <div className="flex flex-col items-start gap-1.5">
            <button onClick={onBack} className="flex items-center gap-1">
              <ChevronLeft className="size-5" style={{ color: "rgba(255,255,255,0.85)" }} />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                Volver
              </span>
            </button>
            <div>
              <div style={{ fontWeight: 700, color: "white", marginBottom: "2px" }} className="text-lg lg:text-2xl">
                Historial de ventas
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)" }} className="text-xs lg:text-sm">
                Turno actual
              </div>
            </div>
          </div>
          
          {/* Right-side statistics blocks aligned with the text container */}
          <div className="flex gap-3 sm:gap-4 shrink-0 lg:gap-6 items-center">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 min-w-[70px] lg:min-w-[90px] lg:px-4 lg:py-2 text-center">
              <div style={{ color: "rgba(255,255,255,0.75)", textTransform: "uppercase", fontWeight: 600, marginBottom: "2px" }} className="text-[9px] lg:text-[10px]">
                Ventas OK
              </div>
              <div style={{ fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums" }} className="text-sm lg:text-base">
                {okSales.length}
              </div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 min-w-[70px] lg:min-w-[90px] lg:px-4 lg:py-2 text-center">
              <div style={{ color: "rgba(255,255,255,0.75)", textTransform: "uppercase", fontWeight: 600, marginBottom: "2px" }} className="text-[9px] lg:text-[10px]">
                Anuladas
              </div>
              <div style={{ fontWeight: 700, color: "#FF8A80", fontVariantNumeric: "tabular-nums" }} className="text-sm lg:text-base">
                {cancelledSales.length}
              </div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 min-w-[95px] lg:min-w-[120px] lg:px-4 lg:py-2 text-center">
              <div style={{ color: "rgba(255,255,255,0.75)", textTransform: "uppercase", fontWeight: 600, marginBottom: "2px" }} className="text-[9px] lg:text-[10px]">
                Total turno
              </div>
              <div style={{ fontWeight: 700, color: "#B9F6CA", fontVariantNumeric: "tabular-nums" }} className="text-sm lg:text-base">
                {formatCurrency(totalShift)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main body content container with synchronized layout bounds */}
      <div className="mx-auto w-full max-w-6xl px-4 flex-1 flex flex-col min-h-0 mt-2">
        {/* Barra de filtros */}
        <div
          style={{
            backgroundColor: "#F4F4F2",
            padding: "10px 0",
            borderBottom: "0.5px solid #E8E8E5",
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexShrink: 0
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
        <div style={{ padding: "8px 0", flexShrink: 0 }}>
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
        <div className="flex-1 overflow-y-auto pb-6">
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "14px",
            margin: "0",
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
                  transferApp={sale.transferApp}
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
