import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { Minus, Plus, Search, LogOut } from "lucide-react";
import { Vendor } from "../App";
import { SaleRow } from "./SaleRow";
import { toast } from "sonner";
import { closeShift } from "../services/fastapi";

const SaleDetailSheet = lazy(() => import("./SaleDetailSheet").then(m => ({ default: m.SaleDetailSheet })));
const CloseShiftSheet = lazy(() => import("./CloseShiftSheet").then(m => ({ default: m.CloseShiftSheet })));
const PostShiftScreen = lazy(() => import("./PostShiftScreen").then(m => ({ default: m.PostShiftScreen })));

interface VendorSimpleViewProps {
  sales: any[];
  currentVendor: Vendor;
  vendors: Vendor[];
  onNewSale: () => void;
  onCancelSale: (saleId: string) => void;
  onChangeVendor: (vendorId: string) => void;
  onLogout: () => void;
}

export function VendorSimpleView({
  sales,
  currentVendor,
  vendors,
  onNewSale,
  onCancelSale,
  onChangeVendor,
  onLogout
}: VendorSimpleViewProps) {
  const [shiftStartTime] = useState<Date>(new Date());
  const [durationString, setDurationString] = useState("0h 0min");
  const [showCloseShiftSheet, setShowCloseShiftSheet] = useState(false);
  const [postShiftData, setPostShiftData] = useState<{
    previousVendor: Vendor;
    nextVendor: Vendor | null;
    durationString: string;
  } | null>(null);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);

  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - shiftStartTime.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setDurationString(`${hours}h ${minutes}min`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [shiftStartTime]);

  // Only show this vendor's own sales
  const myAllSales = sales.filter(s => s.vendorName === currentVendor.name);
  const myValidSales = myAllSales.filter(s => s.status !== "cancelled");
  const recentSales = myAllSales.slice(0, 10);

  const handleConfirmCloseShift = async (nextVendorId: string | null, note: string) => {
    const nextVendor = nextVendorId ? vendors.find(v => v.id === nextVendorId) || null : null;
    
    try {
      await closeShift("current", {
        status: "closed",
        note: note,
        vendorName: currentVendor.name
      });
    } catch (e) {
      console.error("Failed to close shift on backend", e);
    }

    setShowCloseShiftSheet(false);
    setPostShiftData({ previousVendor: currentVendor, nextVendor, durationString });
    if (note) console.log("Nota del turno:", note);
  };

  const handlePostShiftContinue = () => {
    if (postShiftData?.nextVendor) {
      onChangeVendor(postShiftData.nextVendor.id);
      toast.success(`✓ Turno pasado a ${postShiftData.nextVendor.name}`, {
        duration: 3000,
        style: { backgroundColor: "#E8F5EE", color: "#2F6B3E", borderLeft: "3px solid #2F6B3E", fontWeight: 600 }
      });
    } else {
      onLogout();
    }
    setPostShiftData(null);
  };

  if (postShiftData) {
    return (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
        <PostShiftScreen
          previousVendor={postShiftData.previousVendor}
          nextVendor={postShiftData.nextVendor}
          validSales={myValidSales}
          durationString={postShiftData.durationString}
          onContinue={handlePostShiftContinue}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted" style={{ width: "100%" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 bg-primary text-primary-foreground flex-shrink-0"
        style={{ height: "52px" }}
        role="banner"
      >
        <div className="flex items-center gap-2">
          <div
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "#4ADE80" }}
            role="status"
            aria-label="Sistema en línea"
          />
          <div>
            <div className="text-sm font-bold leading-tight">SITI</div>
            <div className="text-xs opacity-90 leading-tight text-white">
              Empanadas El Sabor · {currentVendor.name} · {currentVendor.role}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="bg-white/30 text-white rounded-full px-2.5 py-1 text-xs font-medium">
            En línea
          </span>
          <span className="text-xs text-white font-medium bg-white/10 px-2 py-1 rounded-md shrink-0">
            Turno: {durationString}
          </span>
          <button
            onClick={() => setShowCloseShiftSheet(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center gap-1 shrink-0"
            type="button"
            aria-label="Cerrar turno actual"
          >
            <span aria-hidden="true">✕</span> Cerrar turno
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar sesión"
            type="button"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto pb-20">
        {/* Hero Button */}
        <div className="mx-4 my-3.5">
          <button
            onClick={onNewSale}
            type="button"
            aria-label="Iniciar nueva venta"
            className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl min-h-[80px] px-6 py-4 shadow-lg border-2 border-transparent transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary/30"
          >
            <div className="text-left">
              <div className="text-xl font-bold leading-tight mb-1">Nueva venta</div>
              <div className="text-sm opacity-90 leading-snug">
                Registra una nueva transacción
              </div>
            </div>
            <span className="text-4xl" role="img" aria-label="Carrito">🛒</span>
          </button>
        </div>

        {/* My shift summary — no global revenue, just count + duration */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-3">
            <div className="bg-card rounded-card p-3 shadow-sm">
              <div className="text-xs uppercase text-muted-foreground mb-1 tracking-wide font-semibold">
                MIS VENTAS
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {myValidSales.length}
              </div>
              <div className="text-xs text-muted-foreground">este turno</div>
            </div>

            <div className="bg-card rounded-card p-3 shadow-sm">
              <div className="text-xs uppercase text-muted-foreground mb-1 tracking-wide font-semibold">
                MI TURNO
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {durationString}
              </div>
              <div className="text-xs text-muted-foreground">activo</div>
            </div>
          </div>
        </div>

        {/* My sales list */}
        <div className="px-4 mb-4">
          <h2 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-3">
            Mis ventas del turno
          </h2>

          {recentSales.length > 0 ? (
            <div className="bg-card rounded-card overflow-hidden shadow-sm">
              {recentSales.map(sale => (
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
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-card p-8 text-center shadow-sm">
              <div className="text-4xl mb-2" role="img" aria-label="Sin ventas">📋</div>
              <p className="text-sm text-muted-foreground">
                No has registrado ventas aún
              </p>
            </div>
          )}
        </div>
      </div>



      <Suspense fallback={null}>
        {showCloseShiftSheet && (
          <CloseShiftSheet
            currentVendor={currentVendor}
            vendors={vendors}
            validSales={myValidSales}
            durationString={durationString}
            pendingOfflineSales={0}
            onClose={() => setShowCloseShiftSheet(false)}
            onConfirm={handleConfirmCloseShift}
          />
        )}

        {selectedSale && (
          <SaleDetailSheet
            sale={selectedSale}
            onClose={() => setSelectedSale(null)}
            onCancel={(saleId) => {
              onCancelSale(saleId);
              setSelectedSale(null);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
