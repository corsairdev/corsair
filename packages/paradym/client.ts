import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Paradym documents no per-plan rate-limit retry contract, so 429s get
 * core's standard handling: up to three retries honouring Retry-After (R8:
 * the plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the writes too.
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
 * body and query.
 */
export function buildParadymApiError(
	message: string,
	options: {
		method: string;
		/** Request path, without query. */
		path: string;
		status: number;
		statusText?: string;
		// unknown: error bodies can be the { message, details, code }
		// envelope or non-JSON from a proxy.
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
 * Masks what a validation error can echo back from the request: any word
 * holding an @ (an email) or 7+ digits (a phone number). Token by token, no
 * backtracking regex.
 */
export function maskEchoes(text: string): string {
	return text
		.split(/(\s+)/)
		.map((token) => {
			if (token.includes('@')) return '[email]';
			if ((token.match(/\d/g)?.length ?? 0) >= 7) return '[number]';
			return token;
		})
		.join('');
}

/**
 * Keeps only the diagnostic part of an error body: `message`, `code` and each
 * detail's `key` and `message`, with echoed values masked. Any other key is
 * dropped.
 */
// unknown: error bodies are arbitrary JSON until narrowed here.
export function safeErrorBody(body: unknown): unknown {
	if (typeof body === 'string') {
		return body.length <= 200 ? maskEchoes(body) : undefined;
	}
	const record = asRecord(body);
	if (!record) return undefined;
	const safe: Record<string, unknown> = {};
	if (typeof record.message === 'string')
		safe.message = maskEchoes(record.message);
	if (typeof record.code === 'number' || typeof record.code === 'string')
		safe.code = record.code;
	if (Array.isArray(record.details)) {
		safe.details = record.details.map((item) => {
			const detail = asRecord(item);
			return {
				...(typeof detail?.key === 'string' ? { key: detail.key } : {}),
				...(typeof detail?.message === 'string'
					? { message: maskEchoes(detail.message) }
					: {}),
			};
		});
	}
	return safe;
}

/**
 * Extracts the readable part of a Paradym error body. Errors are
 * `{"message":"...","details":[...],"code":2005}` (verified live: 401
 * without a key, 403 with an invalid key, both code 2005).
 * https://docs.paradym.id/api-and-dashboard/error-codes
 */
export function describeParadymError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof record?.code === 'number'
			? `error code ${record.code}`
			: undefined) ??
		fallback;
	return text;
}

export type ParadymQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type ParadymRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: ParadymQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST/PUT/PATCH shapes.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Paradym request. API keys authenticate in the
 * `x-access-token` header, and every wallet-scoped route takes the walletId
 * in its path.
 * https://docs.paradym.id/api-and-dashboard/interacting-with-the-api
 */
export async function makeParadymRequest(
	apiKey: string,
	{ method, path, query, body }: ParadymRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.paradym.id',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'x-access-token': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? 'application/json'
				: undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (resource ids and bodies). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status. A short
			// plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describeParadymError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw buildParadymApiError(
				`Paradym ${error.status}: ${maskEchoes(detail)}`,
				{
					method,
					path,
					status: error.status,
					statusText: error.statusText,
					body: safeErrorBody(error.body),
					retryAfter: error.retryAfter,
				},
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
