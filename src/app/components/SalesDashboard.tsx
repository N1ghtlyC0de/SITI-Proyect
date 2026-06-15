import { useState, useEffect } from "react";
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
  Calculator,
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { formatCurrency, cn } from "../lib/utils";
import { createValidation } from "../services/fastapi";
import { HeaderNav } from "./HeaderNav";
import { PrimaryButton } from "./molecules/PrimaryButton";
import { KPICard } from "./molecules/KPICard";
import { Modal } from "./molecules/Modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

interface SalesDashboardProps {
  sales?: any[];
  dailyGoal?: number;
  onNavigate?: (id: string) => void;
}

export function SalesDashboard({ sales = [], dailyGoal = 150000, onNavigate }: SalesDashboardProps) {
  const [activeTab] = useState("today");
  const [isVentasHoraOpen, setIsVentasHoraOpen] = useState(true);
  const [isMetodosPagoOpen, setIsMetodosPagoOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsVentasHoraOpen(true);
      setIsMetodosPagoOpen(true);
    }
  }, []);

  const handleExportPDF = async () => {
    setIsExportMenuOpen(false);
    
    // Store current state of all accordions
    const prevVentasHora = isVentasHoraOpen;
    const prevMetodosPago = isMetodosPagoOpen;

    // Temporarily expand all accordion containers
    setIsVentasHoraOpen(true);
    setIsMetodosPagoOpen(true);

    // Wait a tiny delay to allow Recharts to draw SVGs on expanded containers
    await new Promise(resolve => setTimeout(resolve, 150));

    // Capture and print
    window.print();

    // Restore original accordion states
    setIsVentasHoraOpen(prevVentasHora);
    setIsMetodosPagoOpen(prevMetodosPago);
  };

  const handleExportCSV = () => {
    setIsExportMenuOpen(false);
    
    // Core metrics data
    const data = [
      {
        Metric: "Ingresos",
        Value: totalIngresos,
        Formatted: formatCurrency(totalIngresos),
      },
      {
        Metric: "Costos",
        Value: totalCostos,
        Formatted: formatCurrency(totalCostos),
      },
      {
        Metric: "Utilidades",
        Value: totalUtilidades,
        Formatted: formatCurrency(totalUtilidades),
      },
      {
        Metric: "Productos Vendidos",
        Value: totalProductsSold,
        Formatted: `${totalProductsSold} unidades`,
      }
    ];

    // Convert to CSV string: Headers, then rows
    const headers = ["Metrica", "Valor Numerico", "Formateado"];
    const csvRows = [
      headers.join(","),
      ...data.map(row => [
        `"${row.Metric}"`,
        row.Value,
        `"${row.Formatted}"`
      ].join(","))
    ];
    const csvContent = csvRows.join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_ventas.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


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



  return (
    <div className="flex min-h-screen h-auto lg:h-screen lg:overflow-y-auto flex-col bg-muted" style={{ width: "100%" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex-shrink-0 flex items-center justify-between px-4 bg-primary text-primary-foreground shadow-md w-full"
        style={{ height: "64px" }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
          <h1 className="text-lg font-semibold tracking-tight truncate hidden sm:block">Dashboard de Ventas</h1>
        </div>

        {/* Center Section - Navigation */}
        <div className="hidden lg:flex justify-center shrink-0 mx-2">
          <HeaderNav active="sales" onNavigate={onNavigate} />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <DropdownMenu open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
            <DropdownMenuTrigger asChild>
              <PrimaryButton
                variant="header"
                icon={<Download aria-hidden="true" />}
                aria-label="Exportar datos del dashboard"
              >
                <span>Exportar</span>
              </PrimaryButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-1">
              <DropdownMenuItem
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none"
              >
                <FileText className="size-4 text-red-500" />
                <span>Exportar como PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none"
              >
                <FileSpreadsheet className="size-4 text-green-600" />
                <span>Exportar como CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Dashboard Content Area restricted to viewport and padded */}
      <div id="sales-dashboard-print-area" className="flex-1 flex flex-col p-4 space-y-3 lg:min-h-0 lg:overflow-y-auto">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            body > *:not(#sales-dashboard-print-area) {
              display: none !important;
            }
            header, nav, footer, button, [role="menu"], [role="dialog"], .bg-primary\\/10 {
              display: none !important;
            }
            #sales-dashboard-print-area {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              position: static !important;
              overflow: visible !important;
            }
            #sales-dashboard-print-area .hidden.lg\\:block {
              display: block !important;
            }
            .recharts-responsive-container {
              height: 300px !important;
              min-height: 300px !important;
            }
          }
        `}} />
        
        {/* Upper summary KPIs: compact padding and spacing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
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


        {/* Split analytical layout: 2 columns side-by-side on desktop */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:min-h-0 lg:overflow-hidden">
          
          {/* Left Column (Trends & Progress) - 50% width on desktop */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:h-full lg:overflow-hidden">
            {/* Daily Goal */}
            <div className="rounded-card bg-card p-4 shadow-sm border border-border shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="size-5 text-primary" />
                  <h2 className="font-semibold text-lg text-foreground">Meta de ventas (Ingresos)</h2>
                </div>
                <span className="text-xs font-semibold text-primary">{goalPercentage}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${goalPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                <span>{formatCurrency(totalIngresos)}</span>
                <span>Meta: {formatCurrency(salesGoal)}</span>
              </div>
            </div>

            {/* Ventas por hora Chart */}
            <div className="flex-1 min-h-0 rounded-card bg-card p-4 shadow-sm border border-border flex flex-col overflow-hidden">
              <button
                type="button"
                onClick={() => setIsVentasHoraOpen(!isVentasHoraOpen)}
                className="w-full flex justify-between items-center text-left mb-3 shrink-0 focus:outline-none lg:pointer-events-none lg:cursor-default"
                aria-expanded={isVentasHoraOpen}
              >
                <h2 className="font-semibold text-lg text-foreground">Ventas por hora</h2>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground transition-transform duration-200 lg:hidden",
                    isVentasHoraOpen && "rotate-180"
                  )}
                />
              </button>
              
              <div className={cn("w-full flex-1 min-h-0", isVentasHoraOpen ? "block" : "hidden lg:block")}>
                <div className="h-64 lg:h-full w-full min-h-0">
                  {isVentasHoraOpen && (
                    <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                      <BarChart data={salesByHour} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#4B5563", fontWeight: 500 }}
                          angle={-45}
                          textAnchor="end"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#4B5563", fontWeight: 500 }}
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
                          maxBarSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Product & Payment Breakdown) - 50% width on desktop */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:h-full lg:overflow-hidden">
            {/* Top row: Unified Product breakdown & Pie chart single card */}
            <div className="rounded-card bg-card p-4 shadow-sm border border-border flex flex-col shrink-0 overflow-hidden">
              <h2 className="font-semibold text-lg mb-2 shrink-0 text-foreground">Detalle de productos vendidos</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Left side: Doughnut chart (30-40% width) */}
                <div className="w-full md:w-1/3 h-[140px] flex items-center justify-center">
                  {topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minHeight={140}>
                      <PieChart>
                        <Pie
                          data={topProducts}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
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
                            return [`${value} u. (${percentage}%)`, name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin datos</span>
                  )}
                </div>

                {/* Right side: Detailed List acting as legend (60-70% width) */}
                <div className="w-full md:w-2/3">
                  {topProducts.length > 0 ? (
                    <div className="space-y-2 h-auto overflow-visible lg:max-h-[140px] lg:overflow-y-auto pr-1">
                      {topProducts.map((product) => {
                        const percentage = Math.min(100, Math.round((product.value / productsSoldDivisor) * 100));
                        return (
                          <div key={`product-${product.id}`} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between text-sm py-0.5">
                              <div className="flex items-center gap-2 truncate">
                                <div
                                  className="size-2 rounded-full shrink-0"
                                  style={{ backgroundColor: product.color }}
                                />
                                <span className="font-medium truncate">{product.name}</span>
                              </div>
                              <span className="font-semibold tabular-nums shrink-0">
                                {product.value} u.
                              </span>
                            </div>
                            <div className="flex items-center gap-2 pl-4">
                              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${percentage}%`, backgroundColor: product.color }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-8 text-right">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[140px] text-xs text-muted-foreground">
                      Sin productos vendidos
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Methods Section (takes up remaining space) */}
            <div className="flex-1 min-h-[300px] lg:min-h-[260px] rounded-card bg-card p-3.5 shadow-sm border border-border flex flex-col overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMetodosPagoOpen(!isMetodosPagoOpen)}
                className="w-full flex justify-between items-center text-left mb-2 shrink-0 focus:outline-none lg:pointer-events-none lg:cursor-default"
                aria-expanded={isMetodosPagoOpen}
              >
                <h2 className="font-semibold text-lg text-foreground">Métodos de pago</h2>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground transition-transform duration-200 lg:hidden",
                    isMetodosPagoOpen && "rotate-180"
                  )}
                />
              </button>
              
              <div className={cn("w-full flex-1 min-h-0", isMetodosPagoOpen ? "block" : "hidden lg:block")}>
                {sales.length > 0 ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:min-h-0 lg:overflow-y-auto">
                    {/* Chart side */}
                    <div className="flex flex-col lg:h-full lg:overflow-hidden">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1 shrink-0">Pedidos por método</h3>
                      <div className="h-64 lg:h-full w-full min-h-0">
                        {isMetodosPagoOpen && (
                          <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                            <BarChart data={paymentMethodsChart} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#4B5563" }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#4B5563" }}
                                allowDecimals={false}
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
                                maxBarSize={36}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* List side with localized overflow container */}
                    <div className="flex flex-col lg:h-full lg:overflow-hidden">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2 shrink-0">Ingresos por método</h3>
                      <div className="space-y-1.5 pr-1 h-auto overflow-visible lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
                        {paymentMethodsChart.map((method) => (
                          <div key={`payment-${method.name}`} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50 text-sm">
                            <span className="font-medium capitalize">{method.name}</span>
                            <span className="font-bold">{formatCurrency(method.ingresos)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1 text-xs text-muted-foreground">
                    Sin ventas registradas
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>



    </div>
  );
}
