import { useState } from "react";
import {
  Package,
  ArrowLeft,
  Search,
  AlertTriangle,
  Edit,
  Plus,
  Trash2
} from "lucide-react";
import { BottomNav } from "./BottomNav";
import { formatCurrency } from "../lib/utils";
import { Modal } from "./molecules/Modal";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  status: "good" | "warning" | "critical";
  image: string;
  price: number;
  emoji?: string;
}

interface InventoryDashboardProps {
  inventory?: Product[];
  onNavigate?: (id: string) => void;
  onUpdateProduct?: (productId: string, updates: Partial<Product>) => void;
  onAddProduct?: (product: Omit<Product, "id" | "status">) => void;
  onDeleteProduct?: (productId: string) => void;
}

export function InventoryDashboard({ inventory = [], onNavigate, onUpdateProduct, onAddProduct, onDeleteProduct }: InventoryDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = inventory.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreatingNew(false);
  };

  const handleCreateClick = () => {
    setEditingProduct({
      id: "",
      name: "",
      category: "",
      stock: 0,
      status: "good",
      image: "",
      price: 0,
      emoji: "📦"
    });
    setIsCreatingNew(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    if (isCreatingNew) {
      onAddProduct?.({
        name: editingProduct.name,
        category: editingProduct.category,
        stock: editingProduct.stock,
        image: editingProduct.image,
        price: editingProduct.price,
        emoji: editingProduct.emoji
      });
    } else {
      onUpdateProduct?.(editingProduct.id, editingProduct);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = (productId: string) => {
    onDeleteProduct?.(productId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted" style={{ width: "100%" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex-shrink-0 flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-sm"
        style={{ height: "52px" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.("home")}
            className="rounded-full p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Volver al inicio"
            type="button"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Inventario en tiempo real</h1>
        </div>
        <button
          onClick={handleCreateClick}
          className="bg-white/20 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          type="button"
          aria-label="Agregar nuevo producto"
        >
          <Plus className="size-4" aria-hidden="true" />
          Agregar
        </button>
      </header>

      <div className="flex-1 overflow-auto pb-6 pt-14">
        <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
          
          <div className="rounded-card bg-card p-4 shadow-sm border border-border flex gap-4">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold">{inventory.reduce((acc, p) => acc + p.stock, 0)}</p>
              <p className="text-xs text-muted-foreground">Total artículos</p>
            </div>
            <div className="w-px bg-border"></div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-warning">{inventory.filter(p => p.status === "warning" || p.status === "critical").length}</p>
              <p className="text-xs text-muted-foreground">Por agotarse</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="search-inventory" className="sr-only">
              Buscar producto o categoría
            </label>
            <input
              id="search-inventory"
              type="text"
              placeholder="Buscar producto o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
            />
          </div>

          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-card bg-card p-3 shadow-sm border border-border"
              >
                <div style={{ fontSize: "32px" }}>{product.emoji || "📦"}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                  <div className="text-xs font-semibold" style={{ color: "#2F6B3E", marginTop: "2px" }}>
                    {formatCurrency(product.price)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {product.status === "critical" && <AlertTriangle className="size-4 text-destructive" />}
                    {product.status === "warning" && <AlertTriangle className="size-4 text-warning" />}
                    <span className={`text-xl font-bold tabular-nums ${
                      product.status === "critical" ? "text-destructive" :
                      product.status === "warning" ? "text-warning" : "text-foreground"
                    }`}>
                      {product.stock}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">unidades</span>
                </div>

                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-muted border border-border rounded-lg p-2 flex items-center justify-center transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary min-w-[44px] min-h-[44px]"
                  type="button"
                  aria-label={`Editar producto ${product.name}`}
                >
                  <Edit className="size-4 text-foreground" aria-hidden="true" />
                </button>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="rounded-card bg-card p-8 text-center border border-border">
                <Package className="mx-auto mb-2 size-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición/creación */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => {
          setEditingProduct(null);
          setIsCreatingNew(false);
        }}
        title={isCreatingNew ? "Agregar producto" : "Editar producto"}
        size="md"
      >
        {editingProduct && (
          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="product-emoji" className="text-sm font-semibold text-muted-foreground block mb-1.5">
                  Emoji
                </label>
                <input
                  id="product-emoji"
                  type="text"
                  value={editingProduct.emoji || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, emoji: e.target.value })}
                  placeholder="📦"
                  className="w-full p-3 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  aria-label="Emoji del producto"
                />
              </div>

              <div>
                <label htmlFor="product-name" className="text-sm font-semibold text-muted-foreground block mb-1.5">
                  Nombre del producto
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Ej: Empanadas de carne"
                  className="w-full p-3 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="product-category" className="text-sm font-semibold text-muted-foreground block mb-1.5">
                  Categoría
                </label>
                <select
                  id="product-category"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full p-3 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Seleccione una categoría</option>
                  <option value="Comida">Comida</option>
                  <option value="Bebida">Bebida</option>
                  <option value="Postre/dulce">Postre/dulce</option>
                  <option value="Paquete">Paquete</option>
                  <option value="Combo">Combo</option>
                </select>
              </div>

              <div>
                <label htmlFor="product-price" className="text-sm font-semibold text-muted-foreground block mb-1.5">
                  Precio
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  value={editingProduct.price}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (val >= 0) {
                      setEditingProduct({ ...editingProduct, price: val });
                    }
                  }}
                  placeholder="0"
                  className="w-full p-3 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  aria-label="Precio del producto"
                />
              </div>

              <div>
                <label htmlFor="product-stock" className="text-sm font-semibold text-muted-foreground block mb-1.5">
                  Stock (unidades)
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={editingProduct.stock}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= 0) {
                      setEditingProduct({ ...editingProduct, stock: val });
                    }
                  }}
                  placeholder="0"
                  className="w-full p-3 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  aria-label="Stock disponible del producto"
                />
              </div>

              <div className="flex gap-3 pt-4">
                {!isCreatingNew && (
                  <button
                    onClick={() => setShowDeleteConfirm(editingProduct.id)}
                    className="flex-1 p-3.5 rounded-card text-sm font-bold bg-destructive/10 text-destructive border border-destructive transition-colors hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive flex items-center justify-center gap-2 min-h-[44px]"
                    type="button"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Eliminar
                  </button>
                )}
                <button
                  onClick={handleSaveProduct}
                  disabled={!editingProduct.name || !editingProduct.category}
                  className={`flex-[2] p-3.5 rounded-card text-sm font-bold transition-all min-h-[44px] ${
                    !editingProduct.name || !editingProduct.category
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                  }`}
                  type="button"
                >
                  {isCreatingNew ? "Crear producto" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmación de eliminación */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        size="sm"
        showCloseButton={false}
      >
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            ¿Eliminar producto?
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (showDeleteConfirm) {
                  handleDeleteProduct(showDeleteConfirm);
                  setEditingProduct(null);
                }
              }}
              className="w-full rounded-lg py-3 text-sm font-semibold text-destructive-foreground bg-destructive transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive min-h-[44px]"
              type="button"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="w-full rounded-lg py-3 text-sm font-semibold text-muted-foreground border border-border transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border min-h-[44px]"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <BottomNav active="inventory" onNavigate={onNavigate} />
    </div>
  );
}
