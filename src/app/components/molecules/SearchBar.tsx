/**
 * MOLÉCULA: SearchBar
 * Barra de búsqueda con icono
 */

import { useState } from "react";
import { Input } from "../atoms/Input";
import { Icon } from "../Icon";

export interface SearchBarProps {
  /** Valor de búsqueda */
  value?: string;
  /** Función al cambiar */
  onChange?: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Función al submit */
  onSubmit?: (value: string) => void;
  /** Ancho completo */
  fullWidth?: boolean;
}

/**
 * SearchBar - Molécula de búsqueda
 *
 * @example
 * <SearchBar
 *   placeholder="Buscar producto..."
 *   onChange={setSearch}
 *   onSubmit={handleSearch}
 * />
 */
export function SearchBar({
  value: controlledValue,
  onChange,
  placeholder = "Buscar...",
  onSubmit,
  fullWidth = true,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: fullWidth ? "100%" : "auto" }}>
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        leftIcon={<Icon name="search" size={20} decorative />}
        fullWidth={fullWidth}
        aria-label="Buscar"
      />
    </form>
  );
}
