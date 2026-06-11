import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  TrendingUp,
  Package,
  Target,
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  X,
  Calculator
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { BottomNav } from "./BottomNav";
import { KPICard } from "./molecules/KPICard";
import { Modal } from "./molecules/Modal";

interface SalesDashboardProps {
  sales?: any[];
  dailyGoal?: number;
  onNavigate?: (id: string) => void;
}

export function SalesDashboard({ sales = [], dailyGoal = 150000, onNavigate }: SalesDashboardProps) {
  const [activeTab] = useState("today");
  const [showValidator, setShowValidator] = useState(false);
  const [cashInRegister, setCashInRegister] = useState("");
  const [validationResult, setValidationResult] = useState<"none" | "match" | "mismatch">("none");

  // Filter out cancelled sales
  const validSales = sales.filter(s => s.status !== "cancelled");

  // Calculate real data from valid sales
  const totalIngresos = validSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProductsSold = validSales.reduce((sum, sale) => sum + (sale.itemCount || sale.products?.reduce((s: number, p: any) => s + p.quantity, 0) || 0), 0);
  const totalCostos = validSales.reduce((sum, sale) => {
    return sum + (sale.products?.reduce((pSum: number, p: any) => pSum + (p.price * p.quantity * 0.3), 0) || 0);
  }, 0);
  const totalUtilidades = totalIngresos - totalCostos;
  const salesGoal = dailyGoal || 1;
  const goalPercentage = Math.min(100, Math.round((totalIngresos / salesGoal) * 100));
  const productsSoldDivisor = totalProductsSold || 1;

  let utilidadesBg = "bg-[#2F6B3E] text-white";
  if (totalUtilidades < 0) {
    utilidadesBg = "bg-[#CF010B] text-white";
  }

  // Group sales by payment method
  const paymentMethodData = validSales.reduce((acc: any, sale) => {
    const method = (sale.paymentMethod || "Efectivo");
    if (!acc[method]) {
      acc[method] = { count: 0, total: 0 };
    }
    acc[method].count += 1;
    acc[method].total += sale.total;
    return acc;
  }, {});

  const paymentMethodsChart = Object.entries(paymentMethodData).map(([method, data]: [string, any]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    pedidos: data.count,
    ingresos: data.total
  }));

  // Calculate cash sales (case-insensitive comparison)
  const cashSales = validSales.filter(sale => (sale.paymentMethod || "").toLowerCase() === "efectivo");
  const totalCashExpected = cashSales.reduce((sum, sale) => sum + sale.total, 0);

  // Calculate real sales by hour
  const salesByHourMap: { [key: number]: number } = {};
  validSales.forEach(sale => {
    const hour = new Date(sale.time).getHours();
    salesByHourMap[hour] = (salesByHourMap[hour] || 0) + sale.total;
  });

  const salesByHour = Object.entries(salesByHourMap)
    .map(([hourStr, total]) => {
      const h = parseInt(hourStr);
      const ampm1 = h >= 12 ? 'pm' : 'am';
      const ampm2 = (h + 1) >= 12 ? 'pm' : 'am';
      const h1 = h % 12 || 12;
      const h2 = (h + 1) % 12 || 12;
      return {
        time: `${h1}${ampm1} - ${h2}${ampm2}`,
        sales: total,
        hour: h
      };
    })
    .sort((a, b) => a.hour - b.hour);

  // If there are no sales, provide an empty state to the chart to avoid crash
  if (salesByHour.length === 0) {
    salesByHour.push({ time: "Sin ventas", sales: 0, hour: 0 });
  }

  // Calculate top products from real sales
  const productCounts: { [key: string]: { name: string; quantity: number; color: string } } = {};
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  validSales.forEach(sale => {
    sale.products?.forEach((product: any) => {
      if (!productCounts[product.id]) {
        productCounts[product.id] = {
          name: product.name,
          quantity: 0,
          color: colors[Object.keys(productCounts).length % colors.length]
        };
      }
      productCounts[product.id].quantity += product.quantity;
    });
  });

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(([id, p], idx) => ({
      id: id,
      name: p.name,
      value: p.quantity,
      color: colors[idx]
    }));

  const handleValidateCash = () => {
    const cashInput = parseFloat(cashInRegister);
    if (isNaN(cashInput)) return;

    if (Math.abs(cashInput - totalCashExpected) < 0.01) {
      setValidationResult("match");
    } else {
      setValidationResult("mismatch");
    }
  };

  const closeValidator = () => {
    setShowValidator(false);
    setCashInRegister("");
    setValidationResult("none");
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted" style={{ width: "100%" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex-shrink-0 flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-sm"
        style={{ height: "52px" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.("home")}
            className="rounded-full p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Volver al inicio"
            type="button"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard de Ventas</h1>
        </div>
        <button
          onClick={() => setShowValidator(true)}
          className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          type="button"
          aria-label="Ir al Validador de caja"
        >
          Validador
        </button>
      </header>

      <div className="flex-1 overflow-auto pb-6 pt-14">
        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-12">

          {/* Main Financial KPIs */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:col-span-12">
            <KPICard
              title="Ingresos"
              value={formatCurrency(totalIngresos)}
              icon={ArrowDownToLine}
            />

            <KPICard
              title="Costos"
              value={formatCurrency(totalCostos)}
              icon={ArrowUpFromLine}
            />

            <KPICard
              title="Utilidades"
              value={formatCurrency(totalUtilidades)}
              icon={TrendingUp}
              variant={totalUtilidades >= 0 ? "success" : "destructive"}
            />

            <KPICard
              title="Prod. Vendidos"
              value={`${totalProductsSold} unid.`}
              icon={Package}
            />
          </div>

          <div className="rounded-card border border-border bg-card p-4 shadow-sm xl:col-span-12">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Validador de caja</h2>
                <p className="text-xs text-muted-foreground">Accede en una vista separada para mantener este dashboard limpio.</p>
              </div>
              <button
                onClick={() => setShowValidator(true)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                type="button"
              >
                Ir al Validador de caja
              </button>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="rounded-card bg-card p-4 shadow-sm border border-border xl:col-span-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="size-5 text-primary" />
                <h2 className="font-semibold">Meta de ventas (Ingresos)</h2>
              </div>
              <span className="text-sm font-medium">{goalPercentage}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatCurrency(totalIngresos)}</span>
              <span>Meta: {formatCurrency(salesGoal)}</span>
            </div>
          </div>

          {/* Breakdown by product */}
          {topProducts.length > 0 && (
            <div className="rounded-card bg-card p-4 shadow-sm border border-border xl:col-span-4">
              <h2 className="font-semibold mb-4">Detalle de productos vendidos</h2>
              <div className="space-y-4">
                {topProducts.map((product) => {
                  const percentage = Math.min(100, Math.round((product.value / productsSoldDivisor) * 100));
                  return (
                    <div key={`product-${product.id}`} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: product.color }}
                          />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          {product.value} unid.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-6">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${percentage}%`, backgroundColor: product.color }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top products Pie Chart */}
          {topProducts.length > 0 && (
            <div className="rounded-card bg-card p-4 shadow-sm border border-border xl:col-span-4">
              <h2 className="font-semibold mb-2">Productos más vendidos</h2>
              <div className="h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProducts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {topProducts.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => {
                        const percentage = Math.min(100, Math.round((value / productsSoldDivisor) * 100));
                        return [`${value} unid. (${percentage}%)`, name];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Sales by hour Chart */}
          <div className="rounded-card bg-card p-4 shadow-sm border border-border xl:col-span-12">
            <h2 className="font-semibold mb-4">Ventas por hora</h2>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByHour} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Ventas']}
                  />
                  <Bar
                    dataKey="sales"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods Section */}
          {sales.length > 0 && (
            <div className="rounded-card bg-card p-4 shadow-sm border border-border xl:col-span-8">
              <h2 className="font-semibold mb-4">Métodos de pago</h2>

              {/* Payment method counts */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Pedidos por método</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentMethodsChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      />
                      <Tooltip
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} pedidos`, 'Cantidad']}
                      />
                      <Bar
                        dataKey="pedidos"
                        fill="var(--chart-1)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment method totals */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Ingresos por método</h3>
                <div className="space-y-2">
                  {paymentMethodsChart.map((method) => (
                    <div key={`payment-${method.name}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium capitalize">{method.name}</span>
                      <span className="text-sm font-bold">{formatCurrency(method.ingresos)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Modal
        isOpen={showValidator}
        onClose={closeValidator}
        title="Validador de caja"
        size="md"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            <p className="text-sm text-muted-foreground">Compara el efectivo real contra el total esperado del sistema.</p>
          </div>

          <div>
            <label htmlFor="cash-in-register" className="mb-2 block text-sm font-medium text-muted-foreground">
              Efectivo en caja
            </label>
            <input
              id="cash-in-register"
              type="number"
              min="0"
              value={cashInRegister}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val < 0) return;
                setCashInRegister(e.target.value);
              }}
              placeholder="0"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span className="text-sm text-muted-foreground">Efectivo esperado (sistema)</span>
            <span className="text-sm font-bold">{formatCurrency(totalCashExpected)}</span>
          </div>

          <button
            onClick={handleValidateCash}
            disabled={!cashInRegister}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            type="button"
          >
            Validar caja
          </button>
        </div>
      </Modal>

      {/* Validation Result Modal - Match */}
      <Modal
        isOpen={validationResult === "match"}
        onClose={() => setValidationResult("none")}
        size="sm"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="size-16 text-success mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold mb-2">
            ¡La caja coincide con las ventas registradas!
          </h3>
          <button
            onClick={() => setValidationResult("none")}
            className="w-full mt-4 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            Aceptar
          </button>
        </div>
      </Modal>

      {/* Validation Result Modal - Mismatch */}
      <Modal
        isOpen={validationResult === "mismatch"}
        onClose={() => setValidationResult("none")}
        title="La caja no coincide con los valores registrados"
        size="md"
      >
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            Revisa las ventas en efectivo del día
          </p>

          <div>
            <h4 className="text-sm font-semibold mb-3">Ventas en efectivo</h4>
            <div className="space-y-2 mb-6">
              {cashSales.map((sale) => (
                <div key={sale.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {sale.products?.map((product: any, idx: number) => (
                        <div key={`${product.id}-${idx}`} className="text-sm">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-muted-foreground"> x{product.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(sale.total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total según sistema:</span>
                <span className="text-sm font-bold">{formatCurrency(totalCashExpected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total reportado en caja:</span>
                <span className="text-sm font-bold">{formatCurrency(parseFloat(cashInRegister) || 0)}</span>
              </div>
              <div className="pt-3 border-t border-destructive/20">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Diferencia:</span>
                  <span className="text-sm font-bold text-destructive">
                    {formatCurrency(Math.abs(totalCashExpected - (parseFloat(cashInRegister) || 0)))}
                    {totalCashExpected > (parseFloat(cashInRegister) || 0) ? " (faltante)" : " (sobrante)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <BottomNav active="sales" onNavigate={onNavigate} />
    </div>
  );
}
