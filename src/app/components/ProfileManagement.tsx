import { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { ProfileFormSheet } from "./ProfileFormSheet";
import { DeleteProfileModal } from "./DeleteProfileModal";
import { toast } from "sonner";

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

interface ProfileManagementProps {
  vendors: Vendor[];
  currentVendorId: string;
  onBack: () => void;
  onCreate: (vendor: Omit<Vendor, "id">) => void;
  onUpdate: (vendorId: string, updates: Partial<Omit<Vendor, "id">>) => void;
  onDelete: (vendorId: string) => void;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function ProfileManagement({ vendors, currentVendorId, onBack, onCreate, onUpdate, onDelete }: ProfileManagementProps) {
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);

  const handleCreateClick = () => {
    setEditingVendor(null);
    setShowFormSheet(true);
  };

  const handleEditClick = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowFormSheet(true);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    if (vendor.id === currentVendorId) {
      toast.error("No puedes eliminar el turno activo", {
        duration: 3000,
        style: {
          backgroundColor: "#FFEBEE",
          color: "#B71C1C",
          borderLeft: "3px solid #B71C1C",
          fontWeight: 600
        }
      });
      return;
    }
    setDeletingVendor(vendor);
  };

  const handleFormSubmit = (vendorData: Omit<Vendor, "id">) => {
    if (editingVendor) {
      onUpdate(editingVendor.id, vendorData);
      toast.success(`Perfil de ${vendorData.name} actualizado`, {
        duration: 3000,
        style: {
          backgroundColor: "#E8F5EE",
          color: "#2F6B3E",
          borderLeft: "3px solid #2F6B3E",
          fontWeight: 600
        }
      });
    } else {
      onCreate(vendorData);
      toast.success(`Perfil de ${vendorData.name} creado`, {
        duration: 3000,
        style: {
          backgroundColor: "#E8F5EE",
          color: "#2F6B3E",
          borderLeft: "3px solid #2F6B3E",
          fontWeight: 600
        }
      });
    }
    setShowFormSheet(false);
    setEditingVendor(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingVendor) {
      onDelete(deletingVendor.id);
      toast.info("Perfil eliminado correctamente", {
        duration: 3000,
        style: {
          backgroundColor: "#E3F2FD",
          color: "#01579B",
          borderLeft: "3px solid #01579B",
          fontWeight: 600
        }
      });
      setDeletingVendor(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F4F4F2", width: "100%" }}>
      {/* Header verde */}
      <div
        style={{
          backgroundColor: "#2F6B3E",
          padding: "16px 16px 20px",
          flexShrink: 0
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-3"
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          <ArrowLeft style={{ width: "20px", height: "20px" }} />
          Volver
        </button>
        <h1 style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "white",
          marginBottom: "4px"
        }}>
          Perfiles del negocio
        </h1>
        <p style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.7)"
        }}>
          {vendors.length} {vendors.length === 1 ? "persona configurada" : "personas configuradas"}
        </p>
      </div>

      {/* Lista de perfiles */}
      <div className="flex-1 overflow-auto p-4">
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}
        >
          {vendors.map((vendor, index) => {
            const isActive = vendor.id === currentVendorId;
            const canDelete = vendor.id !== currentVendorId;

            return (
              <div
                key={vendor.id}
                style={{
                  padding: "16px",
                  borderBottom: index < vendors.length - 1 ? "1px solid #F4F4F2" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: vendor.avatarColor.bg,
                    color: vendor.avatarColor.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {getInitials(vendor.name)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1A1A19",
                    marginBottom: "2px"
                  }}>
                    {vendor.name}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "#757572",
                    marginBottom: "4px"
                  }}>
                    {vendor.role}
                  </div>
                  {isActive && (
                    <div style={{
                      backgroundColor: "#E8F5EE",
                      color: "#2F6B3E",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "12px",
                      display: "inline-block"
                    }}>
                      Activo ahora
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(vendor)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "#F4F4F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "none"
                    }}
                  >
                    <Edit style={{ width: "18px", height: "18px", color: "#757572" }} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(vendor)}
                    disabled={!canDelete}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: canDelete ? "#FFEBEE" : "#F4F4F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: canDelete ? "pointer" : "not-allowed",
                      border: "none",
                      opacity: canDelete ? 1 : 0.5
                    }}
                  >
                    <Trash2 style={{ width: "18px", height: "18px", color: canDelete ? "#B71C1C" : "#BDBDBA" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={handleCreateClick}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#2F6B3E",
          boxShadow: "0 4px 12px rgba(47,107,62,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "none",
          zIndex: 10
        }}
      >
        <Plus style={{ width: "28px", height: "28px", color: "white" }} />
      </button>

      {/* Form Sheet */}
      {showFormSheet && (
        <ProfileFormSheet
          vendor={editingVendor}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowFormSheet(false);
            setEditingVendor(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deletingVendor && (
        <DeleteProfileModal
          vendorName={deletingVendor.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingVendor(null)}
        />
      )}
    </div>
  );
}
