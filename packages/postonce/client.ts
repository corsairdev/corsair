import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Official PostOnce public REST host. Every path below is relative to `/v1`.
 * Docs: https://docs.postonce.to/api-reference
 * Spec: https://postonce.to/api/openapi.json
 */
export const POSTONCE_API_BASE = 'https://postonce.to/api/public/v1';

/**
 * PostOnce rate-limits per API key and answers a 429 with
 * `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`
 * (Unix seconds). This is the only 429 retry layer; the plugin handler must
 * not add another.
 */
const POSTONCE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 2,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		resetTime: 'X-RateLimit-Reset',
		remaining: 'X-RateLimit-Remaining',
		limit: 'X-RateLimit-Limit',
	},
};

export type PostOnceQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type PostOnceRequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	query?: PostOnceQuery;
	/** Sent as `Idempotency-Key`; a repeat with the same body returns the original post. */
	idempotencyKey?: string;
};

/** Drop undefined values so we don't send `?foo=undefined`. */
export function compactQuery(query: PostOnceQuery): PostOnceQuery {
	const out: PostOnceQuery = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/** Same as {@link compactQuery}, for JSON bodies. */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/** Encodes one path segment (a post id) so it cannot change the route. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Issues a PostOnce request with bearer auth.
 *
 * Failures stay as `ApiError` so status, body (`error.code` /
 * `error.message`) and rate-limit metadata reach the plugin error handlers.
 * Wrapping them would drop `retryAfter` and skip RATE_LIMIT_ERROR.
 *
 * Auth: `Authorization: Bearer API_KEY`, created under Developers in the
 * PostOnce dashboard.
 * Docs: https://docs.postonce.to/getting-started/authentication
 */
export async function makePostOnceRequest<T>(
	endpoint: string,
	apiKey: string,
	options: PostOnceRequestOptions = {},
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('postonce', 'api_key');
	}

	const { method = 'GET', body, query, idempotencyKey } = options;
	const hasBody = method !== 'GET' && method !== 'DELETE' && body !== undefined;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};
	if (hasBody) {
		headers['Content-Type'] = 'application/json';
	}
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	const config: OpenAPIConfig = {
		BASE: POSTONCE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const compact = query ? compactQuery(query) : undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? 'application/json; charset=utf-8' : undefined,
		query: compact && Object.keys(compact).length > 0 ? compact : undefined,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: POSTONCE_RATE_LIMIT_CONFIG,
	});
}
