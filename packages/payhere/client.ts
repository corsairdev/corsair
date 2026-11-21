import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Payhere documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the refund write too.
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
 * body and query. Customer emails ride through the request, which core's own
 * ApiError keeps on the request.
 */
export function buildPayhereApiError(
	message: string,
	options: {
		method: string;
		/** Request path, without query. */
		path: string;
		status: number;
		statusText?: string;
		// unknown: error bodies can be the { error } envelope or non-JSON
		// from a proxy.
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
 * Extracts the readable part of a Payhere error body. Errors are
 * `{"error":"Unauthorized"}` (verified live with an invalid key).
 */
export function describePayhereError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.error === 'string' && record.error.length > 0
			? record.error
			: undefined) ??
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		fallback;
	return text;
}

export type PayhereQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PayhereRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: PayhereQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Payhere request. API keys authenticate in the Authorization
 * header as a Bearer token.
 * https://developers.payhere.co/docs/api-auth
 */
export async function makePayhereRequest(
	apiKey: string,
	{ method, path, query, body }: PayhereRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.payhere.co',
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
		query: method === 'GET' ? query : undefined,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (customer emails). Core's fallback
			// message embeds the whole response body, so the text comes from
			// the provider's error or the status. A short plain-text body (the
			// gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describePayhereError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw buildPayhereApiError(`Payhere ${error.status}: ${detail}`, {
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
