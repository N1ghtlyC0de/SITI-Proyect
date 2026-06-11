/**
 * ÁTOMO: Input
 * Campo de entrada base del sistema de diseño
 */

import { ReactNode, InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Valor del input */
  value?: string;
  /** Función al cambiar el valor */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder */
  placeholder?: string;
  /** Si el input tiene error */
  error?: boolean;
  /** Mensaje de error */
  errorMessage?: string;
  /** Si el input está deshabilitado */
  disabled?: boolean;
  /** Icono a la izquierda */
  leftIcon?: ReactNode;
  /** Icono a la derecha */
  rightIcon?: ReactNode;
  /** Ancho completo */
  fullWidth?: boolean;
  /** Tamaño del input */
  size?: "sm" | "md" | "lg";
  /** ID para asociar con label */
  id?: string;
}

const sizeStyles = {
  sm: {
    height: "40px",
    padding: "8px 12px",
    fontSize: "14px",
  },
  md: {
    height: "48px",
    padding: "12px 16px",
    fontSize: "16px",
  },
  lg: {
    height: "56px",
    padding: "14px 20px",
    fontSize: "18px",
  },
};

/**
 * Componente Input - Átomo base del sistema
 *
 * @example
 * <Input
 *   placeholder="Buscar producto..."
 *   value={search}
 *   onChange={(e) => setSearch(e.target.value)}
 *   leftIcon={<SearchIcon />}
 * />
 */
export function Input({
  value,
  onChange,
  placeholder,
  error = false,
  errorMessage,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  size = "md",
  id,
  type = "text",
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  className = "",
  ...rest
}: InputProps) {
  const sizeStyle = sizeStyles[size];
  const hasError = error || !!errorMessage;

  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>
      <div style={{ position: "relative", width: "100%" }}>
        {leftIcon && (
          <div
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              color: "var(--color-neutral-500)",
              pointerEvents: "none",
            }}
          >
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={hasError || ariaInvalid}
          aria-describedby={hasError && errorMessage ? `${id}-error` : ariaDescribedBy}
          className={`input ${className}`}
          style={{
            width: "100%",
            minHeight: sizeStyle.height,
            padding: leftIcon
              ? `${sizeStyle.padding.split(" ")[0]} ${sizeStyle.padding.split(" ")[1]} ${
                  sizeStyle.padding.split(" ")[0]
                } 44px`
              : sizeStyle.padding,
            paddingRight: rightIcon ? "44px" : sizeStyle.padding.split(" ")[1],
            fontSize: sizeStyle.fontSize,
            fontFamily: "var(--font-primary)",
            color: "var(--color-neutral-800)",
            backgroundColor: disabled ? "var(--color-neutral-100)" : "white",
            border: hasError
              ? "2px solid var(--color-error-700)"
              : "2px solid var(--color-neutral-200)",
            borderRadius: "var(--radius-base)",
            outline: "none",
            transition: "all var(--duration-base) var(--ease-out)",
            cursor: disabled ? "not-allowed" : "text",
          }}
          {...rest}
        />

        {rightIcon && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              color: "var(--color-neutral-500)",
              pointerEvents: "none",
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {hasError && errorMessage && (
        <div
          id={`${id}-error`}
          role="alert"
          style={{
            marginTop: "6px",
            fontSize: "14px",
            color: "var(--color-error-700)",
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

/**
 * Textarea component
 */
export interface TextareaProps extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Valor del textarea */
  value?: string;
  /** Función al cambiar el valor */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Placeholder */
  placeholder?: string;
  /** Si tiene error */
  error?: boolean;
  /** Mensaje de error */
  errorMessage?: string;
  /** Número de filas */
  rows?: number;
  /** Ancho completo */
  fullWidth?: boolean;
  /** ID para label */
  id?: string;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  error = false,
  errorMessage,
  disabled = false,
  rows = 4,
  fullWidth = true,
  id,
  "aria-label": ariaLabel,
  className = "",
  ...rest
}: TextareaProps) {
  const hasError = error || !!errorMessage;

  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        aria-label={ariaLabel}
        aria-invalid={hasError}
        aria-describedby={hasError && errorMessage ? `${id}-error` : undefined}
        className={className}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "16px",
          fontFamily: "var(--font-primary)",
          color: "var(--color-neutral-800)",
          backgroundColor: disabled ? "var(--color-neutral-100)" : "white",
          border: hasError
            ? "2px solid var(--color-error-700)"
            : "2px solid var(--color-neutral-200)",
          borderRadius: "var(--radius-base)",
          outline: "none",
          resize: "vertical",
          lineHeight: 1.5,
          transition: "all var(--duration-base) var(--ease-out)",
          cursor: disabled ? "not-allowed" : "text",
        }}
        {...rest}
      />

      {hasError && errorMessage && (
        <div
          id={`${id}-error`}
          role="alert"
          style={{
            marginTop: "6px",
            fontSize: "14px",
            color: "var(--color-error-700)",
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
