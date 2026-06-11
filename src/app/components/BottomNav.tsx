import { FocusEventHandler, useState } from "react";
import { Home, ShoppingCart, Package, Clock } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "sales", label: "Ventas", icon: ShoppingCart },
  { id: "inventory", label: "Inventario", icon: Package },
  { id: "shifts", label: "Turnos", icon: Clock },
];

interface BottomNavProps {
  active: string;
  onNavigate?: (id: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const [expanded, setExpanded] = useState(false);

  const handleBlur: FocusEventHandler<HTMLElement> = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setExpanded(false);
    }
  };

  return (
    <nav
      className="fixed left-1/2 top-14 z-40 -translate-x-1/2"
      aria-label="Navegación principal"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={handleBlur}
    >
      <div
        className={`flex items-center gap-1 rounded-2xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85 transition-all duration-200 ${
          expanded ? "w-[360px]" : "w-[220px]"
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`group flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              type="button"
            >
              <Icon className="size-5" aria-hidden="true" />
              <span
                className={`overflow-hidden whitespace-nowrap text-xs font-semibold transition-all duration-200 ${
                  expanded ? "max-w-[90px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
