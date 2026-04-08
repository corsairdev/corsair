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
    TOKEN: apiKey,
    HEADERS: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey, // Stitch might expect it in a header too
    },
  };

  const requestOptions: ApiRequestOptions = {
    method,
    url: endpoint,
    body: method !== 'GET' ? body : undefined,
    query: method === 'GET' ? query : undefined,
    mediaType: 'application/json',
  };

  try {
    const response = await request<T>(config, requestOptions, {
      rateLimitConfig: STITCH_RATE_LIMIT_CONFIG,
    });
    return response;
  } catch (error: any) {
    throw new StitchAPIError(
      error.message || 'Unknown Stitch API Error',
      error.status,
      error.code
    );
  }
}
