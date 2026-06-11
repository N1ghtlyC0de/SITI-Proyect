import { useState, useEffect, lazy, Suspense } from "react";
import { Lock, LogOut } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { SaleRow } from "./SaleRow";
import { HeaderNav } from "./HeaderNav";
import { StatusBadge } from "./molecules/StatusBadge";
import { toast } from "sonner";

const VendorSwitcher = lazy(() => import("./VendorSwitcher").then(m => ({ default: m.VendorSwitcher })));
const SaleDetailSheet = lazy(() => import("./SaleDetailSheet").then(m => ({ default: m.SaleDetailSheet })));
const CloseShiftSheet = lazy(() => import("./CloseShiftSheet").then(m => ({ default: m.CloseShiftSheet })));
const PostShiftScreen = lazy(() => import("./PostShiftScreen").then(m => ({ default: m.PostShiftScreen })));

interface Vendor {
  id: string;
  name: string;
  emoji: string;
  role: string;
  avatarColor: {
    bg: string;
    text: string;
  };
}

interface VendorHomeProps {
  sales?: any[];
  inventory?: any[];
  dailyGoal?: number;
  currentVendor: Vendor;
  vendors: Vendor[];
  onSetDailyGoal?: (goal: number) => void;
  onChangeVendor?: (vendorId: string) => void;
  onManageProfiles?: () => void;
  onOpenApiDemo?: () => void;
  onNewSale?: () => void;
  onNavigate?: (id: string) => void;
  onCancelSale?: (saleId: string) => void;
  onLogout?: () => void;
}

export function VendorHome({ sales = [], inventory = [], dailyGoal = 0, currentVendor, vendors, onSetDailyGoal, onChangeVendor, onManageProfiles, onOpenApiDemo, onNewSale, onNavigate, onCancelSale, onLogout }: VendorHomeProps) {
  const [cajaAbierta, setCajaAbierta] = useState(true);
  // Mock a shift start time to exactly 3h 24m ago for the sake of matching the prompt requirement exactly.
  // In a real app this would be part of the global state or initialized differently.
  const [shiftStartTime, setShiftStartTime] = useState<Date>(new Date(Date.now() - (3 * 3600 + 24 * 60) * 1000));
  const [durationString, setDurationString] = useState("3h 24min");

  const [businessName] = useState("Empanadas El Sabor");
  
  const [showVendorSwitcher, setShowVendorSwitcher] = useState(false); // Used only if tapping inactive hero button
  const [showCloseShiftSheet, setShowCloseShiftSheet] = useState(false);
  const [postShiftData, setPostShiftData] = useState<{
    previousVendor: Vendor;
    nextVendor: Vendor | null;
    durationString: string;
  } | null>(null);

  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [showCriticalStock, setShowCriticalStock] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());

  // Update duration string
  useEffect(() => {
    const updateDuration = () => {
      const diff = Math.floor((Date.now() - shiftStartTime.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setDurationString(`${hours}h ${minutes}min`);
    };
    updateDuration();
    const interval = setInterval(updateDuration, 60000);
    return () => clearInterval(interval);
  }, [shiftStartTime]);

  const handleVendorSelect = (id: string) => {
    const selectedVendor = vendors.find(v => v.id === id);
    if (selectedVendor && id !== currentVendor.id) {
      onChangeVendor?.(id);
      setCajaAbierta(true);
      setShiftStartTime(new Date()); // reset timer
      setShowVendorSwitcher(false);

      toast.success(`✓ Turno cambiado a ${selectedVendor.name}`, {
        duration: 3000,
        style: {
          backgroundColor: "#E8F5EE",
          color: "#2F6B3E",
          borderLeft: "3px solid #2F6B3E",
          fontWeight: 600
        }
      });
    } else {
      setShowVendorSwitcher(false);
    }
  };

  const handleConfirmCloseShift = (nextVendorId: string | null, note: string) => {
    const nextVendor = nextVendorId ? vendors.find(v => v.id === nextVendorId) || null : null;
    
    setShowCloseShiftSheet(false);
    setPostShiftData({
      previousVendor: currentVendor,
      nextVendor,
      durationString
    });

    if (note) {
      console.log("Nota del turno guardada:", note);
    }
  };

  const handlePostShiftContinue = () => {
    if (postShiftData?.nextVendor) {
      onChangeVendor?.(postShiftData.nextVendor.id);
      setCajaAbierta(true);
      setShiftStartTime(new Date());
    } else {
      setCajaAbierta(false);
    }
    setPostShiftData(null);
  };

  // Cálculo de métricas
  const validSales = sales.filter(s => s.status !== "cancelled");
  const totalVendido = validSales.reduce((sum, sale) => sum + sale.total, 0);
  const ventasRealizadas = validSales.length;
  const costoTotal = validSales.reduce((sum, sale) => {
    return sum + sale.products.reduce((pSum: number, p: any) => pSum + (p.price * 0.3 * p.quantity), 0);
  }, 0);
  const utilidad = totalVendido - costoTotal;

  const ultimasVentas = sales.slice(0, 4);

  // Alertas: solo mostrar las que aplican
  const inventoryLowItems = inventory.filter(item => item.status === "critical").length;
  const hasAlerts = inventoryLowItems > 0 || totalVendido === 0;

  if (postShiftData) {
    return (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
        <PostShiftScreen
          previousVendor={postShiftData.previousVendor}
          nextVendor={postShiftData.nextVendor}
          validSales={validSales}
          durationString={postShiftData.durationString}
          onContinue={handlePostShiftContinue}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted" style={{ width: "100%" }}>
      {/* 1. Status Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 bg-primary text-primary-foreground flex-shrink-0 w-full"
        style={{ height: "64px" }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div
            className="size-1.5 rounded-full shrink-0"
            style={{ backgroundColor: "#4ADE80" }}
            role="status"
            aria-label="Sistema en línea"
          />
          <div className="min-w-0 hidden sm:block">
            <div className="text-sm font-bold leading-tight truncate">
              SITI
            </div>
            <div className="text-xs opacity-90 leading-tight text-white truncate">
              {businessName} · {currentVendor.name}
            </div>
          </div>
        </div>

        {/* Center Section - Navigation */}
        <div className="flex justify-center shrink-0 mx-2">
          <HeaderNav active="home" onNavigate={onNavigate} />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-1.5 flex-1">
          <StatusBadge status="success" label="En línea" className="hidden lg:inline-flex" />
          <StatusBadge 
            status={cajaAbierta ? "success" : "error"} 
            label={cajaAbierta ? "Caja abierta" : "Caja cerrada"} 
            className="hidden lg:inline-flex"
            aria-label={cajaAbierta ? "Caja abierta" : "Caja cerrada"}
            role="status"
          />
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shrink-0"
            aria-label="Cerrar sesión"
            type="button"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-10 pt-0">
        {/* 2. Hero Button */}
        <div className="mx-4 my-3.5">
          <button
            onClick={cajaAbierta ? onNewSale : () => setShowVendorSwitcher(true)}
            aria-label={cajaAbierta ? "Iniciar nueva venta" : "Activar sistema"}
            type="button"
            className={`w-full flex items-center justify-between transition-all active:scale-98 focus:outline-none focus:ring-4 rounded-2xl min-h-[80px] px-6 py-4 border-2 border-transparent ${
              cajaAbierta
                ? "bg-primary text-primary-foreground shadow-lg focus:ring-primary/30"
                : "bg-foreground text-background shadow-md focus:ring-foreground/30"
            }`}
          >
            <div className="text-left">
              <div className="text-xl font-bold leading-tight mb-1">
                {cajaAbierta ? "Nueva venta" : "Sistema en reposo"}
              </div>
              <div className="text-sm opacity-90 leading-snug">
                {cajaAbierta ? "Registra una nueva transacción" : "Toca para activar"}
              </div>
            </div>
            {cajaAbierta ? (
              <span className="text-4xl" aria-hidden="true">🛒</span>
            ) : (
              <div className="flex items-center justify-center bg-white/15 size-12 rounded-xl">
                <Lock className="size-6" aria-hidden="true" />
              </div>
            )}
          </button>
        </div>

        {/* 3. Stats Row */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:gap-3">
            <div className="bg-card rounded-card p-3 shadow-sm">
              <div className="text-xs uppercase text-muted-foreground mb-1 tracking-wide font-semibold">
                VENDIDO
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                ${(totalVendido / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(totalVendido)}
              </div>
            </div>

            <div className="bg-card rounded-card p-3 shadow-sm">
              <div className="text-xs uppercase text-muted-foreground mb-1 tracking-wide font-semibold">
                VENTAS
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {ventasRealizadas}
              </div>
              <div className="text-xs text-muted-foreground">
                registradas
              </div>
            </div>

            <div className="bg-card rounded-card p-3 shadow-sm">
              <div className="text-xs uppercase text-muted-foreground mb-1 tracking-wide font-semibold">
                UTILIDAD
              </div>
              <div
                className={`text-lg font-bold tabular-nums ${
                  utilidad > 0 ? "text-success" : utilidad < 0 ? "text-destructive" : "text-foreground"
                }`}
              >
                ${(utilidad / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(utilidad)}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Alerts and Goal */}
        <div className="px-4 mb-4">
          <div className="space-y-2">
            {/* Meta Diaria */}
            <div className="bg-card rounded-card p-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                  Meta Diaria
                </h2>
                {currentVendor.role === "Administrador" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenApiDemo}
                      className="text-xs text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-1"
                      type="button"
                      aria-label="Abrir demostración de integración API"
                    >
                      API demo
                    </button>
                    {isEditingGoal ? (
                      <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newGoal = parseFloat(goalInput);
                          if (!isNaN(newGoal) && newGoal >= 0) {
                            onSetDailyGoal?.(newGoal);
                          } else {
                            toast.error("La meta diaria no puede ser negativa.");
                            setGoalInput(dailyGoal.toString());
                            setIsEditingGoal(false);
                            return;
                          }
                          setIsEditingGoal(false);
                        }}
                        className="text-xs text-success font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-1 rounded px-1"
                        type="button"
                        aria-label="Guardar meta diaria"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setGoalInput(dailyGoal.toString());
                          setIsEditingGoal(false);
                        }}
                        className="text-xs text-destructive font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1 rounded px-1"
                        type="button"
                        aria-label="Cancelar edición"
                      >
                        Cancelar
                      </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditingGoal(true)}
                        className="text-xs text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-1"
                        type="button"
                        aria-label="Editar meta diaria"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {isEditingGoal ? (
                <input
                  type="number"
                  min="0"
                  value={goalInput}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val < 0) return;
                    setGoalInput(e.target.value);
                  }}
                  className="w-full p-2 rounded-lg border border-border text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  aria-label="Meta Diaria"
                />
              ) : (
                <>
                  <div className="flex items-end gap-2 mb-2">
                    <div className="text-xl font-bold text-foreground tabular-nums">
                      {formatCurrency(totalVendido)}
                    </div>
                    <div className="text-xs text-muted-foreground pb-0.5">
                      de {formatCurrency(dailyGoal)}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (totalVendido / (dailyGoal || 1)) * 100)}%`
                      }}
                      role="progressbar"
                      aria-valuenow={totalVendido}
                      aria-valuemin={0}
                      aria-valuemax={dailyGoal}
                      aria-label={`Progreso de meta diaria: ${formatCurrency(totalVendido)} de ${formatCurrency(dailyGoal)}`}
                    />
                  </div>
                </>
              )}
            </div>

            {hasAlerts && (
              <>
                {inventoryLowItems > 0 && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowCriticalStock(!showCriticalStock)}
                      className="bg-warning/10 border-l-4 border-warning rounded-card p-2.5 text-sm text-warning font-medium text-left w-full transition-colors hover:bg-warning/20 focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-1"
                      type="button"
                      aria-expanded={showCriticalStock}
                      aria-controls={showCriticalStock ? "critical-stock-list" : undefined}
                    >
                      ⚠️ Hay {inventoryLowItems} producto{inventoryLowItems > 1 ? "s" : ""} con stock crítico
                    </button>
                    {showCriticalStock && (
                      <div
                        id="critical-stock-list"
                        className="space-y-2 pl-3"
                        role="region"
                        aria-label="Lista de productos con stock crítico"
                      >
                        {inventory.filter(item => item.status === "critical").map(item => (
                          <div
                            key={item.id}
                            className="bg-card rounded-lg p-2 text-xs flex justify-between border border-warning/20 shadow-sm"
                          >
                            <span className="text-foreground font-medium">{item.name}</span>
                            <span className="text-warning font-bold">{item.stock} uds</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {totalVendido === 0 && (
                  <div
                    className="bg-destructive/10 border-l-4 border-destructive rounded-card p-2.5 text-sm text-destructive font-medium"
                    role="alert"
                    aria-live="polite"
                  >
                    ⛔ No hay ventas registradas hoy
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 5. Últimas ventas */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
              Últimas ventas
            </h2>
            <button
              onClick={() => onNavigate?.("sales-history")}
              className="text-xs text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-1"
              type="button"
              aria-label="Ver historial completo de ventas"
            >
              Ver todo
            </button>
          </div>

          {ultimasVentas.length > 0 ? (
            <div className="bg-card rounded-card overflow-hidden shadow-sm">
              {ultimasVentas.map((sale) => (
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
                No hay ventas registradas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Shift Bar */}
      <div
        className="sticky bottom-0 bg-card border-t border-border py-1.5 px-4 flex items-center justify-between z-30"
        role="contentinfo"
        aria-label="Información de turno actual"
      >
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">{currentVendor.emoji}</span>
          <div>
            <div className="text-sm font-bold text-foreground leading-tight">
              {currentVendor.name}
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              Turno: {durationString}
            </div>
          </div>
        </div>

        {cajaAbierta && (
          <button
            onClick={() => setShowCloseShiftSheet(true)}
            className="bg-card border border-border rounded-lg px-3 py-1 text-xs font-semibold text-foreground flex items-center gap-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1"
            type="button"
            aria-label="Cerrar turno actual"
          >
            <span aria-hidden="true">✕</span> Cerrar turno
          </button>
        )}
      </div>

      <Suspense fallback={null}>
        {showCloseShiftSheet && (
          <CloseShiftSheet
            currentVendor={currentVendor}
            vendors={vendors}
            validSales={validSales}
            durationString={durationString}
            // Mock 2 pending offline sales for demonstration, normally this would come from real offline store.
            pendingOfflineSales={2} 
            onClose={() => setShowCloseShiftSheet(false)}
            onConfirm={handleConfirmCloseShift}
          />
        )}

        {showVendorSwitcher && (
          <VendorSwitcher
            vendors={vendors}
            currentVendorId={currentVendor.id}
            currentVendorName={currentVendor.name}
            onSelect={handleVendorSelect}
            onManageProfiles={() => {
              setShowVendorSwitcher(false);
              onManageProfiles?.();
            }}
            onClose={() => setShowVendorSwitcher(false)}
          />
        )}

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
      </Suspense>

    </div>
  );
}
