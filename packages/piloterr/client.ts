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
 * A failed call throws this: core's `ApiError` (R8: core and the handlers
 * read `status` and `retryAfter` from it), rebuilt without the request
 * query. Scraping queries ride through the request, which core's own
 * ApiError keeps on the request.
 */
export class PiloterrAPIError extends ApiError {
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method: string;

	constructor(
		message: string,
		options: {
			method: string;
			/** Request path, without query. */
			path: string;
			status: number;
			statusText?: string;
			// unknown: error bodies can be the {"error": "..."} envelope or
			// non-JSON from the edge.
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(
			{
				method: options.method as ApiRequestOptions['method'],
				url: options.path,
			},
			{
				url: options.path,
				ok: false,
				status: options.status,
				statusText: options.statusText ?? '',
				body: options.body,
			},
			message,
			{ retryAfter: options.retryAfter },
		);
		this.name = 'PiloterrAPIError';
		this.method = options.method;
	}
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
			throw new PiloterrAPIError(`Piloterr ${error.status}: ${detail}`, {
				method,
				path,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
