import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Piggy (rebranded Leat) documents no per-plan rate limits, so 429s get
 * core's standard handling: up to three retries honouring Retry-After (R8:
 * the plugin adds no second retry layer).
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Extracts the readable part of a Piggy error body. Errors carry the
 * documented envelope `{"message":...,"code":<number>,"status_code":400}`;
 * authentication failures answer the bare `{"message":"Unauthenticated."}`
 * (both verified live with an invalid key, 2026-11-21).
 */
export function describePiggyError(
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

export type PiggyQuery = Record<string, string | number | boolean | undefined>;

export type PiggyRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PiggyQuery;
	/** JSON body for POST and PUT calls; Piggy takes none on GET/DELETE. */
	body?: Record<string, unknown>;
};

/**
 * Authenticated Piggy request. Personal Access Tokens authenticate as
 * `Authorization: Bearer <access_token>`, created for a private app in the
 * Business Dashboard. Resource paths sit under
 * `https://api.leat.com/api/v3/oauth/clients/…`.
 * https://docs.leat.com/v3/authentication
 */
export async function makePiggyRequest(
	apiKey: string,
	{ method, path, query, body }: PiggyRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.leat.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: body === undefined ? undefined : body,
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
			// Rebuilt without the request (auth header, attribute payloads).
			// Core's fallback message embeds the whole response body, so the
			// text comes from the provider's error or the status.
			const detail = describePiggyError(
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
				`Piggy ${error.status}: ${detail}`,
				{ retryAfter: error.retryAfter },
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
