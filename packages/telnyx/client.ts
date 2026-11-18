import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TELNYX_API_BASE = 'https://api.telnyx.com/v2';

// Core's request() would retry every 429 before the plugin sees it, including
// a 429 with code 40333, which means a messaging profile's daily spend limit is
// used up. So core makes one attempt and error-handlers.ts retries a 429
// itself, skipping 40333 (plugin rules R8).
const TELNYX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

export type TelnyxErrorDetails = {
	errors: Array<{ code?: string; title?: string; detail?: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of Telnyx's JSON envelope.
function readErrorDetails(body: unknown): TelnyxErrorDetails {
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
 * Telnyx answers failures as `{ errors: [{ code, title, detail, meta }] }`,
 * where `code` is a string such as "10005". Errors stay core's ApiError; this
 * reads the entries from one, or returns undefined for anything else.
 * https://developers.telnyx.com/docs/overview/errors/error-codes
 */
export function telnyxErrorDetails(
	// unknown: any thrown value; only core's ApiError has a body to read.
	error: unknown,
): TelnyxErrorDetails | undefined {
	return error instanceof ApiError ? readErrorDetails(error.body) : undefined;
}

/**
 * Core's ApiError keeps the request it failed on, body included, and a send
 * body holds phone numbers and the message text. This rebuilds the same
 * ApiError without the request body. Status, retryAfter and Telnyx's response
 * body stay as they were.
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

export type TelnyxQuery = Record<string, string | number | boolean | undefined>;

export type TelnyxRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: TelnyxQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTelnyxRequest(
	apiKey: string,
	{ method, path, query, body }: TelnyxRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TELNYX_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Telnyx reads the key from a bearer header.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
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
			rateLimitConfig: TELNYX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the request body it carried.
		if (error instanceof ApiError) throw withoutRequestBody(error);
		throw error;
	}
}
