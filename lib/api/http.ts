// The one place that sends HTTP requests to groundwork-api.

/** The API is on Render's free plan, which sleeps when idle and can take ~30–60 s to wake. */
const TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function baseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set (see .env.example).");
  return base.replace(/\/+$/, "");
}

/**
 * Encodes one path segment, so a value like "../admin" can't change which endpoint is called.
 * Every value from a URL or user input that goes into an API path must pass through this.
 */
export function segment(value: string): string {
  return encodeURIComponent(value);
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Sent as JSON. */
  body?: unknown;
  /** Admin session token, sent as a Bearer header. Server-side only; never pass it to the browser. */
  token?: string;
};

/**
 * Sends a request to `/api/v1${path}` and returns the raw Response. Network failures and timeouts
 * become ApiError(0). Callers decide what each status means.
 */
export async function apiFetch(path: string, { method = "GET", body, token }: FetchOptions = {}): Promise<Response> {
  if (!path.startsWith("/")) throw new Error(`API path must start with "/": ${path}`);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    return await fetch(`${baseUrl()}/api/v1${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(0, `Couldn't reach the API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * GET `/api/v1${path}` and parse the JSON. Returns null for 404 (not found, or not published);
 * throws ApiError for any other failure so the page's error boundary can show it.
 */
export async function apiGet<T>(path: string): Promise<T | null> {
  const response = await apiFetch(path);
  if (response.status === 404) return null;
  if (!response.ok) throw new ApiError(response.status, `API responded ${response.status} for ${path}`);
  return (await response.json()) as T;
}
