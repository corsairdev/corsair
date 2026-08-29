import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BreatheHRApiError extends Error {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly body?: unknown;

  constructor(message: string, public readonly code?: number, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'BreatheHRApiError';

    if (options?.cause instanceof ApiError) {
      this.status = options.cause.status;
      this.statusText = options.cause.statusText;
      this.body = options.cause.body;
    }
  }
}

export const BREATHE_HR_API_BASE = 'https://api.breathehr.com/v1';

export async function makeBreatheHrRequest<T>(
  endpoint: string,
  apiKey: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
  } = {},
): Promise<T> {
  const { method = 'GET', query = {}, body } = options;

  const config: OpenAPIConfig = {
    BASE: BREATHE_HR_API_BASE,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'omit',
    TOKEN: undefined,
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': apiKey,
    },
  };

  const requestOptions: ApiRequestOptions = {
    method,
    url: endpoint,
    query,
    body,
  };

  try {
    return await request<T>(config, requestOptions);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new BreatheHRApiError(error.message, error.status, { cause: error });
    }
    if (error instanceof Error) {
      throw new BreatheHRApiError(error.message, undefined, { cause: error });
    }
    throw new BreatheHRApiError('Unknown Breathe HR API error');
  }
}
