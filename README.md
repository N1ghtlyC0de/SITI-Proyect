
  # 3 . Sistema de Información Informal (copia) (copia)

  This is a code bundle for 3 . Sistema de Información Informal (copia) (copia). The original project is available at https://www.figma.com/design/SeXF7oi1XttYO7m6010kvC/3-.-Sistema-de-Informaci%C3%B3n-Informal--copia---copia-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Backend configuration

  1. Copy `.env.example` to `.env`.
  2. Choose API mode:
     - REST: `VITE_API_MODE=rest`
     - GraphQL: `VITE_API_MODE=graphql`
  3. Set backend URL using `VITE_API_BASE_URL`.

  Default `.env` points to the included backend (`http://localhost:4100`).

  ## Included real backend (REST + GraphQL)

  Run `npm run backend` to start backend API on `http://localhost:4100`.

  REST endpoints:

  - `GET /health`
  - `GET /posts?_limit=6`
  - `POST /posts`
  - `DELETE /posts/:id`

  GraphQL endpoint:

  - `POST /graphql`
  - Schema file: `backend/schema.graphql`

  Persistence:

  - Posts are stored in SQLite: `backend/data/posts.db`
  - New posts survive backend restarts

  ## Local mock API (sin backend propio)

  Run `npm run mock:api` to start a local REST backend at `http://localhost:4000`.

  Available endpoints:

  - `GET /health`
  - `GET /posts?_limit=6`
  - `POST /posts`

  To use the mock API, update `.env` temporarily to `VITE_API_BASE_URL=http://localhost:4000`.
  
