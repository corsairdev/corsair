import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { RevoltValue } from './endpoints/call';

/**
 * Revolt rebranded to **Stoat**, and `api.stoat.chat` is the host the published
 * OpenAPI document now names. `api.revolt.chat` still answers the same API, so
 * the base is configurable rather than hard-coded: a self-hosted instance is a
 * different host again.
 */
export const REVOLT_API_BASE = 'https://api.stoat.chat';

/**
 * Which credential the account holds. A bot uses `X-Bot-Token`; a user uses
 * `X-Session-Token`. The two are not interchangeable: a bot token in the session
 * header is rejected, so the choice is part of the plugin's options.
 */
export type RevoltCredential = 'bot' | 'user';

export const REVOLT_TOKEN_HEADERS = {
	bot: 'X-Bot-Token',
	user: 'X-Session-Token',
} as const satisfies Record<RevoltCredential, string>;

/**
 * Revolt answers every failure in one flat envelope, and the code repeats the
 * HTTP status:
 *
 * ```json
 * { "error": { "code": 401, "reason": "Unauthorized",
 *              "description": "The request requires user authentication." } }
 * ```
 *
 * `reason` is the short category and `description` the sentence, so both are
 * kept. A 429 is different: it carries rate-limit headers and a body naming
 * `retry_after`, which the docs express in **milliseconds**.
 */
export class RevoltAPIError extends Error {
	readonly status?: number;
	/** The `error.code`, which repeats the HTTP status. */
	readonly code?: number;
	/** The short category, such as `Unauthorized`. */
	readonly reason?: string;
	/** The sentence explaining the failure. */
	readonly description?: string;
	/** Milliseconds to wait, from `Retry-After` or the body's `retry_after`. */
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
			reason?: string;
			description?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RevoltAPIError';
		this.status = options.status;
		this.code = options.code;
		this.reason = options.reason;
		this.description = options.description;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The token is missing, malformed, or for the wrong credential header. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The message, channel, server or user does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body or path Revolt refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 413;
	}

	/** Revolt blocks an action it considers abusive. */
	get isBlockedError(): boolean {
		return this.status === 429 && this.reason === 'Blocked';
	}
}

/**
 * Reads the `error` object out of a body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function errorBody(body: unknown): {
	code?: number;
	reason?: string;
	description?: string;
	retryAfter?: number;
} {
	const outer = asRecord(body);
	const inner = asRecord(outer?.error);
	const code = inner?.code;
	const reason = inner?.reason;
	const description = inner?.description;
	// A rate-limit body carries `retry_after` beside the error object.
	const retry = outer?.retry_after;
	return {
		code: typeof code === 'number' ? code : undefined,
		reason: typeof reason === 'string' ? reason : undefined,
		description:
			typeof description === 'string' && description.length > 0
				? description
				: undefined,
		retryAfter: typeof retry === 'number' ? retry : undefined,
	};
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `errorBody` narrows it.
 */
export function describeRevoltError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { code, reason, description } = errorBody(body);
	// The body's `code` repeats the HTTP status, so printing both would read
	// `Revolt 401 401`; it is only added when it disagrees.
	const parts = [status];
	if (code !== undefined && code !== status) parts.push(code);
	const label = parts.filter((part) => part !== undefined).join(' ');
	// The description is the sentence; `reason` alone is too terse on its own.
	const text = description ?? reason ?? fallback;
	return label ? `Revolt ${label}: ${text}` : text;
}

export type RevoltQuery = Record<string, RevoltValue | undefined>;

export type RevoltRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path starting with a slash. */
	path: string;
	query?: RevoltQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/** Encodes one path segment. `@me` must stay readable, so it is not encoded. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Revolt rate-limits per bucket with `X-RateLimit-*` headers. A 429 carries a
 * `retry_after` in the body, which the docs give in milliseconds, so the handler
 * reads that rather than a header.
 */
const REVOLT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 500,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The token rides in its own header — `X-Bot-Token` or `X-Session-Token` — not
 * `Authorization`, which is why `TOKEN` is unset.
 */
function configWith(
	apiKey: string,
	credential: RevoltCredential,
	base: string,
): OpenAPIConfig {
	return {
		BASE: base,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			[REVOLT_TOKEN_HEADERS[credential]]: apiKey,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRevoltRequest(
	apiKey: string,
	credential: RevoltCredential,
	base: string,
	{ method, path, query, body, replayable }: RevoltRequest,
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
		return await request<unknown>(
			configWith(apiKey, credential, base),
			requestOptions,
			{ rateLimitConfig: REVOLT_RATE_LIMIT_CONFIG },
		);
	} catch (error) {
		if (error instanceof ApiError) {
			const { code, reason, description, retryAfter } = errorBody(error.body);
			// The cause holds the request, and with it the token header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RevoltAPIError(
				describeRevoltError(error.status, error.body, error.message),
				{
					status: error.status,
					code,
					reason,
					description,
					retryAfter: error.retryAfter ?? retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RevoltAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RevoltAPIError('Unknown Revolt error', {
			method,
			replayable,
		});
	}
}
