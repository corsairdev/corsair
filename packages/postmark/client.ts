import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const POSTMARK_API_BASE = 'https://api.postmarkapp.com';

/**
 * Postmark publishes its own rate-limit headers (`X-RateLimit-Limit`,
 * `X-RateLimit-Remaining` and `X-RateLimit-Reset`) rather than a Retry-After, so
 * no header delay is read here and the handlers fall back to their strategy.
 */
const POSTMARK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Postmark answers every problem as `{ ErrorCode, Message }`, where `ErrorCode`
 * is a stable numeric identifier from its published table and `Message` is the
 * human sentence. `ErrorCode` also rides in the `X-PM-ApiErrorCode` header.
 *
 * Note that a batch send answers HTTP 200 and reports per-message failures
 * inside the body, so a 200 is not proof that every message was sent.
 */
export class PostmarkAPIError extends Error {
	readonly status?: number;
	/** The stable numeric `ErrorCode`, such as `300`. */
	readonly errorCode?: number;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Postmark (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when Postmark rejected the token rather than the request. */
	readonly credentialsRejected: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			errorCode?: number;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PostmarkAPIError';
		this.status = options.status;
		this.errorCode = options.errorCode;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
	}
}

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(
	record: Record<string, Untyped> | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

/** The stable numeric `ErrorCode`, such as `300`. */
export function readErrorCode(body: Untyped): number | undefined {
	return readNumber(asRecord(body), 'ErrorCode');
}

/**
 * Code 10 is the only authentication error in the published table, and its
 * message names whether a server or account token was wrong. A 401 always means
 * the credential, whether or not a body arrived.
 */
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status !== 401) return false;
	return readErrorCode(body) === 10 || readErrorCode(body) === undefined;
}

/**
 * Builds the message from the status and Postmark's stable `ErrorCode`, and
 * never from Postmark's `Message`. That text can repeat a sender or recipient
 * address, and the message reaches callers and server logs, so it is left out
 * entirely rather than filtered: the code identifies the failure precisely.
 */
export function describePostmarkError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	// unknown: the error body before a guard narrows it.
	const code = readErrorCode(body);
	if (status !== undefined && code !== undefined) {
		return `Postmark ${status}, code ${code}`;
	}
	if (status !== undefined) return `Postmark ${status}`;
	return fallback;
}

/** Matches an email address inside free text. */
const EMAIL = /[^\s<>"'@]+@[^\s<>"'@]+\.[A-Za-z]{2,}/g;
const REDACTED = '[redacted]';

/**
 * Replaces every email address in a string. Postmark's `Message` and any echoed
 * field can carry the sender or recipient, and both the error body and its text
 * travel to callers and logs.
 */
export function redactAddresses(value: string): string;
export function redactAddresses(value: Untyped): Untyped;
export function redactAddresses(value: Untyped): Untyped {
	// unknown: a body is arbitrary JSON, walked without narrowing its shape.
	if (typeof value === 'string') return value.replace(EMAIL, REDACTED);
	if (Array.isArray(value)) {
		return value.map((item: Untyped) => redactAddresses(item));
	}
	const record = asRecord(value);
	if (record === undefined) return value;
	const redacted: Record<string, Untyped> = {};
	for (const [key, item] of Object.entries(record)) {
		redacted[key] = redactAddresses(item);
	}
	return redacted;
}

/**
 * Removes the server's API tokens from a settings response.
 *
 * `server.get` is a read, and a caller limited to reads must not be able to lift
 * a token out of it and use that token directly against Postmark, where none of
 * Corsair's permission checks apply. Dropping the field from the schema is not
 * enough: `ServerSchema` is `.loose()`, so an undeclared `ApiTokens` would still
 * pass through. This runs on the raw body, before the schema sees it.
 */
export function withoutApiTokens(
	body: Untyped, // unknown: the server body before the output schema parses it.
): Untyped {
	const record = asRecord(body);
	if (record === undefined) return body;
	const { ApiTokens: _tokens, ...rest } = record;
	return rest;
}

/** A query value; Postmark takes repeated keys for a list, not `key[]`. */
export type PostmarkQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;

export type PostmarkQuery = Record<string, PostmarkQueryValue>;

export type PostmarkRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: PostmarkQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Rewrites a query so a list is sent as repeated keys without brackets, which
 * is how Postmark parses `tag` and `messagestream` filters.
 */
export function buildQuery(
	query: PostmarkQuery,
): Record<string, string | number | boolean | string[]> {
	const result: Record<string, string | number | boolean | string[]> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		result[key] = Array.isArray(value)
			? value.map((item) => String(item))
			: (value as string | number | boolean);
	}
	return result;
}

/**
 * The server token, sent in `X-Postmark-Server-Token`. Postmark also has an
 * account token for the account-level routes, which this plugin does not wrap:
 * every route here is a server-level one, so a single token covers all of them.
 */
export const POSTMARK_SERVER_TOKEN_HEADER = 'X-Postmark-Server-Token';

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makePostmarkRequest(
	serverToken: string,
	{ method, path, query, body }: PostmarkRequest,
): Promise<Untyped> {
	if (!serverToken.trim()) {
		throw new AuthMissingError('postmark', 'api_key');
	}
	if (/[\r\n]/.test(serverToken)) {
		throw new PostmarkAPIError('The API token must not contain newlines');
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		[POSTMARK_SERVER_TOKEN_HEADER]: serverToken,
	};
	// Postmark requires Content-Type even on a GET, and answers 415 without it.
	headers['Content-Type'] = 'application/json';

	const config: OpenAPIConfig = {
		BASE: POSTMARK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: query === undefined ? undefined : buildQuery(query),
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: POSTMARK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through (R8) so status, retryAfter and
		// isRateLimitError() keep working. Postmark's `Message` can repeat an
		// address, and the body it rides in travels on the error, so both are
		// rebuilt without private values.
		if (error instanceof ApiError) {
			throw new ApiError(
				error.request,
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: redactAddresses(error.statusText),
					body: redactAddresses(error.body),
				},
				describePostmarkError(error.status, error.body, 'Postmark error'),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PostmarkAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PostmarkAPIError('Unknown Postmark error', {
			method,
			transport: true,
		});
	}
}
