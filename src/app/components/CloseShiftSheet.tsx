import { useState } from "react";
import { Lock } from "lucide-react";
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

interface CloseShiftSheetProps {
  currentVendor: Vendor;
  vendors: Vendor[];
  validSales: any[];
  durationString: string;
  pendingOfflineSales?: number;
  onClose: () => void;
  onConfirm: (nextVendorId: string | null, note: string) => void;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function CloseShiftSheet({
  currentVendor,
  vendors,
  validSales,
  durationString,
  pendingOfflineSales = 0,
  onClose,
  onConfirm
}: CloseShiftSheetProps) {
  const [selectedNextVendor, setSelectedNextVendor] = useState<string | null>(null);
  const [isClosingWithoutRelief, setIsClosingWithoutRelief] = useState(false);
  const [note, setNote] = useState("");
  const [forceCloseWarning, setForceCloseWarning] = useState(false);

  const availableVendors = vendors.filter(v => v.id !== currentVendor.id);
  const totalVendido = validSales.reduce((sum, sale) => sum + sale.total, 0);
  const ventasRealizadas = validSales.length;

  const handleSelectVendor = (id: string) => {
    setSelectedNextVendor(id);
    setIsClosingWithoutRelief(false);
  };

  const handleSelectNoRelief = () => {
    setIsClosingWithoutRelief(true);
    setSelectedNextVendor(null);
  };

  const hasSelection = selectedNextVendor !== null || isClosingWithoutRelief;
  
  const handleConfirm = () => {
    if (!hasSelection) return;
    if (pendingOfflineSales > 0 && !forceCloseWarning) {
      setForceCloseWarning(true);
      return;
    }
    onConfirm(isClosingWithoutRelief ? null : selectedNextVendor, note);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in slide-in-from-bottom duration-300 flex flex-col"
        style={{
          backgroundColor: "#fff",
          borderRadius: "18px 18px 0 0",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "96vh",
          overflowY: "auto"
        }}
      >
        {/* Handle */}
        <div style={{ padding: "8px 0 8px" }}>
          <div
            style={{
              width: "36px",
              height: "4px",
              backgroundColor: "#E8E8E5",
              borderRadius: "2px",
              margin: "0 auto"
            }}
          />
        </div>

        {/* Sección 1: Resumen */}
        <div style={{ padding: "0 20px 10px" }}>
          <div style={{
            backgroundColor: "#F4F4F2",
            borderRadius: "12px",
            padding: "10px 14px"
          }}>
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: currentVendor.avatarColor.bg,
                  color: currentVendor.avatarColor.text,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  flexShrink: 0
                }}
              >
                {getInitials(currentVendor.name)}
              </div>
              <div>
                <div className="text-lg font-bold text-[#1A1A19]">
                  {currentVendor.name}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {currentVendor.role}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Ventas</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span className="text-lg md:text-xl font-bold text-[#1A1A19]">{ventasRealizadas}</span>
                  <span style={{ backgroundColor: "#E8F5EE", color: "#2F6B3E", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: 600 }}>+</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Total</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span className="text-lg md:text-xl font-bold text-[#1A1A19]">${(totalVendido/1000).toFixed(0)}k</span>
                  <span style={{ backgroundColor: "#E8F5EE", color: "#2F6B3E", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: 600 }}>+</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Duración</div>
                <div className="text-lg md:text-xl font-bold text-[#1A1A19]">{durationString}</div>
              </div>
            </div>

            {pendingOfflineSales > 0 && (
              <div style={{ 
                marginTop: "12px", 
                backgroundColor: "#FFF3E0", 
                borderLeft: "3px solid #ED6C02", 
                padding: "10px 12px", 
                borderRadius: "8px" 
              }}>
                <div style={{ fontSize: "12px", color: "#E65100", fontWeight: 500 }}>
                  ⚠️ {pendingOfflineSales} ventas pendientes de sincronización. Espera antes de cerrar.
                </div>
                {forceCloseWarning && (
                  <button 
                    onClick={() => onConfirm(isClosingWithoutRelief ? null : selectedNextVendor, note)}
                    style={{ 
                      marginTop: "8px", 
                      fontSize: "12px", 
                      fontWeight: 600, 
                      color: "#B71C1C", 
                      padding: "6px 10px", 
                      backgroundColor: "#FFEBEE", 
                      borderRadius: "6px",
                      width: "100%",
                      textAlign: "center"
                    }}
                  >
                    Cerrar de todas formas
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sección 2: ¿Quién sigue? */}
        <div style={{ padding: "0 20px 10px" }}>
          <div style={{ marginBottom: "6px" }}>
            <h3 className="text-xl md:text-2xl font-bold text-[#1A1A19]">
              Siguiente turno
            </h3>
            <p className="text-xs md:text-sm text-gray-500">
              Selecciona el próximo vendedor o cierra sin relevo.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {availableVendors.map((vendor) => {
              const isSelected = selectedNextVendor === vendor.id;
              
              return (
                <button
                  key={vendor.id}
                  onClick={() => handleSelectVendor(vendor.id)}
                  className={`w-full cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm ${
                    isSelected ? "border-2 border-[#2F6B3E] bg-[#E8F5EE]" : "border border-[#E8E8E5] bg-white"
                  }`}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left"
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      backgroundColor: vendor.avatarColor.bg,
                      color: vendor.avatarColor.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                      flexShrink: 0
                    }}
                  >
                    {getInitials(vendor.name)}
                  </div>

                  <div className="flex-1">
                    <div className="text-base font-semibold text-[#1A1A19]" style={{ marginBottom: "2px" }}>
                      {vendor.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {vendor.role}
                    </div>
                  </div>

                  {isSelected && (
                    <div 
                      className="flex items-center gap-1 text-[#2F6B3E] bg-[#E8F5EE] border border-[#2F6B3E]/30 shrink-0"
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "12px"
                      }}
                    >
                      <span aria-hidden="true">✓</span> Siguiente turno
                    </div>
                  )}
                </button>
              );
            })}

            <button
              onClick={handleSelectNoRelief}
              className={`w-full cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm ${
                isClosingWithoutRelief ? "border-2 border-[#1A1A19] bg-[#F4F4F2]" : "border border-[#E8E8E5] bg-white"
              }`}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
                marginTop: "4px"
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#F4F4F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Lock className="size-5 text-[#3D3D3B]" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-[#3D3D3B]" style={{ marginBottom: "2px" }}>
                  Sin relevo — cerrar y bloquear
                </div>
                <div className="text-sm text-gray-500">
                  El sistema quedará en reposo hasta el próximo acceso
                </div>
              </div>
              {isClosingWithoutRelief && (
                <div 
                  className="flex items-center gap-1 text-[#1A1A19] bg-[#E8E8E5] border border-[#1A1A19]/30 shrink-0"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "12px"
                  }}
                >
                  <span aria-hidden="true">✓</span> Seleccionado
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Sección 3: Observación */}
        <div style={{ padding: "0 20px 10px" }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nota del turno (opcional)"
            rows={2}
            className="placeholder-gray-500"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #9CA3AF",
              fontSize: "13px",
              color: "#1A1A19",
              backgroundColor: "#F9FAFB",
              resize: "none",
              outline: "none"
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
          <button
            onClick={handleConfirm}
            disabled={!hasSelection || (pendingOfflineSales > 0 && forceCloseWarning)}
            style={{
              width: "100%",
              backgroundColor: !hasSelection ? "#E8E8E5" : "#B71C1C",
              color: !hasSelection ? "#A3A3A0" : "white",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: !hasSelection ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {pendingOfflineSales > 0 && !forceCloseWarning ? "Confirmar cierre forzado" : "Cerrar turno"}
          </button>
          <div style={{ fontSize: "11px", color: "#757572", textAlign: "center", width: "100%" }}>
            Esto no cierra la caja.
          </div>
        </div>
      </div>
    </div>
  );
}
