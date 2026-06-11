/**
 * ÁTOMO: Button
 * Botón base del sistema de diseño con variantes y estados
 */

import { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  /** Contenido del botón */
  children: ReactNode;
  /** Variante visual del botón */
  variant?: ButtonVariant;
  /** Tamaño del botón */
  size?: ButtonSize;
  /** Si el botón está deshabilitado */
  disabled?: boolean;
  /** Si el botón ocupa todo el ancho */
  fullWidth?: boolean;
  /** Tipo de botón HTML */
  type?: "button" | "submit" | "reset";
  /** Función al hacer click */
  onClick?: () => void;
  /** Label para accesibilidad */
  "aria-label"?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Icono a la izquierda */
  leftIcon?: ReactNode;
  /** Icono a la derecha */
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  destructive: "btn-destructive",
  ghost: "btn-ghost",
};

const sizeStyles: Record<ButtonSize, { height: string; padding: string; fontSize: string }> = {
  sm: {
    height: "40px",
    padding: "8px 16px",
    fontSize: "14px",
  },
  md: {
    height: "48px",
    padding: "12px 20px",
    fontSize: "16px",
  },
  lg: {
    height: "56px",
    padding: "16px 24px",
    fontSize: "17px",
  },
};

/**
 * Componente Button - Átomo base del sistema
 *
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Confirmar venta
 * </Button>
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  className = "",
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const sizeStyle = sizeStyles[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${variantStyles[variant]} ${className}`}
      style={{
        minHeight: sizeStyle.height,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontWeight: 600,
        borderRadius: "var(--radius-md)",
        border: "2px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all var(--duration-base) var(--ease-out)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
      {children}
      {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}

/**
 * Botón de icono (solo icono, cuadrado)
 */
export function IconButton({
  children,
  variant = "ghost",
  size = "md",
  disabled = false,
  onClick,
  "aria-label": ariaLabel,
  className = "",
}: Omit<ButtonProps, "leftIcon" | "rightIcon" | "fullWidth">) {
  const sizeStyle = sizeStyles[size];
  const dimension = sizeStyle.height;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${variantStyles[variant]} ${className}`}
      style={{
        minWidth: dimension,
        minHeight: dimension,
        width: dimension,
        height: dimension,
        padding: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-base)",
        border: "2px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all var(--duration-base) var(--ease-out)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
