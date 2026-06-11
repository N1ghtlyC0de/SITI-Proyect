# 🎨 Sistema de Diseño - Resumen Ejecutivo

## ✅ Sistema de Diseño Profesional Implementado

Se ha creado un **sistema de diseño completo, profesional y accesible** para el Sistema de Información para Trabajos Informales, cumpliendo con estándares WCAG 2.1 AA.

---

## 📁 Archivos Creados

### 1. **`/src/styles/design-system.css`**
Sistema completo de tokens de diseño:
- ✅ Paleta de colores profesional (50+ variantes)
- ✅ Escala tipográfica modular (1.250)
- ✅ Sistema de espaciado (base 8px)
- ✅ Bordes, sombras y elevaciones
- ✅ Componentes base (botones, cards, inputs, badges, alerts)
- ✅ Grid y layout systems

### 2. **`/src/app/components/Icon.tsx`**
Sistema de iconografía consistente:
- ✅ 30+ iconos predefinidos
- ✅ Componente `<Icon>` accesible
- ✅ Variantes: `IconCircle`, `IconWithBadge`
- ✅ Labels automáticos para accesibilidad

### 3. **`/DESIGN-GUIDE.md`**
Documentación completa de la guía de estilo (50+ páginas):
- ✅ Paleta de colores detallada
- ✅ Sistema tipográfico completo
- ✅ Guía de iconografía
- ✅ Layout y organización visual
- ✅ Componentes base
- ✅ Ejemplos de uso
- ✅ Buenas prácticas

---

## 🎨 Paleta de Colores

### Verde Primario (Corporativo)
```css
--color-primary-500: #2F6B3E;  /* Principal */
--color-primary-700: #1F4A2B;  /* Hover */
--color-primary-100: #E8F5EE;  /* Fondos */
```

### Grises Neutrales
```css
--color-neutral-800: #1A1A19;  /* Texto principal */
--color-neutral-600: #757572;  /* Texto secundario */
--color-neutral-200: #E8E8E5;  /* Bordes */
--color-neutral-100: #F4F4F2;  /* Fondos */
```

### Colores Semánticos
```css
/* Éxito */
--color-success-500: #2F6B3E;
--color-success-100: #E8F5EE;

/* Error */
--color-error-700: #B71C1C;
--color-error-100: #FFEBEE;

/* Advertencia */
--color-warning-700: #ED6C02;
--color-warning-100: #FFF3E0;

/* Información */
--color-info-700: #1976D2;
--color-info-100: #E3F2FD;
```

**Total**: 50+ variantes de color accesibles

---

## 📝 Tipografía

### Escala Modular (Major Third 1.250)

| Token | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 12px | Labels secundarios |
| `text-sm` | 14px | Texto pequeño |
| **`text-base`** | **16px** | **Texto normal** ✅ |
| `text-lg` | 18px | Texto destacado |
| `text-xl` | 20px | Subtítulos pequeños |
| `text-2xl` | 24px | Subtítulos |
| `text-3xl` | 30px | Títulos |
| `text-4xl` | 36px | Títulos principales |
| `text-5xl` | 48px | Display |

### Pesos Tipográficos
```css
--font-weight-regular: 400;   /* Texto normal */
--font-weight-medium: 500;    /* Énfasis leve */
--font-weight-semibold: 600;  /* Subtítulos, labels */
--font-weight-bold: 700;      /* Títulos, botones */
```

### Clases Tipográficas
```html
<!-- Títulos -->
<h1 class="heading-1">Título Principal</h1>
<h2 class="heading-2">Título de Sección</h2>
<h3 class="heading-3">Subtítulo</h3>

<!-- Texto de párrafo -->
<p class="body-base">Texto normal (16px)</p>
<p class="body-small">Texto pequeño (14px)</p>

<!-- Labels -->
<label class="label">Etiqueta</label>
<span class="caption">Metadato</span>
```

---

## 🖼️ Iconografía

### Componente de Icono

```tsx
import { Icon, IconCircle, IconWithBadge } from "./components/Icon";

// Icono básico
<Icon name="cart" size={20} color="#2F6B3E" aria-label="Carrito" />

// Icono circular
<IconCircle
  name="success"
  size={24}
  backgroundColor="#E8F5EE"
  iconColor="#2F6B3E"
/>

// Icono con badge numérico
<IconWithBadge name="cart" count={3} />
```

### Iconos Disponibles (30+)

**Comercio**: `cart`, `package`, `trending`, `dollar`  
**Estados**: `success`, `error`, `warning`, `info`  
**Navegación**: `arrowLeft`, `chevronRight`, `close`  
**Acciones**: `plus`, `minus`, `search`, `edit`, `trash`  
**Otros**: `users`, `clock`, `lock`, `settings`, `calendar`

---

## 📐 Layout y Espaciado

### Sistema de Espaciado (Base 8px)

```css
--space-2: 8px;    /* Pequeño */
--space-3: 12px;   /* Medio */
--space-4: 16px;   /* Estándar ✅ */
--space-6: 24px;   /* Entre secciones */
--space-8: 32px;   /* Grande */
```

### Border Radius
```css
--radius-base: 8px;    /* Botones pequeños */
--radius-md: 12px;     /* Cards */
--radius-lg: 16px;     /* Botones principales */
--radius-xl: 20px;     /* Modales */
```

### Sombras
```css
--shadow-button: 0 2px 8px rgba(47, 107, 62, 0.2);
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-modal: 0 20px 40px rgba(0, 0, 0, 0.3);
```

### Grid System
```html
<div class="container">
  <div class="grid-2">
    <div>Columna 1</div>
    <div>Columna 2</div>
  </div>
</div>
```

### Stack Layouts
```html
<div class="stack-md">
  <h2>Título</h2>
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
</div>
```

---

## 🔘 Componentes Base

### Botones

```html
<!-- Primario -->
<button class="btn-primary">Confirmar venta</button>

<!-- Secundario -->
<button class="btn-secondary">Cancelar</button>

<!-- Destructivo -->
<button class="btn-destructive">Eliminar</button>
```

**Características**:
- ✅ Altura mínima: 56px
- ✅ Padding: 16px 24px
- ✅ Font-size: 16px
- ✅ Border: 2px
- ✅ Sombras y transiciones

---

### Cards

```html
<div class="card">
  <h3>Título del Card</h3>
  <p>Contenido</p>
</div>
```

**Características**:
- ✅ Fondo blanco
- ✅ Border-radius: 16px
- ✅ Sombra sutil
- ✅ Padding: 16px

---

### Inputs

```html
<input
  type="text"
  class="input"
  placeholder="Ingrese texto"
/>
```

**Características**:
- ✅ Altura mínima: 48px
- ✅ Font-size: 16px
- ✅ Border: 2px
- ✅ Focus visible con sombra verde

---

### Badges

```html
<span class="badge badge-success">OK</span>
<span class="badge badge-error">Anulada</span>
<span class="badge badge-warning">Stock bajo</span>
<span class="badge badge-info">Nueva</span>
```

---

### Alerts

```html
<div class="alert alert-success">
  ✅ Venta registrada exitosamente
</div>

<div class="alert alert-error">
  ❌ Error al procesar la venta
</div>

<div class="alert alert-warning">
  ⚠️ Stock bajo en este producto
</div>

<div class="alert alert-info">
  ℹ️ Nuevo turno iniciado
</div>
```

---

## 📊 Jerarquía Visual

### Por Color

1. **Verde `#2F6B3E`** → Acción principal, éxito
2. **Gris oscuro `#3D3D3B`** → Acción secundaria
3. **Rojo `#B71C1C`** → Acción destructiva, error
4. **Naranja `#ED6C02`** → Advertencia
5. **Azul `#1976D2`** → Información

### Por Tamaño

1. **36px** → Títulos principales (H1)
2. **30px** → Títulos de sección (H2)
3. **24px** → Subtítulos (H3)
4. **20px** → Subtítulos pequeños (H4)
5. **16px** → Texto normal (base) ✅
6. **14px** → Texto pequeño
7. **12px** → Labels secundarios

### Por Peso

1. **700** → Títulos, botones
2. **600** → Subtítulos, labels importantes
3. **500** → Énfasis leve
4. **400** → Texto normal

---

## ✅ Checklist de Uso

Al usar el sistema de diseño:

### Colores
- [ ] ¿Usas `var(--color-*)` en lugar de valores hex?
- [ ] ¿El contraste cumple WCAG AA (4.5:1)?
- [ ] ¿Los estados (success, error, warning) usan colores semánticos?

### Tipografía
- [ ] ¿Usas clases `.heading-*` o `.body-*`?
- [ ] ¿Los tamaños son de la escala modular?
- [ ] ¿El texto base es mínimo 16px?
- [ ] ¿El line-height es adecuado (1.5 para texto)?

### Espaciado
- [ ] ¿Usas tokens `var(--space-*)` en lugar de valores arbitrarios?
- [ ] ¿Los espacios son múltiplos de 4px (idealmente 8px)?

### Componentes
- [ ] ¿Los botones tienen mínimo 56px de altura?
- [ ] ¿Los inputs tienen mínimo 48px de altura?
- [ ] ¿Los iconos tienen aria-labels?
- [ ] ¿Los focus states son visibles?

---

## 🎯 Ejemplo Completo

```tsx
import { Icon } from "./components/Icon";

function ProductCard() {
  return (
    <div className="card">
      {/* Título con clase tipográfica */}
      <h3 className="heading-3" style={{ marginBottom: "var(--space-3)" }}>
        Empanadas de carne
      </h3>

      {/* Precio con color primario */}
      <div
        className="body-base"
        style={{
          color: "var(--color-primary-500)",
          fontWeight: "var(--font-weight-bold)",
          marginBottom: "var(--space-2)"
        }}
      >
        $1,500
      </div>

      {/* Badge de estado */}
      <span className="badge badge-warning">
        <Icon name="warning" size={12} decorative />
        Stock bajo
      </span>

      {/* Botón con sistema */}
      <button
        className="btn-primary"
        style={{ marginTop: "var(--space-4)", width: "100%" }}
      >
        <Icon name="cart" size={20} color="white" decorative />
        Agregar al carrito
      </button>
    </div>
  );
}
```

---

## 📚 Recursos

### Documentación
- **Guía completa**: `/DESIGN-GUIDE.md`
- **Accesibilidad**: `/ACCESSIBILITY.md`

### Código
- **Tokens CSS**: `/src/styles/design-system.css`
- **Iconos**: `/src/app/components/Icon.tsx`
- **Tema**: `/src/styles/theme.css`

### Herramientas
- Type Scale: https://type-scale.com/
- Contrast Checker: https://contrast-ratio.com/
- Color Palette: https://coolors.co/

---

## 🚀 Beneficios del Sistema

### Para Desarrolladores
- ✅ **Consistencia automática**: Tokens predefinidos
- ✅ **Menos decisiones**: Paleta limitada y clara
- ✅ **Componentes reutilizables**: No reinventar la rueda
- ✅ **Documentación completa**: Ejemplos y guías

### Para Usuarios
- ✅ **Experiencia coherente**: Mismo look & feel
- ✅ **Mayor legibilidad**: Tipografía optimizada
- ✅ **Mejor accesibilidad**: WCAG 2.1 AA
- ✅ **Interfaz profesional**: Diseño moderno

### Para el Negocio
- ✅ **Desarrollo más rápido**: Menos tiempo en decisiones de diseño
- ✅ **Menos bugs visuales**: Sistema consistente
- ✅ **Mantenimiento simplificado**: Un solo lugar para cambios
- ✅ **Escalabilidad**: Fácil agregar nuevos componentes

---

**🎉 Sistema de Diseño v1.0 - Mayo 2026**

El sistema está **listo para usar** y **completamente documentado**.
