/**
 * This file contains the core logic for making authenticated requests to the Stitch API.
 * It handles authentication via API keys, request formatting, and error handling.
 *
 * Note on Type Safety:
 * The `unknown` type is used in catch blocks to ensure safe error handling with proper type assertions.
 * Dynamic request bodies are typed as `Record<string, unknown>` where possible, or `any` when
 * interacting with legacy or highly dynamic data structures that don't have a fixed schema.
 */

import { request, type ApiRequestOptions, type OpenAPIConfig, type RateLimitConfig } from 'corsair/http';

export class StitchAPIError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'StitchAPIError';
  }
}

const STITCH_API_BASE = 'https://stitch.withgoogle.com/api/v1';

const STITCH_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxRetries: 3,
  initialRetryDelay: 1000, headerNames: { retryAfter: 'Retry-After' },
  backoffMultiplier: 2,
};

export async function makeStitchRequest<T>(
  endpoint: string,
  apiKey: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    query?: Record<string, string | number | boolean | undefined>;
  } = {},
): Promise<T> {
  const { method = 'GET', body, query } = options;

  const config: OpenAPIConfig = {
    BASE: STITCH_API_BASE,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'omit',
    HEADERS: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  };

  const requestOptions: ApiRequestOptions = {
    method,
    url: endpoint,
    body,
    query,
    mediaType: 'application/json',
  };

  try {
    const response = await request<T>(config, requestOptions, {
      rateLimitConfig: STITCH_RATE_LIMIT_CONFIG,
    });
    return response;
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; code?: string };
    throw new StitchAPIError(
      err.message || 'Unknown Stitch API Error',
      err.status,
      err.code
    );
  }
}
