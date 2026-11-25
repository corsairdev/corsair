import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LOB_API_BASE = 'https://api.lob.com/v1';

// unknown: the body is an untyped error envelope until asRecord narrows it.
function readErrorBody(body: unknown): { code?: string; message?: string } {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	return {
		// The newer uploads surface answers flat (`{ code: 403, message }`)
		// where code is a number, so only the wrapped envelope yields a code.
		code: typeof error?.code === 'string' ? error.code : undefined,
		message:
			typeof error?.message === 'string'
				? error.message
				: typeof record?.message === 'string'
					? record.message
					: undefined,
	};
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// tags the error. Lob documents no Retry-After header; it sends
// X-Rate-Limit-Reset, which corsair/http cannot return alongside the body.
const LOB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	// Kept for the header contract even though Lob never sends the header.
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 || readErrorBody(body).code === 'rate_limit_exceeded',
};

/**
 * Lob error bodies wrap one object: `{ error: { message, status_code, code } }`
 * with snake_case string codes. Rate limits answer 429 with code
 * `rate_limit_exceeded` and no Retry-After. The body is deliberately not kept
 * on the error: ApiError does not redact request bodies, and neither this
 * plugin's queries nor Lob's error bodies carry the API key, but keeping the
 * raw cause would print request headers through util.inspect.
 */
export class LobAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code from the body, e.g. `rate_limit_exceeded`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when a gateway sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request carried an Idempotency-Key, so a replay is safe. */
	readonly hasIdempotency: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: LobRequest['method'];
			hasIdempotency?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LobAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.hasIdempotency = options.hasIdempotency ?? false;
	}

	/** A 429 by status or by body code; gateways may drop the body. */
	get isRateLimit(): boolean {
		return this.status === 429 || this.code === 'rate_limit_exceeded';
	}
}

export function describeLobError(
	status: number | undefined,
	// unknown: a proxy can answer with HTML or text instead of Lob's envelope.
	body: unknown,
	fallback: string,
): string {
	const { code, message } = readErrorBody(body);
	const text = message ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Lob ${label}: ${text}` : text;
}

export type LobQuery = Record<string, string | number | boolean | undefined>;

export type LobRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: LobQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Extra headers, currently only Idempotency-Key on mail sends. */
	headers?: Record<string, string>;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for bodyless successes.
export async function makeLobRequest(
	apiKey: string,
	{ method, path, query, body, headers }: LobRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: LOB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// HTTP Basic with the key as username and an empty password. Corsair's
		// config USERNAME/PASSWORD path requires both non-empty, so the header
		// is built here instead.
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: LOB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		const hasIdempotency = Boolean(headers?.['Idempotency-Key']);
		if (error instanceof ApiError) {
			throw new LobAPIError(
				describeLobError(error.status, error.body, error.message),
				{
					status: error.status,
					code: readErrorBody(error.body).code,
					retryAfter: error.retryAfter,
					method,
					hasIdempotency,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		// Transport failures never reached Lob, so the cause is kept for these.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LobAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
				hasIdempotency,
			});
		}
		throw new LobAPIError('Unknown Lob error', { method, hasIdempotency });
	}
}
