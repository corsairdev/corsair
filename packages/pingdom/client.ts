import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Pingdom documents no rate limits, so 429s get core's standard handling:
 * up to three retries honouring Retry-After (R8: the plugin adds no second
 * retry layer).
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
 * `status` and `retryAfter` from it, and management maps errors named
 * ApiError to a provider error with its status), rebuilt without the request
 * body and query. Check settings ride through the request, which core's own
 * ApiError keeps.
 */
export function buildPingdomApiError(
	message: string,
	options: {
		method: string;
		/** Request path, without query. */
		path: string;
		status: number;
		statusText?: string;
		// unknown: error bodies are the documented
		// {"error": {statuscode, statusdesc, errormessage}} envelope or
		// non-JSON from the edge.
		body?: unknown;
		retryAfter?: number;
	},
): ApiError {
	return new ApiError(
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
}

/**
 * Extracts the readable part of a Pingdom error body. Errors carry
 * `{"error":{"statuscode":401,"statusdesc":"Unauthorized","errormessage":
 * "Please provide a valid API token"}}` (verified live with an invalid
 * token, 2026-11-21).
 */
export function describePingdomError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	const text =
		(typeof error?.errormessage === 'string' && error.errormessage.length > 0
			? error.errormessage
			: undefined) ??
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		fallback;
	return text;
}

export type PingdomQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PingdomRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PingdomQuery;
	/** JSON body; Pingdom accepts JSON on every write. */
	// unknown: bodies mix strings, numbers, booleans and id arrays per route.
	body?: Record<string, unknown>;
};

/**
 * Authenticated Pingdom request. API tokens authenticate as an
 * Authorization Bearer header, generated inside My Pingdom.
 * https://docs.pingdom.com (API_3.1.yaml)
 */
export async function makePingdomRequest(
	apiKey: string,
	{ method, path, query, body }: PingdomRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.pingdom.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (check settings). Core's fallback
			// message embeds the whole response body, so the text comes from
			// the provider's error or the status.
			const detail = describePingdomError(
				error.body,
				error.statusText || 'request failed',
			);
			throw buildPingdomApiError(`Pingdom ${error.status}: ${detail}`, {
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
