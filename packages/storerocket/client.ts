import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const STOREROCKET_API_BASE = 'https://storerocket.io/api/v2';

/**
 * The documented shared limit is 1,000 requests per minute; a 429 carries
 * Retry-After and responses carry X-RateLimit-Limit/Remaining. One retry
 * layer: the transport does not retry (maxRetries: 0), the rate-limit
 * handler in error-handlers.ts waits out Retry-After.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class StorerocketAPIError extends Error {
	readonly status?: number;
	/** The unmodified response body, when there was one. */
	// unknown: error bodies can be the { message, errors } validation shape,
	// the 401 message envelope, or non-JSON from a proxy.
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
		this.name = 'StorerocketAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}
}

/**
 * Extracts the readable part of a Storerocket error body. Errors carry a
 * `message`, and 422 validation failures add an `errors` object of field
 * arrays ("The city field is required.").
 * https://docs.storerocket.io/api/errors
 */
export function describeStorerocketError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message =
		typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined;
	// unknown: the errors object's keys depend on which fields failed.
	const errors = asRecord(record?.errors);
	const fields = errors
		? Object.entries(errors)
				.map(([field, messages]) => `${field}: ${String(messages)}`)
				.join('; ')
		: undefined;
	const text =
		message ??
		(typeof body === 'string' && body.length > 0 ? body : undefined) ??
		fallback;
	return fields ? `${text} (${fields})` : text;
}

export type StorerocketQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type StorerocketRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	path: string;
	query?: StorerocketQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across the location contracts.
	body?: unknown;
	/** Optional Idempotency-Key, documented for special-hours POST and PATCH. */
	idempotencyKey?: string;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Storerocket request. The token authenticates with the
 * Bearer scheme; the docs say not to use an X-API-Key header or a URL token.
 * https://docs.storerocket.io/api/authentication
 */
export async function makeStorerocketRequest(
	apiKey: string,
	{ method, path, query, body, idempotencyKey }: StorerocketRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: STOREROCKET_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType:
			method === 'GET' || method === 'DELETE' ? undefined : 'application/json',
		...(idempotencyKey
			? { headers: { 'Idempotency-Key': idempotencyKey } }
			: {}),
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Rethrow our own error untouched; the branches below would re-wrap it
		// and drop its fields.
		if (error instanceof StorerocketAPIError) throw error;
		if (error instanceof ApiError) {
			const detail = describeStorerocketError(error.body, error.message);
			throw new StorerocketAPIError(
				error.status === undefined
					? detail
					: `Storerocket ${error.status}: ${detail}`,
				{ cause: error, status: error.status, body: error.body, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new StorerocketAPIError(error.message, { cause: error, method });
		}
		throw new StorerocketAPIError('Unknown Storerocket error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
