import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// Core retries a 429 (the provider refused the request before running it,
// so replaying a write is safe) and honours Retry-After.
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

/** Admin requests always require a user API key; public chat bots may not. */
export async function makeDocsbotaiRequest<T>(
	host: 'admin' | 'chat',
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Validated request bodies have different shapes across operations.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (host === 'admin' && !apiKey)
		throw new AuthMissingError('docsbotai', 'api_key');
	const config: OpenAPIConfig = {
		BASE:
			host === 'admin' ? 'https://docsbot.ai/api' : 'https://api.docsbot.ai',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey || undefined,
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: endpoint,
		body: options.body,
		query: options.query,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<T>(config, requestOptions, { rateLimitConfig });
	} catch (error) {
		// Core's ApiError goes through as the same instance (R8: its status and
		// retryAfter drive the error handlers). Only the request body and query
		// are dropped first: they carry chat questions, lead details and URLs.
		if (error instanceof ApiError && error.request) {
			Object.defineProperty(error, 'request', {
				value: { ...error.request, body: undefined, query: undefined },
			});
		}
		throw error;
	}
}
