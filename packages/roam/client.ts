import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The versioned base; every route is an RPC method below it. */
export const ROAM_API_BASE = 'https://api.ro.am/v1';

/**
 * Every response is rendered against a dated API version. Omitting the header
 * uses the integration's pinned default, but the plugin sends one explicitly so
 * a body's shape does not change under it when Roam moves the default.
 */
export const ROAM_API_VERSION = '2026-08-25';

/**
 * Roam answers every failure with the inverse of its success envelope:
 *
 * ```json
 * { "ok": false, "error": "invalid_token",
 *   "message": "Could not process OAuth access token",
 *   "requestId": "523b4f75-…" }
 * ```
 *
 * `error` is a catalog code, and the docs say to branch on it rather than on
 * `message`. A `missing_scope` body also carries `needed` and `provided`.
 *
 * **The response's content type is `text/plain`**, so `corsair/http` hands the
 * body over as a string rather than parsed JSON. The client parses it itself;
 * without that step every error would arrive as one unreadable string.
 */
export class RoamAPIError extends Error {
	readonly status?: number;
	/** The catalog code, such as `invalid_token` or `missing_scope`. */
	readonly code?: string;
	/** The id Roam support asks for. */
	readonly requestId?: string;
	/** Scopes that would satisfy a `missing_scope` failure; any one is enough. */
	readonly needed: string[];
	/** The scopes the token actually holds. */
	readonly provided: string[];
	/** Milliseconds from a Retry-After header, when Roam sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			requestId?: string;
			needed?: string[];
			provided?: string[];
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RoamAPIError';
		this.status = options.status;
		this.code = options.code;
		this.requestId = options.requestId;
		this.needed = options.needed ?? [];
		this.provided = options.provided ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * A missing, invalid or revoked token. `not_authed` is a request with no
	 * bearer at all; `approval_pending` is a personal token awaiting an admin.
	 */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.code === 'not_authed' ||
			this.code === 'invalid_token' ||
			this.code === 'token_revoked'
		);
	}

	/**
	 * The token is valid but lacks a scope. This is a 403 and reads like an auth
	 * failure, but a different token is needed rather than a retry.
	 */
	get isPermissionError(): boolean {
		return this.status === 403 || this.code === 'missing_scope';
	}

	/** The method, chat, user or meeting does not exist. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 'not_found';
	}

	/** A body or query Roam refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.code === 'invalid_request';
	}
}

/**
 * Reads the error body. `corsair/http` hands this over as a string because Roam
 * labels it `text/plain`, so it is parsed here whenever it looks like JSON.
 * unknown: the body may be a parsed object or the raw string.
 */
function errorBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		if (!trimmed.startsWith('{')) return null;
		try {
			return asRecord(JSON.parse(trimmed));
		} catch {
			// A body that starts with `{` but does not parse is not JSON after all.
			return null;
		}
	}
	return asRecord(body);
}

/** Reads a string array out of a `missing_scope` body. */
// unknown: the record's values are provider JSON until the array check narrows
// this one, and a non-string entry is simply skipped.
function stringList(
	record: Record<string, unknown> | null,
	key: string,
): string[] {
	const value = record?.[key];
	if (!Array.isArray(value)) return [];
	return value.filter((entry): entry is string => typeof entry === 'string');
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `errorBody` narrows it.
 */
export function describeRoamError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = errorBody(body);
	const code = record?.error;
	const text = record?.message;
	const codePart = typeof code === 'string' ? code : undefined;
	const label = [status, codePart]
		.filter((part) => part !== undefined)
		.join(' ');
	// Roam's own `message` is a description; the catalog code is the fallback
	// when a proxy answered without one.
	const summary = typeof text === 'string' && text.length > 0 ? text : fallback;
	const prefix = label ? `Roam ${label}: ` : '';

	const needed = stringList(record, 'needed');
	if (codePart === 'missing_scope' && needed.length > 0) {
		return `${prefix}${summary} (needs one of: ${needed.join(', ')})`;
	}
	return `${prefix}${summary}`;
}

export type RoamQuery = Record<string, string | number | boolean | undefined>;

export type RoamRequest = {
	method: 'GET' | 'POST';
	/** The RPC method, such as `/chat.post`. */
	path: string;
	query?: RoamQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Roam documents no throughput window, so this config exists only to read a
 * `Retry-After` if one arrives; the handler owns the retry count.
 */
const ROAM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The token is a bearer. `Roam-Version` pins the response shape, and both
 * headers are mandatory: without a version Roam falls back to the integration's
 * pinned default, which can change between calls.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: ROAM_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			'Roam-Version': ROAM_API_VERSION,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRoamRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RoamRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: ROAM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const record = errorBody(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RoamAPIError(
				describeRoamError(error.status, error.body, error.message),
				{
					status: error.status,
					code: typeof record?.error === 'string' ? record.error : undefined,
					requestId:
						typeof record?.requestId === 'string'
							? record.requestId
							: undefined,
					needed: stringList(record, 'needed'),
					provided: stringList(record, 'provided'),
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RoamAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RoamAPIError('Unknown Roam error', { method, replayable });
	}
}
