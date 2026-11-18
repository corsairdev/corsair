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
 * Revolt answers a failure in one of two bodies (live, 11-12):
 *
 * - Its own handlers name the error `type`, the source `location`, and
 *   sometimes a field saying what was missing or exceeded:
 *   `{ "type": "MissingPermission", "permission": "ManageChannel", "location": "…" }`.
 * - Rocket's catcher, which answers a missing or bad token (401) or a body it
 *   cannot parse (422), uses an envelope whose code repeats the status:
 *   `{ "error": { "code": 401, "reason": "Unauthorized",
 *                 "description": "The request requires user authentication." } }`.
 *
 * A 429 carries only `{ "retry_after": 9825 }`, in **milliseconds**.
 */
export class RevoltAPIError extends Error {
	readonly status?: number;
	/** The body's `type` (`NotFound`, `MissingPermission`) or the envelope's `reason`. */
	readonly reason?: string;
	/** The envelope's sentence, or the body's extra fields (`permission: ManageChannel`). */
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
		this.reason = options.reason;
		this.description = options.description;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The token is missing, malformed, or lacks the permission. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The message, channel, server or user does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body or path Revolt refused, such as `EmptyMessage` (422). */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 413 || this.status === 422;
	}
}

/** Body fields that are not worth repeating in the message. */
const SKIPPED_ERROR_FIELDS = new Set(['type', 'location', 'retry_after']);

/**
 * Reads the error out of either body, and a 429's `retry_after`.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function errorBody(body: unknown): {
	reason?: string;
	description?: string;
	retryAfter?: number;
} {
	const record = asRecord(body);
	const retry = record?.retry_after;
	const retryAfter = typeof retry === 'number' ? retry : undefined;

	// Rocket's catcher envelope: `reason` is the category, `description` the
	// sentence.
	const envelope = asRecord(record?.error);
	if (envelope) {
		const { reason, description } = envelope;
		return {
			reason: typeof reason === 'string' ? reason : undefined,
			description:
				typeof description === 'string' && description.length > 0
					? description
					: undefined,
			retryAfter,
		};
	}

	// Revolt's own `{ type, location, ... }` body.
	const type = record?.type;
	const details = Object.entries(record ?? {})
		.filter(
			([key, value]) =>
				!SKIPPED_ERROR_FIELDS.has(key) &&
				(typeof value === 'string' || typeof value === 'number'),
		)
		.map(([key, value]) => `${key}: ${String(value)}`);
	return {
		reason: typeof type === 'string' ? type : undefined,
		description: details.length > 0 ? details.join(', ') : undefined,
		retryAfter,
	};
}

/**
 * Builds the message for an error body, such as
 * `Revolt 401: The request requires user authentication.` or
 * `Revolt 403: MissingPermission (permission: ManageChannel)`.
 * unknown: the body is untyped until `errorBody` narrows it.
 */
export function describeRevoltError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const { reason, description } = errorBody(body);
	let text = fallback;
	if (record?.error !== undefined) {
		// The envelope's description is the sentence; `reason` alone is terse.
		text = description ?? reason ?? fallback;
	} else if (reason) {
		text = description ? `${reason} (${description})` : reason;
	}
	return status !== undefined ? `Revolt ${status}: ${text}` : text;
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
 * `retry_after` in the body, in milliseconds, and no `Retry-After` header, so
 * the handler reads the body.
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
			const { reason, description, retryAfter } = errorBody(error.body);
			// The cause holds the request, and with it the token header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RevoltAPIError(
				describeRevoltError(error.status, error.body, error.message),
				{
					status: error.status,
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
