import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KEYWORD_API_BASE = 'https://app.keyword.com/api/v2';

// A rank chart over 180 days and a few hundred keywords answers a large body,
// and the rank history for a whole group can take longer than the 20 second
// default in corsair/http.
const KEYWORD_TIMEOUT_MS = 60_000;

/**
 * Keyword answers every failure in a JSON:API error envelope:
 *
 * ```json
 * { "errors": [{ "code": "401", "title": "...", "message": "Unauthenticated." }] }
 * ```
 *
 * `code` is the status as a string, which is what a handler matches on.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readErrors(body: unknown): {
	code?: string;
	title?: string;
	message?: string;
} {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!Array.isArray(errors) || errors.length === 0) return {};
	const first = asRecord(errors[0]);
	const read = (key: string) => {
		const value = first?.[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
		return undefined;
	};
	return {
		code: read('code'),
		title: read('title'),
		message: read('message') ?? read('detail'),
	};
}

// Keyword limits each token to 60 requests a minute (30 for competitor
// history) and answers 429 without a Retry-After. The RATE_LIMIT_ERROR handler
// owns the retries and their backoff.
const KEYWORD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Keyword failure that got no answer: a reset, DNS failure, abort or
 * timeout, or a body that is not JSON. An HTTP error from Keyword stays core's
 * `ApiError` (see `sanitizeApiError`), so its status and rate-limit fields
 * reach core and the error handlers.
 */
export class KeywordAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;
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
		this.name = 'KeywordAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

function keywordStatus(error: unknown): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export function isKeywordRateLimit(error: unknown): boolean {
	return keywordStatus(error) === 429;
}

export function isKeywordAuthError(error: unknown): boolean {
	return keywordStatus(error) === 401;
}

/** The token's user is not allowed to make this call. */
export function isKeywordPermissionError(error: unknown): boolean {
	return keywordStatus(error) === 403;
}

/** The plan's keyword allowance is full, which no retry can fix. */
export function isKeywordQuotaError(error: unknown): boolean {
	return keywordStatus(error) === 402;
}

/**
 * Core's `ApiError` keeps the request body and the raw response, and a keyword
 * create echoes the project's `auth` key inside the resource. The error is
 * rebuilt as an `ApiError` with the same status and rate-limit fields, the body
 * cut to the first error's `code`, `title` and `message`, and the sent body
 * dropped.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const { body: _body, formData: _formData, ...request } = error.request;
	const errorBody = parseJsonText(error.body) ?? error.body;
	const fields = readErrors(errorBody);
	const kept = Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
	return new ApiError(
		request,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: Object.keys(kept).length > 0 ? { errors: [kept] } : {},
		},
		// Core's message for a status it does not list quotes the whole
		// response body, so a body without a message gets a fixed one.
		describeKeywordError(error.status, errorBody, 'Keyword request failed'),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** The message Keyword sent, with the status in front. */
// unknown: an error body is untyped: a JSON:API envelope, or text from a proxy
// that never reached Keyword.
export function describeKeywordError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readErrors(body);
	const text = fields.message ?? fields.title ?? fallback;
	return status === undefined ? text : `Keyword ${status}: ${text}`;
}

export type KeywordQueryValue = string | number | boolean;

export type KeywordRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, KeywordQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, which
	// is a JSON:API document built per operation.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * The project (group) name goes into a path segment, and Keyword's names can
 * contain a `[sub]` marker for a subproject, such as
 * `Disney[sub]Disney Classics`. `encodeURIComponent` leaves the brackets in
 * the reserved set, so they are restored after encoding to keep the marker
 * readable to Keyword rather than turning it into `%5Bsub%5D`.
 */
export function projectSegment(name: string): string {
	return encodeURIComponent(name).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKeywordRequest(
	apiKey: string,
	{ method, path, query, body }: KeywordRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KEYWORD_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KEYWORD_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: KEYWORD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new KeywordAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KeywordAPIError('Unknown Keyword error', {
			method,
			transport: true,
		});
	}

	if (typeof raw !== 'string') return raw;
	if (raw.trim() === '') return undefined;
	const parsed = parseJsonText(raw);
	if (parsed === undefined) {
		throw new KeywordAPIError('Keyword answered a body that is not JSON', {
			method,
		});
	}
	return parsed;
}

/**
 * Keyword sends every body, errors included, as `application/vnd.api+json`.
 * corsair/http parses only `application/json`, so those bodies arrive as
 * text and are parsed here. Text that is not JSON gives undefined.
 */
// unknown: the text is an arbitrary JSON:API document until a schema reads it.
function parseJsonText(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		const parsed: unknown = JSON.parse(body);
		return parsed;
	} catch {
		return undefined;
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KeywordQueryValue | undefined>,
): Record<string, KeywordQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KeywordQueryValue] => entry[1] !== undefined,
		),
	);
}

/**
 * The project's `auth` key is a credential that Keyword returns inside every
 * project and keyword resource, and `users/self` returns the account's master
 * `api_token` and its Intercom identity hash. All are stripped before a result
 * reaches a caller's log or payload, because they are not theirs to pass on.
 */
const SECRET_KEYS = new Set(['auth', 'api_token', 'intercom_hash']);

// unknown: a resource is a JSON:API document whose attributes have no closed
// shape per provider version, so the walk is over open records.
export function stripProjectAuth(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(stripProjectAuth);
	const record = asRecord(value);
	if (!record) return value;

	const cleaned: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(record)) {
		if (SECRET_KEYS.has(key)) continue;
		cleaned[key] = stripProjectAuth(entry);
	}
	return cleaned;
}
