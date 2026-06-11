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

interface HeaderNavProps {
  active: string;
  onNavigate?: (id: string) => void;
}

export function HeaderNav({ active, onNavigate }: HeaderNavProps) {
  return (
    <nav className="flex items-center gap-2 max-w-fit mx-auto" aria-label="Navegación principal">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={`group flex items-center justify-center p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
              isActive
                ? "bg-white text-primary shadow-sm"
                : "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white"
            }`}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            type="button"
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span
              className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 ease-in-out ${
                isActive
                  ? "max-w-xs opacity-100 ml-2"
                  : "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
