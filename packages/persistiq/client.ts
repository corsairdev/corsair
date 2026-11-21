import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * PersistIQ documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
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
 * Extracts the readable part of a PersistIQ error body. Errors are
 * `{"status":"error","error":{"reason":"unauthorized","message":"..."}}`
 * (verified live with an invalid key).
 */
export function describePersistiqError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	const text =
		(typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: undefined) ??
		(typeof error?.reason === 'string' && error.reason.length > 0
			? error.reason
			: undefined) ??
		fallback;
	return text;
}

export type PersistiqQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PersistiqRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: PersistiqQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST/PUT/PATCH shapes.
	body?: unknown;
};

/**
 * Replaces the key wherever PersistIQ echoes it. A 401 answers
 * "Failed to find api key: <the key sent>", so a wrong or revoked key would
 * otherwise land in the error message, the error body and every log line
 * that prints them.
 */
export function redactKey(
	// unknown: error bodies are arbitrary JSON or text.
	value: unknown,
	apiKey: string,
	// unknown: the same value with every occurrence of the key replaced.
): unknown {
	if (!apiKey) return value;
	if (typeof value === 'string') return value.split(apiKey).join('[redacted]');
	if (Array.isArray(value)) return value.map((item) => redactKey(item, apiKey));
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [
				key,
				redactKey(item, apiKey),
			]),
		);
	}
	return value;
}

/**
 * Authenticated PersistIQ request. API keys authenticate in the x-api-key
 * header.
 * https://persistiq.com/api-docs/v1/swagger.json
 */
export async function makePersistiqRequest(
	apiKey: string,
	{ method, path, query, body }: PersistiqRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.persistiq.com',
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
			// Rebuilt without the request (lead records carry emails) and with
			// the echoed key masked. Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status.
			const errorBody = redactKey(error.body, apiKey);
			const detail = describePersistiqError(
				errorBody,
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
					body: errorBody,
				},
				`PersistIQ ${error.status}: ${detail}`,
				{ retryAfter: error.retryAfter },
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
