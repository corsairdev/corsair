import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AeroleadsAPIError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfter?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AeroleadsAPIError';
  }
}

const AEROLEADS_API_BASE = 'https://aeroleads.com/api';

export async function makeAeroleadsRequest<T>(
  endpoint: string,
  apiKey: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: Record<string, unknown>;
    query?: Record<string, string | number | boolean | undefined>;
  } = {},
): Promise<T> {
  const { method = 'GET', body, query } = options;

  const config: OpenAPIConfig = {
    BASE: AEROLEADS_API_BASE,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'omit',
    TOKEN: apiKey,
    HEADERS: {
      'Content-Type': 'application/json',
    },
  };

  const requestOptions: ApiRequestOptions = {
    method,
    url: endpoint,
    body: method === 'POST' || method === 'PUT' || method === 'PATCH' ? body : undefined,
    mediaType: 'application/json; charset=utf-8',
    query: {
      api_key: apiKey,
      ...query,
    },
  };

  try {
    return await request<T>(config, requestOptions);
  } catch (error) {
    // Preserve ApiError metadata so the plugin's RATE_LIMIT_ERROR / AUTH_ERROR
    // handlers (error-handlers.ts) can detect status 429/401 and read
    // retryAfter. Without this, throwing a bare AeroleadsAPIError would strip
    // the status code and the rate-limit retry path would never fire.
    if (error instanceof ApiError) {
      throw new AeroleadsAPIError(error.message, error.status, error.retryAfter);
    }
    if (error instanceof Error) {
      throw new AeroleadsAPIError(error.message);
    }
    throw new AeroleadsAPIError('Unknown error');
  }
}