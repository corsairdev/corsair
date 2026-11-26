import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LUSHA_API_BASE = 'https://api.lusha.com';

/** The message Lusha sends (per its error-codes page) when the account is out of credits. */
const INSUFFICIENT_CREDITS_MESSAGE = 'insufficient credits';

const REDACTED = '[REDACTED]';

/** Query values the routes accept; undefined drops the parameter. */
export type LushaQuery = Record<string, string | number | boolean | undefined>;

export type LushaRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: LushaQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * A free read that is safe to repeat. Only these are retried after a 5xx
	 * or a network failure (R8): every other call either charges credits on
	 * each run or changes data, and the first attempt may already have landed.
	 */
	replayable?: boolean;
};

/** Errors from replayable requests; error-handlers.ts reads this. */
const replayableErrors = new WeakSet<object>();

/** True when the failed request was a free read that can be repeated. */
export function isReplayable(error: unknown): boolean {
	return typeof error === 'object' && error !== null
		? replayableErrors.has(error)
		: false;
}

// unknown: error bodies arrive as arbitrary JSON; the helpers narrow one
// field at a time rather than typing Lusha's whole error shape.
function readString(
	record: Record<string, unknown>,
	key: string,
): string | undefined {
	const value = record[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Reads Lusha's error message. The documented shape is
 * `{statusCode, message, errors?}`; the gateway's own 404 sends
 * `{message, request_id}`, so every field is optional here.
 */
// unknown: see readString.
export function describeLushaError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	if (!record) return fallback;
	const message =
		readString(record, 'message') ?? readString(record, 'error') ?? fallback;
	const errors = record.errors;
	const details = Array.isArray(errors)
		? errors.filter((item): item is string => typeof item === 'string')
		: [];
	const summary = `Lusha ${status ?? 'error'}: ${message}`;
	const text =
		details.length > 0 ? `${summary} (${details.join('; ')})` : summary;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** 402, or the documented message (matched in case the status differs). */
export function isOutOfCredits(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	return (
		error.status === 402 ||
		error.message.toLowerCase().includes(INSUFFICIENT_CREDITS_MESSAGE)
	);
}

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: LUSHA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// Lusha names the header exactly `api_key` (lowercase, underscore).
			api_key: apiKey,
		},
	};
}

/**
 * Core's ApiError keeps the request body and query, and Lusha requests carry
 * the people being looked up (names, emails, LinkedIn URLs) or a table
 * owner's email. R8 allows rebuilding the error to drop them; status,
 * retryAfter and the response body stay.
 */
function withoutRequestData(error: ApiError, method: string): ApiError {
	return new ApiError(
		{
			method: error.request.method ?? (method as ApiRequestOptions['method']),
			url: error.request.url,
			query: error.request.query === undefined ? undefined : { [REDACTED]: '' },
			body: error.request.body === undefined ? undefined : REDACTED,
		},
		{
			// The query string can hold a table owner's email address.
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		describeLushaError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * Sends one operation and returns the response body. Core's request() retries
 * a 429 three times with backoff (Lusha sends no Retry-After); everything
 * else is decided by error-handlers.ts.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeLushaRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: LushaRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<unknown>(configWith(apiKey), requestOptions);
	} catch (error) {
		const thrown =
			error instanceof ApiError ? withoutRequestData(error, method) : error;
		if (replayable && typeof thrown === 'object' && thrown !== null) {
			replayableErrors.add(thrown);
		}
		throw thrown;
	}
}
