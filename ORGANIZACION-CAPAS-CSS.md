# 📐 Organización de Capas CSS y Nomenclatura

## Sistema de Capas CSS (CSS Cascade Layers)

El sistema utiliza una organización clara de estilos con capas bien definidas:

```
src/styles/
├── index.css           (Punto de entrada - importa todo en orden)
├── fonts.css           (Capa 1: Fuentes)
├── tailwind.css        (Capa 2: Tailwind base)
├── theme.css           (Capa 3: Variables CSS y tokens)
├── design-system.css   (Capa 4: Sistema de diseño)
├── responsive.css      (Capa 5: Media queries)
├── accessibility.css   (Capa 6: Accesibilidad)
└── global.css          (Capa 7: Utilities y helpers)
```

---

## Orden de Importación

**Archivo:** `/src/styles/index.css`

```css
@import './fonts.css';          /* 1. Fuentes primero */
@import './tailwind.css';       /* 2. Base de Tailwind */
@import './theme.css';          /* 3. Variables y tokens */
@import './design-system.css';  /* 4. Componentes base */
@import './responsive.css';     /* 5. Breakpoints */
@import './accessibility.css';  /* 6. A11y específico */
@import './global.css';         /* 7. Utilities finales */
```

**Razón del orden:** 
- Fuentes y base primero
- Tokens antes de su uso
- Componentes después de tokens
- Utilities al final (máxima especificidad)

---

## Nomenclatura de Clases

### 1. Clases de Tokens (theme.css)

**Patrón:** `--{tipo}-{nombre}[-{variante}]`

```css
/* Colores */
--color-primary
--color-primary-foreground
--color-success
--color-destructive

/* Spacing */
--space-2
--space-4
--space-8

/* Radius */
--radius-card
--radius-modal
```

**Uso en Tailwind:**
```jsx
<div className="bg-primary text-primary-foreground rounded-card p-4">
```

---

### 2. Clases Utility (global.css)

**Patrón:** `{función}-{tamaño/tipo}`

```css
/* Screen reader only */
.sr-only

/* Line clamp */
.line-clamp-1
.line-clamp-2
.line-clamp-3

/* Stacks (vertical spacing) */
.stack-xs
.stack-sm
.stack-md
.stack-lg

/* Layout */
.center
.spread
.cluster

/* Status */
.status-dot-online
.status-dot-offline

/* Animaciones */
.animate-fade-in
.animate-slide-up
.animate-scale-in

/* Skeleton */
.skeleton
.skeleton-text
.skeleton-avatar
```

**Uso:**
```jsx
<div className="stack-md">
  <h1>Título</h1>
  <p>Párrafo</p>
</div>
```

---

### 3. Componentes Atomic Design

**Estructura:**
```
src/app/components/
├── atoms/              (Componentes básicos)
│   ├── LoadingSpinner.tsx
│   ├── StatusBadge.tsx
│   ├── Button.tsx
│   └── Input.tsx
│
├── molecules/          (Componentes compuestos)
│   ├── KPICard.tsx
│   ├── ProductCard.tsx
│   ├── Modal.tsx
│   └── AlertBanner.tsx
│
└── organisms/          (Componentes complejos)
    ├── VendorHome.tsx
    ├── NewSale.tsx
    ├── SalesDashboard.tsx
    └── InventoryDashboard.tsx
```

**Nomenclatura de archivos:**
- PascalCase para componentes: `ProductCard.tsx`
- Descriptivos y específicos
- Un componente por archivo

---

## Jerarquía de Especificidad

```
1. Tailwind base (más baja)
   ↓
2. Theme variables
   ↓
3. Design system components
   ↓
4. Responsive overrides
   ↓
5. Accessibility fixes
   ↓
6. Global utilities (más alta)
```

**Ejemplo:**
```jsx
/* ✅ CORRECTO: tokens primero, utilidades después */
<button className="bg-primary text-primary-foreground rounded-card p-4 touch-target">

/* ❌ INCORRECTO: inline styles mezclados */
<button className="bg-primary" style={{ color: "white", padding: "16px" }}>
```

---

## Guías de Nomenclatura por Tipo

### Colores

**Patrón:** `{categoría}-{intensidad}` o `{semántica}`

```css
/* Sistema */
--color-primary
--color-secondary
--color-background
--color-foreground

/* Semántico */
--color-success
--color-error
--color-warning
--color-info

/* Estados */
--color-muted
--color-accent
--color-border
```

**Uso en Tailwind:**
- `bg-primary` → fondo primario
- `text-success` → texto éxito
- `border-muted` → borde tenue

---

### Spacing

**Patrón:** `{tipo}-{tamaño}`

```css
/* Spacing scale (4px base) */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
```

**Uso en Tailwind:**
- `p-4` → padding 16px
- `mb-6` → margin-bottom 24px
- `gap-3` → gap 12px

---

### Typography

**Patrón:** `text-{tamaño}` o `font-{peso}`

```css
/* Tamaños */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px

/* Pesos */
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

---

### Radius

**Patrón:** `rounded-{tipo}`

```css
rounded-sm: 4px
rounded: 8px
rounded-lg: 12px
rounded-card: 12px
rounded-modal: 16px
rounded-full: 9999px
```

---

## Convenciones de Nomenclatura

### Variables CSS

```css
/* ✅ CORRECTO */
--color-primary
--space-4
--radius-card

/* ❌ INCORRECTO */
--primaryColor
--spacing4
--cardRadius
```

**Regla:** kebab-case siempre

---

### Clases Utility

```css
/* ✅ CORRECTO */
.sr-only
.line-clamp-2
.stack-md
.touch-target

/* ❌ INCORRECTO */
.srOnly
.lineClamp2
.stackMd
.touchTarget
```

**Regla:** kebab-case, descriptivo

---

### Componentes React

```tsx
/* ✅ CORRECTO */
export function ProductCard() {}
export function KPICard() {}
export function StatusBadge() {}

/* ❌ INCORRECTO */
export function productCard() {}
export function kpiCard() {}
export function statusbadge() {}
```

**Regla:** PascalCase siempre

---

## Sistema de Breakpoints

**Archivo:** `/src/styles/responsive.css`

```css
/* Mobile first - sin media query */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
}
```

**Breakpoints estándar:**
- `0-767px`: Mobile (default)
- `768px-1023px`: Tablet
- `1024px+`: Desktop

---

## Capas de Tailwind

El sistema utiliza Tailwind v4 con capas personalizadas:

```css
@layer base {
  /* Reset y estilos base */
  * {
    @apply border-border outline-ring/50;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  /* Componentes reutilizables */
  .btn-primary {
    @apply bg-primary text-primary-foreground ...;
  }
}

@layer utilities {
  /* Utilities específicas */
  .touch-target {
    @apply min-w-[44px] min-h-[44px];
  }
}
```

---

## Buenas Prácticas

### 1. Preferir Tokens sobre Valores Hardcoded

```jsx
/* ✅ CORRECTO */
<div className="bg-primary text-primary-foreground">

/* ❌ INCORRECTO */
<div style={{ backgroundColor: "#2F6B3E", color: "white" }}>
```

---

### 2. Usar Clases Utility para Casos Comunes

```jsx
/* ✅ CORRECTO */
<div className="center">  {/* Predefinido en global.css */}

/* ❌ INCORRECTO */
<div className="flex items-center justify-center">
```

---

### 3. Componentes para Patrones Repetidos

```jsx
/* ✅ CORRECTO */
<StatusBadge status="ok" />

/* ❌ INCORRECTO */
<span className="inline-flex items-center gap-1.5 rounded-full border ...">
  <CheckCircle2 className="size-4" />
  <span>OK</span>
</span>
```

---

### 4. Mobile-First en Media Queries

```css
/* ✅ CORRECTO */
.element {
  padding: 1rem;
}

@media (min-width: 768px) {
  .element {
    padding: 2rem;
  }
}

/* ❌ INCORRECTO */
.element {
  padding: 2rem;
}

@media (max-width: 767px) {
  .element {
    padding: 1rem;
  }
}
```

---

### 5. Consistencia en Nombres

```tsx
/* ✅ CORRECTO - Mismo patrón */
<KPICard />
<ProductCard />
<StatusBadge />

/* ❌ INCORRECTO - Patrones mezclados */
<KPI />
<Product_Card />
<status-badge />
```

---

## Checklist de Organización

- [ ] Estilos importados en orden correcto en `index.css`
- [ ] Variables CSS siguen patrón `--{tipo}-{nombre}`
- [ ] Clases utility siguen patrón kebab-case
- [ ] Componentes React en PascalCase
- [ ] Tokens usados en lugar de valores hardcoded
- [ ] Mobile-first en media queries
- [ ] Un componente por archivo
- [ ] Archivos en carpeta correcta (atoms/molecules/organisms)
- [ ] Nombres descriptivos y específicos
- [ ] Sin duplicación de estilos

---

## Herramientas de Validación

### VS Code Extensions Recomendadas:

1. **Tailwind CSS IntelliSense**
   - Autocomplete para clases Tailwind
   - Preview de colores y spacing

2. **CSS Variable Autocomplete**
   - Autocomplete para `var(--*)` 

3. **Prettier**
   - Formateo consistente de clases

4. **ESLint**
   - Validación de convenciones de nomenclatura

---

## Migración de Código Legacy

Si encuentras código con estilos inline:

```jsx
/* ANTES */
<div style={{ backgroundColor: "#2F6B3E", padding: "16px" }}>

/* DESPUÉS */
<div className="bg-primary p-4">
```

**Proceso:**
1. Identificar valor hardcoded
2. Buscar token equivalente en `theme.css`
3. Reemplazar con clase Tailwind
4. Validar visualmente
5. Commit cambio

---

## Referencias

- **Tokens CSS:** `/src/styles/theme.css`
- **Utilities:** `/src/styles/global.css`
- **Componentes:** `/src/app/components/`
- **Documentación Tailwind:** https://tailwindcss.com/
- **Atomic Design:** https://bradfrost.com/blog/post/atomic-web-design/

---

**Última actualización:** Mayo 14, 2026  
**Versión:** 1.0
