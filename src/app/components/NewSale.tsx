import { useState } from "react";
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react";
import { SaleSuccessModal } from "./SaleSuccessModal";
import { formatCurrency } from "../lib/utils";
import { ProductCard } from "./molecules/ProductCard";
import { Modal } from "./molecules/Modal";

interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface NewSaleProps {
  inventory?: any[];
  onCompleteSale?: (cart: any[], total: number, paymentMethod: string, amountReceived?: number) => void;
  onBack?: () => void;
}

type PaymentMethod = "Efectivo" | "Transferencia" | "Tarjeta débito" | "Tarjeta crédito";

export function NewSale({ inventory = [], onCompleteSale, onBack }: NewSaleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItemData[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [amountReceived, setAmountReceived] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const availableProducts = inventory.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    emoji: item.emoji || "📦",
    stock: item.stock
  }));

  const filteredProducts = availableProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const amountValue = parseFloat(amountReceived) || 0;
  const change = amountValue - total;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    // Validar que haya stock suficiente
    if (currentQtyInCart + 1 > product.stock) {
      triggerToast("Stock máximo alcanzado para este producto");
      return;
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          emoji: product.emoji,
        },
      ]);
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;

        // Si estamos aumentando, validar stock
        if (delta > 0) {
          const product = availableProducts.find(p => p.id === id);
          if (product && newQty > product.stock) {
            triggerToast("Stock máximo alcanzado para este producto");
            return item;
          }
        }

        return newQty >= 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    setPaymentMethod(null);
    setAmountReceived("");
    setShowMobileCart(false);
  };

  const handleConfirmSale = () => {
    if (!canConfirm) return;

    // Validar stock final antes de confirmar
    for (const item of cart) {
      const product = availableProducts.find(p => p.id === item.id);
      if (product && item.quantity > product.stock) {
        triggerToast("Stock máximo alcanzado para este producto");
        return;
      }
    }

    onCompleteSale?.(cart, total, paymentMethod!, paymentMethod === "Efectivo" ? amountValue : undefined);
    setShowSuccess(true);
    setShowMobileCart(false);
  };

  const handleNewSale = () => {
    setCart([]);
    setAmountReceived("");
    setPaymentMethod(null);
    setShowSuccess(false);
  };

  const handleFinish = () => {
    setShowSuccess(false);
    onBack?.();
  };

  // Validación del botón
  let canConfirm = false;
  let buttonBg = "#E8E8E5";
  let buttonText = "#BDBDBA";
  let buttonBorder = "transparent";
  let buttonLabel = "Agrega productos al carrito";

  if (cart.length > 0 && !paymentMethod) {
    buttonBg = "#E8E8E5";
    buttonText = "#BDBDBA";
    buttonLabel = "Selecciona el método de pago";
  } else if (cart.length > 0 && paymentMethod) {
    if (paymentMethod === "Efectivo") {
      if (!amountReceived || amountValue === 0) {
        buttonBg = "#E8E8E5";
        buttonText = "#BDBDBA";
        buttonLabel = "Ingresa el monto recibido";
      } else if (amountValue < total) {
        buttonBg = "#FFEBEE";
        buttonText = "#B71C1C";
        buttonBorder = "#B71C1C";
        buttonLabel = `Falta ${formatCurrency(total - amountValue)}`;
      } else {
        canConfirm = true;
        buttonBg = "#2F6B3E";
        buttonText = "white";
        buttonLabel = `Confirmar venta · ${formatCurrency(total)}`;
      }
    } else {
      canConfirm = true;
      buttonBg = "#2F6B3E";
      buttonText = "white";
      buttonLabel = `Confirmar venta · ${formatCurrency(total)}`;
    }
  }

  const isInCart = (productId: string) => cart.some(item => item.id === productId);
  const getCartQuantity = (productId: string) => cart.find(item => item.id === productId)?.quantity || 0;
  const hasCartItems = cart.length > 0;

  const cartPanelContent = (
    <>
      <div style={{
        padding: "14px 16px",
        borderBottom: "0.5px solid #E8E8E5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A19" }}>
          Carrito {hasCartItems ? `· ${formatCurrency(total)}` : ""}
        </div>
        <button
          onClick={handleClearCart}
          style={{ fontSize: "12px", color: hasCartItems ? "#B71C1C" : "#BDBDBA", fontWeight: 600 }}
          disabled={!hasCartItems}
          type="button"
        >
          Limpiar
        </button>
      </div>

      <div style={{
        maxHeight: "160px",
        overflowY: "auto",
        padding: "8px 16px"
      }}>
        {hasCartItems ? cart.map(item => {
          const productItem = availableProducts.find(p => p.id === item.id);
          const isAtMaxStock = productItem ? item.quantity >= productItem.stock : false;

          return (
            <div
              key={item.id}
              className="flex flex-col border-b border-border/50 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
              style={{
                width: "100%"
              }}
            >
              {/* Top Row (Details): Name and Subtotal Price */}
              <div className="flex justify-between items-start w-full gap-3">
                <div style={{ fontSize: "13px", color: "#1A1A19", fontWeight: 500, wordBreak: "break-word" }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1A1A19",
                  fontVariantNumeric: "tabular-nums",
                  flexShrink: 0
                }}>
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>

              {/* Bottom Row (Controls): Quantity buttons + Trash */}
              <div className="flex justify-between items-center w-full mt-2">
                {/* Quantity Controls (left side) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="transition-all hover:opacity-90 active:scale-95"
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "#2F6B3E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                    type="button"
                  >
                    <Minus className="size-3" style={{ color: "white" }} />
                  </button>
                  <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    disabled={isAtMaxStock}
                    className="transition-all hover:opacity-90 active:scale-95"
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "#2F6B3E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isAtMaxStock ? 0.45 : 1,
                      cursor: isAtMaxStock ? "not-allowed" : "pointer"
                    }}
                    type="button"
                  >
                    <Plus className="size-3" style={{ color: "white" }} />
                  </button>
                </div>

                {/* Trash Icon (right side) */}
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded hover:bg-destructive/10 shrink-0"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer"
                  }}
                  title="Eliminar del carrito"
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        }) : (
          <div style={{ padding: "14px 0", color: "#757572", fontSize: "13px" }}>
            Agrega productos para iniciar el carrito.
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px", borderTop: "0.5px solid #E8E8E5" }}>
        <div style={{
          fontSize: "10px",
          textTransform: "uppercase",
          color: "#757572",
          fontWeight: 600,
          letterSpacing: "0.5px",
          marginBottom: "10px"
        }}>
          Método de pago
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 lg:grid-cols-2">
          {(["Efectivo", "Transferencia", "Tarjeta débito", "Tarjeta crédito"] as PaymentMethod[]).map(method => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              disabled={!hasCartItems}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: `1.5px solid ${paymentMethod === method ? "#2F6B3E" : "#E8E8E5"}`,
                backgroundColor: paymentMethod === method ? "#F0FAF4" : "white",
                fontSize: "12px",
                fontWeight: paymentMethod === method ? 700 : 500,
                color: paymentMethod === method ? "#2F6B3E" : "#1A1A19",
                opacity: hasCartItems ? 1 : 0.6,
                cursor: hasCartItems ? "pointer" : "not-allowed"
              }}
              type="button"
            >
              {method}
            </button>
          ))}
        </div>

        {paymentMethod === "Efectivo" && hasCartItems && (
          <div className="space-y-2">
            <label htmlFor="amount-received" style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A19", display: "block", marginBottom: "8px" }}>
              Monto recibido en efectivo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground pointer-events-none">
                $
              </span>
              <input
                id="amount-received"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amountReceived ? new Intl.NumberFormat('es-CO').format(parseInt(amountReceived, 10)) : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  if (rawValue.length > 9) return;
                  setAmountReceived(rawValue);
                }}
                aria-describedby={amountValue < total && amountValue > 0 ? "amount-error" : undefined}
                aria-invalid={amountValue < total && amountValue > 0}
                style={{
                  width: "100%",
                  minHeight: "52px",
                  padding: "14px 16px 14px 28px",
                  fontSize: "18px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: amountValue < total && amountValue > 0 ? "2px solid #B71C1C" : "2px solid #E8E8E5",
                  backgroundColor: amountValue < total && amountValue > 0 ? "#FFEBEE" : "white",
                  transition: "all 0.2s ease"
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            {amountValue < total && amountValue > 0 && (
              <div id="amount-error" role="alert" style={{ fontSize: "14px", color: "#B71C1C", fontWeight: 600, marginTop: "8px" }}>
                ⚠️ El monto ingresado es menor al total de la venta
              </div>
            )}

            {amountValue >= total && amountValue > 0 && (
              <div style={{
                backgroundColor: "#E8F5EE",
                border: "1px solid rgba(47,107,62,0.15)",
                borderRadius: "10px",
                padding: "10px 12px"
              }}>
                <div style={{ fontSize: "12px", color: "#757572", marginBottom: "4px" }}>
                  Cambio a entregar
                </div>
                <div 
                  className="break-all"
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2F6B3E",
                    fontVariantNumeric: "tabular-nums",
                    overflowWrap: "anywhere"
                  }}
                >
                  {formatCurrency(change)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "10px 16px", borderTop: "0.5px solid #E8E8E5" }}>
        <div style={{
          backgroundColor: "#1A1A19",
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
            Total venta
          </span>
          <span style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "white",
            fontVariantNumeric: "tabular-nums"
          }}>
            {formatCurrency(total)}
          </span>
        </div>

        <button
          onClick={handleConfirmSale}
          disabled={!canConfirm}
          aria-label={buttonLabel}
          style={{
            width: "100%",
            minHeight: "56px",
            padding: "16px 24px",
            borderRadius: "14px",
            fontSize: "17px",
            fontWeight: 700,
            backgroundColor: buttonBg,
            color: buttonText,
            border: `2px solid ${buttonBorder}`,
            cursor: canConfirm ? "pointer" : "not-allowed",
            transition: "all 0.2s ease"
          }}
          type="button"
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col bg-muted overflow-hidden" style={{ width: "100%" }}>
      {/* Header verde sin border-radius */}
      <header className="bg-primary text-primary-foreground p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg px-2 py-1 -ml-2 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Volver a la página anterior"
            type="button"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="text-sm font-medium">Volver</span>
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1 leading-tight">Nueva Venta</h1>
          <p className="text-sm opacity-90" aria-live="polite" aria-atomic="true">
            {cart.length === 0
              ? "Selecciona los productos"
              : `${totalItems} item${totalItems !== 1 ? "s" : ""} · ${formatCurrency(total)}`
            }
          </p>
        </div>
      </header>

      {/* Responsive Container: Row on desktop, Col on mobile. Screen overflow hidden to prevent body scroll */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
        
        {/* Product Area: Search bar (fixed) + Product Grid (independent scroll) */}
        <div className="flex-1 flex flex-col min-h-0 p-4 pb-20 lg:pb-4 h-[calc(100vh-120px)] lg:h-auto overflow-y-auto">
          {/* Fixed Search Bar */}
          <div className="flex-shrink-0 mb-4">
            <label htmlFor="search-products" className="sr-only">
              Buscar producto
            </label>
            <input
              id="search-products"
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                minHeight: "48px",
                padding: "14px 16px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "2px solid #E8E8E5",
                backgroundColor: "white",
                transition: "border-color 0.2s ease"
              }}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {/* Product selection grid - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
              {filteredProducts.map(product => {
                const cartQty = getCartQuantity(product.id);
                const displayStock = Math.max(0, product.stock - cartQty);
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    emoji={product.emoji}
                    price={product.price}
                    stock={displayStock}
                    isInCart={isInCart(product.id)}
                    cartQuantity={cartQty}
                    onClick={() => handleAddToCart(product)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar: Expanded Cart Sidebar (hidden on smaller screens) */}
        <aside className="hidden lg:block lg:w-[380px] lg:border-l lg:border-[#E8E8E5] lg:bg-white lg:overflow-y-auto flex-shrink-0">
          {cartPanelContent}
        </aside>
      </div>

      {/* Mobile Sticky Footer Summary (Only visible on mobile and when items are in cart) */}
      {hasCartItems && (
        <div
          onClick={() => setShowMobileCart(true)}
          className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 flex items-center justify-between shadow-lg lg:hidden z-40 cursor-pointer hover:bg-primary/95 active:scale-[0.99] transition-all"
          style={{
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -4px 16px rgba(0,0,0,0.15)"
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">Ver Carrito</span>
            <span className="text-sm opacity-90">· {totalItems} {totalItems === 1 ? "item" : "items"}</span>
          </div>
          <span className="text-lg font-bold">{formatCurrency(total)}</span>
        </div>
      )}

      {/* Mobile Drawer (Bottom Sheet Overlay) */}
      {showMobileCart && hasCartItems && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end lg:hidden transition-all duration-300">
          {/* Backdrop (Tapping closes the drawer) */}
          <div className="flex-1" onClick={() => setShowMobileCart(false)} />
          
          {/* Collapsible drawer content sheet */}
          <div 
            className="bg-white rounded-t-[24px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Close Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E5]">
              <h2 className="text-lg font-bold text-gray-900">Carrito de Compras</h2>
              <button
                onClick={() => setShowMobileCart(false)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg bg-gray-100 active:scale-95 transition-all"
                type="button"
              >
                Cerrar
              </button>
            </div>

            {/* Inner cart contents (Scrollable) */}
            <div className="overflow-y-auto flex-1 pb-8">
              {cartPanelContent}
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <SaleSuccessModal
          ticketNumber={Math.random().toString(36).substring(2, 8).toUpperCase()}
          total={total}
          paymentMethod={paymentMethod || "Efectivo"}
          onNewSale={handleNewSale}
          onFinish={handleFinish}
          onUndo={() => {
            setShowSuccess(false);
          }}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="text-base" role="img" aria-label="Error">⚠️</span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
