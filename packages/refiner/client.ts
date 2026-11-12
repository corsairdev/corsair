import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const REFINER_API_BASE = 'https://api.refiner.io/v1';

/**
 * A Refiner failure is a single `error` string, and some carry a `code` that
 * repeats the status:
 *
 * ```json
 * {"error":"No API key found in headers"}
 * {"error":"Resource or route not found.","code":404}
 * {"error":"You are doing this too often. Please slow down.","code":429}
 * ```
 *
 * The first was captured live with a bearer token and also with none at all: the
 * API answers "No API key found in headers" for both, so a wrong key and a missing
 * one are indistinguishable from the message alone.
 */
export class RefinerAPIError extends Error {
	readonly status?: number;
	/** The body's `code`, which repeats the HTTP status when present. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, which Refiner sends on a 429. */
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
		this.name = 'RefinerAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The key is missing or wrong. Refiner answers both with the same 401 and the
	 * same message, so there is no way to tell them apart.
	 */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The key is valid but the plan or role does not cover this resource. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** The contact, response, form or segment does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A body Refiner refused, or the method is wrong for the route. `405` is
	 * included because a caller that sent `PATCH` to a `POST` route can fix it.
	 */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 405 || this.status === 422;
	}

	/**
	 * `409` on `identify-user`: another identify request for the same user is
	 * still in progress. Refiner documents this as a conflict, and it clears on
	 * its own, so it is the one failure worth retrying here.
	 */
	get isConflict(): boolean {
		return this.status === 409;
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): { message?: string; code?: number } {
	const record = asRecord(body);
	const error = record?.error;
	const message = record?.message;
	const code = record?.code;
	return {
		message:
			typeof error === 'string' && error.length > 0
				? error
				: typeof message === 'string' && message.length > 0
					? message
					: undefined,
		code: typeof code === 'number' ? code : undefined,
	};
}

/**
 * Builds the message for an error body, keeping Refiner's wording because it is
 * specific ("Another request for the same user is already in progress.").
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRefinerError(
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
	return label ? `Refiner ${label}: ${text}` : text;
}

/**
 * A query value. Refiner reads bracketed keys for its filter objects, so those
 * are built as flat strings rather than nested objects.
 */
export type RefinerQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RefinerRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	/** Path below `/v1`, starting with a slash. */
	path: string;
	query?: RefinerQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Three limits apply at once: 4,000 requests a minute and 1,000 per 15 seconds
 * per API key, plus 100 a minute per user ID. A 429 carries `Retry-After` and
 * `X-RateLimit-*` headers, which the plugin reads.
 */
const REFINER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

/**
 * The key goes in `Authorization: Bearer`, the method Refiner recommends. It also
 * accepts `api_key=…` as a query or body parameter and HTTP Basic with the key as
 * the username, but neither is used: a credential in a URL is logged by every
 * proxy on the way.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: REFINER_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRefinerRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RefinerRequest,
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
			rateLimitConfig: REFINER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RefinerAPIError(
				describeRefinerError(error.status, error.body, error.message),
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
			throw new RefinerAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RefinerAPIError('Unknown Refiner error', { method, replayable });
	}
}

/**
 * Builds the bracketed keys Refiner reads for its filter objects, such as
 * `response_data[nps]=9`. A nested object would reach the API as
 * `response_data[nps]` only if `corsair/http` happened to flatten it the same
 * way, so the keys are built here explicitly.
 */
export function bracketQuery(
	prefix: string,
	values: Record<string, string | number | boolean> | undefined,
): RefinerQuery {
	if (!values) return {};
	const query: RefinerQuery = {};
	for (const [key, value] of Object.entries(values)) {
		query[`${prefix}[${key}]`] = value;
	}
	return query;
}

/**
 * Builds the indexed keys Refiner reads for a list filter, such as
 * `form_uuids[0]=a&form_uuids[1]=b`. Refiner answers a plain or comma-joined
 * value with 400 "The form uuids value must be an object.", and `corsair/http`
 * would repeat a bare key for an array, so the keys are built here.
 */
export function listQuery(
	name: string,
	values: string[] | undefined,
): RefinerQuery {
	const query: RefinerQuery = {};
	values?.forEach((value, index) => {
		query[`${name}[${index}]`] = value;
	});
	return query;
}

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
