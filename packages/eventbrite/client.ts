import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const EVENTBRITE_API_BASE = 'https://www.eventbriteapi.com/v3';

// Eventbrite documents no timeout. Reads with several expansions regularly
// take a few seconds, so 20 seconds leaves too little room.
const EVENTBRITE_TIMEOUT_MS = 30_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Eventbrite does not document a 429 header
// today; the header name is kept so one is honoured if it appears.
const EVENTBRITE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Eventbrite error bodies are `{ error, error_description, status_code }`,
 * where `error` is the constant machine code to branch on (`NOT_FOUND`,
 * `ARGUMENTS_ERROR`, `HIT_RATE_LIMIT`, …). Two routes answer with a Spring
 * envelope (`{ timestamp, status, error, path }`) instead, and a few 5xx
 * bodies are the same code with an empty description, so both are read.
 *
 * The key travels in the Authorization header only, never in the query or the
 * body, so `body` is safe to keep and no request copy is retained.
 */
export class EventbriteAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code, e.g. `NOT_FOUND` or `ARGUMENTS_ERROR`. */
	readonly code?: string;
	/** Per-field details Eventbrite adds to `ARGUMENTS_ERROR`. */
	// unknown: the provider shapes this as a nested object keyed by code.
	readonly detail?: unknown;
	/** Milliseconds from a Retry-After header, when Eventbrite sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the two envelopes above, but a proxy
	// can answer with HTML or plain text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			// unknown: an error body is untyped until the guards below narrow it.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'EventbriteAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = readCode(this.body);
		this.detail = asRecord(this.body)?.error_detail;
	}

	/** True only for the documented hourly-quota answer. */
	get isRateLimit(): boolean {
		return this.status === 429 || this.code === 'HIT_RATE_LIMIT';
	}
}

// unknown: the body is an untyped error body until asRecord narrows it.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const value = record?.error;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see EventbriteAPIError; the body's shape is unknown until read here.
export function describeEventbriteError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	// Eventbrite's own envelope first, then the Spring gateway's `error`/`path`
	// pair used by a couple of routes.
	const text =
		readString(record, 'error_description') ??
		readString(record, 'message') ??
		readString(record, 'detail') ??
		(typeof record?.error === 'string' && record.error.includes(' ')
			? record.error
			: undefined) ??
		fallback;
	const code = readCode(body);
	const label = [status, code && !code.includes(' ') ? code : undefined]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Eventbrite ${label}: ${text}` : text;
}

export type EventbriteQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type EventbriteRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: EventbriteQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204 answer, which none of the wrapped routes send today.
export async function makeEventbriteRequest(
	apiKey: string,
	{ method, path, query, body }: EventbriteRequest,
): Promise<unknown> {
	// unknown: the caller's output schema types the body.
	const config: OpenAPIConfig = {
		BASE: EVENTBRITE_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: EVENTBRITE_TIMEOUT_MS,
		// `TOKEN` renders `Bearer`, which is exactly what Eventbrite wants; it
		// also keeps the key out of the URL, where only a few param names are
		// redacted from an error.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: same as the return type above.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: EVENTBRITE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof EventbriteAPIError) {
			// Thrown by a caller-supplied callback: keep it as-is so its fields
			// survive the rethrow.
			throw error;
		}
		if (error instanceof ApiError) {
			// The token is in the Authorization header, which neither the message
			// nor `cause` prints; `request` is still not retained.
			throw new EventbriteAPIError(
				describeEventbriteError(error.status, error.body, error.message),
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
			throw new EventbriteAPIError(error.message, { cause: error, method });
		}
		throw new EventbriteAPIError('Unknown Eventbrite error', { method });
	}
}
