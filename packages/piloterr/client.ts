import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Piloterr documents no Retry-After header and no 429: plan and per-key
 * rate limits answer 401 with a "Rate limit exceeded…" message (see the
 * error-handling page), so the client keeps core's standard 429 handling
 * for other APIs' shape and the plugin's error handlers retry the 401
 * rate-limit case. maxRetries stays 3 for any 429 the edge may answer.
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
 * Extracts the readable part of a Piloterr error body. Errors carry
 * `{"error": "<message>"}` (verified live with an invalid key: 401
 * `{"error":"Invalid API Key"}`).
 */
export function describePiloterrError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.error === 'string' && record.error.length > 0
			? record.error
			: undefined) ?? fallback;
	return text;
}

export type PiloterrQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type PiloterrRequest = {
	method: 'GET';
	path: string;
	query?: PiloterrQuery;
	/** Requests binary answers (screenshots) as { bytes, contentType }. */
	responseType?: 'binary';
};

/**
 * Authenticated Piloterr request. API keys authenticate as the `x-api-key`
 * header, created in the Piloterr dashboard. Every documented operation is
 * a GET.
 * https://docs.piloterr.com/introduction
 */
export async function makePiloterrRequest(
	apiKey: string,
	{ method, path, query, responseType }: PiloterrRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.piloterr.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		...(responseType === undefined ? {} : { responseType }),
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (scraping queries). Core's fallback
			// message embeds the whole response body, so the text comes from
			// the provider's error or the status.
			const detail = describePiloterrError(
				error.body,
				error.statusText || 'request failed',
			);
			throw strippedApiError(
				error,
				method,
				path,
				`Piloterr ${error.status}: ${detail}`,
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
