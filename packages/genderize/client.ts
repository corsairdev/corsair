import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GENDERIZE_API_BASE = 'https://api.genderize.io';

/**
 * Genderize answers one question — the likely gender behind a name — and has a
 * single endpoint. A query is a `GET` with `name`, or repeated `name[]`
 * parameters for a batch, and the key travels as `apikey` in the query string.
 *
 * A live probe without a key still answers, so `apiKey` is optional: Genderize
 * serves an IP-scoped allowance before it asks for an account.
 * Reference: https://genderize.io/documentation/api
 */
export type GenderizeCredentials = {
	/** The account's `apikey`. Absent means the IP-scoped allowance is used. */
	apiKey?: string;
};

/**
 * A name that is not in the data set answers 200 with `gender: null`,
 * `probability: 0` and `count: 0`. That is a result, not a failure, and the
 * schemas say so, so nothing here treats it as an error.
 */
export class GenderizeAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from `Retry-After`, when Genderize sent one. */
	readonly retryAfter?: number;
	/** Genderize's own `error` string, such as `Invalid API key`. */
	readonly reason?: string;
	/** Requests left in the current window, from `X-Rate-Limit-Remaining`. */
	readonly remaining?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			reason?: string;
			remaining?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GenderizeAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.reason = options.reason;
		this.remaining = options.remaining;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/**
	 * 429 covers both the monthly quota and the short-term throttle, which the
	 * docs list as `Request limit reached` and `Request too low to process`.
	 */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** The key was not recognized. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The subscription behind the key is paused, expired or unpaid. */
	get isSubscriptionError(): boolean {
		return this.status === 402;
	}

	/** The name was missing, empty or malformed. */
	get isValidationError(): boolean {
		return this.status === 422;
	}
}

/** The `error` string Genderize sent, or a readable fallback. */
// unknown: an error body is untyped: Genderize's `{ error }`, or text from a
// proxy that never reached the API.
export function describeGenderizeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const reason = record?.error;
	const text =
		typeof reason === 'string' && reason.length > 0 ? reason : fallback;
	return status ? `Genderize ${status}: ${text}` : text;
}

export type GenderizeQueryValue = string | number | boolean;

export type GenderizeRequest = {
	path: string;
	/** Repeated `name[]` entries travel as an array, which the client expands. */
	query: Record<string, GenderizeQueryValue | string[] | undefined>;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGenderizeRequest(
	credentials: GenderizeCredentials,
	{ path, query }: GenderizeRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GENDERIZE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 20_000,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: {
			...query,
			// Genderize takes the key in the query string, and omitting it is valid:
			// the API then serves its IP-scoped allowance.
			apikey: credentials.apiKey,
		},
	};

	try {
		const result = await request<unknown>(config, requestOptions, {
			rateLimitConfig: GENDERIZE_RATE_LIMIT_CONFIG,
		});
		return result;
	} catch (error) {
		if (error instanceof ApiError) {
			const reason = asRecord(error.body)?.error;
			throw new GenderizeAPIError(
				describeGenderizeError(error.status, error.body, error.message),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					reason: typeof reason === 'string' ? reason : undefined,
					remaining: error.rateLimitRemaining,
					method: 'GET',
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GenderizeAPIError(error.message, {
				cause: error,
				method: 'GET',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GenderizeAPIError('Unknown Genderize error', {
			method: 'GET',
			transport: true,
		});
	}
}

/**
 * Genderize throttles a batch to the plan's window, and answers 429 with
 * `Request too low to process` when the batch is larger than what is left.
 * Neither case is worth an automatic retry with the same body, so the config
 * only records the status; the handlers decide.
 */
export const GENDERIZE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		// Genderize sends `X-Rate-Limit-Remaining` on every response, errors
		// included, so a 429 carries what is left of the window.
		remaining: 'x-rate-limit-remaining',
	},
};

/** Drops keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GenderizeQueryValue | string[] | undefined>,
): Record<string, GenderizeQueryValue | string[]> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GenderizeQueryValue | string[]] =>
				entry[1] !== undefined,
		),
	);
}
