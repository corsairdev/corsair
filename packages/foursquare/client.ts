import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The Places API moved off `api.foursquare.com`. The v3 paths there answer 401
 * with `Invalid request token` for every request, while the docs' own OpenAPI
 * spec lists `https://places-api.foursquare.com`, which is what this client
 * uses. `api.foursquare.com/v2` is the separate, legacy API and is not wrapped.
 */
export const FOURSQUARE_API_BASE = 'https://places-api.foursquare.com';

/**
 * Required on every request. Without it the API answers
 * `400 {"message":"Please provide a valid version."}` **even with a valid key**,
 * which reads like an auth failure. Verified live. The docs pin the current
 * value; their OpenAPI spec reports the same date as `info.version` (`20250617`).
 */
export const FOURSQUARE_API_VERSION = '2025-06-17';

/**
 * Foursquare answers errors as `{ message }` with a real HTTP status:
 *
 * - `400` a bad parameter, or a missing version header
 * - `401` `Invalid request token`
 * - `403` the requested information is restricted
 * - `404` the endpoint or place does not exist
 * - `409` the request cannot be completed as-is
 * - `500` retry later
 */
export class FoursquareAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Foursquare sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
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
		this.name = 'FoursquareAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** `400 Please provide a valid version.` is the missing-version case. */
	get isVersionError(): boolean {
		return this.status === 400 && /provide a valid version/i.test(this.message);
	}

	/**
	 * A 429 is normally a throughput limit, but Foursquare also answers 429 when
	 * the account is out of API credits, and retrying that can never succeed.
	 * Verified live: the body names the billing page and says the free tier is
	 * exhausted.
	 */
	get isCreditExhausted(): boolean {
		return (
			this.status === 429 &&
			/no api credits|add credits|freePro/i.test(this.message)
		);
	}
}

/**
 * Reads the error message out of a body. Verified live: most errors answer
 * `{ message }`, but a 500 can answer `{ errors: ["internal server error"] }`
 * instead, so both are read before falling back.
 * unknown: the body is untyped until the guards here narrow it.
 */
export function describeFoursquareError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	let message: string | undefined;
	if (typeof record?.message === 'string' && record.message.length > 0) {
		message = record.message;
	} else if (Array.isArray(record?.errors)) {
		const first = record.errors.find(
			(value): value is string => typeof value === 'string',
		);
		message = first;
	}
	const detail = message ?? fallback;
	return status === undefined ? detail : `Foursquare ${status}: ${detail}`;
}

export type FoursquareRequest = {
	method: 'GET';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. Foursquare documents 50 QPS (100 enterprise), which a
// burst can trip; leaving `headerNames` out would throw on the first 429.
const FOURSQUARE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: FOURSQUARE_API_BASE,
		VERSION: FOURSQUARE_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// A Service Key, sent as a Bearer token.
			Authorization: `Bearer ${apiKey}`,
			// Mandatory; see the constant above.
			'X-Places-Api-Version': FOURSQUARE_API_VERSION,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeFoursquareRequest(
	apiKey: string,
	{ method, path, query }: FoursquareRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
	};

	try {
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: FOURSQUARE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof FoursquareAPIError) throw error;
		if (error instanceof ApiError) {
			throw new FoursquareAPIError(
				describeFoursquareError(error.status, error.body, error.message),
				{
					cause: error,
					status: error.status,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new FoursquareAPIError(error.message, { cause: error, method });
		}
		throw new FoursquareAPIError('Unknown Foursquare error', { method });
	}
}
