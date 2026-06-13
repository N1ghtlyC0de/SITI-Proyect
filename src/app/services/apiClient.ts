type ApiMode = "rest" | "graphql";

const DEFAULT_BASE_URL = "http://localhost:8000";
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

export async function apiRequest<T>(
  path: string, 
  init?: RequestInit, 
  retries = 3, 
  backoffDelay = 1000
): Promise<T> {
  const url = normalizePath(path);
  
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
        signal: controller.signal,
        ...init,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API ${response.status}: ${errorBody || "Request failed"}`);
      }

      return (await response.json()) as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      const isLastAttempt = attempt === retries - 1;
      const isAbort = error.name === "AbortError";
      const isNetworkError = error instanceof TypeError || isAbort || error?.message?.toLowerCase().includes("failed to fetch") || error?.message?.toLowerCase().includes("networkerror");

      if (isLastAttempt || !isNetworkError) {
        console.error(`apiRequest error on ${url}:`, error);
        throw error;
      }

      const nextDelay = backoffDelay * Math.pow(2, attempt);
      console.warn(`apiRequest failed on ${url}. Retrying in ${nextDelay}ms... (Attempt ${attempt + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, nextDelay));
    }
  }
  
  throw new Error(`API request to ${url} failed after ${retries} attempts.`);
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
