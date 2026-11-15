import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TRIGGERCMD_API_BASE = 'https://www.triggercmd.com';

// Core's request() retries a 429 three times and honours Retry-After, so the
// 429 handler in error-handlers.ts does not retry again. The provider documents
// no reset header, so only Retry-After is read.
const TRIGGERCMD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * TRIGGERcmd answers every failure as `{ err: "Invalid Token!" }` with a 401,
 * and answers an unknown route with a 404 and no body at all. That difference
 * is useful: a 404 means the path is wrong, a 401 means it is right and the
 * token is not.
 *
 * The token also works as a `?token=` query parameter, which the provider's own
 * CLI and docs use. This client sends it as a Bearer header instead, so it never
 * appears in a URL that an `ApiError` would capture.
 *
 * Errors are core's ApiError, passed through unchanged. This reads the
 * provider's `err` text from its body.
 */
export function triggerCmdErrorMessage(error: unknown): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const err = asRecord(error.body)?.err;
	return typeof err === 'string' && err.length > 0 ? err : undefined;
}

export type TriggerCmdQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TriggerCmdRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: TriggerCmdQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeTriggerCmdRequest(
	apiToken: string,
	{ method, path, query, body }: TriggerCmdRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TRIGGERCMD_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	// Core's ApiError goes through unchanged: its status, retryAfter and body
	// are what the error handlers read.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: TRIGGERCMD_RATE_LIMIT_CONFIG,
	});
}
