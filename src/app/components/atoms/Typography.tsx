/**
 * ÁTOMO: Typography
 * Componentes tipográficos base del sistema
 */

import { ReactNode, CSSProperties } from "react";

interface TypographyBaseProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Heading 1 - Título principal
 */
export function Heading1({ children, className = "", style, as = "h1" }: TypographyBaseProps) {
  const Component = as;
  return (
    <Component className={`heading-1 ${className}`} style={style}>
      {children}
    </Component>
  );
}

/**
 * Heading 2 - Título de sección
 */
export function Heading2({ children, className = "", style, as = "h2" }: TypographyBaseProps) {
  const Component = as;
  return (
    <Component className={`heading-2 ${className}`} style={style}>
      {children}
    </Component>
  );
}

/**
 * Heading 3 - Subtítulo
 */
export function Heading3({ children, className = "", style, as = "h3" }: TypographyBaseProps) {
  const Component = as;
  return (
    <Component className={`heading-3 ${className}`} style={style}>
      {children}
    </Component>
  );
}

/**
 * Heading 4 - Subtítulo pequeño
 */
export function Heading4({ children, className = "", style, as = "h4" }: TypographyBaseProps) {
  const Component = as;
  return (
    <Component className={`heading-4 ${className}`} style={style}>
      {children}
    </Component>
  );
}

/**
 * Body - Texto de párrafo
 */
export function Body({
  children,
  className = "",
  style,
  size = "base",
  as = "p",
}: TypographyBaseProps & { size?: "small" | "base" | "large" }) {
  const Component = as;
  const sizeClass = size === "small" ? "body-small" : size === "large" ? "body-large" : "body-base";

  return (
    <Component className={`${sizeClass} ${className}`} style={style}>
      {children}
    </Component>
  );
}

/**
 * Label - Etiqueta de formulario
 */
export function Label({
  children,
  htmlFor,
  className = "",
  style,
  required = false,
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  style?: CSSProperties;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`} style={style}>
      {children}
      {required && (
        <span style={{ color: "var(--color-error-700)", marginLeft: "4px" }} aria-label="obligatorio">
          *
        </span>
      )}
    </label>
  );
}

/**
 * Caption - Texto secundario pequeño
 */
export function Caption({ children, className = "", style, as = "span" }: TypographyBaseProps) {
  const Component = as;
  return (
    <Component className={`caption ${className}`} style={style}>
      {children}
    </Component>
  );
}

/**
 * Display - Texto muy grande para destacar
 */
export function Display({ children, className = "", style, as = "h1" }: TypographyBaseProps) {
  const Component = as;
  return (
    <Component
      className={className}
      style={{
        fontSize: "var(--text-5xl)",
        fontWeight: "var(--font-weight-bold)",
        lineHeight: "var(--leading-tight)",
        letterSpacing: "var(--tracking-tight)",
        color: "var(--color-neutral-800)",
        ...style,
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Code - Texto monoespaciado para código
 */
export function Code({ children, className = "", style }: TypographyBaseProps) {
  return (
    <code
      className={className}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.9em",
        padding: "2px 6px",
        backgroundColor: "var(--color-neutral-100)",
        borderRadius: "4px",
        color: "var(--color-neutral-800)",
        ...style,
      }}
    >
      {children}
    </code>
  );
}

/**
 * Link - Enlaces de texto
 */
export function Link({
  children,
  href,
  onClick,
  external = false,
  className = "",
  style,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const externalProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <a
      href={href}
      onClick={onClick}
      className={className}
      style={{
        color: "var(--color-primary-500)",
        textDecoration: "underline",
        textDecorationThickness: "2px",
        textUnderlineOffset: "3px",
        fontWeight: 500,
        transition: "color var(--duration-fast) var(--ease-out)",
        cursor: "pointer",
        ...style,
      }}
      {...externalProps}
    >
      {children}
    </a>
  );
}
