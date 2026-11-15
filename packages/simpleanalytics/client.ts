import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonObject, UnknownJson } from './json';

/**
 * One host serves all three APIs: the Stats API under `/{hostname}.json`, the
 * Export API under `/api/export/datapoints` and the Admin API under
 * `/api/websites`. The origin is the whole base, and `path` carries the route.
 */
export const SIMPLEANALYTICS_API_BASE = 'https://simpleanalytics.com';

/**
 * Twenty failed authentications in 15 minutes lock the key for up to 15
 * minutes, so blind retries are worse here than elsewhere: an invalid key
 * retried three times three times over is most of the way to a lockout. Retries
 * live in error-handlers.ts and never cover an auth failure.
 */
const SIMPLEANALYTICS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Simple Analytics reports failures **inside a 200 or 400 body**, not through
 * the status alone:
 *
 * - Stats and Export answer `{ ok: false, error: "…" }`.
 * - Admin answers `{ success: false, error: "…" }`.
 * - A Free-plan website missing the Simple Analytics badge answers 423 with
 *   `{ code: "BADGE_REQUIRED" }`.
 *
 * A call that returns 200 with `ok: false` is a failure, so the client checks
 * the body and throws this error. A non-2xx answer stays core's `ApiError`
 * (with the provider's message), and a request that never reached the API
 * (DNS, reset, timeout) throws this error with the transport failure as cause.
 */
export class SimpleanalyticsAPIError extends Error {
	readonly status?: number;
	/** The provider's own message, from `error` in the body. */
	readonly reason?: string;
	/** A machine-readable code, such as `BADGE_REQUIRED`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// An error body is `{ ok, error }`, but a proxy can answer HTML or nothing.
	readonly body?: UnknownJson; // unknown: see the note above

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: UnknownJson; // unknown: same open error body as the field above
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SimpleanalyticsAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.reason = readString(record, 'error');
		this.code = readString(record, 'code');
	}

	/** True when the key is missing, invalid, or locked after failed attempts. */
	get isAuthError(): boolean {
		return isAuthFailure(this);
	}

	/** True when a Free-plan website is locked because its badge is missing. */
	get isBadgeRequired(): boolean {
		return isBadgeLock(this);
	}
}

// The record is an untyped response body; read one field at a time.
function readString(
	record: JsonObject | null | undefined, // unknown: untyped response body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Turns a body that reports failure into a message. `ok` is the Stats and
 * Export flag, `success` the Admin one, so both are checked.
 */
export function failureFromBody(
	body: UnknownJson, // unknown: a response body, possibly an error object
	status: number | undefined,
): string | null {
	const record = asRecord(body);
	if (!record) return null;
	const failed = record.ok === false || record.success === false;
	if (!failed) return null;

	const reason =
		readString(record, 'error') ??
		readString(record, 'message') ??
		'Simple Analytics reported a failure';
	return status === undefined
		? reason
		: `Simple Analytics ${status}: ${reason}`;
}

export function describeSimpleanalyticsError(
	status: number | undefined,
	body: UnknownJson, // unknown: an error body can be text, HTML or empty
	fallback: string,
): string {
	const fromBody = failureFromBody(body, status);
	if (fromBody) return fromBody;
	const text =
		typeof body === 'string' && body.trim().length > 0
			? body.trim().slice(0, 300)
			: fallback;
	return status === undefined ? text : `Simple Analytics ${status}: ${text}`;
}

export type SimpleanalyticsQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SimpleanalyticsRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: SimpleanalyticsQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: UnknownJson; // unknown: the endpoint's input schema already validated it
	/** Extra headers, such as the Admin API's User-Id. */
	headers?: Record<string, string>;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * The Stats API takes the hostname in the path with `.json` appended, so
 * `simpleanalytics.com` becomes `/simpleanalytics.com.json`. An optional path
 * goes before `.json`, each segment encoded so a hash-mode path such as
 * `/#/pricing` stays in the request path instead of becoming a fragment. The
 * root path `/` has no segment to put there; stats.get sends it as `page=/`.
 */
export function statsPath(hostname: string, path?: string): string {
	const cleaned = path?.replace(/^\/+/, '');
	if (!cleaned) return `/${segment(hostname)}.json`;
	const encoded = cleaned.split('/').map(segment).join('/');
	return `/${segment(hostname)}/${encoded}.json`;
}

/** True when the caller asked for the homepage alone, as `/`. */
export function isRootPath(path: string | undefined): boolean {
	return path !== undefined && path.length > 0 && /^\/+$/.test(path);
}

/**
 * Rebuilds core's ApiError with the provider's own message, keeping status,
 * body, request and rate-limit fields. Core names a 400 only "Bad Request",
 * which hides why Simple Analytics refused the call.
 */
function withProviderMessage(error: ApiError): ApiError {
	const reason = failureFromBody(error.body, error.status);
	if (!reason || reason === error.message) return error;
	return new ApiError(
		error.request,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		reason,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** Reads the HTTP status from core's ApiError or this plugin's error. */
export function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof SimpleanalyticsAPIError) {
		return error.status;
	}
	return undefined;
}

/** Reads `error` and `code` from the response body of either error type. */
function bodyFieldsOf(error: Error): { reason?: string; code?: string } {
	if (error instanceof SimpleanalyticsAPIError) {
		return { reason: error.reason, code: error.code };
	}
	if (error instanceof ApiError) {
		const record = asRecord(error.body);
		return {
			reason: readString(record, 'error'),
			code: readString(record, 'code'),
		};
	}
	return {};
}

/** True when the key is missing, invalid, or locked after failed attempts. */
export function isAuthFailure(error: Error): boolean {
	const status = statusOf(error);
	if (status === 401 || status === 403) return true;
	const reason = bodyFieldsOf(error).reason?.toLowerCase() ?? '';
	return (
		reason.includes('no valid authorization') ||
		reason.includes('no api-key') ||
		reason.includes('too many failed attempts')
	);
}

/** True when a Free-plan website is locked because its badge is missing. */
export function isBadgeLock(error: Error): boolean {
	return (
		statusOf(error) === 423 || bodyFieldsOf(error).code === 'BADGE_REQUIRED'
	);
}

// unknown: callers parse the body with the endpoint's zod output schema, and
// the shape differs per route, which is what that schema is for.
export async function makeSimpleanalyticsRequest(
	apiKey: string,
	{ method, path, query, body, headers }: SimpleanalyticsRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMPLEANALYTICS_API_BASE,
		VERSION: '6',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Api-Key': apiKey,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: see the note on makeSimpleanalyticsRequest.
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SIMPLEANALYTICS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Core's ApiError passes through so its status, retryAfter and request
			// reach core's handlers. Only the message is swapped for the provider's
			// `error` text, which core leaves out for a 400 ("Bad Request").
			throw withProviderMessage(error);
		}
		// A transport failure never held a body or headers, so its cause is safe to
		// keep. DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SimpleanalyticsAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new SimpleanalyticsAPIError('Unknown Simple Analytics error', {
			method,
		});
	}
}

/**
 * Sends a request and fails when the body reports `ok: false` or
 * `success: false`, whatever the status. This is where a 200 that says the
 * call failed becomes an error, which is why every endpoint goes through it.
 *
 * A body-level failure has no HTTP status of its own, so the message carries
 * no status prefix; a caller reads `status` only when the transport failed.
 */
export async function makeCheckedRequest(
	apiKey: string,
	request: SimpleanalyticsRequest,
): Promise<UnknownJson> {
	const raw = await makeSimpleanalyticsRequest(apiKey, request);
	const failure = failureFromBody(raw, undefined);
	if (failure) throw new SimpleanalyticsAPIError(failure, { body: raw });
	return raw;
}
