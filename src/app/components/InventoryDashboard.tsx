import { useState } from "react";
import {
  Package,
  ArrowLeft,
  Search,
  AlertTriangle,
  Edit,
  Plus,
  Trash2,
  ArrowDownAZ,
  ArrowUpZA,
  ArrowDown10,
  ArrowUp01,
  ChevronDown,
  Minus
} from "lucide-react";
import { HeaderNav } from "./HeaderNav";
import { PrimaryButton } from "./molecules/PrimaryButton";
import { StatusChip } from "./molecules/StatusChip";
import { formatCurrency } from "../lib/utils";
import { Modal } from "./molecules/Modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  const [sortBy, setSortBy] = useState("name-asc");
  const [filterStatus, setFilterStatus] = useState<"all" | "escasos" | "agotados">("all");
  
  type EditingProduct = Omit<Product, "stock" | "price"> & { stock: string | number; price: string | number };
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = inventory.filter(p => {
    if (filterStatus === "escasos") {
      if (p.status !== "warning" && p.status !== "critical" && p.stock !== 0) return false;
      if (p.stock === 0) return false; // Agotados aren't just "escasos"
    }
    if (filterStatus === "agotados" && p.stock !== 0) return false;

    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "stock-asc": return a.stock - b.stock;
      case "stock-desc": return b.stock - a.stock;
      default: return 0;
    }
  });

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreatingNew(false);
  };

  const handleCreateClick = () => {
    setEditingProduct({
      id: "",
      name: "",
      category: "",
      stock: "",
      status: "good",
      image: "",
      price: "",
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
        stock: Number(editingProduct.stock) || 0,
        image: editingProduct.image,
        price: Number(editingProduct.price) || 0,
        emoji: editingProduct.emoji
      });
    } else {
      onUpdateProduct?.(editingProduct.id, {
        ...editingProduct,
        stock: Number(editingProduct.stock) || 0,
        price: Number(editingProduct.price) || 0
      } as Product);
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
        className="sticky top-0 z-30 flex-shrink-0 flex items-center justify-between px-4 bg-primary text-primary-foreground shadow-sm w-full"
        style={{ height: "64px" }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => onNavigate?.("home")}
            className="rounded-full p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 shrink-0"
            aria-label="Volver al inicio"
            type="button"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight truncate hidden sm:block">Inventario en tiempo real</h1>
        </div>

        {/* Center Section - Navigation */}
        <div className="flex justify-center shrink-0 mx-2">
          <HeaderNav active="inventory" onNavigate={onNavigate} />
        </div>

        {/* Right Section */}
        <div className="flex flex-1 justify-end">
          <PrimaryButton
            variant="header"
            onClick={handleCreateClick}
            icon={<Plus aria-hidden="true" />}
            aria-label="Agregar nuevo producto"
          >
            <span className="hidden sm:inline">Nuevo Producto</span>
          </PrimaryButton>
        </div>
      </header>

      <div className="flex-1 overflow-auto pb-6 pt-0">
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
            <div className="w-px bg-border"></div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-destructive">{inventory.filter(p => p.stock === 0).length}</p>
              <p className="text-xs text-muted-foreground">Agotados</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
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
            <div className="sm:w-48 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-lg border border-border bg-card py-2.5 px-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]">
                  <span className="flex items-center gap-2">
                    {sortBy === "name-asc" && <ArrowDownAZ className="size-4 text-muted-foreground" />}
                    {sortBy === "name-desc" && <ArrowUpZA className="size-4 text-muted-foreground" />}
                    {sortBy === "stock-asc" && <ArrowDown10 className="size-4 text-muted-foreground" />}
                    {sortBy === "stock-desc" && <ArrowUp01 className="size-4 text-muted-foreground" />}
                    {sortBy === "name-asc" ? "Nombre (A-Z)" :
                     sortBy === "name-desc" ? "Nombre (Z-A)" :
                     sortBy === "stock-asc" ? "Stock (Menor a Mayor)" :
                     "Stock (Mayor a Menor)"}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="name-asc" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ArrowDownAZ className="size-4" />
                        <span>Nombre (A-Z)</span>
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name-desc" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ArrowUpZA className="size-4" />
                        <span>Nombre (Z-A)</span>
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="stock-asc" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ArrowDown10 className="size-4" />
                        <span>Stock (Menor a Mayor)</span>
                      </div>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="stock-desc" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ArrowUp01 className="size-4" />
                        <span>Stock (Mayor a Menor)</span>
                      </div>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            <StatusChip
              status="neutral"
              isActive={filterStatus === "all"}
              onClick={() => setFilterStatus("all")}
            >
              Todos
            </StatusChip>
            <StatusChip
              status="warning"
              isActive={filterStatus === "escasos"}
              onClick={() => setFilterStatus("escasos")}
            >
              Escasos
            </StatusChip>
            <StatusChip
              status="error"
              isActive={filterStatus === "agotados"}
              onClick={() => setFilterStatus("agotados")}
            >
              Agotados
            </StatusChip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex items-center gap-4 p-3.5 border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
                  product.status === "critical"
                    ? "border-destructive/50 hover:border-destructive bg-destructive/5"
                    : product.status === "warning"
                    ? "border-warning/50 hover:border-warning bg-warning/5"
                    : "border-border hover:border-foreground/20 bg-card"
                }`}
              >
                <div style={{ fontSize: "32px" }} className="leading-none shrink-0">{product.emoji || "📦"}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold" style={{ color: "#2F6B3E" }}>
                      {formatCurrency(product.price)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {product.status === "critical" && <AlertTriangle className="size-4 text-destructive" />}
                      {product.status === "warning" && <AlertTriangle className="size-4 text-warning" />}
                      <span className="text-xs font-medium text-muted-foreground mr-0.5">Stock:</span>
                      <span className={`text-base font-bold tabular-nums leading-none ${
                        product.status === "critical" ? "text-destructive" :
                        product.status === "warning" ? "text-warning" : "text-foreground"
                      }`}>
                        {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20 rounded-lg flex items-center justify-center p-2 aspect-square transition-colors focus:outline-none focus:ring-2 focus:ring-warning shrink-0 ml-2"
                  type="button"
                  aria-label={`Editar producto ${product.name}`}
                >
                  <Edit className="size-5" aria-hidden="true" />
                </button>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full rounded-card bg-card p-8 text-center border border-border">
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
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <input
                    id="product-price"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={editingProduct.price === "" ? "" : Number(editingProduct.price).toLocaleString("es-CO")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      if (rawValue === "") {
                        setEditingProduct({ ...editingProduct, price: "" });
                      } else {
                        setEditingProduct({ ...editingProduct, price: parseInt(rawValue, 10) });
                      }
                    }}
                    placeholder="0"
                    className="w-full p-3 pl-8 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    aria-label="Precio del producto"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="product-stock" className="text-sm font-semibold text-muted-foreground block mb-1.5">
                  Stock (unidades)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(prev => prev ? { ...prev, stock: Math.max(0, (Number(prev.stock) || 0) - 1) } : prev)}
                    className="flex items-center justify-center size-11 rounded-card border border-border bg-muted hover:bg-muted/80 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Reducir stock"
                  >
                    <Minus className="size-5" />
                  </button>
                  <input
                    id="product-stock"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setEditingProduct({ ...editingProduct, stock: "" });
                      } else {
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed) && parsed >= 0) {
                          setEditingProduct({ ...editingProduct, stock: parsed });
                        }
                      }
                    }}
                    placeholder="0"
                    className="w-full text-center p-3 text-sm rounded-card border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    aria-label="Stock disponible del producto"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingProduct(prev => prev ? { ...prev, stock: (Number(prev.stock) || 0) + 1 } : prev)}
                    className="flex items-center justify-center size-11 rounded-card border border-border bg-muted hover:bg-muted/80 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Aumentar stock"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>
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
    </div>
  );
}
