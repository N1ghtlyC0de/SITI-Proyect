import { ReactNode, useState, useEffect, Suspense, lazy, useRef } from "react";
import { Home, ShoppingCart, Package, Clock, X } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { getProducts, getSales, createProduct, updateProduct, deleteProduct, createSale } from "./services/fastapi";

const VendorHome = lazy(() => import("./components/VendorHome").then(m => ({ default: m.VendorHome })));
const VendorSimpleView = lazy(() => import("./components/VendorSimpleView").then(m => ({ default: m.VendorSimpleView })));
const LoginScreen = lazy(() => import("./components/LoginScreen").then(m => ({ default: m.LoginScreen })));
const NewSale = lazy(() => import("./components/NewSale").then(m => ({ default: m.NewSale })));
const SalesDashboard = lazy(() => import("./components/SalesDashboard").then(m => ({ default: m.SalesDashboard })));
const InventoryDashboard = lazy(() => import("./components/InventoryDashboard").then(m => ({ default: m.InventoryDashboard })));
const ShiftsDashboard = lazy(() => import("./components/ShiftsDashboard").then(m => ({ default: m.ShiftsDashboard })));
const ShiftsHistory = lazy(() => import("./components/ShiftsHistory").then(m => ({ default: m.ShiftsHistory })));
const SalesHistory = lazy(() => import("./components/SalesHistory").then(m => ({ default: m.SalesHistory })));
const ProfileManagement = lazy(() => import("./components/ProfileManagement").then(m => ({ default: m.ProfileManagement })));
const ApiIntegrationPage = lazy(() => import("./components/pages/ApiIntegrationPage").then(m => ({ default: m.ApiIntegrationPage })));

import { toast } from "sonner";

const LoadingFallback = () => (
  <div className="flex flex-col min-h-screen bg-muted animate-pulse">
    {/* Header Skeleton */}
    <div className="h-16 bg-[#2F6B3E]/80 w-full" />
    
    {/* Content Skeleton */}
    <div className="flex-1 p-6 space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-card rounded-xl border border-border" />
        ))}
      </div>
      
      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[350px] bg-card rounded-xl border border-border" />
        <div className="h-[350px] bg-card rounded-xl border border-border" />
      </div>
    </div>
  </div>
);

type AdminScreen =
  | "home"
  | "new-sale"
  | "sales"
  | "inventory"
  | "shifts"
  | "shifts-history"
  | "sales-history"
  | "profile-management"
  | "api-integration";
type VendorScreen = "home" | "new-sale";

export interface Vendor {
  id: string;
  name: string;
  emoji: string;
  role: string;
  avatarColor: {
    bg: string;
    text: string;
  };
}

export interface GlobalState {
  dailyGoal: number;
  currentVendor: Vendor;
  vendors: Vendor[];
  sales: {
    id: string;
    total: number;
    time: Date;
    itemCount: number;
    products: any[];
    paymentMethod: string;
    status?: "ok" | "cancelled";
    vendorName?: string;
    amountReceived?: number;
    change?: number;
  }[];
  inventory: {
    id: string;
    name: string;
    category: string;
    stock: number;
    status: "good" | "warning" | "critical";
    image?: string;
    price: number;
    emoji?: string;
    lowStockThreshold: number;
  }[];
}

const initialInventory = [
  { id: "1", name: "Empanadas de carne", category: "Comida", stock: 45, status: "good" as const, image: "https://images.unsplash.com/photo-1626200419307-e836ec413b52?auto=format&fit=crop&q=80&w=200&h=200", price: 1500, emoji: "🥟", lowStockThreshold: 15 },
  { id: "2", name: "Arepas de queso", category: "Comida", stock: 12, status: "warning" as const, image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=200&h=200", price: 2500, emoji: "🫓", lowStockThreshold: 20 },
  { id: "3", name: "Jugos naturales", category: "Bebidas", stock: 30, status: "good" as const, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=200&h=200", price: 3000, emoji: "🧃", lowStockThreshold: 10 },
  { id: "4", name: "Gaseosas", category: "Bebidas", stock: 5, status: "critical" as const, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200", price: 2500, emoji: "🥤", lowStockThreshold: 10 },
  { id: "5", name: "Chorizos", category: "Comida", stock: 25, status: "good" as const, image: "https://images.unsplash.com/photo-1599818817290-77a7fceb5a6c?auto=format&fit=crop&q=80&w=200&h=200", price: 4000, emoji: "🌭", lowStockThreshold: 12 },
];

const mockSales = [
  {
    id: "014",
    total: 15500,
    time: new Date(2026, 4, 2, 11, 20),
    itemCount: 4,
    products: [
      { id: "1", name: "Café Tinto", quantity: 2, price: 2500, emoji: "☕" },
      { id: "2", name: "Empanada", quantity: 1, price: 1500, emoji: "🥟" },
      { id: "3", name: "Jugo Natural", quantity: 1, price: 3000, emoji: "🥤" },
      { id: "4", name: "Pan", quantity: 1, price: 1500, emoji: "🍞" }
    ],
    paymentMethod: "Daviplata",
    status: "ok" as const,
    vendorName: "María López"
  },
  {
    id: "013",
    total: 5500,
    time: new Date(2026, 4, 2, 10, 45),
    itemCount: 1,
    products: [
      { id: "5", name: "Arepa de queso", quantity: 1, price: 5500, emoji: "🫓" }
    ],
    paymentMethod: "Efectivo",
    status: "cancelled" as const,
    vendorName: "María López",
    amountReceived: 10000,
    change: 4500
  },
  {
    id: "012",
    total: 8000,
    time: new Date(2026, 4, 2, 9, 30),
    itemCount: 1,
    products: [
      { id: "6", name: "Sandwich", quantity: 1, price: 8000, emoji: "🥪" }
    ],
    paymentMethod: "Nequi",
    status: "ok" as const,
    vendorName: "María López"
  },
  {
    id: "011",
    total: 12500,
    time: new Date(2026, 4, 2, 8, 15),
    itemCount: 2,
    products: [
      { id: "7", name: "Combo Desayuno", quantity: 1, price: 10000, emoji: "🍳" },
      { id: "8", name: "Chocolate", quantity: 1, price: 2500, emoji: "🍫" }
    ],
    paymentMethod: "Efectivo",
    status: "ok" as const,
    vendorName: "María López",
    amountReceived: 15000,
    change: 2500
  }
];

const initialVendors: Vendor[] = [
  { id: "vendor-1", name: "María López", emoji: "👩", role: "Vendedor", avatarColor: { bg: "#E8F5EE", text: "#2F6B3E" } },
  { id: "vendor-2", name: "Carlos Ruiz", emoji: "👨", role: "Vendedor", avatarColor: { bg: "#E3F2FD", text: "#01579B" } },
  { id: "admin-1", name: "Ana García", emoji: "👩‍💼", role: "Administrador", avatarColor: { bg: "#FFF3E0", text: "#E65100" } }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AdminScreen | VendorScreen>("home");
  const [saleCounter, setSaleCounter] = useState(15); // mockSales end at "014"
  const [isMobile, setIsMobile] = useState(false);
  const [alert, setAlert] = useState<{ message: string; visible: boolean } | null>(null);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timeLeftRef = useRef(6000);
  const intervalRef = useRef<any>(null);

  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef<number | null>(null);

  const handleCloseAlert = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setAlert(prev => prev ? { ...prev, visible: false } : null);
    setSwipeOffset(0);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (alert && alert.visible) {
      setProgress(100);
      timeLeftRef.current = 6000;
      
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          timeLeftRef.current -= 100;
          setProgress((timeLeftRef.current / 6000) * 100);
          
          if (timeLeftRef.current <= 0) {
            handleCloseAlert();
          }
        }
      }, 100);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [alert, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current !== null) {
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartRef.current;
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (Math.abs(swipeOffset) > 50) {
      handleCloseAlert();
    } else {
      setSwipeOffset(0);
    }
    touchStartRef.current = null;
  };
  const [globalState, setGlobalState] = useState<GlobalState>({
    dailyGoal: 150000,
    currentVendor: initialVendors[0],
    vendors: initialVendors,
    sales: mockSales,
    inventory: initialInventory,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [apiProducts, apiSales] = await Promise.all([
          getProducts(),
          getSales()
        ]);
        
        setGlobalState(prev => ({
          ...prev,
          inventory: apiProducts.length > 0 ? (apiProducts as any) : prev.inventory,
          sales: apiSales.length > 0 ? apiSales.map(s => ({ ...s, time: new Date(s.time) })) as any : prev.sales
        }));
      } catch (err) {
        console.error("Backend fetch failed. Using local mock data.", err);
        setAlert({
          message: "Servidor fuera de línea. Utilizando datos locales en modo demostración.",
          visible: true
        });
      }
    }
    loadData();
  }, []);

  const isAdmin = globalState.currentVendor.role === "Administrador";

  const renderWithA11y = (content: ReactNode) => (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <main id="main-content">
        <Suspense fallback={<LoadingFallback />}>
          {content}
        </Suspense>
      </main>
      <Toaster position={isMobile ? "top-center" : "bottom-right"} />
    </>
  );

  const handleLogin = (vendorId: string) => {
    const vendor = globalState.vendors.find(v => v.id === vendorId);
    if (vendor) {
      setGlobalState(prev => ({ ...prev, currentVendor: vendor }));
      setIsLoggedIn(true);
      setCurrentScreen("home");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("home");
  };

  const handleChangeVendor = (vendorId: string) => {
    const selectedVendor = globalState.vendors.find(v => v.id === vendorId);
    if (selectedVendor) {
      setGlobalState(prev => ({ ...prev, currentVendor: selectedVendor }));
    }
  };

  const handleCreateVendor = (vendor: Omit<Vendor, "id">) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}`
    };
    setGlobalState(prev => ({
      ...prev,
      vendors: [...prev.vendors, newVendor]
    }));
  };

  const handleUpdateVendor = (vendorId: string, updates: Partial<Omit<Vendor, "id">>) => {
    setGlobalState(prev => ({
      ...prev,
      vendors: prev.vendors.map(v => v.id === vendorId ? { ...v, ...updates } : v),
      currentVendor: prev.currentVendor.id === vendorId ? { ...prev.currentVendor, ...updates } : prev.currentVendor
    }));
  };

  const handleDeleteVendor = (vendorId: string) => {
    setGlobalState(prev => ({
      ...prev,
      vendors: prev.vendors.filter(v => v.id !== vendorId)
    }));
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<any>) => {
    // Optimistic UI update
    setGlobalState(prev => ({
      ...prev,
      inventory: prev.inventory.map(p => {
        if (p.id === productId) {
          const updated = { ...p, ...updates };
          const newStock = updated.stock;
          const newStatus = newStock <= 5 ? "critical" : newStock <= 15 ? "warning" : "good";
          return { ...updated, status: newStatus };
        }
        return p;
      })
    }));

    // Backend update
    try {
      await updateProduct(productId, updates);
    } catch (e) {
      console.error("Failed to update product on backend", e);
    }
  };

  const handleAddProduct = async (product: Omit<any, "id" | "status">) => {
    const tempId = `product-${Date.now()}`;
    const newProduct = {
      ...product,
      id: tempId,
      status: product.stock <= 5 ? "critical" : product.stock <= 15 ? "warning" : "good"
    };
    
    setGlobalState(prev => ({
      ...prev,
      inventory: [...prev.inventory, newProduct]
    }));

    try {
      const apiProduct = await createProduct({
        name: product.name,
        category: product.category,
        stock: product.stock,
        status: newProduct.status,
        image: product.image,
        price: product.price,
        emoji: product.emoji
      });
      // Update with real ID
      setGlobalState(prev => ({
        ...prev,
        inventory: prev.inventory.map(p => p.id === tempId ? { ...p, id: apiProduct.id } : p)
      }));
    } catch (e) {
      console.error("Failed to create product on backend", e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setGlobalState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(p => p.id !== productId)
    }));

    try {
      await deleteProduct(productId);
    } catch (e) {
      console.error("Failed to delete product on backend", e);
    }
  };

  const handleAddSale = async (cart: any[], total: number, paymentMethod: string, amountReceived?: number, transferApp?: string) => {
    const newId = String(saleCounter).padStart(3, "0");
    setSaleCounter(prev => prev + 1);
    const newSale = {
      id: newId,
      total,
      time: new Date(),
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      products: cart,
      paymentMethod,
      status: "ok" as const,
      vendorName: globalState.currentVendor.name,
      amountReceived: paymentMethod === "Efectivo" ? amountReceived : undefined,
      change: paymentMethod === "Efectivo" && amountReceived ? amountReceived - total : undefined,
      transferApp: paymentMethod === "Transferencia" ? transferApp : undefined
    };

    const updatedInventory = globalState.inventory.map(prod => {
      const cartItem = cart.find(c => c.id === prod.id);
      if (cartItem) {
        const newStock = Math.max(0, prod.stock - cartItem.quantity);
        return {
          ...prod,
          stock: newStock,
          status: newStock <= 5 ? "critical" as const : newStock <= 15 ? "warning" as const : "good" as const
        };
      }
      return prod;
    });

    setGlobalState(prev => ({
      ...prev,
      sales: [newSale, ...prev.sales],
      inventory: updatedInventory
    }));

    try {
      const apiSale = await createSale({
        total: newSale.total,
        itemCount: newSale.itemCount,
        paymentMethod: newSale.paymentMethod,
        status: newSale.status,
        vendorName: newSale.vendorName,
        amountReceived: newSale.amountReceived,
        change: newSale.change,
        transferApp: newSale.transferApp,
        products: cart.map(c => ({
          product_id: c.id,
          name: c.name,
          quantity: c.quantity,
          price: c.price,
          emoji: c.emoji
        }))
      });
      setGlobalState(prev => ({
        ...prev,
        sales: prev.sales.map(s => s.id === newId ? { ...s, id: apiSale.id } : s)
      }));
      return apiSale.id;
    } catch (e) {
      console.error("Failed to record sale on backend", e);
      return newId;
    }
  };

  const handleCancelSale = (saleId: string) => {
    setGlobalState(prev => {
      const saleToCancel = prev.sales.find(s => s.id === saleId);
      if (!saleToCancel || saleToCancel.status === "cancelled") {
        return prev;
      }

      const updatedSales = prev.sales.map(s =>
        s.id === saleId ? { ...s, status: "cancelled" as const } : s
      );

      const updatedInventory = prev.inventory.map(prod => {
        const soldProduct = saleToCancel.products.find(p => p.id === prod.id);
        if (soldProduct) {
          const newStock = prod.stock + soldProduct.quantity;
          return {
            ...prod,
            stock: newStock,
            status: newStock <= 5 ? "critical" as const : newStock <= 15 ? "warning" as const : "good" as const
          };
        }
        return prod;
      });

      return {
        ...prev,
        sales: updatedSales,
        inventory: updatedInventory
      };
    });
  };

  // Not logged in → show login screen
  if (!isLoggedIn) {
    return renderWithA11y(<LoginScreen vendors={globalState.vendors} onLogin={handleLogin} />);
  }

  // ── VENDOR FLOW (non-admin) ──────────────────────────────────────────────
  if (!isAdmin) {
    if (currentScreen === "new-sale") {
      return renderWithA11y(
        <NewSale
          inventory={globalState.inventory}
          onCompleteSale={async (cart, total, method, received, transferApp) => {
            return await handleAddSale(cart, total, method, received, transferApp);
          }}
          onBack={() => setCurrentScreen("home")}
        />,
      );
    }

    return renderWithA11y(
      <VendorSimpleView
        sales={globalState.sales}
        currentVendor={globalState.currentVendor}
        vendors={globalState.vendors}
        onNewSale={() => setCurrentScreen("new-sale")}
        onCancelSale={handleCancelSale}
        onChangeVendor={handleChangeVendor}
        onLogout={handleLogout}
      />,
    );
  }

  // ── ADMIN FLOW ───────────────────────────────────────────────────────────
  let content;

  if (currentScreen === "new-sale") {
    content = (
      <NewSale
        inventory={globalState.inventory}
        onCompleteSale={handleAddSale}
        onBack={() => setCurrentScreen("home")}
      />
    );
  } else if (currentScreen === "sales") {
    content = (
      <SalesDashboard
        sales={globalState.sales}
        dailyGoal={globalState.dailyGoal}
        onNavigate={(id) => setCurrentScreen(id as AdminScreen)}
      />
    );
  } else if (currentScreen === "inventory") {
    content = (
      <InventoryDashboard
        inventory={globalState.inventory}
        onNavigate={(id) => setCurrentScreen(id as AdminScreen)}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    );
  } else if (currentScreen === "shifts") {
    content = <ShiftsDashboard onNavigate={(id) => setCurrentScreen(id as AdminScreen)} />;
  } else if (currentScreen === "shifts-history") {
    content = <ShiftsHistory onBack={() => setCurrentScreen("shifts")} />;
  } else if (currentScreen === "sales-history") {
    content = (
      <SalesHistory
        sales={globalState.sales}
        onBack={() => setCurrentScreen("home")}
        onCancelSale={handleCancelSale}
      />
    );
  } else if (currentScreen === "profile-management") {
    content = (
      <ProfileManagement
        vendors={globalState.vendors}
        currentVendorId={globalState.currentVendor.id}
        onBack={() => setCurrentScreen("home")}
        onCreate={handleCreateVendor}
        onUpdate={handleUpdateVendor}
        onDelete={handleDeleteVendor}
      />
    );
  } else if (currentScreen === "api-integration") {
    content = <ApiIntegrationPage onBack={() => setCurrentScreen("home")} />;
  } else {
    content = (
      <VendorHome
        sales={globalState.sales}
        inventory={globalState.inventory}
        dailyGoal={globalState.dailyGoal}
        currentVendor={globalState.currentVendor}
        vendors={globalState.vendors}
        onSetDailyGoal={(goal) => setGlobalState(prev => ({ ...prev, dailyGoal: goal }))}
        onChangeVendor={handleChangeVendor}
        onManageProfiles={() => setCurrentScreen("profile-management")}
        onOpenApiDemo={() => setCurrentScreen("api-integration")}
        onNewSale={() => setCurrentScreen("new-sale")}
        onNavigate={(id) => setCurrentScreen(id as AdminScreen)}
        onCancelSale={handleCancelSale}
        onLogout={handleLogout}
      />
    );
  }

  const showBottomNav = isLoggedIn && isAdmin && ["home", "sales", "inventory", "shifts"].includes(currentScreen);

  return renderWithA11y(
    <div className={`w-full min-h-screen ${showBottomNav ? "pb-20 lg:pb-0" : ""}`}>
      {content}
      {showBottomNav && (
        <nav 
          className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden grid grid-cols-4 py-2 text-muted-foreground" 
          aria-label="Navegación móvil"
        >
          {[
            { id: "home", label: "Inicio", icon: Home },
            { id: "sales", label: "Ventas", icon: ShoppingCart },
            { id: "inventory", label: "Inventario", icon: Package },
            { id: "shifts", label: "Turnos", icon: Clock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id as AdminScreen)}
                className={`flex flex-col items-center gap-1 text-xs focus:outline-none transition-all ${
                  isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground font-medium"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                type="button"
              >
                <div className={`flex items-center justify-center rounded-full px-5 py-1 transition-all ${
                  isActive ? "bg-primary/10 text-primary" : "bg-transparent text-muted-foreground"
                }`}>
                  <Icon className="size-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Custom SystemAlert Component with lifecycle, manual close, and swipe gesture */}
      {alert && alert.visible && (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`fixed z-50 bg-white border border-border rounded-xl shadow-lg p-4 pb-5 overflow-hidden transition-all duration-300 ${
            isMobile 
              ? "top-20 left-4 right-4 mx-auto max-w-sm" 
              : "right-4 bottom-4"
          }`}
          style={{
            transform: `translateX(${swipeOffset}px)`,
            opacity: 1 - Math.min(1, Math.abs(swipeOffset) / 150),
          }}
        >
          <div className="flex gap-3 items-start pr-8">
            <div className="size-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold shrink-0 mt-0.5" role="img" aria-label="Alerta">
              ⚠️
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Alerta del Sistema</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-normal break-words whitespace-normal">
                {alert.message}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCloseAlert}
            className="absolute top-2.5 right-2.5 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar alerta"
            type="button"
          >
            <X className="size-4" />
          </button>
          
          <div 
            className="absolute bottom-0 left-0 h-1 bg-destructive transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
