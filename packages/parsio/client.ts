import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Parsio documents no rate-limit retry contract, so 429s get core's
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
 * path so request bodies and queries stay out of it.
 */
function strippedApiError(
	error: ApiError,
	method: ApiRequestOptions['method'],
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
 * Extracts the readable part of a Parsio error body. Errors are
 * `{"statusCode":401,"message":"Unauthorized"}` (verified live without a
 * key); validation answers use the same envelope with a 400.
 */
export function describeParsioError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof record?.detail === 'string' && record.detail.length > 0
			? record.detail
			: undefined) ??
		fallback;
	return text;
}

export type ParsioQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type ParsioRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: ParsioQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST shapes.
	body?: unknown;
	/** Multipart form for the file upload endpoints. */
	formData?: Record<string, string | Blob>;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Parsio request. API keys authenticate in the X-API-Key
 * header. https://help.parsio.io/public-api/parsio-public-api
 */
export async function makeParsioRequest(
	apiKey: string,
	{ method, path, query, body, formData }: ParsioRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.parsio.io',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-API-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		// webhooks.delete takes an ids body on DELETE, so DELETE carries a
		// body too, not just POST.
		body: formData
			? undefined
			: method === 'POST' || method === 'DELETE'
				? body
				: undefined,
		mediaType:
			formData || (method !== 'POST' && method !== 'DELETE')
				? undefined
				: 'application/json',
		formData,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (document content, email addresses).
			// Core's fallback message embeds the whole response body, so the
			// text comes from the provider's error or the status. A short
			// plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describeParsioError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw strippedApiError(
				error,
				method,
				path,
				`Parsio ${error.status}: ${detail}`,
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
