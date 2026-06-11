import { useState, useEffect } from "react";
import { Check, RotateCcw } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface SaleSuccessModalProps {
  ticketNumber: string;
  total: number;
  paymentMethod?: string;
  onNewSale: () => void;
  onFinish: () => void;
  onUndo?: () => void;
  onSendWhatsApp?: () => void;
}

export function SaleSuccessModal({
  ticketNumber,
  total,
  paymentMethod = "Efectivo",
  onNewSale,
  onFinish,
  onUndo,
}: SaleSuccessModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [showUndo, setShowUndo] = useState(true);

  useEffect(() => {
    if (countdown <= 0) {
      setShowUndo(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleUndo = () => {
    setShowUndo(false);
    onUndo?.();
  };

  const currentTime = new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: "#F4F4F2",
        width: "100%"
      }}
    >
      {/* Header verde sin contenido visible */}
      <div style={{
        backgroundColor: "#2F6B3E",
        height: "60px",
        flexShrink: 0
      }} />

      {/* Cuerpo centrado */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "40px 24px" }}>
        <div className="flex flex-col items-center w-full max-w-sm">
          {/* Círculo con check */}
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#2F6B3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px"
          }}>
            <Check style={{ width: "40px", height: "40px", color: "white", strokeWidth: 3 }} />
          </div>

          {/* Título */}
          <h2 style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1A1A19",
            letterSpacing: "-0.4px",
            marginBottom: "8px",
            textAlign: "center"
          }}>
            ¡Venta registrada!
          </h2>

          {/* ID + hora + método */}
          <p style={{
            fontSize: "14px",
            color: "#757572",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            #{ticketNumber} · {currentTime} · {paymentMethod}
          </p>

          {/* Monto */}
          <div style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#2F6B3E",
            fontVariantNumeric: "tabular-nums",
            margin: "8px 0 24px 0"
          }}>
            {formatCurrency(total)}
          </div>

          {/* Chip deshacer */}
          {showUndo && countdown > 0 && (
            <div style={{
              width: "100%",
              backgroundColor: "#1A1A19",
              borderRadius: "10px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px"
            }}>
              <span style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.7)"
              }}>
                ¿Fue un error? ({countdown}s)
              </span>
              <button
                onClick={handleUndo}
                style={{
                  backgroundColor: "#C89A2E",
                  color: "#1A1A19",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <RotateCcw className="size-3" />
                Deshacer
              </button>
            </div>
          )}

          {/* Botones */}
          <div className="w-full space-y-3">
            <button
              onClick={onNewSale}
              style={{
                width: "100%",
                backgroundColor: "#2F6B3E",
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Nueva venta
            </button>
            <button
              onClick={onFinish}
              style={{
                width: "100%",
                backgroundColor: "#E8E8E5",
                color: "#757572",
                fontSize: "16px",
                fontWeight: 700,
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
