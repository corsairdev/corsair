import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEXTCORTEX_API_BASE = 'https://api.textcortex.com/v1';

// Core's request() retries a 429 three times and honours Retry-After, so the
// 429 handler in error-handlers.ts does not retry again. TextCortex promises
// no reset header, so only Retry-After is read.
const TEXTCORTEX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

export type TextCortexErrorDetails = {
	message?: string;
	code?: string;
	details: Array<{ location?: string; message: string }>;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of a JSON envelope.
function readErrorDetails(body: unknown): TextCortexErrorDetails {
	const record = asRecord(body);
	if (!record) return { details: [] };

	const details: Array<{ location?: string; message: string }> = [];
	const rawDetail = record.detail;
	if (Array.isArray(rawDetail)) {
		for (const entry of rawDetail) {
			const item = asRecord(entry);
			const message = item?.msg;
			if (typeof message !== 'string' || message.length === 0) continue;
			const loc = item?.loc;
			details.push({
				location: Array.isArray(loc) ? loc.map(String).join('.') : undefined,
				message,
			});
		}
	}

	const error = asRecord(record.error);
	const message =
		(typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: undefined) ??
		(typeof record.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof rawDetail === 'string' && rawDetail.length > 0
			? rawDetail
			: undefined);

	const type = error?.type;
	const code = error?.code;
	return {
		message,
		code:
			typeof type === 'string'
				? type
				: typeof code === 'string'
					? code
					: undefined,
		details,
	};
}

/**
 * TextCortex speaks the OpenAI shape, so a failure carries `error.message` and
 * `error.type` on the chat routes. Its own endpoints answer `{ detail }` or a
 * service error with `status` and `message` instead, and a validation failure
 * can put an array in `detail`. Errors are core's ApiError; this reads any of
 * the three bodies, or returns undefined for anything else.
 * https://docs.textcortex.com/api
 */
export function textCortexErrorDetails(
	// unknown: any thrown value; only core's ApiError has a body to read.
	error: unknown,
): TextCortexErrorDetails | undefined {
	return error instanceof ApiError ? readErrorDetails(error.body) : undefined;
}

/**
 * A 422 validation body lists each rejected field as `{ loc, msg, type, input }`
 * (OpenAPI `ValidationError`), and `input` is the rejected value: for a prompt
 * that is too long, the prompt itself. This drops `input` from each entry and
 * leaves the rest of the body as the provider sent it.
 */
// unknown: the provider's error body, any JSON or text.
function withoutEchoedInput(body: unknown): unknown {
	const record = asRecord(body);
	if (!record || !Array.isArray(record.detail)) return body;
	return {
		...record,
		detail: record.detail.map((entry: unknown) => {
			const item = asRecord(entry);
			if (!item || !('input' in item)) return entry;
			const { input: _input, ...rest } = item;
			return rest;
		}),
	};
}

/**
 * Core's ApiError keeps the request it failed on, body included, and a chat
 * body holds the user's prompt. This rebuilds the same ApiError without the
 * request body and without a validation body's echoed `input`, so the prompt
 * does not travel with the error into logs.
 * Status, retryAfter and the provider's response body stay as they were.
 */
function withoutRequestBody(error: ApiError): ApiError {
	const stripped = new ApiError(
		{ ...error.request, body: undefined },
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: withoutEchoedInput(error.body),
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

export type TextCortexQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TextCortexRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: TextCortexQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTextCortexRequest(
	apiKey: string,
	{ method, path, query, body }: TextCortexRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TEXTCORTEX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TextCortex reads the key from a bearer header.
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
			rateLimitConfig: TEXTCORTEX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the request body it echoed.
		if (error instanceof ApiError) throw withoutRequestBody(error);
		throw error;
	}
}
