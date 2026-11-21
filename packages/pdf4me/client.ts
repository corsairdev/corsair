import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * PDF4me documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the writes too.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A failed call throws core's `ApiError` (R8: core and the handlers read
 * `status` and `retryAfter` from it), rebuilt with only the method and the
 * path. Document payloads carry file contents, which core's own ApiError
 * keeps on `request`.
 */
function strippedApiError(
	error: ApiError,
	method: Pdf4meRequest['method'],
	path: string,
	message: string,
): ApiError {
	return new ApiError(
		{ method, url: path },
		{
			url: path,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		message,
		{ retryAfter: error.retryAfter },
	);
}

/**
 * Extracts the readable part of a PDF4me error body. PDF4me answers plain
 * text or JSON messages (e.g. "File is empty", "Invalid Optimization
 * Profile"); 401 with an invalid key answers an empty body (verified live).
 */
export function describePdf4meError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof record?.error === 'string' && record.error.length > 0
			? record.error
			: undefined) ??
		(typeof body === 'string' && body.length > 0 && body.length <= 200
			? body
			: undefined) ??
		fallback;
	return text;
}

export type Pdf4meRequest = {
	method: 'GET' | 'POST';
	path: string;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST shapes.
	body?: unknown;
	/** Set when the route answers a raw binary file (e.g. merged PDF). */
	binary?: boolean;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated PDF4me request. API keys authenticate with the raw key in
 * the Authorization header — no scheme word, per the docs' request example.
 * https://docs.pdf4me.com/pdf4me-api/
 */
export async function makePdf4meRequest(
	apiKey: string,
	{ method, path, body, binary }: Pdf4meRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.pdf4me.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
		responseType: binary ? 'binary' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (file payloads). Core's fallback
			// message embeds the whole response body, so the text comes from
			// the provider's error or the status.
			const detail = describePdf4meError(
				error.body,
				error.statusText || 'request failed',
			);
			throw strippedApiError(
				error,
				method,
				path,
				`PDF4me ${error.status}: ${detail}`,
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
