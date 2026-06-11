import { API_BASE_URL, API_MODE, apiRequest, graphqlRequest } from "./apiClient";
import type { ApiPost, CreatePostPayload } from "../types/api";

const REST_POSTS_PATH =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_REST_POSTS_PATH) || "/posts";

function resolveRestPath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
}

function normalizePost(input: any): ApiPost {
  return {
    userId: Number(input?.userId ?? 1),
    id: Number(input?.id ?? Date.now()),
    title: String(input?.title ?? ""),
    body: String(input?.body ?? ""),
  };
}

export async function getPosts(limit = 6): Promise<ApiPost[]> {
  if (API_MODE === "graphql") {
    const data = await graphqlRequest<{ posts: ApiPost[] }>(
      `
        query Posts($limit: Int!) {
          posts(limit: $limit) {
            id
            userId
            title
            body
          }
        }
      `,
      { limit },
    );

    return data.posts.map(normalizePost);
  }

  const data = await apiRequest<ApiPost[]>(`${REST_POSTS_PATH}?_limit=${limit}`);
  return data.map(normalizePost);
}

export async function createPost(payload: CreatePostPayload): Promise<ApiPost> {
  if (API_MODE === "graphql") {
    const data = await graphqlRequest<{ createPost: ApiPost }>(
      `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            userId
            title
            body
          }
        }
      `,
      { input: payload },
    );

    return normalizePost(data.createPost);
  }

  const data = await apiRequest<ApiPost>(REST_POSTS_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizePost(data);
}

export async function deletePost(postId: number): Promise<boolean> {
  if (API_MODE === "graphql") {
    const data = await graphqlRequest<{ deletePost: boolean }>(
      `
        mutation DeletePost($id: Int!) {
          deletePost(id: $id)
        }
      `,
      { id: postId },
    );

    return Boolean(data.deletePost);
  }

  const response = await fetch(resolveRestPath(`${REST_POSTS_PATH}/${postId}`), {
    method: "DELETE",
  });

  if (response.status === 204) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API ${response.status}: ${errorBody || "Request failed"}`);
  }

  return true;
}

export async function testBackendConnection(): Promise<boolean> {
  try {
    const posts = await getPosts(1);
    return Array.isArray(posts);
  } catch {
    return false;
  }
}
