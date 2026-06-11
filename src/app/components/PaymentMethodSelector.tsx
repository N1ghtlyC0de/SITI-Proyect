import { Banknote, Smartphone, CreditCard } from "lucide-react";

export type PaymentMethod = "efectivo" | "nequi" | "daviplata" | "tarjeta";

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  icon: typeof Banknote;
}

const paymentMethods: PaymentMethodOption[] = [
  { id: "efectivo", label: "Efectivo", icon: Banknote },
  { id: "nequi", label: "Nequi", icon: Smartphone },
  { id: "daviplata", label: "Daviplata", icon: Smartphone },
  { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Método de pago</label>
      <div className="grid grid-cols-2 gap-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-muted"
              }`}
              style={{ minHeight: 44 }}
            >
              <Icon className={`size-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
                {method.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
