import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The only host. */
export const ROLLBAR_API_BASE = 'https://api.rollbar.com/api/1';

/**
 * Rollbar reports a failure **inside a 200-shaped body**, with `err` as the
 * discriminator:
 *
 * ```json
 * { "err": 1, "message": "access token required" }
 * { "err": 0, "result": { … } }
 * ```
 *
 * `err` is `0` for success and non-zero otherwise, and the HTTP status is not a
 * reliable proxy: the live "access token required" response is a **401** with
 * that body, while a rejected item update is a 200 with `err: 1`. The plugin
 * therefore reads `err` and never treats a 200 as proof of success on its own.
 */
export class RollbarAPIError extends Error {
	readonly status?: number;
	/** The body's `err`, which is non-zero for every failure. */
	readonly err?: number;
	/** Milliseconds until the rate-limit window resets, from Rollbar's headers. */
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
			err?: number;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RollbarAPIError';
		this.status = options.status;
		this.err = options.err;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The token is missing, or lacks a scope for this route. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The item, occurrence, project or deploy does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body or query Rollbar refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}

	/**
	 * The token's rate limit is spent. Rollbar answers this as a 429 and names
	 * the wait in the `X-Rate-Limit-*` headers, which the client reads.
	 */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

/**
 * Reads the `err` discriminator and the message out of a body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function bodyState(body: unknown): {
	err?: number;
	message?: string;
} {
	const record = asRecord(body);
	const err = record?.err;
	const message = record?.message;
	return {
		err: typeof err === 'number' ? err : undefined,
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
	};
}

/**
 * Builds the message for a failure, whether it came from an HTTP error status or
 * from a `200` whose `err` was non-zero.
 * unknown: the body is untyped until `bodyState` narrows it.
 */
export function describeRollbarError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { err, message } = bodyState(body);
	const text = message ?? fallback;
	const label = [status, err !== undefined ? `err ${err}` : undefined]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Rollbar ${label}: ${text}` : text;
}

export type RollbarQuery = Record<
	string,
	string | number | boolean | undefined | (string | number)[]
>;

export type RollbarRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** Path below `/api/1`, starting with a slash. */
	path: string;
	query?: RollbarQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
	/**
	 * The route answers `{ err }` in a 200 body, so the client itself must treat a
	 * non-zero `err` as a failure. Every operation on this API does, so it is
	 * always set.
	 */
	checkErr?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Rollbar sends no `Retry-After`. Every response, the 429 included, carries
 * `X-Rate-Limit-Remaining-Seconds` (seconds left in the window) and
 * `X-Rate-Limit-Reset` (the window's end as a Unix timestamp), so the wait is
 * read from those. The handler owns the retry count.
 */
const ROLLBAR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'x-rate-limit-remaining-seconds',
		resetTime: 'x-rate-limit-reset',
		remaining: 'x-rate-limit-remaining',
		limit: 'x-rate-limit-limit',
	},
};

/** The token rides in its own header, not `Authorization`. */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: ROLLBAR_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Rollbar-Access-Token': apiKey,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRollbarRequest(
	apiKey: string,
	{ method, path, query, body, replayable, checkErr }: RollbarRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	// unknown: the body is provider JSON until the caller's output schema parses
	// it, and the `err` check below reads only that one field.
	let raw: unknown;
	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		raw = await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: ROLLBAR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { err } = bodyState(error.body);
			// The cause holds the request, and with it the token header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RollbarAPIError(
				describeRollbarError(error.status, error.body, error.message),
				{
					status: error.status,
					err,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RollbarAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RollbarAPIError('Unknown Rollbar error', {
			method,
			replayable,
		});
	}

	// A resolved request can still describe a failure, so the body decides. The
	// status is left unset: reporting 200 on a failure would be worse than
	// reporting none, and `err` is the discriminator a caller reads.
	if (checkErr) {
		const { err } = bodyState(raw);
		if (err !== undefined && err !== 0) {
			throw new RollbarAPIError(
				describeRollbarError(undefined, raw, 'failed'),
				{
					err,
					method,
					replayable,
				},
			);
		}
	}

	return raw;
}
