import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SPOTLIGHTR_API_BASE = 'https://api.spotlightr.com';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const SPOTLIGHTR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A request that never reached Spotlightr (DNS, reset, timeout). HTTP failures
 * are not wrapped: core's `ApiError` passes through, rebuilt only to mask the
 * key (see `withoutKey`), so its `status`, `retryAfter` and `request` reach
 * core and the caller.
 */
export class SpotlightrAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Spotlightr sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message);
		this.name = 'SpotlightrAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

const REDACTED = '[REDACTED]';

/** Replaces every copy of the key, raw or URL-encoded, inside a string. */
function maskKey(value: string, apiKey: string): string {
	if (!apiKey) return value;
	return value
		.split(apiKey)
		.join(REDACTED)
		.split(encodeURIComponent(apiKey))
		.join(REDACTED);
}

/**
 * Spotlightr's paginated answers echo the request URL, key included, in
 * `next_page_url` and `prev_page_url`. This masks the key anywhere in a
 * response body so it never reaches the caller or an agent's transcript.
 */
// unknown: any JSON value; strings are masked, containers walked.
export function redactKey(value: unknown, apiKey: string): unknown {
	if (typeof value === 'string') return maskKey(value, apiKey);
	if (Array.isArray(value)) return value.map((item) => redactKey(item, apiKey));
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [
				key,
				redactKey(item, apiKey),
			]),
		);
	}
	return value;
}

/**
 * Spotlightr authenticates with a `vooKey` query parameter, and core's
 * ApiError redaction does not know that name, so the key would ride along in
 * `url`, `request.url` and `request.query`. This rebuilds the same ApiError
 * with the key masked there and the provider's text as the message; status,
 * body and rate-limit fields are kept.
 */
export function withoutKey(error: ApiError, apiKey: string): ApiError {
	const { query, ...request } = error.request;
	const maskedQuery = query
		? Object.fromEntries(
				Object.entries(query).map(([key, value]) => [
					key,
					key === 'vooKey' ? REDACTED : value,
				]),
			)
		: undefined;
	return new ApiError(
		{
			...request,
			url: maskKey(error.request.url, apiKey),
			...(maskedQuery ? { query: maskedQuery } : {}),
		},
		{
			url: maskKey(error.url, apiKey),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: redactKey(error.body, apiKey),
		},
		maskKey(
			describeSpotlightrError(error.status, error.body, error.message),
			apiKey,
		),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * Spotlightr reports failures as a JSON *string*, not an object: a 401 body is
 * literally `"Unauthorized."`. A wrong key and a missing one differ only in the
 * text, so the message is the only signal.
 */
export function describeSpotlightrError(
	status: number | undefined,
	// unknown: the body is a bare JSON string, an HTML error page from the web
	// server, or nothing at all.
	body: unknown,
	fallback: string,
): string {
	let text = fallback;
	if (typeof body === 'string') {
		const stripped = body.replace(/^"|"$/g, '').trim();
		// An empty or blank body leaves the caller's message in place, rather
		// than producing a label with nothing after it. So does the web
		// server's HTML error page, which says nothing a caller can use.
		if (stripped.length > 0 && !stripped.startsWith('<')) text = stripped;
	} else {
		const record = asRecord(body);
		const message = record?.message;
		if (typeof message === 'string' && message.length > 0) {
			text = message;
		} else if (typeof body === 'number' || typeof body === 'boolean') {
			text = String(body);
		}
	}
	return status === undefined ? text : `Spotlightr ${status}: ${text}`;
}

/** True for the two 401 texts Spotlightr uses when the key is absent or wrong. */
export function isAuthMessage(message: string): boolean {
	return /unauthorized|missing token|invalid token/i.test(message);
}

export type SpotlightrQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SpotlightrRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: SpotlightrQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
	/** Multipart bodies. An array value is sent as repeated fields. */
	formData?: Record<string, string | string[] | Blob | undefined>;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Sends one request. The key is added to the query string here rather than by
 * each endpoint, so no route can forget it.
 */
export async function makeSpotlightrRequest(
	apiKey: string,
	{ method, path, query, body, formData }: SpotlightrRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: SPOTLIGHTR_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, vooKey: apiKey },
		body,
		formData,
		mediaType:
			body === undefined || formData !== undefined
				? undefined
				: 'application/json',
	};

	try {
		const body = await request<unknown>(config, requestOptions, {
			rateLimitConfig: SPOTLIGHTR_RATE_LIMIT_CONFIG,
		});
		return redactKey(body, apiKey);
	} catch (error) {
		if (error instanceof SpotlightrAPIError) throw error;
		if (error instanceof ApiError) throw withoutKey(error, apiKey);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SpotlightrAPIError(maskKey(error.message, apiKey), { method });
		}
		throw new SpotlightrAPIError('Unknown Spotlightr error', { method });
	}
}
