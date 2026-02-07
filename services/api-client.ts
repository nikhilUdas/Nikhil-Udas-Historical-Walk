import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../constants/api";

// Simple fetch wrapper with token handling and JSON parsing.
// Use EXPO_PUBLIC_API_BASE_URL to configure the backend URL at runtime.

const TOKEN_KEY = "hw_auth_token";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  body?: Record<string, unknown> | FormData | undefined;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
};

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
};

export const getAuthToken = async () => AsyncStorage.getItem(TOKEN_KEY);
export const setAuthToken = async (token: string) => AsyncStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = async () => AsyncStorage.removeItem(TOKEN_KEY);

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, query, signal } = options;
  const token = await getAuthToken();
  const url = buildUrl(path, query);

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  let finalBody: BodyInit | undefined;

  if (body instanceof FormData) {
    finalBody = body;
    // Let fetch set multipart boundaries automatically; do not set Content-Type here.
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: method === "GET" || method === "DELETE" ? undefined : finalBody,
    signal,
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const message = (data as any)?.message || (data as any)?.error || `Request failed (${res.status})`;
    // Clear token on 401 to force re-auth later.
    if (res.status === 401) {
      await clearAuthToken().catch(() => null);
    }
    throw new Error(message);
  }

  return data as T;
}

export const get = <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
  request<T>(path, { ...options, method: "GET" });

export const post = <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
  request<T>(path, { ...options, method: "POST", body });

export const put = <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
  request<T>(path, { ...options, method: "PUT", body });

export const patch = <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
  request<T>(path, { ...options, method: "PATCH", body });

export const del = <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
  request<T>(path, { ...options, method: "DELETE" });
