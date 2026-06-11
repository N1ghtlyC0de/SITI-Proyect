/**
 * ÁTOMO: Badge
 * Etiqueta de estado o categoría
 */

import { ReactNode } from "react";

export type BadgeVariant = "success" | "error" | "warning" | "info" | "neutral";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  /** Contenido del badge */
  children: ReactNode;
  /** Variante de color */
  variant?: BadgeVariant;
  /** Tamaño del badge */
  size?: BadgeSize;
  /** Icono opcional */
  icon?: ReactNode;
  /** Clase CSS adicional */
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  success: {
    bg: "var(--color-success-100)",
    color: "var(--color-success-700)",
    border: "var(--color-success-500)",
  },
  error: {
    bg: "var(--color-error-100)",
    color: "var(--color-error-700)",
    border: "var(--color-error-700)",
  },
  warning: {
    bg: "var(--color-warning-100)",
    color: "var(--color-warning-700)",
    border: "var(--color-warning-700)",
  },
  info: {
    bg: "var(--color-info-100)",
    color: "var(--color-info-700)",
    border: "var(--color-info-700)",
  },
  neutral: {
    bg: "var(--color-neutral-100)",
    color: "var(--color-neutral-700)",
    border: "var(--color-neutral-400)",
  },
};

const sizeStyles: Record<BadgeSize, { fontSize: string; padding: string; height: string }> = {
  sm: {
    fontSize: "10px",
    padding: "2px 8px",
    height: "18px",
  },
  md: {
    fontSize: "12px",
    padding: "4px 10px",
    height: "22px",
  },
  lg: {
    fontSize: "14px",
    padding: "6px 12px",
    height: "28px",
  },
};

/**
 * Componente Badge - Átomo para etiquetas de estado
 *
 * @example
 * <Badge variant="success" icon={<CheckIcon />}>OK</Badge>
 */
export function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon,
  className = "",
}: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        minHeight: sizeStyle.height,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 700,
        backgroundColor: variantStyle.bg,
        color: variantStyle.color,
        borderRadius: "var(--radius-base)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
      }}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * Badge numérico (para contadores)
 */
export function NumericBadge({
  count,
  max = 99,
  variant = "error",
  className = "",
}: {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  className?: string;
}) {
  const variantStyle = variantStyles[variant];
  const displayCount = count > max ? `${max}+` : count.toString();

  if (count === 0) return null;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "20px",
        height: "20px",
        padding: "0 6px",
        fontSize: "11px",
        fontWeight: 700,
        backgroundColor: variantStyle.color,
        color: "white",
        borderRadius: "10px",
        border: "2px solid white",
      }}
      aria-label={`${count} notificaciones`}
    >
      {displayCount}
    </span>
  );
}

/**
 * Badge de punto (dot badge)
 */
export function DotBadge({
  variant = "error",
  size = 8,
  className = "",
}: {
  variant?: BadgeVariant;
  size?: number;
  className?: string;
}) {
  const variantStyle = variantStyles[variant];

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: variantStyle.color,
        borderRadius: "50%",
      }}
      aria-hidden="true"
    />
  );
}
