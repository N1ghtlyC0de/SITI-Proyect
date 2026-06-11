import { Vendor } from "../App";
import { AlertCircle, ArrowRight } from "lucide-react";
import { StatusBadge } from "./molecules/StatusBadge";

interface LoginScreenProps {
  vendors: Vendor[];
  onLogin: (vendorId: string) => void;
}

export function LoginScreen({ vendors, onLogin }: LoginScreenProps) {
  const admins = vendors.filter(v => v.role === "Administrador");
  const sellers = vendors.filter(v => v.role !== "Administrador");

  return (
    <div
      className="flex min-h-screen flex-col bg-muted"
      style={{ width: "100%" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 bg-primary text-primary-foreground flex-shrink-0"
        style={{ height: "52px" }}
      >
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full" style={{ backgroundColor: "#4ADE80" }} />
          <div>
            <div className="text-sm font-bold leading-tight">SITI</div>
            <div className="text-xs opacity-90 leading-tight text-white">Empanadas El Sabor</div>
          </div>
        </div>
        <StatusBadge status="success" label="En línea" />
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-5">
        {/* Greeting */}
        <div className="text-center pt-4 pb-2">
          <div className="text-5xl mb-3" role="img" aria-label="Tienda">🏪</div>
          <h1 className="text-xl font-bold text-foreground">¿Quién eres hoy?</h1>
          <p className="text-sm text-foreground/80 mt-1">
            Selecciona tu perfil para iniciar tu turno
          </p>
        </div>

        {/* Admins */}
        {admins.length > 0 && (
          <div>
            <p className="text-xs uppercase font-semibold text-foreground/80 tracking-wider mb-2 px-1">
              Administración
            </p>
            <div className="space-y-2">
              {admins.map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => onLogin(vendor.id)}
                  type="button"
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-card shadow-sm border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div
                    className="size-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                    style={{ backgroundColor: vendor.avatarColor.bg, color: vendor.avatarColor.text }}
                  >
                    {vendor.emoji}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Acceso total · Reportes · Inventario
                    </div>
                  </div>
                  <StatusBadge status="warning" label="Admin" className="shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sellers */}
        {sellers.length > 0 && (
          <div>
            <p className="text-xs uppercase font-semibold text-foreground/80 tracking-wider mb-2 px-1">
              Vendedores
            </p>
            <div className="space-y-2">
              {sellers.map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => onLogin(vendor.id)}
                  type="button"
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-card shadow-sm border-2 border-border hover:border-primary/50 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div
                    className="size-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                    style={{ backgroundColor: vendor.avatarColor.bg, color: vendor.avatarColor.text }}
                  >
                    {vendor.emoji}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-foreground">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Ventas del turno actual
                    </div>
                  </div>
                  <StatusBadge status="success" label="Vendedor" className="shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="rounded-card bg-card border border-border p-3 mt-2">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            🔒 Los vendedores solo acceden a su proceso de venta actual.
            Solo el Administrador ve reportes, inventario y cifras globales del negocio.
          </p>
        </div>
      </div>
    </div>
  );
}
