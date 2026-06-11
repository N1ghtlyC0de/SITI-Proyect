import { useState } from "react";
import { ChevronLeft, Minus, Plus } from "lucide-react";
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
  const [showStockError, setShowStockError] = useState(false);

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

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    // Validar que haya stock suficiente
    if (currentQtyInCart + 1 > product.stock) {
      setShowStockError(true);
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
            setShowStockError(true);
            return item;
          }
        }

        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleClearCart = () => {
    setCart([]);
    setPaymentMethod(null);
    setAmountReceived("");
  };

  const handleConfirmSale = () => {
    if (!canConfirm) return;

    // Validar stock final antes de confirmar
    for (const item of cart) {
      const product = availableProducts.find(p => p.id === item.id);
      if (product && item.quantity > product.stock) {
        setShowStockError(true);
        return;
      }
    }

    onCompleteSale?.(cart, total, paymentMethod!, paymentMethod === "Efectivo" ? amountValue : undefined);
    setShowSuccess(true);
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
        {hasCartItems ? cart.map(item => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "0.5px solid #F4F4F2"
            }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.id, -1)}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "1px solid #E8E8E5",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                type="button"
              >
                <Minus className="size-3" style={{ color: "#757572" }} />
              </button>
              <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, 1)}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "1px solid #E8E8E5",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                type="button"
              >
                <Plus className="size-3" style={{ color: "#757572" }} />
              </button>
            </div>

            <div style={{ flex: 1, marginLeft: "12px" }}>
              <div style={{ fontSize: "13px", color: "#1A1A19" }}>
                {item.name}
              </div>
            </div>

            <div style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1A1A19",
              fontVariantNumeric: "tabular-nums"
            }}>
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        )) : (
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
            <input
              id="amount-received"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="0"
              value={amountReceived}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val < 0) return;
                setAmountReceived(e.target.value);
              }}
              aria-describedby={amountValue < total && amountValue > 0 ? "amount-error" : undefined}
              aria-invalid={amountValue < total && amountValue > 0}
              style={{
                width: "100%",
                minHeight: "52px",
                padding: "14px 16px",
                fontSize: "18px",
                fontWeight: 600,
                borderRadius: "12px",
                border: amountValue < total && amountValue > 0 ? "2px solid #B71C1C" : "2px solid #E8E8E5",
                backgroundColor: amountValue < total && amountValue > 0 ? "#FFEBEE" : "white",
                transition: "all 0.2s ease"
              }}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
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
                <div style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#2F6B3E",
                  fontVariantNumeric: "tabular-nums"
                }}>
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
    <div className="flex min-h-screen flex-col bg-muted" style={{ width: "100%" }}>
      {/* Header verde sin border-radius */}
      <header className="sticky top-0 z-30 bg-primary text-primary-foreground p-4 flex-shrink-0">
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

      <div className={`flex-1 overflow-auto ${hasCartItems ? "pb-[360px] lg:pb-4" : "pb-4"}`}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6" style={{ padding: "16px" }}>
          <div>
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

            <div style={{ padding: "16px 0 0" }}>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    emoji={product.emoji}
                    price={product.price}
                    stock={product.stock}
                    isInCart={isInCart(product.id)}
                    cartQuantity={getCartQuantity(product.id)}
                    onClick={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-4">
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              border: "1px solid #E8E8E5"
            }}>
              {cartPanelContent}
            </div>
          </aside>
        </div>
      </div>

      {hasCartItems && (
        <div
          className="lg:hidden"
          style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "14px 14px 0 0",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.1)",
          display: "block"
        }}
        >
          <div className="lg:hidden">
            {cartPanelContent}
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
            // La venta ya fue registrada, aquí se podría implementar lógica de reversión
          }}
        />
      )}

      <Modal
        isOpen={showStockError}
        onClose={() => setShowStockError(false)}
        size="sm"
      >
        <div className="text-center">
          <div className="text-6xl mb-4" role="img" aria-label="Advertencia">⚠️</div>
          <h3 className="text-xl font-bold mb-4 text-foreground">
            No hay suficiente stock
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            La cantidad solicitada supera el stock disponible. Por favor, revisa las cantidades en tu carrito.
          </p>
        </div>
      </Modal>
    </div>
  );
}
