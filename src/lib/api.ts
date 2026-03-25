import { useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "./apiURL";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | Array<unknown> | null;
}

export function useApi() {
  const { token } = useAuth();

  const request = useCallback(
    async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const { body, ...fetchOptions } = options;

      const config: RequestInit = {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      };

      if (body) {
        if (typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob)) {
          config.body = JSON.stringify(body);
        } else {
          config.body = body as BodyInit;
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      const contentType = response.headers.get("content-type");
      let data: unknown;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON Response from API:", text.slice(0, 500)); 
        throw new Error(`Server returned non-JSON response (${response.status}). If you see HTML, the backend might be offline or unreachable on port 5000.`);
      }

      if (!response.ok) {
        const errorData = data as Record<string, string>;
        throw new Error(errorData?.message || errorData?.error || "An API error occurred");
      }

      return data as T;
    },
    [token]
  );

  const get = useCallback(<T>(endpoint: string, options?: Omit<RequestOptions, "method">) => 
    request<T>(endpoint, { ...options, method: "GET" }), [request]);

  const post = useCallback(<T>(endpoint: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) => 
    request<T>(endpoint, { ...options, method: "POST", body }), [request]);

  const put = useCallback(<T>(endpoint: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) => 
    request<T>(endpoint, { ...options, method: "PUT", body }), [request]);

  const del = useCallback(<T>(endpoint: string, options?: Omit<RequestOptions, "method">) => 
    request<T>(endpoint, { ...options, method: "DELETE" }), [request]);

  return useMemo(() => ({ get, post, put, del, delete: del }), [get, post, put, del]);
}
