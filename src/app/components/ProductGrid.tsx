import { Plus } from "lucide-react";
import { formatCurrency } from "../lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="flex flex-col items-center gap-2 rounded-card bg-card p-4 text-center shadow-sm transition-all active:scale-95 disabled:opacity-50"
          style={{ minHeight: 120 }}
        >
          <span className="text-4xl">{product.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">{product.name}</p>
            <p className="mt-1 text-xs font-semibold tabular-nums text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Plus className="size-3" />
              Agregar
            </div>
          )}
          {product.stock === 0 && (
            <span className="text-xs text-destructive">Sin stock</span>
          )}
        </button>
      ))}
    </div>
  );
}
