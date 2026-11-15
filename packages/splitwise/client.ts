import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SPLITWISE_API_BASE = 'https://secure.splitwise.com/api/v3.0';

// error-handlers.ts owns retries. The config has to be complete: request.ts
// replaces its defaults with whatever object it is handed, so a partial one
// either skips the rate-limit block or throws reading `headerNames`.
const SPLITWISE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** The single message a 401 carries; Splitwise sends `{ error }` there. */
const NOT_LOGGED_IN = 'Invalid API Request: you are not logged in';

type LooseRecord = Record<string, unknown>; // unknown: provider bodies have no fixed shape.

/** Reads one string field out of a provider body, ignoring every other type. */
function readString(
	record: LooseRecord | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Splitwise answers errors in two shapes:
 *
 * - 401: `{ error: 'Invalid API Request: you are not logged in' }`
 * - 403 and 404: `{ errors: { base: ['Invalid API Request: ...'] } }`
 *
 * Some writes answer 200 with a body that still says it failed, so the
 * endpoints parse `success` and `errors` themselves and throw
 * `SplitwiseOperationError` when the write did not apply.
 */
export class SplitwiseAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Splitwise sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SplitwiseAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

/**
 * A 200 whose body says the operation did not apply. Splitwise documents this
 * for delete, undelete, add_user_to_group and remove_user_from_group: the
 * status code carries no information, only `success` and `errors` do.
 */
export class SplitwiseOperationError extends Error {
	/** The provider's own messages, keyed by the field they belong to. */
	readonly errors: Record<string, string[]>;

	constructor(message: string, errors: Record<string, string[]> = {}) {
		super(message);
		this.name = 'SplitwiseOperationError';
		this.errors = errors;
	}
}

export function describeSplitwiseError(
	status: number | undefined,
	body: unknown, // unknown: the provider or a proxy decides the error body shape.
	fallback: string,
): string {
	const record = asRecord(body);
	const nested = asRecord(record?.errors);
	const base = nested?.base;
	const firstBase = Array.isArray(base)
		? base.find((entry) => typeof entry === 'string')
		: undefined;
	const text =
		readString(record, 'error') ??
		(typeof firstBase === 'string' ? firstBase : undefined) ??
		readString(record, 'message') ??
		fallback;
	return status === undefined ? text : `Splitwise ${status}: ${text}`;
}

export type SplitwiseQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SplitwiseRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: SplitwiseQuery;
	body?: unknown; // unknown: the input schema validated it; each route's body differs.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeSplitwiseRequest(
	apiKey: string,
	{ method, path, query, body }: SplitwiseRequest,
): Promise<unknown> {
	// unknown: the operation's own output schema types the answer.
	const config: OpenAPIConfig = {
		BASE: SPLITWISE_API_BASE,
		VERSION: '3.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : 'application/json; charset=utf-8',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			// unknown: see above.
			rateLimitConfig: SPLITWISE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Re-throw the plugin's own errors untouched: the generic Error branch
		// below would wrap them and drop `errors` and the provider message.
		if (error instanceof SplitwiseAPIError) throw error;
		if (error instanceof ApiError) {
			throw new SplitwiseAPIError(
				describeSplitwiseError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SplitwiseAPIError(error.message, { cause: error, method });
		}
		throw new SplitwiseAPIError('Unknown Splitwise error', { method });
	}
}

/** True when the message is Splitwise's "you are not logged in" 401 reply. */
export function isNotLoggedIn(error: unknown): boolean {
	// unknown: callers pass what they caught.
	return (
		error instanceof SplitwiseAPIError &&
		error.status === 401 &&
		error.message.includes(NOT_LOGGED_IN)
	);
}
