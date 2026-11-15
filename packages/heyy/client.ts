import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const HEYY_API_BASE = 'https://api.heyy.io/v3';

// Search responses can carry a page of 100 contacts, each with handles, labels,
// attributes and chats, so the body is large but the query itself is simple.
const HEYY_TIMEOUT_MS = 30_000;

/** Every error body is `{ success: false, error: { messageKey, message } }`. */
export type HeyyErrorFields = {
	messageKey?: string;
	message?: string;
	invalidParams?: unknown; // unknown: field-level details, read only when present.
};

// unknown: the body is untrusted JSON until asRecord narrows it.
export function readError(body: unknown): HeyyErrorFields {
	const error = asRecord(asRecord(body)?.error);
	if (!error) return {};
	const messageKey = error.messageKey;
	const message = error.message;
	return {
		messageKey: typeof messageKey === 'string' ? messageKey : undefined,
		message: typeof message === 'string' ? message : undefined,
		invalidParams: error.invalidParams,
	};
}

/**
 * The delay before a 429's window resets.
 *
 * `corsair/http` reads `X-RateLimit-Reset` into `rateLimitReset` as a
 * millisecond timestamp, and `extractRateLimitInfo` only copies it onto
 * `retryAfter` when the header names a *future* time, so a value that has
 * already passed leaves `retryAfter` unset. This turns either form into a
 * delay so the handler always has one.
 */
export function resetDelayMs(
	resetTimestampMs: number | undefined,
): number | undefined {
	if (resetTimestampMs === undefined || !Number.isFinite(resetTimestampMs)) {
		return undefined;
	}
	const delay = resetTimestampMs - Date.now();
	return delay > 0 ? delay : undefined;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads the rate-limit headers into the error. Heyy sends `X-RateLimit-Reset`
// rather than `Retry-After`, so both names are read here.
const HEYY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

/**
 * Heyy answers every failure as
 * `{ success: false, error: { messageKey, message, invalidParams? } }`, and the
 * `messageKey` is the machine-readable half: `unauthorized`,
 * `rate_limit_exceeded`, `contact_not_found`, and so on.
 */
export class HeyyAPIError extends Error {
	readonly status?: number;
	/** `error.messageKey`, such as `rate_limit_exceeded`. */
	readonly messageKey?: string;
	/** Milliseconds until the per-minute window resets, from a 429. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are the envelope above, but a proxy can answer with
	// HTML or text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'HeyyAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.method = options.method ?? cause?.request.method;
		const fields = readError(options.body ?? cause?.body);
		this.messageKey = fields.messageKey;
		// Retry-After wins when Heyy sends one; otherwise the X-RateLimit-Reset
		// timestamp becomes the delay.
		this.retryAfter =
			options.retryAfter ??
			cause?.retryAfter ??
			resetDelayMs(cause?.rateLimitReset);
		// Only the provider's message is kept: a request body can carry contact
		// details, and ApiError does not redact a body.
		this.body = fields.message
			? { error: { messageKey: fields.messageKey, message: fields.message } }
			: undefined;
	}
}

// unknown: see HeyyAPIError.
export function describeHeyyError(
	status: number | undefined,
	body: unknown, // unknown: the untyped error body, read field by field.
	fallback: string,
): string {
	const { messageKey, message } = readError(body);
	const text = message ?? fallback;
	const label = [status, messageKey]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Heyy ${label}: ${text}` : text;
}

/**
 * A status-only description, safe to pass as the fallback above.
 *
 * The shared client's own message must never be that fallback: for a status
 * outside its fixed map (504, for one) `ApiError.message` embeds the whole
 * response body, and a rejected contact echoes the fields that were sent.
 */
export function statusOnlyDescription(
	status: number | undefined,
	statusText: string | undefined,
): string {
	if (status === undefined) return 'request failed';
	return statusText ? `request failed (${statusText})` : 'request failed';
}

export type HeyyQuery = Record<string, string | number | boolean | undefined>;

export type HeyyRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: HeyyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeHeyyRequest(
	apiKey: string,
	{ method, path, query, body }: HeyyRequest,
): Promise<unknown> {
	// unknown: callers parse it with a zod output schema.
	const config: OpenAPIConfig = {
		BASE: HEYY_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: HEYY_TIMEOUT_MS,
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
		return await request<unknown>(config, requestOptions, {
			// unknown: see the return type.
			rateLimitConfig: HEYY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately dropped: `cause` is non-enumerable, but
			// util.inspect follows it, and ApiError.body holds `invalidParams`,
			// which echoes the submitted fields of a rejected contact. Everything
			// the handlers need is copied onto this error instead.
			throw new HeyyAPIError(
				describeHeyyError(
					error.status,
					error.body,
					// Never error.message: on an unmapped status it embeds the body.
					statusOnlyDescription(error.status, error.statusText),
				),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter ?? resetDelayMs(error.rateLimitReset),
					method: error.request.method ?? method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new HeyyAPIError(error.message, { cause: error, method });
		}
		throw new HeyyAPIError('Unknown Heyy error', { method });
	}
}
