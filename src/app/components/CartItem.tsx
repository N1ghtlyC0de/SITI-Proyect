import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "../lib/utils";

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <span className="text-2xl">{item.emoji}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {formatCurrency(item.price)} × {item.quantity}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center font-medium tabular-nums">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="flex size-8 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
