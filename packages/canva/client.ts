import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const CANVA_API_BASE = 'https://api.canva.com/rest';

const CANVA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function isBinaryBody(body: unknown): body is string | Blob {
	return (
		typeof body === 'string' ||
		(typeof Blob !== 'undefined' && body instanceof Blob)
	);
}

export async function makeCanvaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string | Blob;
		query?: Record<string, string | number | boolean | undefined>;
		extraHeaders?: Record<string, string>;
		/** Send no token: a public route that fails when one is sent (app JWKS). */
		anonymous?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, extraHeaders, anonymous } = options;
	const binary = isBinaryBody(body);

	const config: OpenAPIConfig = {
		BASE: CANVA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: anonymous ? undefined : apiKey,
		HEADERS: {
			...(binary
				? { 'Content-Type': 'application/octet-stream' }
				: { 'Content-Type': 'application/json' }),
			...extraHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: binary
			? 'application/octet-stream'
			: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	// Core's ApiError goes through as it is: the error handlers and core's
	// OAuth refresh after a 401 read its status and retryAfter, and Canva's own
	// code and message stay on error.body.
	return request<T>(config, requestOptions, {
		rateLimitConfig: CANVA_RATE_LIMIT_CONFIG,
	});
}
