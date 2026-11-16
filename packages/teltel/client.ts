import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TELTEL_API_BASE = 'https://api.teltel.io/v2';

// Core's request() retries a 429 three times and honours Retry-After, so the
// 429 handler in error-handlers.ts does not retry again. TelTEL documents no
// Retry-After.
const TELTEL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

export type TeltelErrorDetails = {
	errors: Array<{ code?: string; title?: string; detail?: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of TelTEL's JSON envelope.
function readErrorDetails(body: unknown): TeltelErrorDetails {
	const record = asRecord(body);
	const list = record?.errors;
	const errors: Array<{ code?: string; title?: string; detail?: string }> = [];
	if (Array.isArray(list)) {
		for (const entry of list) {
			const item = asRecord(entry);
			if (!item) continue;
			const code = item.code;
			const title = item.title;
			const detail = item.detail;
			errors.push({
				code: typeof code === 'string' ? code : undefined,
				title: typeof title === 'string' ? title : undefined,
				detail: typeof detail === 'string' ? detail : undefined,
			});
		}
	}
	return { errors };
}

/**
 * TelTEL answers failures as `{ errors: [{ code, title, detail }] }`. A 401
 * means no credential was sent and a 403 that one was sent and refused, or
 * that the key's role or plan does not cover the route. Errors stay core's
 * ApiError; this reads the entries from one, or returns undefined otherwise.
 * https://apidoc.teltel.io
 */
export function teltelErrorDetails(
	// unknown: any thrown value; only core's ApiError has a body to read.
	error: unknown,
): TeltelErrorDetails | undefined {
	return error instanceof ApiError ? readErrorDetails(error.body) : undefined;
}

/** The list filter value can name phone numbers, so it is masked on errors. */
const FILTER_PARAM = 'filter';
const REDACTED = '[REDACTED]';

function withoutFilterValue(url: string): string {
	try {
		const parsed = new URL(url);
		if (!parsed.searchParams.has(FILTER_PARAM)) return url;
		parsed.searchParams.set(FILTER_PARAM, REDACTED);
		return parsed.toString();
	} catch {
		return url;
	}
}

/**
 * Core's ApiError keeps the request it failed on: a send or contact body
 * holds phone numbers and message text, and a list's `filter` value can hold
 * a phone number too. This rebuilds the same ApiError with the body dropped
 * and the filter masked, in the request and in the URL. Status, retryAfter and
 * TelTEL's response body stay as they were.
 */
function withoutCustomerData(error: ApiError): ApiError {
	const filter = error.request.query?.[FILTER_PARAM];
	if (error.request.body === undefined && filter === undefined) return error;
	const stripped = new ApiError(
		{
			...error.request,
			body: undefined,
			query:
				filter === undefined
					? error.request.query
					: { ...error.request.query, [FILTER_PARAM]: REDACTED },
		},
		{
			url: withoutFilterValue(error.url),
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

export type TeltelQuery = Record<string, string | number | boolean | undefined>;

export type TeltelRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: TeltelQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTeltelRequest(
	apiKey: string,
	{ method, path, query, body }: TeltelRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TELTEL_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TelTEL accepts the key in an X-API-KEY header or an apikey query
		// parameter. The header keeps it out of URLs and logs.
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the response shape is the endpoint's concern; the caller
		// parses it with its zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TELTEL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the customer data it carried.
		if (error instanceof ApiError) throw withoutCustomerData(error);
		throw error;
	}
}
