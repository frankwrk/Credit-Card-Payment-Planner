type ApiErrorPayload = {
  code?: string;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? "Request failed.");
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code;
    this.details = payload?.details;
  }
}

const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8787")
  .replace(/\/+$/, "");

export const API_URL = `${baseUrl}/api`;

export async function apiRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (!token) {
    throw new ApiError(401, {
      code: "UNAUTHORIZED",
      message: "Missing auth token.",
    });
  }

  headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiErrorPayload | undefined;
  let data: T | null = null;

  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text) as T;
      if (!response.ok) {
        payload = data as unknown as ApiErrorPayload;
      }
    } catch (error) {
      if (!response.ok) {
        payload = { message: text };
      }
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, payload);
  }

  return data as T;
}
