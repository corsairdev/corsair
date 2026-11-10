import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const RESPONDIO_API_BASE = 'https://api.respond.io/v2';

/**
 * Respond.io answers a failure with a `code` and a `message`:
 *
 * ```json
 * {"code":401,"message":"UN_AUTHORIZED"}
 * {"code":400,"message":"Validation error."}
 * {"code":429,"message":"Too Many Requests"}
 * ```
 *
 * Unlike most of these plugins, `code` is a number on every documented failure
 * and matches the HTTP status, so the body is read mainly for its `message`.
 */
export class RespondioAPIError extends Error {
	readonly status?: number;
	/** The body's `code`, which matches the HTTP status. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, which respond.io sends on a 429. */
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
			code?: number;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RespondioAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The bearer token is missing, wrong or revoked. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** A token on a plan that does not include the Developer API (Growth and up). */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** No contact matched the identifier, or the message does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A body respond.io refused. A `400` is also what an `includeComments` value
	 * other than true or false returns, which the docs call out explicitly.
	 */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}

	/** The contact cannot be messaged on that channel, such as outside the 24h window. */
	get isUnprocessable(): boolean {
		return this.status === 449;
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): { message?: string; code?: number } {
	const record = asRecord(body);
	const message = record?.message;
	const code = record?.code;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'number' ? code : undefined,
	};
}

/**
 * Builds the message for an error body. respond.io's `message` is a code-like
 * string (`UN_AUTHORIZED`), so the status carries most of the meaning.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRespondioError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, code } = failure(body);
	const text = message ?? fallback;
	const parts = [status];
	// The code repeats the status, so it is only added when it differs.
	if (code !== undefined && code !== status) parts.push(code);
	const label = parts.filter((part) => part !== undefined).join(' ');
	return label ? `respond.io ${label}: ${text}` : text;
}

/**
 * A query value. List Messages takes flat scalars only; its filters travel in the
 * path and the cursor.
 */
export type RespondioQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RespondioRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path below `/v2`, starting with a slash. */
	path: string;
	query?: RespondioQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Each HTTP method on each request path allows **5 requests a second**, tracked
 * independently, and a 429 carries `Retry-After` plus `X-RateLimit-*` headers.
 */
const RESPONDIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

/**
 * The token goes in `Authorization: Bearer`. A workspace can hold up to 10 Access
 * Tokens, and the Developer API needs the Growth plan or above.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RESPONDIO_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRespondioRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RespondioRequest,
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
			rateLimitConfig: RESPONDIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RespondioAPIError(
				describeRespondioError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RespondioAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RespondioAPIError('Unknown respond.io error', {
			method,
			replayable,
		});
	}
}

/**
 * Builds the contact identifier respond.io expects in a path: a bare id, email or
 * phone is not enough, it must carry its prefix.
 *
 * ```text
 * id:123          a contact ID
 * email:a@b.com   an email address
 * phone:+6012345  a phone number in E.164 form
 * ```
 *
 * A value that already carries a prefix is passed through, so a caller who knows
 * the form is not forced to strip it.
 */
export function contactIdentifier(
	value: string | number,
	kind: 'id' | 'email' | 'phone' = 'id',
): string {
	const text = String(value);
	if (/^(id|email|phone):/.test(text)) return encodeURIComponent(text);
	return encodeURIComponent(`${kind}:${text}`);
}

/** Encodes an identifier that is already prefixed, such as a raw `id:123`. */
export function prefixedIdentifier(value: string): string {
	return encodeURIComponent(value);
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
