import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TONEDEN_API_BASE = 'https://www.toneden.io/api/v1';

export const TONEDEN_OAUTH_AUTHORIZE_URL =
	'https://www.toneden.io/auth/oauth2/authorize';
export const TONEDEN_OAUTH_TOKEN_URL =
	'https://www.toneden.io/auth/oauth2/token';

// Core's request() retries a 429 three times and honours Retry-After, so the
// 429 handler in error-handlers.ts does not retry again. The object has to be
// complete: request.ts replaces its defaults wholesale, so a partial one either
// skips the rate-limit block or throws reading `headerNames`.
const TONEDEN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * ToneDen's error body is not documented per route. The API answers a JSON
 * object with a `message` or `error` field on failure, and `/links/validPath`
 * answers 200 with `{ valid: false, reason }` for an unusable path, which is a
 * success with a negative answer rather than an error. HTTP failures stay
 * core's ApiError; `describeToneDenError` reads the message out of the body.
 */

/**
 * Core's ApiError keeps the request it failed on, body included, and a user
 * update or a contact upload carries email addresses and phone numbers. This
 * rebuilds the same ApiError without the request body. Status, retryAfter and
 * ToneDen's response body stay as they were.
 */
function withoutRequestBody(error: ApiError): ApiError {
	if (error.request.body === undefined) return error;
	const stripped = new ApiError(
		{ ...error.request, body: undefined },
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	stripped.stack = error.stack;
	return stripped;
}

export function describeToneDenError(
	status: number | undefined,
	// unknown: the error body is an untyped JSON object or a proxy page.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message =
		(typeof record?.message === 'string' && record.message) ||
		(typeof record?.error === 'string' && record.error) ||
		(typeof record?.error_description === 'string' &&
			record.error_description) ||
		fallback;
	return status === undefined ? message : `ToneDen ${status}: ${message}`;
}

export type ToneDenQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type ToneDenRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: ToneDenQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeToneDenRequest(
	accessToken: string,
	{ method, path, query, body }: ToneDenRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TONEDEN_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TONEDEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the request body it carried.
		if (error instanceof ApiError) throw withoutRequestBody(error);
		throw error;
	}
}
