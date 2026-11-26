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

export type LinklyQuery = Record<
	string,
	string | number | boolean | Record<string, string | undefined> | undefined
>;

export type LinklyRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: LinklyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: ApiBody;
	/**
	 * Safe to send again after an inconclusive outcome (a 5xx or a dropped
	 * connection). GET reads are always safe. Writes are only where the
	 * provider makes a repeat a no-op or an upsert: POST /link with `id`
	 * updates in place, re-deleting a trashed link answers 200 again, restore
	 * targets links by id, and a conversion with an `event_id` returns the
	 * original instead of counting twice.
	 */
	replaySafe?: boolean;
	/** Overrides core's 20 s default, for calls that carry big batches. */
	timeoutMs?: number;
};

/** For bulk calls of up to 1,000 links, which can outlast core's 20 s. */
export const LINKLY_BULK_TIMEOUT_MS = 60_000;

/** What the error handlers need to know about the request that failed. */
export type LinklyRequestFacts = {
	method: LinklyRequest['method'];
	replaySafe: boolean;
};

// Core's ApiError has no room for the request's replay safety, and a
// transport error (fetch timeout, dropped socket) is not an ApiError at all.
// The facts ride beside the error instead of inside a wrapper class, so the
// error that reaches the handlers and the caller is core's own (R8).
const requestFacts = new WeakMap<object, LinklyRequestFacts>();

/** Records the request facts for an error the client is about to throw. */
export function rememberRequestFacts(
	error: object,
	facts: LinklyRequestFacts,
): void {
	requestFacts.set(error, facts);
}

export function linklyRequestFacts(
	error: unknown, // unknown: any thrown value; only objects carry facts
): LinklyRequestFacts | undefined {
	return typeof error === 'object' && error !== null
		? requestFacts.get(error)
		: undefined;
}

// Core retries every 429 three times with exponential backoff from 1 s
// (R8). Linkly sends no Retry-After or X-RateLimit headers (checked by
// probe). A 429 from a spent analytics allowance or a full 50-per-hour
// analytics window fails again after those retries; neither body shape has
// been seen live, so the plugin does not try to tell them apart from a burst.
const LINKLY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// The record is an untyped error body; read one field at a time.
function readString(
	record: JsonRecord | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Reads Linkly's error text out of the bodies it sends:
 *
 * - the envelope `{ error, code }` (the usage 429 adds `current_usage`,
 *   `limit` and `message`)
 * - a field-keyed validation object such as `{ slug: ['is invalid'] }`
 * - plain text, which the spec documents for some 401s
 */
export function describeLinklyError(
	status: number | undefined,
	// unknown: see ApiError.body.
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
	const detail = readString(record, 'message');
	const fieldMessages = readFieldErrors(record);
	const text = envelope
		? detail && detail !== envelope
			? `${envelope} (${detail})`
			: envelope
		: (fieldMessages ?? fallback);
	return label(status, text);
}

/** The envelope's machine code, e.g. `not_found` or `rate_limit_exceeded`. */
export function linklyErrorCode(body: ApiBody): string | undefined {
	return readString(asRecord(body), 'code');
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

/**
 * Webhook ids are the webhook URLs themselves, encoded into the unsubscribe
 * paths, and a hook URL often carries its own secret
 * (https://hooks.example.com/<token>). Core redacts only known query
 * parameters, so the hook segment is masked here.
 */
export function redactWebhookPath(url: string): string {
	return url.replace(/(\/webhooks\/)[^/?#]+/, '$1[REDACTED]');
}

/**
 * Core's ApiError keeps the request it sent, body included: destination URLs,
 * link passwords, webhook URLs and conversion visitor IPs. The rebuilt error
 * keeps status, body, URL (webhook segment masked) and rate-limit fields and
 * drops the request body and headers (R8's one allowed rebuild).
 */
function withoutRequestData(error: ApiError): ApiError {
	const rebuilt = new ApiError(
		{
			method: error.request.method,
			url: redactWebhookPath(error.request.url),
		},
		{
			url: redactWebhookPath(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		describeLinklyError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	return rebuilt;
}

// The returned body is parsed by the endpoint's zod output schema; it is
// undefined when Linkly answers without a body.
export async function makeLinklyRequest(
	apiKey: string,
	{ method, path, query, body, replaySafe, timeoutMs }: LinklyRequest,
): Promise<ApiBody> {
	const config: OpenAPIConfig = {
		BASE: LINKLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
		...(timeoutMs === undefined ? {} : { TIMEOUT: timeoutMs }),
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	const facts: LinklyRequestFacts = {
		method,
		replaySafe: replaySafe ?? method === 'GET',
	};

	try {
		return await request<ApiBody>(config, requestOptions, {
			rateLimitConfig: LINKLY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		const thrown =
			error instanceof ApiError ? withoutRequestData(error) : error;
		// A transport failure (DOMException timeouts included) never reached
		// Linkly, so it carries the request's own replay safety too.
		if (typeof thrown === 'object' && thrown !== null) {
			rememberRequestFacts(thrown, facts);
		}
		throw thrown;
	}
}
