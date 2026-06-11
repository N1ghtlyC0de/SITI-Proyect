import { useState } from "react";
import { Check, ChevronRight, Settings } from "lucide-react";

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

interface VendorSwitcherProps {
  vendors: Vendor[];
  currentVendorId: string;
  currentVendorName: string;
  onSelect: (id: string) => void;
  onManageProfiles: () => void;
  onClose: () => void;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getRoleIcon(role: string): string {
  if (role === "Vendedor") return "🏪";
  if (role === "Administrador") return "📊";
  if (role === "Dueño") return "👑";
  return "👤";
}

export function VendorSwitcher({ vendors, currentVendorId, currentVendorName, onSelect, onManageProfiles, onClose }: VendorSwitcherProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in slide-in-from-bottom duration-300"
        style={{
          backgroundColor: "#fff",
          borderRadius: "18px 18px 0 0",
          padding: "20px 20px 28px",
          width: "100%",
          maxWidth: "720px"
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: "36px",
            height: "4px",
            backgroundColor: "#E8E8E5",
            borderRadius: "2px",
            margin: "0 auto 18px"
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#1A1A19",
            marginBottom: "4px"
          }}>
            Cambiar vendedor / turno
          </h3>
          <p style={{
            fontSize: "12px",
            color: "#757572"
          }}>
            Turno activo: {currentVendorName}
          </p>
        </div>

        {/* Lista de vendedores */}
        <div className="flex flex-col gap-2 mb-4">
          {vendors.map((vendor) => {
            const isActive = vendor.id === currentVendorId;
            const isHovered = hoveredId === vendor.id;

            return (
              <button
                key={vendor.id}
                onClick={() => onSelect(vendor.id)}
                onMouseEnter={() => setHoveredId(vendor.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "13px 14px",
                  borderRadius: "10px",
                  border: `1.5px solid ${isActive || isHovered ? "#2F6B3E" : "#E8E8E5"}`,
                  backgroundColor: isActive || isHovered ? "#F4F4F2" : "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.12s ease"
                }}
              >
                {/* Avatar con iniciales */}
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

                {/* Información del vendedor */}
                <div className="flex-1 text-left">
                  <div style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1A1A19",
                    marginBottom: "2px"
                  }}>
                    {vendor.name}
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "#757572",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px"
                  }}>
                    <span>{getRoleIcon(vendor.role)}</span>
                    <span>{vendor.role}</span>
                  </div>
                </div>

                {/* Indicador derecho */}
                {isActive ? (
                  <div className="flex items-center gap-2">
                    <Check style={{ width: "16px", height: "16px", color: "#2F6B3E" }} />
                    <div style={{
                      backgroundColor: "#E8F5EE",
                      color: "#2F6B3E",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "12px"
                    }}>
                      Activo
                    </div>
                  </div>
                ) : (
                  <ChevronRight style={{ width: "16px", height: "16px", color: "#BDBDBA" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Botón "Gestionar perfiles" */}
        <button
          onClick={() => {
            onClose();
            onManageProfiles();
          }}
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "12px",
            backgroundColor: "#F4F4F2",
            border: "1.5px solid #E8E8E5",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#2F6B3E",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#2F6B3E";
            e.currentTarget.style.backgroundColor = "#F0FAF4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E8E8E5";
            e.currentTarget.style.backgroundColor = "#F4F4F2";
          }}
        >
          <Settings style={{ width: "16px", height: "16px" }} />
          Gestionar perfiles
        </button>

        {/* Botón cancelar */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            border: "1px solid #E8E8E5",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#757572",
            cursor: "pointer"
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
