import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Pexels documents a per-month quota (default 200 requests/hour and 20,000
 * per month) with an X-Ratelimit-Reset header on the answer, so 429s get
 * core's standard handling: up to three retries honouring Retry-After (R8:
 * the plugin adds no second retry layer). Every route is a GET, so a retry
 * is safe.
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
 * read `status` and `retryAfter` from it), rebuilt without the request body
 * and query. Search queries ride through the request, which core's own
 * ApiError keeps on the request.
 */
export class PexelsAPIError extends ApiError {
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
			// unknown: error bodies can be the { status, code, message }
			// envelope or non-JSON from a proxy.
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
		this.name = 'PexelsAPIError';
		this.method = options.method;
	}
}

/**
 * Extracts the readable part of a Pexels error body. Errors are
 * `{"status":401,"code":"Unauthorized","message":"Invalid API key"}`
 * (verified live with an invalid key).
 */
export function describePexelsError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof record?.code === 'string' && record.code.length > 0
			? record.code
			: undefined) ??
		fallback;
	return text;
}

export type PexelsQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PexelsRequest = {
	method: 'GET';
	path: string;
	query?: PexelsQuery;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Pexels request. API keys authenticate as the raw value of
 * the Authorization header — no scheme word, per the docs. Photos and
 * videos live on the same host; photos under /v1, videos at the root.
 * https://www.pexels.com/api/documentation/
 */
export async function makePexelsRequest(
	apiKey: string,
	{ method, path, query }: PexelsRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.pexels.com',
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
		query,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (search queries). Core's fallback
			// message embeds the whole response body, so the text comes from
			// the provider's error or the status.
			const detail = describePexelsError(
				error.body,
				error.statusText || 'request failed',
			);
			throw new PexelsAPIError(`Pexels ${error.status}: ${detail}`, {
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
