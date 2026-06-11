# Configuración de Design Tokens en Figma

Guía paso a paso para crear las variables y estilos del Design System en Figma.

---

## 📋 Pre-requisitos

- Cuenta Figma Professional, Organization o Enterprise (necesario para Variables)
- Permisos de edición en el archivo

---

## 🎨 PASO 1: Crear Colecciones de Variables

### 1.1 Colección "Primitives"

1. Abre el panel de Variables: `⌘ + ⌥ + V` (Mac) o `Ctrl + Alt + V` (Windows)
2. Click en "Create collection"
3. Nombra la colección: **"Primitives"**
4. Crea los siguientes grupos y variables:

#### Green
- `green-600` → #2F6B3E
- `green-700` → #236030
- `green-50` → #F0FAF4
- `green-100` → #E8F5EE

#### Red
- `red-700` → #B71C1C
- `red-50` → #FFEBEE

#### Amber
- `amber-700` → #E65100
- `amber-50` → #FFF3E0

#### Blue
- `blue-700` → #01579B
- `blue-50` → #E3F2FD

#### Gold
- `gold-500` → #C89A2E
- `gold-50` → #FFF8E1

#### Gray
- `gray-0` → #FAFAFA
- `gray-50` → #F4F4F2
- `gray-100` → #E8E8E5
- `gray-300` → #BDBDBA
- `gray-500` → #757572
- `gray-700` → #3D3D3B
- `gray-900` → #1A1A19

### 1.2 Colección "Semantic"

1. Click en "+" para crear otra colección
2. Nombra: **"Semantic"**
3. Crea grupos y variables que **referencian** los primitivos:

#### Action
- `color/action/primary` → `Primitives/green-600`
- `color/action/primary-hover` → `Primitives/green-700`

#### Surface
- `color/surface/default` → `Primitives/gray-0`
- `color/surface/subtle` → `Primitives/gray-50`

#### Text
- `color/text/primary` → `Primitives/gray-900`
- `color/text/secondary` → `Primitives/gray-500`

#### Status
- `color/status/error` → `Primitives/red-700`
- `color/status/warning` → `Primitives/amber-700`
- `color/status/success` → `Primitives/green-600`

**💡 Tip:** Para referenciar una variable, usa el selector desplegable al definir el valor.

### 1.3 Colección "Radius"

1. Crea colección: **"Radius"**
2. Tipo: **Number**
3. Variables:
   - `sm` → 6
   - `md` → 10
   - `lg` → 14
   - `xl` → 18
   - `pill` → 9999

### 1.4 Colección "Spacing"

1. Crea colección: **"Spacing"**
2. Tipo: **Number**
3. Variables:
   - `1` → 4
   - `2` → 8
   - `3` → 12
   - `4` → 16
   - `5` → 20
   - `6` → 24
   - `8` → 32
   - `10` → 40

---

## ✍️ PASO 2: Crear Estilos de Texto

1. Abre el panel de Text Styles (icono "T" en la barra lateral)
2. Crea los siguientes estilos:

### heading/xl
- Font: **SF Pro** (o Inter si no está disponible)
- Weight: **Bold (700)**
- Size: **20**
- Line height: **24** (120%)
- Letter spacing: **-0.3**

### heading/lg
- Font: **SF Pro**
- Weight: **Bold (700)**
- Size: **18**
- Line height: **22** (122%)

### heading/md
- Font: **SF Pro**
- Weight: **Semibold (600)**
- Size: **16**
- Line height: **21** (130%)

### body/md
- Font: **SF Pro**
- Weight: **Regular (400)**
- Size: **14**
- Line height: **21** (150%)

### body/sm
- Font: **SF Pro**
- Weight: **Regular (400)**
- Size: **12**
- Line height: **17** (140%)

### label/xs
- Font: **SF Pro**
- Weight: **Semibold (600)**
- Size: **10**
- Line height: **12** (120%)
- Letter spacing: **0.4**
- Text case: **UPPERCASE**

### mono/lg
- Font: **SF Pro**
- Weight: **Bold (700)**
- Size: **24**
- Line height: **29** (120%)
- OpenType Features: Habilita **"Tabular figures"**

**💡 Tip:** Para tabular figures, ve a "..." → "OpenType features" → Activa "tnum"

---

## 🌓 PASO 3: Crear Estilos de Efectos (Shadows)

1. Crea un rectángulo temporal
2. Ve al panel de propiedades → Effects
3. Crea los siguientes Effect Styles:

### shadow/card

**Layer blur:**
- Type: Drop shadow
- X: 0
- Y: 1
- Blur: 4
- Spread: 0
- Color: #000000
- Opacity: 8%

**+ Inner shadow:**
- X: 0
- Y: 0
- Blur: 0
- Spread: 1
- Color: #000000
- Opacity: 4%

### shadow/hero

**Drop shadow:**
- X: 0
- Y: 4
- Blur: 16
- Spread: 0
- Color: #2F6B3E
- Opacity: 35%

### shadow/sheet

**Drop shadow:**
- X: 0
- Y: -4
- Blur: 32
- Spread: 0
- Color: #000000
- Opacity: 18%

---

## 🔧 PASO 4: Organización

### Estructurar por grupos con "/"
Usa la nomenclatura con barras para crear jerarquías:
- `color/action/primary`
- `color/status/error`
- `typography/heading/xl`

Esto crea menús desplegables automáticamente.

### Publicar a biblioteca
1. Abre el panel de Assets (⌥ + 2)
2. Click en el icono del libro
3. Click "Publish"
4. Agrega descripción del cambio
5. Click "Publish"

---

## 📦 Importación Automática (Opcional)

Si usas plugins como **Tokens Studio for Figma** o **Figma Tokens**:

1. Instala el plugin desde Community
2. Import el archivo `design-tokens.json`
3. El plugin creará automáticamente todas las variables

---

## ✅ Verificación

Antes de cerrar, verifica:

- [ ] 33 variables de color creadas
- [ ] Referencias semánticas apuntan correctamente a primitivos
- [ ] 5 variables de radius
- [ ] 8 variables de spacing
- [ ] 7 estilos de texto
- [ ] 3 estilos de efectos
- [ ] Todo publicado a la biblioteca

---

## 📖 Recursos

- [Documentación completa](./DESIGN_TOKENS.md)
- [Archivo CSS](./src/styles/design-tokens.css)
- [Archivo JSON](./design-tokens.json)

---

## 🎯 Uso en Diseños

### Aplicar variables:
1. Selecciona un elemento
2. Click en el ícono de variable en Fill, Stroke, etc.
3. Selecciona la variable semántica (no los primitivos)

### Aplicar estilos de texto:
1. Selecciona texto
2. Panel Text → Dropdown de estilos
3. Selecciona el estilo apropiado

### Buenas prácticas:
- ✅ Usa tokens semánticos: `color/action/primary`
- ❌ Evita primitivos directos: `green-600`
- ✅ Usa estilos de texto en lugar de tipografía manual
- ✅ Mantén consistencia con la app implementada
