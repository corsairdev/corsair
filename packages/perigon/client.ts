import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Perigon documents no rate-limit retry contract beyond "requests are
 * rate-limited per plan quota", so 429s get core's standard handling: up to
 * three retries honouring Retry-After (R8: the plugin adds no second retry
 * layer). GETs are replay-safe; there are no writes in this plugin.
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
 * and query. Article content is licensed data, which core's own ApiError
 * keeps on the request.
 */
export class PerigonAPIError extends ApiError {
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
			// unknown: error bodies can be the { status, message, timestamp }
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
		this.name = 'PerigonAPIError';
		this.method = options.method;
	}
}

/**
 * Extracts the readable part of a Perigon error body. Errors are
 * `{"status":401,"message":"Invalid API key.","timestamp":...}` (verified
 * live with an invalid key).
 */
export function describePerigonError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ?? fallback;
	return text;
}

export type PerigonQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PerigonRequest = {
	method: 'GET';
	path: string;
	query?: PerigonQuery;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Perigon request. The key goes in the x-api-key header — the
 * docs' second choice — so it never lands in a URL or query string.
 * https://perigon.io/docs/api/authentication
 */
export async function makePerigonRequest(
	apiKey: string,
	{ method, path, query }: PerigonRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.perigon.io',
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
			// Rebuilt without the request (licensed article content). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status.
			const detail = describePerigonError(
				error.body,
				error.statusText || 'request failed',
			);
			throw new PerigonAPIError(`Perigon ${error.status}: ${detail}`, {
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
