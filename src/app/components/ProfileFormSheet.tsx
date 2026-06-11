import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

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

interface ProfileFormSheetProps {
  vendor: Vendor | null;
  onSubmit: (vendor: Omit<Vendor, "id">) => void;
  onClose: () => void;
}

const AVATAR_COLORS = [
  { bg: "#E8F5EE", text: "#2F6B3E", name: "Verde" },
  { bg: "#E3F2FD", text: "#01579B", name: "Azul" },
  { bg: "#FFF3E0", text: "#E65100", name: "Ámbar" },
  { bg: "#F3E5F5", text: "#6A1B9A", name: "Púrpura" }
];

const ROLES = [
  { value: "Vendedor", emoji: "🏪", label: "Vendedor" },
  { value: "Administrador", emoji: "📊", label: "Administrador" },
  { value: "Dueño", emoji: "👑", label: "Dueño" }
];

export function ProfileFormSheet({ vendor, onSubmit, onClose }: ProfileFormSheetProps) {
  const [name, setName] = useState(vendor?.name || "");
  const [role, setRole] = useState(vendor?.role || "Vendedor");
  const [avatarColor, setAvatarColor] = useState(vendor?.avatarColor || AVATAR_COLORS[0]);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [nameError, setNameError] = useState(false);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const isEditing = vendor !== null;
  const showPinField = role === "Administrador" || role === "Dueño";
  const isValid = name.trim().length > 0;

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim().length > 0) {
      setNameError(false);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(0, 1);
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = () => {
    if (!isValid) {
      setNameError(true);
      return;
    }

    // Encontrar emoji del rol seleccionado
    const selectedRole = ROLES.find(r => r.value === role);
    const emoji = selectedRole?.emoji || "👤";

    onSubmit({
      name: name.trim(),
      role,
      emoji,
      avatarColor
    });
  };

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
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto"
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

        {/* Título */}
        <h3 style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#1A1A19",
          marginBottom: "24px"
        }}>
          {isEditing ? "Editar perfil" : "Nuevo perfil"}
        </h3>

        {/* Campo 1: Selector de color de avatar */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#3D3D3B",
            marginBottom: "10px"
          }}>
            Color de avatar
          </label>
          <div className="flex gap-3">
            {AVATAR_COLORS.map((color, index) => {
              const isSelected = color.bg === avatarColor.bg;
              return (
                <button
                  key={index}
                  onClick={() => setAvatarColor(color)}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: color.bg,
                    border: isSelected ? `2px solid ${color.text}` : "2px solid transparent",
                    transform: isSelected ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {isSelected && <Check style={{ width: "20px", height: "20px", color: color.text }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campo 2: Nombre completo */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#3D3D3B",
            marginBottom: "8px"
          }}>
            Nombre *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ingresa el nombre completo"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: `1.5px solid ${nameError ? "#B71C1C" : name ? "#2F6B3E" : "#E8E8E5"}`,
              fontSize: "15px",
              color: "#1A1A19",
              outline: "none",
              transition: "border-color 0.2s"
            }}
          />
          {nameError && (
            <p style={{
              fontSize: "11px",
              color: "#B71C1C",
              marginTop: "6px"
            }}>
              El nombre es obligatorio
            </p>
          )}
        </div>

        {/* Campo 3: Rol */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "#3D3D3B",
            marginBottom: "10px"
          }}>
            Rol *
          </label>
          <div className="flex gap-2">
            {ROLES.map((r) => {
              const isSelected = role === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{
                    flex: 1,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    backgroundColor: isSelected ? "#2F6B3E" : "#F4F4F2",
                    color: isSelected ? "white" : "#3D3D3B",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                  }}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Campo 4: PIN (opcional, solo si rol = Administrador o Dueño) */}
        {showPinField && (
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#3D3D3B",
              marginBottom: "10px"
            }}>
              PIN de acceso (opcional)
            </label>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={pinRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(index, e)}
                  style={{
                    width: "44px",
                    height: "52px",
                    borderRadius: "10px",
                    border: "1.5px solid #E8E8E5",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#1A1A19",
                    textAlign: "center",
                    outline: "none"
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Botón Guardar */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: isValid ? "#2F6B3E" : "#BDBDBA",
            color: "white",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 700,
            border: "none",
            cursor: isValid ? "pointer" : "not-allowed",
            marginBottom: "12px"
          }}
        >
          Guardar perfil
        </button>

        {/* Botón Cancelar */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "transparent",
            color: "#757572",
            fontSize: "14px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
