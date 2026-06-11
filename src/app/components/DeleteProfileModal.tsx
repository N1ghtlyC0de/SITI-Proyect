interface DeleteProfileModalProps {
  vendorName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProfileModal({ vendorName, onConfirm, onCancel }: DeleteProfileModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "320px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
        }}
      >
        {/* Icono de advertencia */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#FFEBEE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px"
          }}
        >
          ⚠️
        </div>

        {/* Título */}
        <h3 style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "#1A1A19",
          textAlign: "center",
          marginBottom: "8px"
        }}>
          ¿Eliminar a {vendorName}?
        </h3>

        {/* Mensaje */}
        <p style={{
          fontSize: "13px",
          color: "#757572",
          textAlign: "center",
          lineHeight: 1.5,
          marginBottom: "24px"
        }}>
          Esta acción no se puede deshacer. Las ventas registradas en este turno se conservarán en el historial.
        </p>

        {/* Botones */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onCancel}
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#F4F4F2",
              color: "#3D3D3B",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#B71C1C",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
