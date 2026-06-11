import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_API_PORT || 4000);

let autoId = 100;
const posts = [
  {
    userId: 1,
    id: 1,
    title: "Inicio de turno",
    body: "Se habilito la caja y se verifico inventario inicial.",
  },
  {
    userId: 1,
    id: 2,
    title: "Primer corte parcial",
    body: "Ventas estables durante la manana con stock suficiente.",
  },
  {
    userId: 2,
    id: 3,
    title: "Novedad de inventario",
    body: "Se registro nivel bajo en gaseosas y se solicito reposicion.",
  },
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function notFound(response) {
  sendJson(response, 404, {
    error: "Not Found",
    message: "Endpoint no disponible",
  });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Payload demasiado grande"));
      }
    });
    request.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("JSON invalido"));
      }
    });
    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (url.pathname === "/health" && request.method === "GET") {
    sendJson(response, 200, { ok: true, service: "mock-api" });
    return;
  }

  if (url.pathname === "/posts" && request.method === "GET") {
    const limitRaw = url.searchParams.get("_limit") || url.searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : undefined;
    const data = Number.isFinite(limit) ? posts.slice(0, Math.max(0, limit)) : posts;
    sendJson(response, 200, data);
    return;
  }

  if (url.pathname === "/posts" && request.method === "POST") {
    try {
      const body = await readBody(request);
      const title = String(body.title || "").trim();
      const postBody = String(body.body || "").trim();
      const userId = Number(body.userId || 1);

      if (title.length < 4) {
        sendJson(response, 400, { error: "title", message: "El titulo debe tener al menos 4 caracteres." });
        return;
      }

      if (postBody.length < 10) {
        sendJson(response, 400, { error: "body", message: "La descripcion debe tener al menos 10 caracteres." });
        return;
      }

      autoId += 1;
      const created = {
        id: autoId,
        userId: Number.isFinite(userId) ? userId : 1,
        title,
        body: postBody,
      };

      posts.unshift(created);
      sendJson(response, 201, created);
    } catch (error) {
      sendJson(response, 400, {
        error: "bad_request",
        message: error instanceof Error ? error.message : "Solicitud invalida",
      });
    }
    return;
  }

  notFound(response);
});

server.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
  console.log("Endpoints: GET /health, GET /posts, POST /posts");
});
