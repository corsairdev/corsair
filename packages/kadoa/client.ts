import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KADOA_API_BASE = 'https://api.kadoa.com';

// A workflow run is accepted at once, but reading its data streams the result
// set, so the 20 second default in corsair/http is too short for
// workflows.data.
const KADOA_TIMEOUT_MS = 60_000;

/**
 * `workflows.data` with `limit: 0` streams every row inline, which Kadoa
 * documents as "subject to a 5-minute response timeout".
 */
export const KADOA_STREAM_TIMEOUT_MS = 300_000;

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(body: unknown): string | undefined {
	const record = asRecord(body);
	const value = record?.error;
	if (typeof value === 'string' && value.length > 0) return value;
	const message = record?.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

// unknown: same untyped body as readString.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const reason = record?.reason;
	if (typeof reason === 'string' && reason.length > 0) return reason;
	// The workflow data route answers a 409 with `code` instead, such as
	// DATA_NOT_PUBLISHED or PRODUCING_SCHEMA_UNAVAILABLE.
	const code = record?.code;
	if (typeof code === 'string' && code.length > 0) return code;
	return undefined;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Kadoa documents no rate limit headers; the
// contract is a 429 with a `reason` of PIPELINE_CROWDED or USER_RATE_LIMIT.
const KADOA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Kadoa error bodies come in three shapes:
 *
 * - `{ error: boolean, message, details? }` on most routes
 * - `{ error: string }` on the workflow run route
 * - `{ error: string, reason, recoveryHint?, existingState? }` on a 409 or 429
 *   from the run route
 *
 * An HTTP error from Kadoa stays core's `ApiError` (see `sanitizeApiError`), so
 * its status, Retry-After and rate-limit fields reach core and the error
 * handlers. `KadoaAPIError` covers the failures that never got an answer: a
 * reset, DNS failure, abort or timeout, and a key that cannot be sent.
 */
export class KadoaAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request never reached Kadoa: a reset, DNS failure or abort. */
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KadoaAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/**
 * The machine-readable reason Kadoa put in an error body, such as
 * `PIPELINE_CROWDED` on a 429 or `DATA_NOT_PUBLISHED` on a data 409.
 */
export function kadoaErrorCode(error: unknown): string | undefined {
	return error instanceof ApiError ? readCode(error.body) : undefined;
}

/**
 * Core's `ApiError` keeps `request.body`, which here can be a variable's value
 * or a run's `variables`, and either can be a credential that would reach any
 * log line printing the error. The error is rebuilt as an `ApiError` with the
 * same status, response body and rate-limit fields, Kadoa's message in front,
 * and the sent body dropped.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const { body: _body, formData: _formData, ...request } = error.request;
	return new ApiError(
		request,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		// Core's message for a status it does not list quotes the whole response
		// body, so a body without a message gets a fixed one instead.
		describeKadoaError(error.status, error.body, 'Kadoa request failed'),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// CR, LF and NUL make `new Headers()` throw a TypeError that quotes the whole
// header value, which here is the key.
const INVALID_HEADER_CHARACTERS = /[\r\n\0]/;

/**
 * The message Kadoa put in an error body, with the status and reason in front
 * when both are known.
 */
// unknown: an error body is untyped: `{ error, message, details }`, `{ error }`,
// or text from a proxy that never reached Kadoa.
export function describeKadoaError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readString(body) ?? fallback;
	const code = readCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Kadoa ${label}: ${text}` : text;
}

export type KadoaQueryValue = string | number | boolean | string[] | undefined;

// An array value is sent as a repeated parameter, which Kadoa documents for
// `tags`, `statusFilters`, `userId`, `channelId` and `templateId`.
export type KadoaQuery = Record<string, KadoaQueryValue>;

export type KadoaRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: KadoaQuery;
	// unknown: the endpoint's input schema has already validated the body, and
	// Kadoa takes four different body shapes across its routes.
	body?: unknown;
	/** Overrides the default request timeout. */
	timeoutMs?: number;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// a string on the routes Kadoa documents as text/plain (pause, schedule and
// workflow delete).
export async function makeKadoaRequest(
	apiKey: string,
	{ method, path, query, body, timeoutMs }: KadoaRequest,
): Promise<unknown> {
	if (INVALID_HEADER_CHARACTERS.test(apiKey)) {
		throw new KadoaAPIError(
			'The Kadoa API key contains a line break or NUL character. Save the key again without it.',
			{ method },
		);
	}

	const config: OpenAPIConfig = {
		BASE: KADOA_API_BASE,
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs ?? KADOA_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KADOA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KadoaAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KadoaAPIError('Unknown Kadoa error', { method, transport: true });
	}
}

/**
 * Pause, schedule and workflow delete answer a plain-text message. A JSON body
 * with a `message` is accepted too, because a gateway in front of Kadoa may
 * answer JSON; anything else throws, so a delete is never reported as done on
 * an empty body.
 */
// unknown: the raw body is either that text or an untyped JSON object.
export function messageResult(
	raw: unknown,
	operation: string,
): {
	message: string;
} {
	// "[object Object]" is what an empty body becomes when someone stringifies
	// it; it never means the operation succeeded.
	if (typeof raw === 'string' && raw.length > 0 && raw !== '[object Object]') {
		return { message: raw };
	}
	const message = asRecord(raw)?.message;
	if (typeof message === 'string' && message.length > 0) return { message };
	throw new Error(`Kadoa returned no message for ${operation}`);
}
