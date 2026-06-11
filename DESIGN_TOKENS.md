# Design System / Tokens
Sistema de Información para Trabajos Informales

---

## COLOR PRIMITIVES

### Green
- `green-600`: #2F6B3E (Primary brand color)
- `green-700`: #236030 (Darker green for hover states)
- `green-50`: #F0FAF4 (Light green background)
- `green-100`: #E8F5EE (Lighter green background)

### Red
- `red-700`: #B71C1C (Error states)
- `red-50`: #FFEBEE (Error background)

### Amber
- `amber-700`: #E65100 (Warning states)
- `amber-50`: #FFF3E0 (Warning background)

### Blue
- `blue-700`: #01579B (Info states)
- `blue-50`: #E3F2FD (Info background)

### Gold
- `gold-500`: #C89A2E (Accent color)
- `gold-50`: #FFF8E1 (Gold background)

### Gray Scale
- `gray-0`: #FAFAFA (Pure white surface)
- `gray-50`: #F4F4F2 (App background)
- `gray-100`: #E8E8E5 (Borders, dividers)
- `gray-300`: #BDBDBA (Disabled states)
- `gray-500`: #757572 (Secondary text)
- `gray-700`: #3D3D3B (Tertiary text)
- `gray-900`: #1A1A19 (Primary text)

---

## SEMANTIC TOKENS
*These reference the primitive tokens above*

### Action
- `color/action/primary` → green-600
- `color/action/primary-hover` → green-700

### Surface
- `color/surface/default` → gray-0
- `color/surface/subtle` → gray-50

### Text
- `color/text/primary` → gray-900
- `color/text/secondary` → gray-500

### Status
- `color/status/error` → red-700
- `color/status/warning` → amber-700
- `color/status/success` → green-600

---

## BORDER RADIUS

- `radius/sm`: 6px (Small elements, badges)
- `radius/md`: 10px (Inputs, small cards)
- `radius/lg`: 14px (Cards, buttons)
- `radius/xl`: 18px (Hero elements, modals)
- `radius/pill`: 9999px (Pills, circular buttons)

---

## TYPOGRAPHY

### Font Family
- Primary: SF Pro (Inter as fallback)
- All monetary values: Use `font-variant-numeric: tabular-nums`

### Text Styles

#### heading/xl
- Font: SF Pro Bold
- Size: 20px
- Line height: 1.2
- Letter spacing: -0.3px
- Usage: Main page titles

#### heading/lg
- Font: SF Pro Bold
- Size: 18px
- Line height: 1.2
- Usage: Section headers

#### heading/md
- Font: SF Pro SemiBold
- Size: 16px
- Line height: 1.3
- Usage: Card titles, modal headers

#### body/md
- Font: SF Pro Regular
- Size: 14px
- Line height: 1.5
- Usage: Default body text

#### body/sm
- Font: SF Pro Regular
- Size: 12px
- Line height: 1.4
- Usage: Secondary information, captions

#### label/xs
- Font: SF Pro SemiBold
- Size: 10px
- Line height: 1.2
- Transform: uppercase
- Letter spacing: 0.4px
- Usage: Input labels, section labels

#### mono/lg
- Font: SF Pro Bold
- Size: 24px
- Line height: 1.2
- Variant: tabular-nums
- Usage: KPIs, large monetary amounts

---

## SHADOWS

### shadow/card
```
0 1px 4px rgba(0,0,0,0.08),
0 0 0 1px rgba(0,0,0,0.04)
```
**Usage**: Standard cards, product cards, list items

### shadow/hero
```
0 4px 16px rgba(47,107,62,0.35)
```
**Usage**: Primary CTA button ("Nueva Venta"), hero elements

### shadow/sheet
```
0 -4px 32px rgba(0,0,0,0.18)
```
**Usage**: Bottom sheets, drawers, modals

---

## SPACING SCALE

Following 4px base unit:

- `space/1`: 4px
- `space/2`: 8px
- `space/3`: 12px
- `space/4`: 16px
- `space/5`: 20px
- `space/6`: 24px
- `space/8`: 32px
- `space/10`: 40px

---

## IMPLEMENTATION NOTES

### Color Usage Guidelines
1. Always use semantic tokens in designs, not primitives directly
2. Status colors should only be used for their intended semantic meaning
3. Green (brand color) is reserved for primary actions and success states
4. Monetary values always use tabular-nums for proper alignment

### Accessibility
- All text on green backgrounds (#2F6B3E) must be white for WCAG AA compliance
- Gray-500 (#757572) should only be used on white backgrounds
- Minimum font size: 10px (label/xs only, used sparingly)

### Mobile First
- All designs start at 375×812px (iPhone SE viewport)
- Touch targets minimum 44×44px
- Bottom navigation and sticky footers account for safe areas

---

## FIGMA SETUP INSTRUCTIONS

### Creating Color Variables in Figma:

1. **Create Collection "Primitives":**
   - Add all primitive colors (green-600, gray-900, etc.)
   - Set mode: "Light"

2. **Create Collection "Semantic":**
   - Add semantic tokens (color/action/primary, etc.)
   - Set each to reference the primitive collection
   - Mode: "Light"

3. **Create Collection "Radius":**
   - Add all radius values as Number variables

4. **Create Text Styles:**
   - heading/xl through mono/lg
   - Configure font, size, line-height, letter-spacing as specified
   - For mono/lg: Enable "Tabular figures" in OpenType features

5. **Create Effect Styles:**
   - shadow/card (Layer blur + Inner shadow)
   - shadow/hero (Drop shadow)
   - shadow/sheet (Drop shadow with negative Y offset)
