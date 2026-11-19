import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const STORMBOARD_API_BASE = 'https://api.stormboard.com';

/**
 * The API uses standard rate-limiting headers (RateLimit-Limit,
 * RateLimit-Remaining, RateLimit-Reset, RateLimit-Policy) and answers 429
 * when the period quota is spent. One retry layer: the transport does not
 * retry (maxRetries: 0); the rate-limit handler in error-handlers.ts waits
 * out a Retry-After when the response carries one and otherwise backs off.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'ratelimit-reset',
		remaining: 'ratelimit-remaining',
		limit: 'ratelimit-limit',
	},
};

export class StormboardAPIError extends Error {
	readonly status?: number;
	/** The unmodified response body, when there was one. */
	// unknown: error bodies can be the { error } auth shape, the
	// { status, message } validation shape, or non-JSON HTML from a proxy.
	readonly body?: unknown;
	/** Milliseconds to wait before retrying, from Retry-After. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'StormboardAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}
}

/**
 * Extracts the readable part of a Stormboard error body. Auth failures
 * answer {"error":"No authentication method set, ..."}; validation failures
 * answer {"status":400,"message":"First name cannot be blank"}. Both were
 * verified live. https://api.stormboard.com/docs
 */
export function describeStormboardError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.error === 'string' && record.error.length > 0
			? record.error
			: undefined) ??
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		fallback;
	return text;
}

export type StormboardQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type StormboardRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: StormboardQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across the resource contracts.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Stormboard request. The v1 API authenticates with the
 * X-API-Key header carrying the account's API key.
 * https://api.stormboard.com/docs/auth
 */
export async function makeStormboardRequest(
	apiKey: string,
	{ method, path, query, body }: StormboardRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: STORMBOARD_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-API-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// GET and DELETE carry parameters in the query string; the documented
		// delete-between route takes its two idea ids there.
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType:
			method === 'GET' || method === 'DELETE' ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Rethrow our own error untouched; the branches below would re-wrap it
		// and drop its fields.
		if (error instanceof StormboardAPIError) throw error;
		if (error instanceof ApiError) {
			// Rebuilt without the cause, per PLUGIN_PR_RULES R8: the cause
			// retains request bodies (profiles and invites carry personal
			// data), and status and retryAfter stay on the rebuilt error for
			// the handlers.
			const detail = describeStormboardError(error.body, error.message);
			throw new StormboardAPIError(
				error.status === undefined
					? detail
					: `Stormboard ${error.status}: ${detail}`,
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new StormboardAPIError(error.message, { cause: error, method });
		}
		throw new StormboardAPIError('Unknown Stormboard error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
