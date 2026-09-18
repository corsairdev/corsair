import { request } from 'corsair/http';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';

const BASE = 'https://core.callpage.io';

export class CallPageAPIError extends Error {
  constructor(message: string, public readonly status?: number, public readonly code?: string | number) {
    super(message);
    this.name = 'CallPageAPIError';
  }
}

export async function makeCallPageRequest<T>(
  endpoint: string,
  apiKey: string,
  options: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; query?: Record<string, unknown> } = {},
): Promise<T> {
  const { method = 'GET', body, query } = options;
  const config: OpenAPIConfig = {
    BASE,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'omit',
    TOKEN: undefined,
    HEADERS: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: apiKey },
  };
  const requestOptions: ApiRequestOptions = {
    method,
    url: endpoint,
    body: method === 'POST' || method === 'PATCH' ? body : undefined,
    mediaType: 'application/json',
    query: query as Record<string, string | number | boolean | undefined>,
  };
  try {
    const response = await request<{ hasError?: boolean; errorCode?: string | number; message?: string; data?: T }>(config, requestOptions);
    if (response.hasError) throw new CallPageAPIError(response.message || 'CallPage API request failed', undefined, response.errorCode);
    return (response.data ?? response) as T;
  } catch (error) {
    if (error instanceof CallPageAPIError) throw error;
    if (error instanceof Error) throw new CallPageAPIError(error.message);
    throw new CallPageAPIError('Unknown CallPage API error');
  }
}
