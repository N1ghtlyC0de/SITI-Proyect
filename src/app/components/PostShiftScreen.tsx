import { X } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface Vendor {
  id: string;
  name: string;
  role: string;
  emoji: string;
  avatarColor: {
    bg: string;
    text: string;
  };
}

interface PostShiftScreenProps {
  previousVendor: Vendor;
  nextVendor: Vendor | null;
  validSales: any[];
  durationString: string;
  onContinue: () => void;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function PostShiftScreen({
  previousVendor,
  nextVendor,
  validSales,
  durationString,
  onContinue
}: PostShiftScreenProps) {
  const totalVendido = validSales.reduce((sum, sale) => sum + sale.total, 0);
  const ventasRealizadas = validSales.length;

  // Calculate most used payment method
  const methodCounts = validSales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let mostUsedMethod = "N/A";
  let maxCount = 0;
  for (const method in methodCounts) {
    if (methodCounts[method] > maxCount) {
      maxCount = methodCounts[method];
      mostUsedMethod = method;
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-300" 
      style={{ width: "100%" }}
    >
      {/* Header verde */}
      <div 
        style={{
          height: "48px",
          backgroundColor: "#2F6B3E",
          flexShrink: 0
        }} 
      />

      {/* Cuerpo */}
      <div 
        className="flex-1 flex flex-col items-center justify-center" 
        style={{ padding: "40px 24px" }}
      >
        <div 
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#1A1A19",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px"
          }}
        >
          <X size={36} color="white" strokeWidth={3} />
        </div>

        <h1 
          style={{ 
            fontSize: "22px", 
            fontWeight: 700, 
            color: "#1A1A19", 
            letterSpacing: "-0.4px",
            marginBottom: "4px"
          }}
        >
          Turno cerrado
        </h1>
        
        <p style={{ fontSize: "14px", color: "#757572", marginBottom: "8px" }}>
          Turno de {previousVendor.name}
        </p>

        <div style={{ fontSize: "16px", fontWeight: 700, color: "#2F6B3E", marginBottom: "24px" }}>
          {durationString} de trabajo
        </div>

        {/* Resumen compacto */}
        <div 
          style={{
            backgroundColor: "#F4F4F2",
            borderRadius: "12px",
            padding: "14px",
            margin: "18px 0",
            width: "100%"
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span style={{ fontSize: "13px", color: "#757572" }}>Ventas realizadas</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A19" }}>{ventasRealizadas}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span style={{ fontSize: "13px", color: "#757572" }}>Total vendido</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#2F6B3E" }}>{formatCurrency(totalVendido)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: "13px", color: "#757572" }}>Método más usado</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A19" }}>{mostUsedMethod}</span>
          </div>
        </div>

        {/* Acción de continuar */}
        <div style={{ width: "100%", marginTop: "auto", paddingTop: "24px" }}>
          {nextVendor ? (
            <div 
              style={{
                backgroundColor: "#E8F5EE",
                borderRadius: "12px",
                padding: "14px"
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: nextVendor.avatarColor.bg,
                    color: nextVendor.avatarColor.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {getInitials(nextVendor.name)}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A19" }}>
                    Le toca a {nextVendor.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#757572" }}>
                    {nextVendor.role}
                  </div>
                </div>
              </div>
              
              <button
                onClick={onContinue}
                style={{
                  width: "100%",
                  backgroundColor: "#2F6B3E",
                  color: "white",
                  borderRadius: "10px",
                  padding: "13px 14px",
                  fontSize: "15px",
                  fontWeight: 700,
                  transition: "opacity 0.2s"
                }}
              >
                Iniciar turno de {nextVendor.name}
              </button>
            </div>
          ) : (
            <button
              onClick={onContinue}
              style={{
                width: "100%",
                backgroundColor: "#F4F4F2",
                color: "#3D3D3B",
                borderRadius: "10px",
                padding: "13px 14px",
                fontSize: "15px",
                fontWeight: 700,
                transition: "opacity 0.2s",
                border: "1px solid #E8E8E5"
              }}
            >
              Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
