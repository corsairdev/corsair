import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
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

/**
 * `corsair/http` retries a request internally when it sees HTTP 429 — three
 * extra attempts by default. That is correct for reads, but a rate-limited
 * write that Starton had already begun processing would be replayed, and
 * Starton offers no idempotency key to make that safe, so replay defaults to
 * off for every method except GET.
 */
const NO_AUTOMATIC_REPLAY: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export type StartonRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	/**
	 * Whether this request may be re-sent automatically after a 429.
	 *
	 * Defaults to `true` for GET and `false` for every other method, so a new
	 * write endpoint is safe by default and has to opt in to replay explicitly.
	 * Set it to `true` only for a non-GET request that provably has no side
	 * effect — Starton's `read` endpoint is a POST purely because it takes the
	 * function arguments in a body.
	 */
	replayable?: boolean;
};

export async function makeStartonRequest<T>(
	endpoint: string,
	apiKey: string,
	options: StartonRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	// Fail closed: anything that is not a GET is treated as a write unless the
	// caller has explicitly established that replaying it is harmless.
	const replayable = options.replayable ?? method === 'GET';

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
		return await request<T>(
			config,
			requestOptions,
			replayable ? undefined : { rateLimitConfig: NO_AUTOMATIC_REPLAY },
		);
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
