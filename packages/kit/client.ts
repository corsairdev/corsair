import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KIT_API_BASE = 'https://api.kit.com';

// Kit's writes can be slow on a large account, so the 20 second default in
// corsair/http is too tight.
const KIT_TIMEOUT_MS = 60_000;

/**
 * Kit answers every failure with `{ errors: [ "...", ... ] }`, an array of
 * plain strings rather than objects. Some routes add `error` or `message`; the
 * array is the one shape every failure carries.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readErrors(body: unknown): string[] {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!Array.isArray(errors)) {
		const message = record?.message ?? record?.error;
		return typeof message === 'string' && message.length > 0 ? [message] : [];
	}
	return errors.filter(
		(entry): entry is string => typeof entry === 'string' && entry.length > 0,
	);
}

/**
 * Kit documents a minutely and a per-second request limit and answers 429 with
 * `Retry-After` when one is hit. error-handlers.ts owns the retry, so the client
 * makes one attempt and only reads the header into the error.
 */
const KIT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Kit request that got no answer: a reset, DNS failure, abort or timeout.
 *
 * An HTTP error from Kit stays core's `ApiError` (see `sanitizeApiError`), so
 * its status, Retry-After and rate-limit fields reach core and the error
 * handlers.
 */
export class KitAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KitAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

// Kit's messages can quote the address a request carried, such as
// "a@b.example is invalid". An address is personal data, so it is replaced
// before a message reaches an error.
const EMAIL_ADDRESS = /[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[^\s@<>"'(),;:]+/g;

export function redactEmails(text: string): string {
	return text.replace(EMAIL_ADDRESS, '[email]');
}

/** Kit's messages joined, with the status in front. */
// unknown: an error body is untyped: an `{ errors: string[] }` envelope, or
// text from a proxy that never reached Kit.
export function describeKitError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const messages = readErrors(body);
	const text = redactEmails(
		messages.length > 0 ? messages.join('; ') : fallback,
	);
	return status === undefined ? text : `Kit ${status}: ${text}`;
}

export type KitQueryValue = string | number | boolean;

export type KitRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, KitQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// each resource has its own attributes.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204, which is how an unsubscribe and a tag removal answer.
export async function makeKitRequest(
	apiKey: string,
	{ method, path, query, body }: KitRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KIT_API_BASE,
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KIT_TIMEOUT_MS,
		// Kit takes the key in `X-Kit-Api-Key`; an `Authorization: Bearer` header
		// is the OAuth path and not what an API key uses.
		HEADERS: { Accept: 'application/json', 'X-Kit-Api-Key': apiKey },
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
			rateLimitConfig: KIT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new KitAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KitAPIError('Unknown Kit error', { method, transport: true });
	}
}

/**
 * Core's `ApiError` keeps `request.body`, which holds the subscriber's address
 * and fields, and Kit's error body can echo the address back. The error is
 * rebuilt as an `ApiError` with the same status and rate-limit fields, Kit's
 * reasons (addresses replaced) as both the message and the body, and the sent
 * body and query dropped: an untag carries the address in its query.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const errors = readErrors(error.body).map(redactEmails);
	return new ApiError(
		request,
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: { errors },
		},
		describeKitError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KitQueryValue | undefined>,
): Record<string, KitQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KitQueryValue] => entry[1] !== undefined,
		),
	);
}
