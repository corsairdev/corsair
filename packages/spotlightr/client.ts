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
 * Spotlightr authenticates with a `vooKey` query parameter on every route, not
 * a header. That has one consequence worth stating: `ApiError` redacts only the
 * params named `api_key`, `key`, `token` and `appid`, so `vooKey` would ride
 * through `cause.request.query` verbatim. This error therefore never keeps the
 * cause or the body; it copies the status and the message and nothing else.
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
		// than producing a label with nothing after it.
		if (stripped.length > 0) text = stripped;
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
	/** Multipart bodies, used by the two upload routes. */
	formData?: Record<string, string | Blob | undefined>;
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SPOTLIGHTR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof SpotlightrAPIError) throw error;
		if (error instanceof ApiError) {
			// Deliberately no `cause`: it carries the request query, and `vooKey`
			// is not one of the params ApiError redacts.
			throw new SpotlightrAPIError(
				describeSpotlightrError(error.status, error.body, error.message),
				{ status: error.status, retryAfter: error.retryAfter, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SpotlightrAPIError(error.message, { method });
		}
		throw new SpotlightrAPIError('Unknown Spotlightr error', { method });
	}
}
