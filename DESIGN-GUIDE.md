# 🎨 Guía de Estilo - Sistema de Diseño

Sistema de diseño profesional, consistente y accesible para el **Sistema de Información para Trabajos Informales**.

---

## 📋 Índice

1. [Paleta de Colores](#1-paleta-de-colores)
2. [Tipografía](#2-tipografía)
3. [Iconografía](#3-iconografía)
4. [Layout y Organización](#4-layout-y-organización)
5. [Componentes Base](#5-componentes-base)
6. [Guía de Uso](#6-guía-de-uso)

---

## 1. Paleta de Colores

### 🎯 Principios de Color

- ✅ **Contraste WCAG AA**: Mínimo 4.5:1 en texto
- ✅ **Jerarquía visual clara**: Los colores comunican importancia
- ✅ **Consistencia**: Mismos colores para mismas acciones
- ✅ **Accesibilidad**: Todos los colores cumplen estándares

---

### 🟢 Verde Primario (Corporativo)

El verde `#2F6B3E` es el color principal de la marca. Representa **confianza, crecimiento y profesionalismo**.

| Variante | Hex | RGB | Uso |
|----------|-----|-----|-----|
| **50** | `#F0FAF4` | rgb(240, 250, 244) | Fondos sutiles |
| **100** | `#E8F5EE` | rgb(232, 245, 238) | Fondos de éxito |
| **500** | `#2F6B3E` | rgb(47, 107, 62) | **Color principal** |
| **700** | `#1F4A2B` | rgb(31, 74, 43) | Hover/Active |

#### Uso del Verde:
```css
/* Botón primario */
background-color: var(--color-primary-500);

/* Hover */
background-color: var(--color-primary-700);

/* Fondo de éxito */
background-color: var(--color-primary-100);
```

#### Ejemplos visuales:
- ✅ Botones principales ("Nueva Venta", "Confirmar")
- ✅ Headers y navegación
- ✅ Estados de éxito
- ✅ Elementos activos

---

### ⚫ Grises Neutrales

Escala de grises para texto, fondos y bordes.

| Variante | Hex | Contraste | Uso |
|----------|-----|-----------|-----|
| **50** | `#FAFAF9` | — | Fondos alternos |
| **100** | `#F4F4F2` | — | Fondo principal |
| **200** | `#E8E8E5` | — | Bordes sutiles |
| **400** | `#BDBDBA` | 3.2:1 | Placeholders |
| **600** | `#757572` | 5.7:1 ✅ | Texto secundario |
| **700** | `#3D3D3B` | 11.2:1 ✅ | Texto normal |
| **800** | `#1A1A19` | 16.8:1 ✅ | **Texto principal** |

#### Jerarquía de Texto:
```css
/* Texto principal */
color: var(--color-neutral-800); /* Negro suave */

/* Texto secundario */
color: var(--color-neutral-600); /* Gris medio */

/* Texto muted */
color: var(--color-neutral-500); /* Gris claro */
```

---

### 🔴 Colores Semánticos

Colores para comunicar estados y acciones.

#### ✅ Éxito (Verde)
| Variante | Hex | Uso |
|----------|-----|-----|
| **50** | `#F0FAF4` | Fondo de alerta |
| **500** | `#2F6B3E` | Texto/Icono |
| **700** | `#1F4A2B` | Borde |

```css
.alert-success {
  background: var(--color-success-50);
  border-left: 4px solid var(--color-success-500);
  color: var(--color-neutral-800);
}
```

#### ❌ Error (Rojo)
| Variante | Hex | Uso |
|----------|-----|-----|
| **50** | `#FEF2F2` | Fondo de alerta |
| **100** | `#FFEBEE` | Fondo de input error |
| **500** | `#EF4444` | Texto/Icono |
| **700** | `#B71C1C` | Borde/Botón destructivo |

```css
.alert-error {
  background: var(--color-error-100);
  border-left: 4px solid var(--color-error-700);
  color: var(--color-neutral-800);
}
```

#### ⚠️ Advertencia (Naranja)
| Variante | Hex | Uso |
|----------|-----|-----|
| **50** | `#FFFBEB` | Fondo de alerta |
| **100** | `#FFF3E0` | Fondo de badge |
| **500** | `#F59E0B` | Texto/Icono |
| **700** | `#ED6C02` | Borde |

```css
.alert-warning {
  background: var(--color-warning-100);
  border-left: 4px solid var(--color-warning-700);
  color: var(--color-neutral-800);
}
```

#### ℹ️ Información (Azul)
| Variante | Hex | Uso |
|----------|-----|-----|
| **50** | `#F0F9FF` | Fondo de alerta |
| **100** | `#E3F2FD` | Fondo de badge |
| **500** | `#3B82F6` | Texto/Icono |
| **700** | `#1976D2` | Borde |

---

### 🎨 Aplicación de Colores

#### Jerarquía Visual por Color

1. **Acción Principal**: Verde `#2F6B3E`
   - Botones principales
   - CTA (Call to Action)
   - Navegación activa

2. **Acción Secundaria**: Gris oscuro `#3D3D3B`
   - Botones secundarios
   - Links

3. **Acción Destructiva**: Rojo `#B71C1C`
   - Eliminar
   - Anular
   - Cancelar

4. **Fondos**: Grises claros
   - Blanco: Cards y modales
   - Gris 100: Fondo de app
   - Gris 200: Separadores

---

## 2. Tipografía

### 📝 Familia Tipográfica

**Primaria**: SF Pro Display (sistema Apple)
```css
font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, 
             "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
```

**Monoespaciada**: SF Mono (para códigos/IDs)
```css
font-family: "SF Mono", "Monaco", "Consolas", "Courier New", monospace;
```

---

### 📏 Escala Tipográfica

Escala modular **1.250 (Major Third)** para jerarquía clara.

| Token | Tamaño | Píxeles | Uso |
|-------|--------|---------|-----|
| `text-xs` | 0.75rem | 12px | Labels secundarios |
| `text-sm` | 0.875rem | 14px | Texto pequeño |
| **`text-base`** | **1rem** | **16px** | **Texto normal** |
| `text-lg` | 1.125rem | 18px | Texto destacado |
| `text-xl` | 1.25rem | 20px | Subtítulos pequeños |
| `text-2xl` | 1.5rem | 24px | Subtítulos |
| `text-3xl` | 1.875rem | 30px | Títulos |
| `text-4xl` | 2.25rem | 36px | Títulos principales |
| `text-5xl` | 3rem | 48px | Display |

---

### 🎯 Jerarquía Tipográfica

#### H1 - Título Principal
```css
.heading-1 {
  font-size: var(--text-4xl);     /* 36px */
  font-weight: var(--font-weight-bold);    /* 700 */
  line-height: var(--leading-tight);       /* 1.2 */
  letter-spacing: var(--tracking-tight);   /* -0.02em */
  color: var(--color-neutral-800);
}
```

**Uso**: Títulos de página, pantallas principales

#### H2 - Título de Sección
```css
.heading-2 {
  font-size: var(--text-3xl);     /* 30px */
  font-weight: var(--font-weight-bold);    /* 700 */
  line-height: var(--leading-tight);       /* 1.2 */
  color: var(--color-neutral-800);
}
```

**Uso**: Secciones importantes, modales

#### H3 - Subtítulo
```css
.heading-3 {
  font-size: var(--text-2xl);     /* 24px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: var(--leading-snug);         /* 1.3 */
  color: var(--color-neutral-800);
}
```

**Uso**: Subsecciones, títulos de cards

#### H4 - Subtítulo Pequeño
```css
.heading-4 {
  font-size: var(--text-xl);      /* 20px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: var(--leading-snug);         /* 1.3 */
  color: var(--color-neutral-800);
}
```

---

### 📄 Texto de Párrafo

#### Body Large
```css
.body-large {
  font-size: var(--text-lg);      /* 18px */
  font-weight: var(--font-weight-regular);  /* 400 */
  line-height: var(--leading-relaxed);      /* 1.75 */
  color: var(--color-neutral-700);
}
```

#### Body Base (Normal)
```css
.body-base {
  font-size: var(--text-base);    /* 16px */
  font-weight: var(--font-weight-regular);  /* 400 */
  line-height: var(--leading-normal);       /* 1.5 */
  color: var(--color-neutral-700);
}
```

#### Body Small
```css
.body-small {
  font-size: var(--text-sm);      /* 14px */
  font-weight: var(--font-weight-regular);  /* 400 */
  line-height: var(--leading-normal);       /* 1.5 */
  color: var(--color-neutral-600);
}
```

---

### 🏷️ Labels y Metadatos

#### Label
```css
.label {
  font-size: var(--text-sm);      /* 14px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: var(--leading-normal);       /* 1.5 */
  color: var(--color-neutral-700);
}
```

**Uso**: Etiquetas de formularios, secciones

#### Caption
```css
.caption {
  font-size: var(--text-xs);      /* 12px */
  font-weight: var(--font-weight-medium);   /* 500 */
  line-height: var(--leading-normal);       /* 1.5 */
  color: var(--color-neutral-500);
}
```

**Uso**: Metadatos, timestamps, notas secundarias

---

### 📐 Pesos Tipográficos

| Token | Valor | Uso |
|-------|-------|-----|
| `font-weight-regular` | 400 | Texto normal |
| `font-weight-medium` | 500 | Énfasis leve |
| `font-weight-semibold` | 600 | Subtítulos, labels |
| `font-weight-bold` | 700 | Títulos, botones |

---

### 📏 Line Heights

| Token | Valor | Uso |
|-------|-------|-----|
| `leading-tight` | 1.2 | Títulos grandes |
| `leading-snug` | 1.3 | Subtítulos |
| `leading-normal` | 1.5 | Texto normal |
| `leading-relaxed` | 1.75 | Párrafos largos |

---

### 📝 Letter Spacing

| Token | Valor | Uso |
|-------|-------|-----|
| `tracking-tight` | -0.02em | Títulos grandes |
| `tracking-normal` | 0 | Texto normal |
| `tracking-wide` | 0.02em | MAYÚSCULAS, badges |

---

## 3. Iconografía

### 🎯 Principios de Iconos

- ✅ **Simples y comprensibles**: Fáciles de reconocer
- ✅ **Consistentes**: Mismo estilo en toda la app
- ✅ **Accesibles**: Con labels y aria-labels
- ✅ **Escalables**: Funcionan en cualquier tamaño
- ✅ **Semánticos**: Ayudan a la comprensión

---

### 🎨 Sistema de Iconos

Usamos **Lucide Icons** (fork moderno de Feather Icons).

#### Tamaños Estándar

| Tamaño | Píxeles | Uso |
|--------|---------|-----|
| `xs` | 16px | Inline con texto pequeño |
| `sm` | 20px | **Estándar** (botones, labels) |
| `md` | 24px | Destacado |
| `lg` | 32px | Headers, heros |
| `xl` | 48px | Ilustraciones |

#### Componente de Icono

```tsx
import { Icon } from "./components/Icon";

// Icono básico
<Icon name="cart" size={20} color="#2F6B3E" aria-label="Carrito" />

// Icono circular
<IconCircle
  name="success"
  size={24}
  backgroundColor="#E8F5EE"
  iconColor="#2F6B3E"
  aria-label="Éxito"
/>

// Icono con badge
<IconWithBadge
  name="cart"
  count={3}
  aria-label="Carrito con 3 productos"
/>
```

---

### 📦 Iconos Disponibles

#### Comercio
- `cart` - Carrito de compras
- `package` - Paquete/Inventario
- `trending` - Tendencias/Ventas
- `dollar` - Dinero/Precio

#### Estados
- `success` - Éxito (check circle)
- `error` - Error (X circle)
- `warning` - Advertencia (triángulo)
- `info` - Información (i circle)

#### Navegación
- `arrowLeft` / `arrowRight` - Flechas
- `chevronLeft` / `chevronRight` / `chevronDown` - Chevrones
- `close` - Cerrar (X)

#### Acciones
- `plus` / `minus` - Agregar/Quitar
- `search` - Buscar
- `edit` - Editar
- `trash` - Eliminar

#### Otros
- `users` - Usuarios
- `clock` - Tiempo
- `lock` / `unlock` - Seguridad
- `settings` - Configuración
- `calendar` - Calendario

---

### 🎨 Colores de Iconos

Los iconos heredan el color del texto (`currentColor`) o usan colores semánticos:

```tsx
// Heredar color del texto
<Icon name="cart" color="currentColor" />

// Verde (éxito, primario)
<Icon name="success" color="var(--color-success-500)" />

// Rojo (error, eliminar)
<Icon name="error" color="var(--color-error-700)" />

// Naranja (advertencia)
<Icon name="warning" color="var(--color-warning-700)" />

// Azul (información)
<Icon name="info" color="var(--color-info-700)" />
```

---

## 4. Layout y Organización

### 📐 Sistema de Espaciado

Base de **8px** para consistencia visual.

| Token | Valor | Píxeles | Uso |
|-------|-------|---------|-----|
| `space-0` | 0 | 0px | Sin espacio |
| `space-1` | 0.25rem | 4px | Espacios mínimos |
| `space-2` | 0.5rem | 8px | Espacios pequeños |
| `space-3` | 0.75rem | 12px | Espacios medios |
| **`space-4`** | **1rem** | **16px** | **Estándar** |
| `space-5` | 1.25rem | 20px | Espacios grandes |
| `space-6` | 1.5rem | 24px | Entre secciones |
| `space-8` | 2rem | 32px | Secciones grandes |
| `space-10` | 2.5rem | 40px | Separaciones mayores |
| `space-12` | 3rem | 48px | Márgenes grandes |

---

### 📦 Border Radius

| Token | Valor | Píxeles | Uso |
|-------|-------|---------|-----|
| `radius-none` | 0 | 0px | Sin redondeo |
| `radius-sm` | 0.375rem | 6px | Badges |
| **`radius-base`** | **0.5rem** | **8px** | **Botones pequeños** |
| `radius-md` | 0.75rem | 12px | Cards |
| `radius-lg` | 1rem | 16px | Botones principales |
| `radius-xl` | 1.25rem | 20px | Modales |
| `radius-2xl` | 1.5rem | 24px | Cards grandes |
| `radius-full` | 9999px | ∞ | Círculos |

---

### 🌑 Sombras (Elevación)

| Token | Uso | Elevación |
|-------|-----|-----------|
| `shadow-xs` | Bordes sutiles | Muy baja |
| `shadow-sm` | Hover states | Baja |
| `shadow-md` | Cards elevados | Media |
| `shadow-lg` | Botones importantes | Alta |
| `shadow-xl` | Dropdowns | Muy alta |
| `shadow-2xl` | Modales | Máxima |

#### Sombras específicas:
```css
--shadow-button: 0 2px 8px rgba(47, 107, 62, 0.2);
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-modal: 0 20px 40px rgba(0, 0, 0, 0.3);
```

---

### 📱 Grid System

```css
/* Container responsive */
.container {
  width: 100%;
  max-width: 375px;  /* Mobile-first */
  margin: 0 auto;
  padding: var(--space-4);
}

/* Grid de 2 columnas */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

/* Grid de 3 columnas */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

/* Grid auto-responsive */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-3);
}
```

---

### 📚 Stack Layouts

Sistema de spacing vertical consistente:

```css
/* Extra small: 8px */
.stack-xs > * + * { margin-top: var(--space-2); }

/* Small: 12px */
.stack-sm > * + * { margin-top: var(--space-3); }

/* Medium: 16px (estándar) */
.stack-md > * + * { margin-top: var(--space-4); }

/* Large: 24px */
.stack-lg > * + * { margin-top: var(--space-6); }

/* Extra large: 32px */
.stack-xl > * + * { margin-top: var(--space-8); }
```

**Uso**:
```html
<div class="stack-md">
  <h2>Título</h2>
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
</div>
```

---

### 🎯 Z-Index Layers

Control de apilamiento visual:

| Layer | Z-Index | Uso |
|-------|---------|-----|
| `z-base` | 0 | Contenido base |
| `z-dropdown` | 100 | Dropdowns |
| `z-sticky` | 200 | Headers sticky |
| `z-fixed` | 300 | Navegación fija |
| `z-modal-backdrop` | 400 | Fondo de modales |
| `z-modal` | 500 | Modales |
| `z-popover` | 600 | Popovers |
| `z-tooltip` | 700 | Tooltips |

---

## 5. Componentes Base

### 🔘 Botones

#### Botón Primario
```tsx
<button className="btn-primary">
  Confirmar venta
</button>
```

**CSS**:
```css
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-base);
  min-height: 56px;
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  box-shadow: var(--shadow-button);
}
```

#### Botón Secundario
```tsx
<button className="btn-secondary">
  Cancelar
</button>
```

**CSS**:
```css
.btn-secondary {
  background-color: white;
  color: var(--color-primary-500);
  border: 2px solid var(--color-primary-500);
  min-height: 56px;
  padding: var(--space-4) var(--space-6);
}
```

#### Botón Destructivo
```tsx
<button className="btn-destructive">
  Eliminar
</button>
```

---

### 🃏 Cards

```tsx
<div className="card">
  <h3>Título del Card</h3>
  <p>Contenido del card</p>
</div>
```

**CSS**:
```css
.card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);
}
```

---

### 📝 Inputs

```tsx
<input
  type="text"
  className="input"
  placeholder="Ingrese texto"
/>
```

**CSS**:
```css
.input {
  width: 100%;
  min-height: 48px;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-base);
}

.input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}
```

---

### 🏷️ Badges

```tsx
<span className="badge badge-success">Éxito</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-warning">Advertencia</span>
<span className="badge badge-info">Info</span>
```

---

### 📢 Alerts

```tsx
<div className="alert alert-success">
  ✅ Venta registrada exitosamente
</div>

<div className="alert alert-error">
  ❌ Error al procesar la venta
</div>

<div className="alert alert-warning">
  ⚠️ Stock bajo en este producto
</div>

<div className="alert alert-info">
  ℹ️ Nuevo turno iniciado
</div>
```

---

## 6. Guía de Uso

### ✅ Buenas Prácticas

#### Colores
```tsx
// ✅ Correcto: Usar tokens
<button style={{ backgroundColor: "var(--color-primary-500)" }}>

// ❌ Incorrecto: Hardcodear colores
<button style={{ backgroundColor: "#2F6B3E" }}>
```

#### Espaciado
```tsx
// ✅ Correcto: Usar tokens de espaciado
<div style={{ padding: "var(--space-4)" }}>

// ❌ Incorrecto: Valores arbitrarios
<div style={{ padding: "14px" }}>
```

#### Tipografía
```tsx
// ✅ Correcto: Usar clases
<h1 className="heading-1">Título</h1>

// ❌ Incorrecto: Estilos inline
<h1 style={{ fontSize: "36px", fontWeight: 700 }}>
```

---

### 🎨 Combinaciones Recomendadas

#### Botón sobre fondo claro
```css
background: var(--color-primary-500);
color: white;
border: 2px solid transparent;
```

#### Texto sobre fondo verde
```css
background: var(--color-primary-50);
color: var(--color-neutral-800);
```

#### Badge de estado
```css
/* Éxito */
background: var(--color-success-100);
color: var(--color-success-700);

/* Error */
background: var(--color-error-100);
color: var(--color-error-700);
```

---

### 📏 Espaciado Consistente

| Tipo de espacio | Token | Valor |
|-----------------|-------|-------|
| Entre elementos inline | `space-2` | 8px |
| Entre elementos de lista | `space-3` | 12px |
| Padding de cards | `space-4` | 16px |
| Entre secciones | `space-6` | 24px |
| Márgenes de página | `space-8` | 32px |

---

### 🎯 Checklist de Diseño

Al crear un nuevo componente:

- [ ] ¿Usa tokens de color en lugar de valores hardcodeados?
- [ ] ¿El contraste cumple WCAG AA (4.5:1)?
- [ ] ¿Usa la escala tipográfica definida?
- [ ] ¿Los espaciados son múltiplos de 4px (8px idealmente)?
- [ ] ¿Los border-radius son consistentes con el sistema?
- [ ] ¿Los iconos tienen aria-labels?
- [ ] ¿Los estados (hover, active, focus) están definidos?
- [ ] ¿El componente es responsive?
- [ ] ¿Los botones tienen mínimo 44x44px de área táctil?
- [ ] ¿Los textos tienen line-height adecuado?

---

## 📚 Referencias

### Archivos del Sistema
- `/src/styles/design-system.css` - Tokens y componentes
- `/src/styles/accessibility.css` - Estilos de accesibilidad
- `/src/app/components/Icon.tsx` - Sistema de iconografía

### Estándares
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- Type Scale: https://type-scale.com/
- Color Contrast: https://contrast-ratio.com/

---

**Última actualización**: Mayo 2026  
**Versión**: 1.0  
**Mantenimiento**: Revisar trimestral
