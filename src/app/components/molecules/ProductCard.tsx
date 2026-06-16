import { formatCurrency } from "../../lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  emoji?: string;
  price: number;
  stock: number;
  isInCart?: boolean;
  cartQuantity?: number;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  lowStockThreshold?: number;
}

export function ProductCard({
  name,
  emoji = "📦",
  price,
  stock,
  isInCart = false,
  cartQuantity = 0,
  disabled = false,
  onClick,
  className = "",
  lowStockThreshold = 10
}: ProductCardProps) {
  const currentStock = stock ?? 0;
  const currentThreshold = lowStockThreshold ?? 10;
  const outOfStock = currentStock === 0;
  const isLowStock = currentStock <= currentThreshold && currentStock > 0;

  const stockColor = outOfStock
    ? "text-destructive font-semibold"
    : isLowStock
    ? "text-amber-600 font-semibold"
    : "text-muted-foreground";

  return (
    <button
      onClick={onClick}
      disabled={disabled || outOfStock}
      className={`relative text-left rounded-card border-2 p-3 shadow-sm transition-all ${
        isInCart
          ? "bg-success/5 border-success"
          : "bg-card border-transparent"
      } ${
        disabled || outOfStock
          ? "opacity-45 cursor-not-allowed"
          : "cursor-pointer hover:shadow-md active:scale-98"
      } ${className}`}
      aria-label={`${name}, precio ${formatCurrency(price)}, ${currentStock} unidades disponibles${isInCart ? `, ${cartQuantity} en carrito` : ""}`}
      type="button"
    >
      {isInCart && cartQuantity > 0 && (
        <div
          className="absolute top-2 right-2 size-5 rounded-full bg-success text-primary-foreground flex items-center justify-center text-xs font-bold"
          aria-label={`${cartQuantity} en carrito`}
        >
          {cartQuantity}
        </div>
      )}

      <div className="text-3xl mb-2" aria-hidden="true">
        {emoji}
      </div>

      <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
        {name}
      </h3>

      <p className="text-sm font-bold text-primary mb-1">
        {formatCurrency(price)}
      </p>

      <p className={`text-xs font-medium ${stockColor}`}>
        {currentStock} en stock
      </p>
    </button>
  );
}
