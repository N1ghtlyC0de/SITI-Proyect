import { formatCurrency } from "../lib/utils";

interface AmountInputProps {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  variant?: "default" | "success" | "warning";
}

export function AmountInput({
  label,
  value,
  onChange,
  readonly = false,
  variant = "default",
}: AmountInputProps) {
  const variantStyles = {
    default: "border-border bg-input-background",
    success: "border-success bg-success/5 text-success",
    warning: "border-warning bg-warning/5 text-warning",
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {readonly ? (
        <div
          className={`rounded-lg border-2 p-3 font-semibold tabular-nums ${variantStyles[variant]}`}
        >
          {formatCurrency(value)}
        </div>
      ) : (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange?.(Number(e.target.value))}
            placeholder="0"
            className="w-full rounded-lg border-2 border-border bg-input-background py-3 pl-8 pr-4 font-semibold tabular-nums outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}
    </div>
  );
}
