import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Pexels' only limits are quotas: 200 requests an hour and 20,000 a month
 * by default. A 429 means one of them is spent and X-Ratelimit-Reset (a UNIX
 * time) says when it refills, possibly weeks away, so retrying after a few
 * seconds only burns more calls (R8: a 429 that reports an exhausted quota
 * is not retried). The 429 reaches the caller at once.
 * https://www.pexels.com/api/documentation/#guidelines
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

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
 * videos both live under /v1 (the old /videos root is deprecated).
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
			// R8: core's ApiError itself (management maps errors named
			// ApiError to their real status), rebuilt with the method and path
			// only, so status and retryAfter survive for the handlers.
			throw new ApiError(
				{ method, url: path },
				{
					url: path,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				`Pexels ${error.status}: ${detail}`,
				{ retryAfter: error.retryAfter },
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
