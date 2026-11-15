import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const CERTSPOTTER_API_BASE = 'https://api.certspotter.com/v1';

// Core's request() retries a 429 three times and honours Retry-After, so the
// 429 handler in error-handlers.ts does not retry again. Cert Spotter names a
// rate limit with the `rate_limited` code, which counts as one whatever the
// status. Only Retry-After is read: the API documents no reset header.
const CERTSPOTTER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (_status, body) => asRecord(body)?.code === 'rate_limited',
};

/**
 * The documented machine-readable code (`bad_credentials`, `timeout`,
 * `lagging_client`, ...) from a failed request's body, or undefined when the
 * error is not core's ApiError or the body has no code.
 */
export function certSpotterErrorCode(error: unknown): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const code = asRecord(error.body)?.code;
	return typeof code === 'string' && code.length > 0 ? code : undefined;
}

export type CertSpotterQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type CertSpotterRequest = {
	method: 'GET';
	path: string;
	query?: CertSpotterQuery;
};

/**
 * Cert Spotter accepts the key as a Bearer token or as HTTP Basic with the key
 * as the username and an empty password. Bearer is used here: `corsair/http`
 * only renders Basic when both username and password are non-empty, so an
 * empty password could not be expressed through USERNAME/PASSWORD.
 */
export async function makeCertSpotterRequest(
	apiKey: string,
	{ method, path, query }: CertSpotterRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: CERTSPOTTER_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
	};

	// Core's ApiError goes through unchanged: its status, retryAfter and body
	// (with the documented `code`) are what the error handlers read.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: CERTSPOTTER_RATE_LIMIT_CONFIG,
	});
}
