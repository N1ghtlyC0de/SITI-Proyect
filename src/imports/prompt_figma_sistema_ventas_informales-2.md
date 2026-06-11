# Prompt para Figma AI — Sistema de Información para Trabajos Informales

---

## 🎯 CONTEXTO DEL PROYECTO

Diseña la interfaz completa (web responsive) de un **Sistema de Información para Trabajos Informales** cuyo objetivo estratégico es **reducir costos operativos, eliminar pérdidas por registro manual en horas pico y digitalizar el control de ventas, inventario y caja** en pequeños negocios informales (estudiantiles, puestos de venta en espacio público, etc.).

El sistema debe reemplazar el proceso actual de papel + cuaderno + memoria del vendedor por una herramienta digital **rápida, accesible desde el celular, simple y con validación automática**. El diseño debe priorizar velocidad de registro en horas pico (meta: una venta completa en ≤ 2 minutos y ≤ 10 clics), legibilidad en pantallas pequeñas y tolerancia a conexiones inestables (modo offline con cola de sincronización).

---

## 👥 ROLES Y PERMISOS (tres perfiles de usuario)

Diseña flujos, menús y paneles diferenciados para estos tres roles. Cada rol debe ver **solo lo que le corresponde**:

### 1. Vendedor (operativo, móvil-first)
- Registrar ventas rápidas
- Gestionar inventario (alta/baja de movimientos)
- Abrir y cerrar caja (monto inicial y final del turno)
- Ver historial de sus propios turnos

### 2. Encargado del negocio / Administrador (tablet + escritorio)
- Obtener datos consolidados, registros y métricas
- Verificar ventas y errores
- Acceder al dashboard contable con KPIs
- Modificar catálogo de productos y precios
- Exportar reportes (CSV y PDF) con sellos de auditoría
- Consultar historial de movimientos por producto
- Comparar ingresos semanales/mensuales

### 3. Dueño del negocio / Super-administrador (escritorio)
- Todo lo anterior más:
- Creación de perfiles y asignación de roles
- Verificación global de ventas
- Notificación de errores y actualizaciones
- Auditoría completa (quién hizo qué y cuándo)

---

## 🎨 SISTEMA DE DISEÑO (Design System)

Crea un Design System reutilizable con estos tokens:

### Paleta de colores
- **Primario:** verde oliva / verde bosque (`#2F6B3E` aprox.) — transmite confianza y se asocia a dinero/crecimiento
- **Secundario:** dorado suave (`#D4A547`) — para acentos y KPIs positivos
- **Neutros:** escala de grises (`#F7F7F5`, `#E5E5E2`, `#9A9A96`, `#2B2B2B`)
- **Semánticos:**
  - Éxito: `#2E7D32` (verde)
  - Advertencia: `#ED6C02` (ámbar) — para descuadres y alertas
  - Error: `#C62828` (rojo) — para fallos de validación
  - Información: `#0277BD` (azul)
- **Mapa de calor del proceso:** verde (bajo) / amarillo (medio) / rojo (crítico)

### Tipografía
- **Titular:** Inter o Plus Jakarta Sans, 600–700, escala 28/24/20/18 px
- **Cuerpo:** Inter 400–500, 16 px base (nunca <14 px en móvil)
- **Números/KPIs:** variante tabular (tabular-nums) para alinear cifras
- **Espaciado de línea:** 1.5 para cuerpo, 1.2 para titulares

### Componentes base (crea variantes con Auto Layout)
- Botones: primario / secundario / terciario / destructivo / icono — estados default / hover / pressed / disabled / loading
- Inputs: texto, numérico, búsqueda, dropdown simple, dropdown multi-selección, selector de fecha, stepper de cantidad
- Cards de producto (con imagen/emoji, nombre, precio, stock)
- Tablas con filtros, orden y paginación
- Tabs horizontales y verticales
- Modales de confirmación y de error
- Toasts/snackbars (éxito, error, info, offline)
- Badges de estado (En línea / Offline / Sincronizando / Pendiente)
- Gráficos: barras, líneas, donut (para el dashboard)
- Navegación inferior (bottom nav) para móvil y sidebar para escritorio
- Skeleton loaders para estados de carga

### Iconografía
Usa una librería coherente (Lucide, Phosphor o similar), trazo de 1.5–2 px, tamaño base 20–24 px.

### Radios y sombras
- Radius: 8 px (inputs y botones), 12 px (cards), 16 px (modales)
- Sombras suaves tipo `0 2px 8px rgba(0,0,0,0.06)`; evita sombras duras

---

## 📱 DISEÑO RESPONSIVE (obligatorio)

Entrega cada pantalla clave en **tres breakpoints**:

| Breakpoint | Ancho | Uso principal |
|---|---|---|
| Mobile | 375 px | Vendedor en el puesto (prioridad #1) |
| Tablet | 768 px | Administrador revisando reportes |
| Desktop | 1440 px | Dueño / dashboard contable |

Reglas:
- **Mobile-first real:** el módulo de Ventas e Inventario del vendedor se diseña primero a 375 px y luego escala
- Navegación: **bottom nav** con 4–5 iconos en móvil, **sidebar colapsable** en tablet/desktop
- Tipografía y botones con tamaños táctiles mínimos de 44×44 px en móvil
- Formularios en columna única en móvil, dos columnas en tablet, tres en desktop
- Tablas: en móvil se transforman en listas de cards apiladas
- Los KPIs del dashboard se apilan verticalmente en móvil y se reorganizan en grid 2×2 o 4×1 en desktop

---

## 🧩 HEURÍSTICAS DE NIELSEN (aplicación explícita por pantalla)

Cada pantalla debe evidenciar estas 10 heurísticas. Al diseñar, anota en un frame lateral cómo cada pantalla cumple al menos 5–6 de ellas:

1. **Visibilidad del estado del sistema** — indicadores de conexión (Online/Offline/Sincronizando), barras de progreso al guardar venta, sello de tiempo de última actualización en el dashboard, confirmación visual al registrar una venta en ≤ 5 seg.
2. **Relación entre el sistema y el mundo real** — usa lenguaje del negocio ("abrir caja", "cerrar turno", "cuadre de caja"), íconos reconocibles (billete, carrito, caja registradora), formatos de moneda y fecha en español colombiano (`$12.500` con punto de miles).
3. **Control y libertad del usuario** — botón de "Cancelar" visible en todos los formularios, opción de "Deshacer" tras registrar una venta (ventana de 10 seg), breadcrumbs en escritorio, botón "Atrás" en móvil.
4. **Consistencia y estándares** — mismos patrones de color, tipografía, posición de acciones primarias (siempre abajo-derecha en modales, pegadas al pulgar en móvil). Los tres módulos (Ventas / Contabilidad / Inventario) comparten layout.
5. **Prevención de errores** — validaciones en tiempo real en el formulario de venta (monto pagado vs. total), bloqueo del botón "Confirmar" hasta que los campos obligatorios estén listos, confirmación modal antes de eliminar un producto del catálogo, alerta antes de cerrar turno si hay ventas sin sincronizar.
6. **Reconocer mejor que recordar** — combos favoritos y productos más vendidos visibles en la pantalla inicial de venta, búsqueda con autocompletado, últimos turnos visibles al abrir caja, lista de productos con imagen/emoji en vez de solo texto.
7. **Flexibilidad y eficiencia de uso** — atajos de teclado en desktop (Enter para confirmar, Esc para cerrar), acceso rápido a productos favoritos en móvil, filtros guardados en el dashboard, plantillas reutilizables de exportación.
8. **Diseño estético y minimalista** — una acción primaria por pantalla, máximo 3 niveles de jerarquía visual, espacios en blanco generosos, no más de 10 campos obligatorios en el formulario de ventas (RNF-02).
9. **Ayuda para reconocer, diagnosticar y recuperarse de errores** — mensajes claros en lenguaje humano:
   - "El monto ingresado no coincide con el pago"
   - "Error de conexión. La venta será guardada en cola y registrada automáticamente al restablecer la conexión"
   - "Inconsistencia detectada en los datos. Revise las transacciones"
   - Siempre con opción de acción correctiva (Reintentar, Corregir, Ver detalles).
10. **Ayuda y documentación** — tooltip (?) junto a cada KPI explicando cómo se calcula, un botón flotante de "¿Necesitas ayuda?" con onboarding paso a paso la primera vez, FAQ accesible desde el menú.

---

## 🗺️ PANTALLAS A DISEÑAR (14 pantallas principales)

> **Principio de consolidación:** cada pantalla agrupa funciones afines usando tabs, paneles laterales, bottom sheets, modales y estados en lugar de multiplicar pantallas. Estados como offline, éxito, error, cargando o vacío **no son pantallas aparte** — son variantes de la pantalla padre.

### A. AUTENTICACIÓN Y ONBOARDING (2 pantallas)

1. **Login** (HU transversal, RNF-05)
   - Usuario + contraseña, "Recordarme", "¿Olvidaste tu contraseña?"
   - **Variantes dentro de la misma pantalla:** estado inicial, recuperación de contraseña (modal de 2 pasos), selección de negocio si el usuario tiene varios (dropdown)
   - Autenticación segura, única, rápida y auditable

2. **Onboarding** (primera vez)
   - Carrusel de 3 slides dentro de la misma pantalla (paginación con dots): registrar ventas rápido → ver KPIs → exportar reportes
   - Skip y "Empezar" al final

### B. MÓDULO DE VENTAS — Rol Vendedor (4 pantallas)

3. **Home del Vendedor** (hub operativo, HU-001, HU-003)
   - Saludo + estado del turno (Abierto / Cerrado) como banner principal
   - **Banner de conexión** (Online / Offline / Sincronizando X ventas pendientes) → absorbe la "pantalla de estado offline"
   - Botón gigante "+ Nueva venta" pegado al pulgar
   - Resumen del día: mini-KPIs (total $, # ventas, alertas)
   - Sección "Últimas ventas del turno" con lista compacta (absorbe "Historial del turno")
   - Acceso secundario: Inventario, Cerrar turno

4. **Apertura / Cierre de Caja** (HU-003, una sola pantalla con dos variantes)
   - **Variante A — Apertura:** input de monto inicial, hora automática, botón "Abrir turno"
   - **Variante B — Cierre/Cuadre:** monto inicial + total ventas esperado vs. monto físico contado, alerta visual si hay descuadre, campo obligatorio de observación, botón "Cerrar turno"
   - Historial de turnos anteriores accesible por tab secundario

5. **Nueva Venta** (HU-001-a, HU-001-b, HU-001-c, HU-002 — flujo completo en UNA pantalla)
   - **Sección superior:** grid de productos favoritos con imagen/emoji + buscador con autocompletado + combos predefinidos
   - **Panel/bottom sheet lateral:** carrito actualizado en vivo con subtotal
   - **Sección inferior (sticky):** método de pago (efectivo / Nequi / Daviplata / tarjeta), monto recibido con cálculo automático de vuelto, botón "Confirmar venta" grande
   - **Modal de confirmación exitosa** (no pantalla aparte): check animado, # ticket, "Enviar recibo por WhatsApp" / "Nueva venta" / "Finalizar"
   - Meta: flujo completo en ≤ 10 clics y ≤ 5 seg de respuesta

6. **Detalle de Venta / Ticket** (accesible desde Home o desde Auditoría)
   - Información completa de la venta, productos, total, método de pago, vendedor, timestamp
   - Opción "Anular" con registro de evidencia del cambio (no se borra, se marca)

### C. MÓDULO DE INVENTARIO (2 pantallas)

7. **Inventario** (HU-007, HU-008 — listado + detalle en panel)
   - Listado con imagen, stock, stock mínimo, badge de color (verde / amarillo / rojo)
   - Buscador + filtros (categoría, stock bajo, etc.)
   - **Panel lateral al seleccionar producto:** detalle + tab de historial de movimientos (HU-008), exportable CSV/PDF
   - Botón flotante "+ Movimiento"

8. **Registrar Movimiento de Inventario** (HU-007 — puede abrirse como modal de la pantalla 7)
   - Dropdown de producto (sin escritura manual)
   - Selector de tipo (Entrada / Salida / Ajuste)
   - Stepper de cantidad
   - Motivo con opciones predefinidas
   - Meta: ≤ 5 min, sin teclado virtual invasivo

### D. MÓDULO CONTABLE — Rol Administrador (3 pantallas)

9. **Dashboard Contable** (HU-006-a, HU-006-b, HU-010 — consolida 3 historias)
   - KPIs superiores: Ventas del día, Utilidad, # productos vendidos, Ticket promedio
   - Gráfico de barras de ventas por hora (evidencia horas pico)
   - Gráfico de líneas de tendencia semanal + top 5 productos
   - **Panel lateral de filtros dinámicos** (rango fecha, producto, vendedor, tipo pago) → resultados en ≤ 5 seg
   - **Tab secundario "Comparación"** (HU-010): selector semanal/mensual, dos períodos lado a lado, % crecimiento
   - Botón "Exportar" en la esquina (abre modal compartido de exportación)

10. **Reportes Contables** (HU-005-a, HU-005-b, HU-005-c — consolida 3 historias)
    - Listado de reportes con buscador, filtros guardados, acceso en ≤ 2 clics
    - **Panel lateral al seleccionar reporte:** detalle con trazabilidad 100% por línea (ID venta, fecha, vendedor), alerta si hay inconsistencias con botón "Revisar transacciones"
    - **Modal compartido de exportación** (reutilizado aquí y en Dashboard): formato CSV/PDF, rango de fechas, campos, sello de auditoría automático (usuario + timestamp)

11. **Catálogo de Productos** (HU-004)
    - Tabla editable inline con imagen, nombre, precio, stock, estado
    - Edición de precio con un clic + confirmación
    - Agregar / Eliminar producto con modal de confirmación
    - Mensaje de advertencia por error de digitación
    - Acceso restringido al rol Administrador

### E. ADMINISTRACIÓN SUPERIOR — Rol Dueño (3 pantallas)

12. **Auditoría** (HU-009 — consolida "auditoría de acciones" + centro de alertas)
    - Tabla en tiempo real: fecha, hora, usuario, acción (venta / inventario / ajuste / anulación)
    - Filtros por tipo de acción y por usuario
    - **Tab secundario "Alertas":** descuadres, ventas anuladas, errores de sincronización, stock crítico
    - Exportable CSV/PDF, restringido a rol administrativo

13. **Gestión de Usuarios y Roles**
    - Listado de usuarios con rol, estado, último acceso
    - **Panel lateral al seleccionar:** crear / editar usuario, asignar rol (Vendedor / Administrador / Dueño), desactivar
    - Historial de cambios de permisos por usuario

14. **Configuración del Negocio**
    - Datos del negocio, horarios, moneda
    - Gestión de categorías y combos favoritos del vendedor
    - Backup, política de retención de datos (RNF-08: mínimo 5 años)
    - Preferencias de notificaciones y alertas

---

### 📋 Mapeo Historia de Usuario → Pantalla

| Historia | Título | Pantalla |
|---|---|---|
| HU-001-a/b/c | Registro rápido / selección / confirmación | 5 |
| HU-002 | Formulario simplificado | 5 |
| HU-003 | Gestión de caja | 3 y 4 |
| HU-004 | Modificación del catálogo | 11 |
| HU-005-a/b/c | Reportes (acceso, consistencia, exportación) | 10 |
| HU-006-a/b/c | Dashboard, filtros, exportación de reportes | 9 |
| HU-007 | Registro de inventario | 8 |
| HU-008 | Historial de movimientos de producto | 7 (panel lateral) |
| HU-009 | Auditoría | 12 |
| HU-010 | Comparación de ingresos | 9 (tab secundario) |

---

## 🎭 ESTADOS A REPRESENTAR EN CADA PANTALLA

Para cada pantalla principal entrega los siguientes estados (mínimo 4 por pantalla crítica):
- **Vacío** (primera vez, sin datos) con ilustración amable y CTA
- **Cargando** (skeleton, no spinners genéricos)
- **Con datos** (estado óptimo)
- **Error** (con mensaje humano y acción de recuperación)
- **Offline** (banner persistente + cola de sincronización)
- **Éxito** (confirmación después de acción crítica)

---

## ♿ ACCESIBILIDAD (WCAG AA mínimo)

- Contraste mínimo 4.5:1 en texto normal, 3:1 en texto grande
- Áreas táctiles ≥ 44×44 px
- No usar color como único canal de información (siempre icono + texto + color)
- Labels visibles en todos los inputs (nada de solo placeholders)
- Orden lógico de tabulación
- Textos alternativos en iconos con significado
- Compatible con lector de pantalla (roles y aria-labels en el handoff)

---

## 🔄 MICROINTERACCIONES CLAVE (anótalas como specs en los frames)

- Animación de confirmación al registrar venta (check verde 300 ms)
- Transición suave entre pasos del formulario de venta (slide 200 ms)
- Haptic feedback en móvil al confirmar
- Contador animado de ventas pendientes cuando está offline
- KPIs con animación de conteo al cargar el dashboard
- Pull-to-refresh en listas móviles
- Skeleton loaders con shimmer sutil

---

## 📐 ENTREGABLES ESPERADOS EN FIGMA

1. **Cover / página de inicio** con nombre del proyecto, versión y team.
2. **Página "Design System"** con todos los tokens, componentes y variantes.
3. **Página "Flujos de usuario"** con user flows de los 3 roles (diagramas conectados).
4. **Página "Mobile (375 px)"** con las pantallas del rol Vendedor (1–8) adaptadas a móvil como prioridad.
5. **Página "Tablet (768 px)"** con las pantallas clave adaptadas (híbrido vendedor/admin).
6. **Página "Desktop (1440 px)"** con las 14 pantallas completas, énfasis en dashboard, reportes y auditoría.
7. **Página "Estados y errores"** con todos los estados vacío/error/offline.
8. **Página "Prototipo"** con al menos 3 flujos interactivos navegables:
   - Flujo A: Vendedor abre caja → registra 2 ventas → cierra caja
   - Flujo B: Administrador abre dashboard → aplica filtros → exporta reporte
   - Flujo C: Dueño crea un usuario nuevo → asigna rol → consulta auditoría
9. **Anotaciones de heurísticas** en una página final mapeando qué heurística de Nielsen cumple cada pantalla.

---

## ✅ CRITERIOS DE ÉXITO DEL DISEÑO

El diseño se considera exitoso cuando:
- Un vendedor puede completar una venta en **≤ 10 clics** y **≤ 2 minutos**
- El dashboard del administrador carga visualmente en menos de 5 segundos percibidos
- Toda acción destructiva tiene confirmación y posibilidad de deshacer
- El sistema se ve y se siente igual de bien en móvil (375 px) que en desktop (1440 px)
- Un usuario nuevo entiende qué hacer sin capacitación previa (autoexplicativo)
- Las 10 heurísticas de Nielsen están evidenciadas al menos una vez en la propuesta
- El diseño es modular: agregar un nuevo módulo no rompe la consistencia (RNF-03)

---

## 🧭 TONO Y PERSONALIDAD DE LA INTERFAZ

Profesional pero cercano. Nada corporativo frío. El usuario final es un vendedor informal (posiblemente un estudiante o emprendedor pequeño), no un contador de multinacional. Usa lenguaje claro, directo, en español colombiano, sin tecnicismos innecesarios. El sistema debe sentirse como un aliado que **le quita trabajo**, no como un software que se lo agrega.

---

**Entrega todas las pantallas con nombres claros, componentes organizados por Auto Layout, y un prototipo navegable. Prioriza velocidad percibida, claridad visual y la experiencia del vendedor en horas pico.**
