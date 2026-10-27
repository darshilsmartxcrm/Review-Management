/**
 * Base API Client with JWT Bearer token injection and fallback resilience
 */

const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    const envUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      // If running on a live public domain but env variable pointed to localhost, use relative origin
      if (envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
        return '';
      }
    }
    return envUrl;
  }
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return '';
  }
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

const TOKEN_KEY = 'rgh_jwt_auth_token_v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string, remember = true): void {
  if (typeof window === 'undefined') return;
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers = {}, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getAuthToken();
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token && !requestHeaders['Authorization']) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data as T;
  } catch (err: any) {
    // If backend is unreachable or CORS fails, rethrow clean error
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn(`[API Network Error] Could not connect to ${url}. Ensure backend is running at ${API_BASE_URL}`);
    }
    throw err;
  }
}
