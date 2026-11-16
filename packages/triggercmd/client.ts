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
 * Errors are core's ApiError (with the caller's `params` removed, see
 * withoutParams). This reads the provider's `err` text from its body.
 */
export function triggerCmdErrorMessage(
	// unknown: any thrown value; only core's ApiError has a body to read.
	error: unknown,
): string | undefined {
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

/**
 * Core's ApiError keeps the request it failed on: the JSON body of
 * `commands.run` and the query of `panels.trigger`, both of which can carry
 * the caller's free-text `params` (a path, a message, a secret). Core only
 * hides credential-named query keys. This rebuilds the same ApiError with the
 * body dropped and `params` replaced in the query and URL; status,
 * retryAfter and the provider's response body stay as they were.
 */
function withoutParams(error: ApiError): ApiError {
	const query = error.request.query;
	const hasQueryParams = query !== undefined && 'params' in query;
	if (error.request.body === undefined && !hasQueryParams) return error;
	const redactUrl = (url: string) =>
		url.replace(/([?&]params=)[^&#]*/g, '$1[REDACTED]');
	const stripped = new ApiError(
		{
			...error.request,
			url: redactUrl(error.request.url),
			body: undefined,
			query: hasQueryParams ? { ...query, params: '[REDACTED]' } : query,
		},
		{
			url: redactUrl(error.url),
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

// unknown: the raw provider response; each endpoint parses it with its own
// output schema in call.ts.
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

	try {
		// unknown: see makeTriggerCmdRequest; call.ts parses the response.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TRIGGERCMD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the caller's `params`. Its status, retryAfter and body are
		// what the error handlers read.
		if (error instanceof ApiError) throw withoutParams(error);
		throw error;
	}
}
