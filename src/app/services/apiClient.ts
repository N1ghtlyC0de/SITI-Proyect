type ApiMode = "rest" | "graphql";

const DEFAULT_BASE_URL = "http://localhost:4100";
const DEFAULT_GRAPHQL_PATH = "/graphql";

const env = typeof import.meta !== "undefined" ? import.meta.env : undefined;

export const API_BASE_URL = env?.VITE_API_BASE_URL || DEFAULT_BASE_URL;
export const API_MODE: ApiMode = env?.VITE_API_MODE === "graphql" ? "graphql" : "rest";

function normalizePath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
}

function getGraphqlEndpoint(): string {
  if (env?.VITE_GRAPHQL_ENDPOINT) {
    return normalizePath(env.VITE_GRAPHQL_ENDPOINT);
  }
  return normalizePath(DEFAULT_GRAPHQL_PATH);
}

export function getBackendConfig() {
  return {
    mode: API_MODE,
    restBaseUrl: API_BASE_URL,
    graphqlEndpoint: getGraphqlEndpoint(),
  };
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(normalizePath(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API ${response.status}: ${errorBody || "Request failed"}`);
  }

  return (await response.json()) as T;
}

export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GraphQL ${response.status}: ${errorBody || "Request failed"}`);
  }

  const result = (await response.json()) as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };

  if (result.errors?.length) {
    const message = result.errors[0]?.message || "GraphQL error";
    throw new Error(message);
  }

  if (!result.data) {
    throw new Error("GraphQL response without data");
  }

  return result.data;
}
