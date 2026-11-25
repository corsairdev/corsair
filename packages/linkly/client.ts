import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LINKLY_API_BASE = 'https://api.linklyhq.com';

// A JSON object of any shape; Linkly adds fields freely and error bodies differ per route.
export type JsonRecord = Record<string, unknown>; // unknown: provider bodies are open objects

// The response body type is each endpoint's output schema's job, not the client's.
export type ApiBody = unknown; // unknown: callers parse with their output schema

export type LinklyQuery = Record<string, string | number | boolean | undefined>;

export type LinklyRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: LinklyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: ApiBody;
	/**
	 * Safe to send again after an inconclusive outcome (a 5xx or a dropped
	 * connection). GET reads are always safe. Writes are only where the
	 * provider makes a repeat a no-op or an upsert: POST /link with `id`
	 * updates in place, re-deleting a trashed link answers 200 again, and
	 * restore targets links by id. Subscribing a webhook URL again is not
	 * known to be a no-op, so it stays replay-unsafe.
	 */
	replaySafe?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt. Linkly
// sends no rate-limit headers at all (verified by probe), so the only
// Retry-After source is this header name, which never appears.
const LINKLY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class LinklyAPIError extends Error {
	readonly status?: number;
	/** The provider's machine code, e.g. `unauthorized` or `rate_limit_exceeded`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Linkly sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request can be sent again after an inconclusive outcome. */
	readonly replaySafe: boolean;
	// unknown: an error body is one of Linkly's envelopes, a field-keyed
	// validation object, or plain text a proxy sent.
	readonly body?: ApiBody;

	constructor(
		message: string,
		options: {
			status?: number;
			// unknown: same open error body as the field above.
			body?: ApiBody;
			code?: string;
			retryAfter?: number;
			method?: string;
			replaySafe?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LinklyAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.code = options.code ?? readString(asRecord(this.body), 'code');
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method;
		this.replaySafe = options.replaySafe ?? options.method === 'GET';
	}

	/**
	 * Rate limits arrive two ways: a 429 whose body carries
	 * `code: 'rate_limit_exceeded'`, and a gateway 429 with no Linkly body.
	 */
	get isRateLimit(): boolean {
		return this.status === 429 || this.code === 'rate_limit_exceeded';
	}
}

// The record is an untyped error body; read one field at a time.
function readString(
	record: JsonRecord | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Reads Linkly's error text out of the three bodies it sends:
 *
 * - the envelope `{ error, code }` (also the 429 body, which adds
 *   `current_usage`, `limit` and `message`)
 * - a field-keyed validation object such as `{ slug: ['is invalid'] }`
 * - plain text, which the spec documents for some 401s
 */
export function describeLinklyError(
	status: number | undefined,
	// unknown: see LinklyAPIError.body.
	body: ApiBody,
	fallback: string,
): string {
	// A string body is Linkly's documented plain-text error (some 401s), but
	// an HTML page means the route never answered as an API route, so it is
	// noise rather than a message.
	if (typeof body === 'string' && body.length > 0 && !body.startsWith('<')) {
		return label(status, body);
	}
	const record = asRecord(body);
	const envelope = readString(record, 'error');
	const fieldMessages = readFieldErrors(record);
	const text = envelope ?? fieldMessages ?? fallback;
	return label(status, text);
}

function label(status: number | undefined, text: string): string {
	return status === undefined ? text : `Linkly ${status}: ${text}`;
}

/** Joins `{ slug: ['is invalid'] }` into `slug: is invalid`. */
function readFieldErrors(
	record: JsonRecord | null | undefined,
): string | undefined {
	if (!record || readString(record, 'error')) return undefined;
	const parts: string[] = [];
	for (const [field, value] of Object.entries(record)) {
		const messages = Array.isArray(value)
			? value.filter((entry): entry is string => typeof entry === 'string')
			: typeof value === 'string'
				? [value]
				: [];
		for (const message of messages) parts.push(`${field}: ${message}`);
	}
	return parts.length > 0 ? parts.join('; ') : undefined;
}

/** Encodes one path segment. Linkly webhook ids are URLs, so this matters. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// The returned body is parsed by the endpoint's zod output schema; it is
// undefined when Linkly answers without a body.
export async function makeLinklyRequest(
	apiKey: string,
	{ method, path, query, body, replaySafe }: LinklyRequest,
): Promise<ApiBody> {
	const config: OpenAPIConfig = {
		BASE: LINKLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<ApiBody>(config, requestOptions, {
			rateLimitConfig: LINKLY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// No cause: the ApiError body can echo provider state and the key
			// rides in the Authorization header, so only the plain fields carry.
			throw new LinklyAPIError(
				describeLinklyError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method,
					replaySafe,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		// A transport failure never reached Linkly, so the error keeps the
		// request's own replay safety for the handler to read.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LinklyAPIError(error.message, {
				cause: error,
				method,
				replaySafe,
			});
		}
		throw new LinklyAPIError('Unknown Linkly error', { method, replaySafe });
	}
}
