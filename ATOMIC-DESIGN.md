# 🧬 Arquitectura de Diseño Atómico (Atomic Design)

Sistema de componentes organizado según la metodología **Atomic Design de Brad Frost**, combinado con **diseño responsivo** para móvil, tablet y escritorio.

---

## 📋 Índice

1. [Qué es Atomic Design](#qué-es-atomic-design)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Niveles de Componentes](#niveles-de-componentes)
4. [Diseño Responsivo](#diseño-responsivo)
5. [Guía de Uso](#guía-de-uso)
6. [Ejemplos Completos](#ejemplos-completos)

---

## 🎯 Qué es Atomic Design

**Atomic Design** es una metodología que organiza componentes UI en 5 niveles jerárquicos, de lo más simple a lo más complejo:

```
Átomos → Moléculas → Organismos → Templates → Páginas
```

### Beneficios:
- ✅ **Reutilización**: Los componentes base se reusan en toda la app
- ✅ **Consistencia**: Mismo look & feel garantizado
- ✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades
- ✅ **Mantenimiento**: Un cambio en un átomo afecta toda la app
- ✅ **Testing**: Componentes pequeños = fácil testear
- ✅ **Documentación**: Jerarquía clara y comprensible

---

## 📁 Estructura de Carpetas

```
src/app/components/
├── atoms/              # Nivel 1: Bloques básicos
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Typography.tsx
│   └── Icon.tsx
│
├── molecules/          # Nivel 2: Grupos de átomos
│   ├── SearchBar.tsx
│   ├── FormField.tsx
│   ├── Card.tsx
│   └── Alert.tsx
│
├── organisms/          # Nivel 3: Secciones complejas
│   ├── Header.tsx
│   ├── ProductGrid.tsx
│   ├── SalesTable.tsx
│   └── Navbar.tsx
│
├── templates/          # Nivel 4: Layouts de página
│   ├── DashboardLayout.tsx
│   ├── FormLayout.tsx
│   └── DetailLayout.tsx
│
└── pages/              # Nivel 5: Páginas completas
    ├── HomePage.tsx
    ├── SalesPage.tsx
    └── InventoryPage.tsx
```

---

## 🧱 Niveles de Componentes

### 1. ⚛️ Átomos

**Los bloques de construcción más básicos del sistema.**

No se pueden dividir más sin perder funcionalidad.

#### Átomos Implementados:

##### 📦 Button
```tsx
import { Button, IconButton } from "./components/atoms/Button";

// Variantes
<Button variant="primary" size="lg">Confirmar venta</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="destructive">Eliminar</Button>

// Con iconos
<Button leftIcon={<CartIcon />}>Agregar al carrito</Button>

// Solo icono
<IconButton aria-label="Cerrar">
  <XIcon />
</IconButton>
```

**Props**:
- `variant`: `"primary"` | `"secondary"` | `"destructive"` | `"ghost"`
- `size`: `"sm"` | `"md"` | `"lg"`
- `disabled`: boolean
- `fullWidth`: boolean
- `leftIcon` / `rightIcon`: ReactNode

---

##### 📝 Input
```tsx
import { Input, Textarea } from "./components/atoms/Input";

// Input básico
<Input
  placeholder="Buscar..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

// Con iconos
<Input
  leftIcon={<SearchIcon />}
  placeholder="Buscar producto..."
/>

// Con error
<Input
  error
  errorMessage="Este campo es obligatorio"
  value={email}
/>

// Textarea
<Textarea
  rows={4}
  placeholder="Escribe tu nota aquí..."
/>
```

**Props**:
- `value`: string
- `onChange`: función
- `error`: boolean
- `errorMessage`: string
- `leftIcon` / `rightIcon`: ReactNode
- `size`: `"sm"` | `"md"` | `"lg"`

---

##### 🏷️ Badge
```tsx
import { Badge, NumericBadge, DotBadge } from "./components/atoms/Badge";

// Badge de estado
<Badge variant="success">OK</Badge>
<Badge variant="error">Anulada</Badge>
<Badge variant="warning">Stock bajo</Badge>

// Badge numérico
<NumericBadge count={5} variant="error" />

// Badge de punto
<DotBadge variant="success" />
```

**Variantes**:
- `success` - Verde
- `error` - Rojo
- `warning` - Naranja
- `info` - Azul
- `neutral` - Gris

---

##### 📰 Typography
```tsx
import {
  Heading1, Heading2, Heading3, Heading4,
  Body, Label, Caption, Display, Code, Link
} from "./components/atoms/Typography";

// Títulos
<Heading1>Título Principal</Heading1>
<Heading2>Título de Sección</Heading2>
<Heading3>Subtítulo</Heading3>

// Texto de párrafo
<Body size="large">Texto grande</Body>
<Body>Texto normal</Body>
<Body size="small">Texto pequeño</Body>

// Labels y metadatos
<Label htmlFor="email" required>Email</Label>
<Caption>Última actualización: hace 2 minutos</Caption>

// Enlaces
<Link href="/ventas">Ver todas las ventas</Link>
```

---

##### 🎨 Icon
```tsx
import { Icon, IconCircle, IconWithBadge } from "./components/Icon";

// Icono básico
<Icon name="cart" size={24} color="#2F6B3E" aria-label="Carrito" />

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

**Iconos disponibles**: `cart`, `package`, `trending`, `dollar`, `success`, `error`, `warning`, `info`, `plus`, `minus`, `search`, `edit`, `trash`, `users`, `clock`, etc.

---

### 2. 🧪 Moléculas

**Combinaciones simples de átomos que funcionan juntos.**

Ejemplos: SearchBar (Input + Icon), FormField (Label + Input + Error).

#### Moléculas Implementadas:

##### 🔍 SearchBar
```tsx
import { SearchBar } from "./components/molecules/SearchBar";

<SearchBar
  placeholder="Buscar producto..."
  onChange={(value) => setSearch(value)}
  onSubmit={(value) => handleSearch(value)}
/>
```

**Composición**: `Input` + `Icon (search)`

---

##### 📋 FormField
```tsx
import { FormField, TextareaField } from "./components/molecules/FormField";

// Campo de texto
<FormField
  fieldId="email"
  label="Correo electrónico"
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  errorMessage={errors.email}
  helperText="Usaremos este email para enviarte notificaciones"
/>

// Textarea
<TextareaField
  fieldId="notes"
  label="Notas adicionales"
  rows={4}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
```

**Composición**: `Label` + `Input` + `Caption (helper/error)`

---

##### 🃏 Card
```tsx
// Card básica
<div className="card">
  <Heading3>Título del Card</Heading3>
  <Body>Contenido de la card con información relevante.</Body>
  <Button variant="primary">Acción</Button>
</div>
```

**Composición**: Container + `Typography` + `Button`

---

##### ⚠️ Alert
```tsx
<div className="alert alert-success">
  <Icon name="success" size={20} />
  <Body size="base">Venta registrada exitosamente</Body>
</div>

<div className="alert alert-error">
  <Icon name="error" size={20} />
  <Body size="base">Error al procesar la venta</Body>
</div>
```

**Composición**: Container + `Icon` + `Body`

---

### 3. 🏗️ Organismos

**Secciones complejas de la interfaz que combinan moléculas y átomos.**

Ejemplos: Header completo, ProductGrid, SalesTable, Navbar.

#### Organismos del Sistema:

##### 🎯 Header (Barra superior)
```tsx
<Header
  title="Nueva Venta"
  subtitle="Selecciona los productos"
  onBack={() => navigate(-1)}
  actions={
    <IconButton aria-label="Configuración">
      <SettingsIcon />
    </IconButton>
  }
/>
```

**Composición**: `Heading` + `Caption` + `IconButton` + navegación

---

##### 🛒 ProductGrid
```tsx
<ProductGrid
  products={products}
  onSelectProduct={(product) => addToCart(product)}
  selectedIds={cartItemIds}
/>
```

**Composición**: Grid layout + múltiples `Card` + `Badge` + `Button`

---

##### 📊 SalesTable
```tsx
<SalesTable
  sales={sales}
  onSelectSale={(sale) => setSelectedSale(sale)}
  onCancelSale={(saleId) => cancelSale(saleId)}
/>
```

**Composición**: Table + `Typography` + `Badge` + `IconButton`

---

##### 🧭 Navbar (Navegación inferior)
```tsx
<Navbar
  activeTab="sales"
  onNavigate={(tab) => navigate(tab)}
/>
```

**Composición**: Container + múltiples `IconButton` + `Badge`

---

### 4. 📄 Templates

**Estructuras de página reutilizables sin contenido específico.**

Define el layout y la organización.

##### 📐 DashboardLayout
```tsx
<DashboardLayout
  header={<Header title="Dashboard" />}
  sidebar={<Sidebar />}
  content={<DashboardContent />}
  footer={<Navbar />}
/>
```

##### 📝 FormLayout
```tsx
<FormLayout
  title="Editar Producto"
  onBack={() => navigate(-1)}
  form={<ProductForm />}
  actions={
    <>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="primary">Guardar</Button>
    </>
  }
/>
```

---

### 5. 📱 Páginas

**Instancias específicas de templates con contenido real.**

```tsx
// HomePage.tsx
export function HomePage() {
  return (
    <DashboardLayout
      header={<Header title="Inicio" />}
      content={
        <>
          <SalesStats sales={sales} />
          <RecentSales sales={sales.slice(0, 5)} />
          <QuickActions />
        </>
      }
      footer={<Navbar activeTab="home" />}
    />
  );
}
```

---

## 📱 Diseño Responsivo

### Breakpoints del Sistema

```css
/* Mobile (por defecto) */
@media (min-width: 0px) { /* 375px - 767px */ }

/* Tablet */
@media (min-width: 768px) { /* 768px - 1023px */ }

/* Desktop */
@media (min-width: 1024px) { /* 1024px+ */ }

/* Desktop grande */
@media (min-width: 1440px) { /* 1440px+ */ }
```

---

### Utilidades Responsivas

#### Ocultar en diferentes tamaños
```html
<!-- Ocultar en mobile -->
<div class="hide-mobile">Visible solo en tablet/desktop</div>

<!-- Ocultar en tablet -->
<div class="hide-tablet">Visible en mobile y desktop</div>

<!-- Ocultar en desktop -->
<div class="hide-desktop">Visible solo en mobile/tablet</div>
```

#### Mostrar solo en tamaños específicos
```html
<!-- Solo mobile -->
<div class="show-mobile-only">Solo visible en móvil</div>

<!-- Solo tablet -->
<div class="show-tablet-only">Solo visible en tablet</div>

<!-- Solo desktop -->
<div class="show-desktop-only">Solo visible en escritorio</div>
```

---

### Grids Responsivos

```html
<!-- 1 columna en mobile, 2 en tablet, 3 en desktop -->
<div class="grid-responsive">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Grid automático -->
<div class="grid-auto-responsive">
  <!-- Se adapta automáticamente -->
</div>
```

---

### Componentes Responsivos

#### Botón Responsivo
```html
<button class="btn-responsive btn-primary">
  Confirmar
</button>
```

- **Mobile**: 48px altura, padding 12px 16px
- **Tablet/Desktop**: 56px altura, padding 16px 24px

#### Card Responsiva
```html
<div class="card-responsive">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

- **Mobile**: padding 16px
- **Tablet/Desktop**: padding 24px

---

### Tabla Responsiva

```html
<!-- Se convierte en cards en mobile -->
<table class="table-card-mobile">
  <thead>
    <tr>
      <th>Producto</th>
      <th>Precio</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Producto">Empanadas</td>
      <td data-label="Precio">$1,500</td>
      <td data-label="Stock">45</td>
    </tr>
  </tbody>
</table>
```

- **Mobile**: Cada fila se muestra como una card
- **Tablet/Desktop**: Tabla normal

---

### Modal Responsivo

```html
<div class="modal-container">
  <div class="modal-content">
    <h2>Título del Modal</h2>
    <p>Contenido</p>
  </div>
</div>
```

- **Mobile**: Bottom sheet (desde abajo), ancho completo
- **Tablet/Desktop**: Modal centrado, max-width 600px

---

## 🎯 Guía de Uso

### Cuándo crear cada nivel

#### ⚛️ Crea un Átomo cuando:
- Es un elemento UI único e indivisible
- Se usará en múltiples lugares
- Tiene variantes de estilo (primary, secondary, etc.)
- Ejemplos: Button, Input, Badge, Icon

#### 🧪 Crea una Molécula cuando:
- Combinas 2-3 átomos que trabajan juntos
- Tiene una función específica y simple
- Se repite en varios organismos
- Ejemplos: SearchBar, FormField, Card header

#### 🏗️ Crea un Organismo cuando:
- Es una sección completa de UI
- Combina moléculas y átomos
- Tiene lógica de negocio
- Ejemplos: Header completo, ProductGrid, SalesTable

#### 📄 Crea un Template cuando:
- Define el layout de una página
- Es reutilizable para diferentes contenidos
- No tiene datos específicos
- Ejemplos: DashboardLayout, FormLayout

#### 📱 Crea una Página cuando:
- Es una vista completa de la app
- Usa un template con datos reales
- Maneja el estado de la vista
- Ejemplos: HomePage, SalesPage, InventoryPage

---

### Reglas de Composición

1. **Los átomos NO dependen de nadie** (autosuficientes)
2. **Las moléculas SOLO usan átomos**
3. **Los organismos usan moléculas y átomos**
4. **Los templates usan organismos, moléculas y átomos**
5. **Las páginas usan templates + datos**

```
Página
  └─ Template
      └─ Organismo
          ├─ Molécula
          │   └─ Átomo
          └─ Átomo
```

---

## 📝 Ejemplos Completos

### Ejemplo 1: Pantalla de Ventas (Atomic Design)

```tsx
// 📱 Página
export function SalesPage() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);

  return (
    <DashboardTemplate
      header={<SalesHeader />}
      content={
        <>
          <SalesStats sales={sales} />
          <SalesTable
            sales={sales}
            onSelect={setSelectedSale}
          />
        </>
      }
      sidebar={<SaleDetail sale={selectedSale} />}
    />
  );
}

// 📄 Template
function DashboardTemplate({ header, content, sidebar }) {
  return (
    <div class="dashboard-with-sidebar">
      {header}
      <div class="dashboard-content">{content}</div>
      {sidebar && <div class="dashboard-sidebar">{sidebar}</div>}
    </div>
  );
}

// 🏗️ Organismo
function SalesHeader() {
  return (
    <header style={{ padding: "var(--space-4)", backgroundColor: "#2F6B3E" }}>
      <Heading2 style={{ color: "white" }}>Dashboard de Ventas</Heading2>
      <SearchBar placeholder="Buscar venta..." />
    </header>
  );
}

// 🏗️ Organismo
function SalesTable({ sales, onSelect }) {
  return (
    <table class="table-responsive">
      {sales.map((sale) => (
        <SaleRow key={sale.id} sale={sale} onClick={() => onSelect(sale)} />
      ))}
    </table>
  );
}

// 🧪 Molécula
function SaleRow({ sale, onClick }) {
  return (
    <tr onClick={onClick}>
      <td><Body>{sale.id}</Body></td>
      <td><Body>{formatCurrency(sale.total)}</Body></td>
      <td><Badge variant={sale.status === "ok" ? "success" : "error"}>
        {sale.status}
      </Badge></td>
    </tr>
  );
}

// ⚛️ Átomos: Heading2, Body, Badge, SearchBar usa Input + Icon
```

---

### Ejemplo 2: Formulario de Producto (Responsive)

```tsx
export function ProductForm() {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [errors, setErrors] = useState({});

  return (
    <form class="form-responsive">
      {/* Full width en mobile y tablet */}
      <div class="full-width">
        <FormField
          fieldId="name"
          label="Nombre del producto"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          errorMessage={errors.name}
        />
      </div>

      {/* 2 columnas en desktop */}
      <FormField
        fieldId="price"
        label="Precio"
        required
        type="number"
        leftIcon={<Icon name="dollar" />}
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        errorMessage={errors.price}
      />

      <FormField
        fieldId="stock"
        label="Stock"
        required
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
        errorMessage={errors.stock}
      />

      {/* Full width */}
      <div class="full-width flex-responsive">
        <Button variant="secondary" fullWidth>Cancelar</Button>
        <Button variant="primary" fullWidth>Guardar</Button>
      </div>
    </form>
  );
}
```

**Responsive**:
- **Mobile**: 1 columna, botones apilados
- **Tablet/Desktop**: 2 columnas, botones lado a lado

---

## ✅ Checklist de Implementación

### Al crear un componente nuevo:

- [ ] ¿Está en el nivel correcto de Atomic Design?
- [ ] ¿Tiene props claramente definidos (TypeScript)?
- [ ] ¿Está documentado con JSDoc?
- [ ] ¿Tiene ejemplos de uso?
- [ ] ¿Es responsivo (mobile, tablet, desktop)?
- [ ] ¿Usa tokens del design system?
- [ ] ¿Es accesible (ARIA labels, roles)?
- [ ] ¿Tiene estados (hover, focus, disabled)?
- [ ] ¿Funciona con teclado?
- [ ] ¿Está optimizado para touch (44x44px)?

---

## 📚 Recursos

### Archivos del Sistema
- `/src/styles/responsive.css` - Sistema responsivo
- `/src/app/components/atoms/` - Átomos base
- `/src/app/components/molecules/` - Moléculas
- `/DESIGN-GUIDE.md` - Guía de estilo completa

### Referencias
- Atomic Design: https://bradfrost.com/blog/post/atomic-web-design/
- Responsive Design: https://web.dev/responsive-web-design-basics/

---

**Última actualización**: Mayo 2026  
**Versión**: 1.0  
**Arquitectura**: Atomic Design + Responsive
