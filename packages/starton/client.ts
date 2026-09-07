import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Raised for failures that never reached Starton (transport errors, invalid
 * path segments). HTTP failures surface as `ApiError` so the error handlers
 * can read `status`, `body.errorCode` and the rate-limit headers.
 */
export class StartonAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'StartonAPIError';
	}
}

/**
 * Starton REST API base (v3).
 * https://github.com/starton-io/starton-openapi (servers[0].url)
 */
const STARTON_API_BASE = 'https://api.starton.com';

/**
 * Starton authenticates with an API key sent as the `x-api-key` header.
 * https://github.com/starton-io/starton-openapi (components.securitySchemes.api-key)
 */
function buildHeaders(apiKey: string): Record<string, string> {
	return { 'x-api-key': apiKey };
}

/** Reject traversal segments and encode caller-supplied path pieces (network, address, id). */
export function encodeStartonPathSegment(value: string): string {
	if (value === '.' || value === '..' || value.length === 0) {
		throw new StartonAPIError('Invalid path segment');
	}
	return encodeURIComponent(value);
}

export type StartonRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeStartonRequest<T>(
	endpoint: string,
	apiKey: string,
	options: StartonRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: STARTON_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: buildHeaders(apiKey),
	};

	const hasBody = body !== undefined && method !== 'GET';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so the plugin error handlers can inspect `status`
		// and `retryAfter` (rate limiting, auth failures, blockchain errors).
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new StartonAPIError(error.message);
		}
		throw new StartonAPIError('Unknown error');
	}
}
