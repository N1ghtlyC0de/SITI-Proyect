/**
 * SISTEMA DE ICONOGRAFÍA
 * Componente de icono consistente y accesible
 */

import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Minus,
  Search,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Settings,
  MoreVertical,
  Download,
  Upload,
  Calendar,
  type LucideIcon
} from "lucide-react";

// Mapa de iconos disponibles
const ICONS = {
  // Comercio
  cart: ShoppingCart,
  package: Package,
  trending: TrendingUp,
  dollar: DollarSign,

  // Usuarios y tiempo
  users: Users,
  clock: Clock,

  // Estados
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,

  // Navegación
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,

  // Acciones
  close: X,
  plus: Plus,
  minus: Minus,
  search: Search,
  edit: Edit,
  trash: Trash2,

  // Seguridad
  lock: Lock,
  unlock: Unlock,
  eye: Eye,
  eyeOff: EyeOff,

  // Otros
  settings: Settings,
  more: MoreVertical,
  download: Download,
  upload: Upload,
  calendar: Calendar,
} as const;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  /** Nombre del icono a mostrar */
  name: IconName;
  /** Tamaño del icono (en píxeles) */
  size?: number;
  /** Color del icono */
  color?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Label para accesibilidad */
  "aria-label"?: string;
  /** Si el icono es decorativo */
  decorative?: boolean;
}

/**
 * Componente de icono consistente
 *
 * @example
 * <Icon name="cart" size={24} color="#2F6B3E" aria-label="Carrito de compras" />
 */
export function Icon({
  name,
  size = 20,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel,
  decorative = false
}: IconProps) {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(ICONS));
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      aria-label={decorative ? undefined : ariaLabel || name}
      aria-hidden={decorative}
      strokeWidth={2}
    />
  );
}

/**
 * Icono con contenedor circular (para avatares, badges, etc.)
 */
export function IconCircle({
  name,
  size = 20,
  backgroundColor = "#E8F5EE",
  iconColor = "#2F6B3E",
  padding = 12,
  "aria-label": ariaLabel,
}: {
  name: IconName;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  padding?: number;
  "aria-label"?: string;
}) {
  return (
    <div
      style={{
        width: size + padding * 2,
        height: size + padding * 2,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <Icon name={name} size={size} color={iconColor} decorative />
    </div>
  );
}

/**
 * Icono con badge numérico
 */
export function IconWithBadge({
  name,
  count,
  size = 20,
  color = "currentColor",
  badgeColor = "#EF4444",
  "aria-label": ariaLabel,
}: {
  name: IconName;
  count: number;
  size?: number;
  color?: string;
  badgeColor?: string;
  "aria-label"?: string;
}) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Icon name={name} size={size} color={color} aria-label={ariaLabel} />
      {count > 0 && (
        <div
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            minWidth: 18,
            height: 18,
            borderRadius: "9px",
            backgroundColor: badgeColor,
            color: "white",
            fontSize: "10px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            border: "2px solid white",
          }}
          aria-label={`${count} notificaciones`}
        >
          {count > 99 ? "99+" : count}
        </div>
      )}
    </div>
  );
}
