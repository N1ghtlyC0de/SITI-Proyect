import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const PORT = Number(process.env.BACKEND_PORT || 4100);
const DATA_DIR = resolve(process.cwd(), "backend", "data");
const DB_FILE = resolve(DATA_DIR, "posts.db");

const INITIAL_POSTS = [
  {
    id: 1,
    userId: 1,
    title: "Apertura del punto",
    body: "Caja inicial confirmada y listado de productos verificado.",
    createdAt: "2026-05-31T00:00:00.000Z",
  },
  {
    id: 2,
    userId: 2,
    title: "Movimiento de media manana",
    body: "Se registran ventas estables y flujo continuo de clientes.",
    createdAt: "2026-05-31T00:05:00.000Z",
  },
];

function ensureDataDir() {
  const dataDir = dirname(DB_FILE);
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

function normalizePost(input) {
  return {
    id: Number(input?.id),
    userId: Number(input?.userId),
    title: String(input?.title || "").trim(),
    body: String(input?.body || "").trim(),
    createdAt: input?.createdAt ? String(input.createdAt) : new Date().toISOString(),
  };
}

ensureDataDir();

const database = new DatabaseSync(DB_FILE);

database.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

const countRow = database.prepare("SELECT COUNT(*) as count FROM posts").get();
if (Number(countRow?.count || 0) === 0) {
  const seedStatement = database.prepare(
    "INSERT INTO posts (id, userId, title, body, createdAt) VALUES (?, ?, ?, ?, ?)",
  );
  database.exec("BEGIN");
  try {
    for (const item of INITIAL_POSTS) {
      seedStatement.run(item.id, item.userId, item.title, item.body, item.createdAt);
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolvePromise, rejectPromise) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) {
        rejectPromise(new Error("Payload demasiado grande"));
      }
    });
    request.on("end", () => {
      if (!data) {
        resolvePromise({});
        return;
      }
      try {
        resolvePromise(JSON.parse(data));
      } catch {
        rejectPromise(new Error("JSON invalido"));
      }
    });
    request.on("error", rejectPromise);
  });
}

function validatePostInput(input) {
  const title = String(input?.title || "").trim();
  const body = String(input?.body || "").trim();
  const userId = Number(input?.userId);

  if (!Number.isFinite(userId) || userId <= 0) {
    return { ok: false, message: "userId debe ser un numero positivo." };
  }
  if (title.length < 4) {
    return { ok: false, message: "title debe tener al menos 4 caracteres." };
  }
  if (body.length < 10) {
    return { ok: false, message: "body debe tener al menos 10 caracteres." };
  }

  return {
    ok: true,
    value: {
      userId,
      title,
      body,
    },
  };
}

function listPosts(limit) {
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;
  const rows = database
    .prepare("SELECT id, userId, title, body, createdAt FROM posts ORDER BY id DESC LIMIT ?")
    .all(normalizedLimit);
  return rows.map(normalizePost);
}

function createPost(input) {
  const createdAt = new Date().toISOString();
  const result = database
    .prepare("INSERT INTO posts (userId, title, body, createdAt) VALUES (?, ?, ?, ?)")
    .run(input.userId, input.title, input.body, createdAt);

  const created = database
    .prepare("SELECT id, userId, title, body, createdAt FROM posts WHERE id = ?")
    .get(Number(result.lastInsertRowid));

  return normalizePost(created);
}

function deletePost(id) {
  const result = database.prepare("DELETE FROM posts WHERE id = ?").run(id);
  return Number(result.changes || 0) > 0;
}

function handleRest(request, response, url) {
  if (url.pathname === "/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true, service: "backend", mode: "rest+graphql" });
    return true;
  }

  if (url.pathname === "/posts" && request.method === "GET") {
    const limitRaw = url.searchParams.get("_limit") || url.searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : 50;
    sendJson(response, 200, listPosts(limit));
    return true;
  }

  return false;
}

async function handleRestPost(request, response, url) {
  if (url.pathname !== "/posts" || request.method !== "POST") {
    return false;
  }

  const payload = await readBody(request);
  const validation = validatePostInput(payload);

  if (!validation.ok) {
    sendJson(response, 400, { error: "validation", message: validation.message });
    return true;
  }

  const created = createPost(validation.value);
  sendJson(response, 201, created);
  return true;
}

function handleRestDelete(request, response, url) {
  if (request.method !== "DELETE") {
    return false;
  }

  const match = url.pathname.match(/^\/posts\/(\d+)$/);
  if (!match) {
    return false;
  }

  const id = Number(match[1]);
  const deleted = deletePost(id);

  if (!deleted) {
    sendJson(response, 404, { error: "not_found", message: "Post no encontrado" });
    return true;
  }

  response.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end();
  return true;
}

function parseGraphqlOperation(query) {
  const compact = String(query || "").replace(/\s+/g, " ").trim();
  if (compact.includes("query") && compact.includes("posts")) return "posts";
  if (compact.includes("mutation") && compact.includes("createPost")) return "createPost";
  if (compact.includes("mutation") && compact.includes("deletePost")) return "deletePost";
  return "unknown";
}

async function handleGraphql(request, response, url) {
  if (url.pathname !== "/graphql" || request.method !== "POST") {
    return false;
  }

  const payload = await readBody(request);
  const operation = parseGraphqlOperation(payload.query);
  const variables = payload.variables || {};

  if (operation === "posts") {
    const limit = Number(variables.limit || 50);
    sendJson(response, 200, {
      data: {
        posts: listPosts(limit),
      },
    });
    return true;
  }

  if (operation === "createPost") {
    const input = variables.input || {};
    const validation = validatePostInput(input);

    if (!validation.ok) {
      sendJson(response, 200, {
        errors: [{ message: validation.message }],
      });
      return true;
    }

    const created = createPost(validation.value);
    sendJson(response, 200, {
      data: {
        createPost: created,
      },
    });
    return true;
  }

  if (operation === "deletePost") {
    const id = Number(variables.id);
    if (!Number.isFinite(id) || id <= 0) {
      sendJson(response, 200, {
        errors: [{ message: "id debe ser un numero positivo." }],
      });
      return true;
    }

    const deleted = deletePost(id);
    sendJson(response, 200, {
      data: {
        deletePost: deleted,
      },
    });
    return true;
  }

  sendJson(response, 200, {
    errors: [{ message: "Operacion GraphQL no soportada. Usa posts, createPost o deletePost." }],
  });
  return true;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  try {
    if (handleRest(request, response, url)) return;
    if (await handleRestPost(request, response, url)) return;
    if (handleRestDelete(request, response, url)) return;
    if (await handleGraphql(request, response, url)) return;

    sendJson(response, 404, { error: "not_found", message: "Endpoint no encontrado" });
  } catch (error) {
    sendJson(response, 500, {
      error: "internal_error",
      message: error instanceof Error ? error.message : "Error interno",
    });
  }
});

server.listen(PORT, () => {
  const schemaPath = resolve(process.cwd(), "backend", "schema.graphql");
  const schemaPreview = readFileSync(schemaPath, "utf-8").split("\n").slice(0, 3).join(" ");
  console.log(`Backend API running on http://localhost:${PORT}`);
  console.log("REST: GET /health, GET /posts, POST /posts, DELETE /posts/:id");
  console.log("GraphQL: POST /graphql");
  console.log(`SQLite database: ${DB_FILE}`);
  console.log(`Schema loaded: ${schemaPreview} ...`);
});
