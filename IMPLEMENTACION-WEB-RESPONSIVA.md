# Implementacion web responsiva

## Arquitectura Atomic Design

Se reforzo la estructura por niveles:

- `src/app/components/atoms`: componentes base reutilizables (`Button`, `Input`, `LoadingSpinner`, etc.).
- `src/app/components/molecules`: combinaciones de atomos (`FormField`, `AlertBanner`, `SearchBar`, etc.).
- `src/app/components/organisms`: bloques funcionales completos (`ApiPostsPanel`).
- `src/app/components/templates`: layout reutilizable de pagina (`DashboardLayout`).
- `src/app/components/pages`: pagina final ensamblada (`ApiIntegrationPage`).

## Conexion front end - back end (REST)

Se agrego una capa de servicios para separar UI y datos:

- `src/app/services/apiClient.ts`: cliente HTTP con `fetch`, manejo de errores y `VITE_API_BASE_URL`.
- `src/app/services/postsService.ts`: endpoints de negocio:
  - `getPosts()` -> GET `/posts`
  - `createPost()` -> POST `/posts`
- `src/app/types/api.ts`: tipado de contratos API (`ApiPost`, `CreatePostPayload`).
- `backend/server.mjs`: backend propio (REST + GraphQL) sin dependencias externas.
- `backend/schema.graphql`: schema oficial para operaciones GraphQL.
- `backend/data/posts.db`: almacenamiento persistente en SQLite.

Demo funcional:

- Vista: `ApiIntegrationPage` (acceso desde `VendorHome` con boton `API demo`).
- Organismo: `ApiPostsPanel` consume GET y POST, muestra loaders, errores y confirmacion.

## Responsividad (mobile-first)

Se mantiene enfoque mobile-first y se amplio para tablet/desktop:

- Breakpoints definidos en `src/styles/responsive.css` (375, 768, 1024, 1440).
- Nuevo layout responsivo:
  - `.page-shell`
  - `.page-header`
  - `.page-grid`
- Uso de Grid/Flex para adaptacion progresiva por viewport.

## Accesibilidad WCAG 2.1 AA (minimos)

Implementado y reforzado en componentes y estilos:

- **Contraste:** paleta semantica y clases con contrastes mejorados (`accessibility.css`, `design-system.css`).
- **Teclado:** focus visible global y navegacion por botones enlazados a acciones.
- **ARIA:** `aria-live`, `aria-label`, `aria-describedby`, `aria-invalid`, regiones y roles en feedback.
- **Texto alternativo:** imagenes existentes con `alt` (via `ImageWithFallback`).
- **Skip link:** agregado en `App.tsx` para saltar al contenido principal.

Validacion recomendada:

1. Ejecutar `npm run dev`.
2. Correr Lighthouse (Chrome DevTools) en mobile + desktop.
3. Ejecutar axe-core en la pantalla de API demo y flujos de venta.

## Heuristicas de Nielsen aplicadas

- **Visibilidad del estado:** loaders, mensajes de exito/error y estados de envio.
- **Correspondencia con mundo real:** lenguaje directo en espanol (ventas, turno, meta diaria).
- **Control y libertad:** accion `Deshacer` tras POST local.
- **Consistencia y estandares:** componentes atomicos reutilizables y estilos unificados.
- **Prevencion de errores:** validaciones previas de formulario y botones deshabilitados.
- **Reconocimiento vs recuerdo:** acciones y ayudas visibles en pantalla.
- **Flexibilidad y eficiencia:** atajo `Ctrl+Enter` para enviar formulario.
- **Estetica minimalista:** layout limpio con jerarquia visual.
- **Ayuda y documentacion:** bloque de ayuda rapida integrado en la pagina de API.

## Ejecucion y despliegue local

### Desarrollo

```bash
npm install
npm run dev
```

### Build de produccion

```bash
npm run build
```

### Deploy sugerido (Vercel/Netlify)

- Build command: `npm run build`
- Output directory: `dist`
- (Opcional) Variable de entorno:
  - `VITE_API_BASE_URL=https://tu-backend.com`

## Configurar backend real (REST o GraphQL)

1. Ejecuta backend propio: `npm run backend`.
2. Verifica que `.env` apunte a `VITE_API_BASE_URL=http://localhost:4100`.
3. Selecciona modo:
   - REST: `VITE_API_MODE=rest`
   - GraphQL: `VITE_API_MODE=graphql`
4. Reinicia frontend con `npm run dev`.

### Schema GraphQL implementado (real)

- Query: `posts(limit: Int!): [Post!]!`
- Mutation: `createPost(input: CreatePostInput!): Post!`
- Mutation: `deletePost(id: Int!): Boolean!`
- Archivo: `backend/schema.graphql`

### Persistencia de datos

- Los posts se guardan en SQLite en `backend/data/posts.db`.
- Reiniciar el backend no elimina publicaciones creadas.
- Para resetear datos, elimina `backend/data/posts.db` y reinicia backend.

### Opcion REST

```bash
VITE_API_MODE=rest
VITE_API_BASE_URL=http://localhost:4100
VITE_REST_POSTS_PATH=/posts
```

### Opcion GraphQL

```bash
VITE_API_MODE=graphql
VITE_API_BASE_URL=http://localhost:4100
VITE_GRAPHQL_ENDPOINT=/graphql
```

Notas:

- `VITE_GRAPHQL_ENDPOINT` puede ser ruta (`/graphql`) o URL completa.
- El panel de API muestra en pantalla el modo activo y endpoint/base configurada.
- Operaciones GraphQL exactas ya integradas en frontend sin fallbacks genericos.
- API demo permite eliminar publicaciones con persistencia real.

## Flujo recomendado de prueba (paso a paso)

1. Inicia la app: `npm run dev`.
2. Asegura backend ejecutandose: `npm run backend`.
3. Ingresa como administrador.
3. Abre `API demo` desde la vista principal.
4. Verifica en cabecera:
   - modo activo (`REST` o `GRAPHQL`)
   - endpoint/base en uso
   - estado de conexion (`conectado`)
5. Pulsa `Actualizar` para probar GET.
6. Crea una publicacion para probar POST.
7. Usa `Deshacer` para validar control del usuario.

### Mock local opcional

Si no tienes backend real aun, puedes usar el mock solo para desarrollo local:

1. Ejecuta `npm run mock:api`.
2. Cambia temporalmente `.env` a `VITE_API_BASE_URL=http://localhost:4000`.

Endpoints disponibles:

- `GET http://localhost:4000/health`
- `GET http://localhost:4000/posts?_limit=6`
- `POST http://localhost:4000/posts`

## Nota

El proyecto ya incluye backend propio listo para evolucionar a base de datos (SQLite/PostgreSQL).
