/**
 * MOLÉCULA: FormField
 * Campo de formulario con label, input y mensaje de error
 */

import { ReactNode } from "react";
import { Input, InputProps, Textarea, TextareaProps } from "../atoms/Input";
import { Label } from "../atoms/Typography";

export interface FormFieldProps extends Omit<InputProps, "id"> {
  /** Label del campo */
  label?: string;
  /** Si el campo es obligatorio */
  required?: boolean;
  /** Descripción/ayuda */
  helperText?: string;
  /** ID único del campo */
  fieldId: string;
}

export interface TextareaFieldProps extends Omit<TextareaProps, "id"> {
  /** Label del campo */
  label?: string;
  /** Si el campo es obligatorio */
  required?: boolean;
  /** Descripción/ayuda */
  helperText?: string;
  /** ID único del campo */
  fieldId: string;
}

/**
 * FormField - Molécula de campo de formulario
 *
 * @example
 * <FormField
 *   fieldId="email"
 *   label="Correo electrónico"
 *   required
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   errorMessage={errors.email}
 * />
 */
export function FormField({
  label,
  required = false,
  helperText,
  fieldId,
  errorMessage,
  ...inputProps
}: FormFieldProps) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div style={{ marginBottom: "8px" }}>
          <Label htmlFor={fieldId} required={required}>
            {label}
          </Label>
        </div>
      )}

      <Input id={fieldId} errorMessage={errorMessage} aria-required={required} {...inputProps} />

      {helperText && !errorMessage && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "13px",
            color: "var(--color-neutral-600)",
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}

/**
 * TextareaField - Campo de textarea con label
 */
export function TextareaField({
  label,
  required = false,
  helperText,
  fieldId,
  errorMessage,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div style={{ marginBottom: "8px" }}>
          <Label htmlFor={fieldId} required={required}>
            {label}
          </Label>
        </div>
      )}

      <Textarea id={fieldId} errorMessage={errorMessage} aria-required={required} {...textareaProps} />

      {helperText && !errorMessage && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "13px",
            color: "var(--color-neutral-600)",
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
