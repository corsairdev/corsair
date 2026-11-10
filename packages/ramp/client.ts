import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Production REST host. Sandbox is `https://demo-api.ramp.com`; the demo app at
 * `demo.ramp.com` is a different host and does not serve the API.
 */
export const RAMP_API_BASE = 'https://api.ramp.com';

/** Path prefix every Developer API route sits under. */
export const RAMP_API_PREFIX = '/developer/v1';

/**
 * Ramp's gateway answers an unknown path with an HTML 404, and the API layer
 * answers a rejected token with a **404** carrying `DEVELOPER_7002`, not a 401.
 * A `404` therefore means two different things, and the body's `error_code` is
 * the only way to tell them apart: `DEVELOPER_7002` is a missing or invalid
 * token, any other 404 is a route or record that does not exist.
 */
const INVALID_TOKEN_CODE = 'DEVELOPER_7002';

/** Documented error codes this plugin reads a meaning from. */
const INSUFFICIENT_SCOPE_CODE = 'DEVELOPER_7100';

/**
 * Ramp error bodies carry the message twice:
 *
 * ```json
 * { "error_v2": { "message", "error_code", "error_id", "notes", "additional_info" },
 *   "error": { "message", "details" } }
 * ```
 *
 * `error_v2` is the structured one; `error.message` repeats the text for older
 * clients. A gateway 404 has no JSON at all and arrives as an HTML string.
 */
export class RampAPIError extends Error {
	readonly status?: number;
	/** `error_v2.error_code`, e.g. `DEVELOPER_7002`. */
	readonly code?: string;
	/** `error_v2.error_id`, the value Ramp support asks for. */
	readonly errorId?: string;
	/** `error_v2.notes`, when Ramp added context. */
	readonly notes?: string;
	/** Milliseconds from a Retry-After header, when Ramp sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errorId?: string;
			notes?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RampAPIError';
		this.status = options.status ?? undefined;
		this.code = options.code;
		this.errorId = options.errorId;
		this.notes = options.notes;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	/**
	 * A rejected token. Ramp reports it as a 404 with `DEVELOPER_7002`, so the
	 * status alone would read as a missing record.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.code === INVALID_TOKEN_CODE;
	}

	/**
	 * The token is valid but lacks a scope the route needs. Ramp sends 403 with
	 * `DEVELOPER_7100` for a read-only token that tries to write, and a bare 403
	 * when the business lacks a plan feature.
	 */
	get isPermissionError(): boolean {
		return this.status === 403 || this.code === INSUFFICIENT_SCOPE_CODE;
	}

	/**
	 * A 404 that is genuinely a missing route or record, as opposed to the
	 * missing-token 404 above.
	 */
	get isNotFound(): boolean {
		return this.status === 404 && this.code !== INVALID_TOKEN_CODE;
	}
}

/** Reads the structured half of a Ramp error body. */
function errorV2(
	// unknown: an error body, untyped until this function narrows it.
	body: unknown,
): Record<string, unknown> | null {
	return asRecord(asRecord(body)?.error_v2);
}

// unknown: the body is untyped until the reads here narrow it.
function readString(
	record: Record<string, unknown> | null,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Builds the message for an error body. `notes` adds context when present.
 * unknown: the body is untyped until the reads here narrow it.
 */
export function describeRampError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const structured = errorV2(body);
	const legacy = asRecord(asRecord(body)?.error);
	const message =
		readString(structured, 'message') ??
		readString(legacy, 'message') ??
		fallback;
	const code = readString(structured, 'error_code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = label ? `Ramp ${label}: ${message}` : message;
	const notes = readString(structured, 'notes');
	return notes ? `${summary} (${notes})` : summary;
}

export type RampQuery = Record<
	string,
	string | number | boolean | undefined | (string | number)[]
>;

export type RampRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** Path under `/developer/v1`, starting with a slash. */
	path: string;
	query?: RampQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * `start` is a record id rather than an offset, so pages change shape as the
 * caller filters. Ramp documents a 60 second cooldown after a 429, which no
 * retry strategy here can express, so the handler uses that as its fallback
 * delay and lets a real `Retry-After` win.
 */
const RAMP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Ramp documents a 60 second block after a 429 as the cooldown to allow for. */
export const RAMP_RATE_LIMIT_COOLDOWN_MS = 60_000;

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RAMP_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
}

/**
 * Pagination is cursor style: `page.next` is an absolute URL whose `start`
 * query holds the last id of the page. Passing the whole URL back as `start`
 * is wrong, so the cursor is read out of it here and the operation takes a bare
 * `start` id instead.
 * unknown: `next` is a provider field, so its type is untyped until checked.
 */
export function readNextCursor(page: unknown): string | null {
	const next = asRecord(page)?.next;
	if (typeof next !== 'string' || next.length === 0) return null;
	const match = /[?&]start=([^&]+)/.exec(next);
	if (!match?.[1]) return null;
	const raw = decodeURIComponent(match[1]);
	return raw.length > 0 ? raw : null;
}

/**
 * The `next` link Ramp documents carries the full absolute URL. It is returned
 * beside the cursor so a caller can page with either.
 */
// unknown: `page` is a provider field read here, untyped until `asRecord`
// narrows it, and `next` is only a string when Ramp actually sent one.
export function readNextUrl(page: unknown): string | null {
	const next = asRecord(page)?.next;
	return typeof next === 'string' && next.length > 0 ? next : null;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRampRequest(
	apiKey: string,
	{ method, path, query, body }: RampRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: `${RAMP_API_PREFIX}${path}`,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: RAMP_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const structured = errorV2(error.body);
			const caught = new RampAPIError(
				describeRampError(error.status, error.body, error.message),
				{
					status: error.status,
					code: readString(structured, 'error_code'),
					errorId: readString(structured, 'error_id'),
					notes: readString(structured, 'notes'),
					retryAfter: error.retryAfter,
					method,
				},
			);
			// The cause holds the request body, and a failed create carries the
			// caller's payload (a bill memo, vendor details). Copy the fields the
			// handlers need and drop it so logging the error cannot print them.
			throw caught;
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RampAPIError(error.message, { cause: error, method });
		}
		throw new RampAPIError('Unknown Ramp error', { method });
	}
}
