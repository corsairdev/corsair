import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GENDER_API_BASE = 'https://gender-api.com';

/**
 * Gender API answers with HTTP 200 even when it refuses, carrying its own
 * `errno` in the body:
 *
 * ```json
 * {"name":"alice","errno":40,"errmsg":"invalid or missing key","gender":"unknown"}
 * ```
 *
 * A live probe with a bad key answered exactly that with status 200, so the
 * status alone cannot be trusted. The client throws whenever `errno` is present
 * and non-zero, whatever the status was.
 *
 * The key travels as the `key` query parameter.
 * Reference: https://gender-api.com/en/api-docs
 */
export type GenderApiCredentials = {
	/** The server key from the account. */
	apiKey?: string;
};

/** The error codes Gender API documents. */
export const GENDER_API_ERRNO = {
	/** The country code is not a known one. */
	INVALID_COUNTRY: 10,
	/** The count of country codes does not match the count of names. */
	COUNTRY_COUNT_MISMATCH: 11,
	/** No name reached the server. */
	NAME_NOT_SET: 20,
	/** More than 100 names in one request. */
	TOO_MANY_NAMES: 21,
	/** The query limit is used up. */
	LIMIT_REACHED: 30,
	/** The server key was not found. */
	INVALID_KEY: 40,
	/** An internal error on their side. */
	UNKNOWN_ERROR: 500,
} as const;

/** The code and message Gender API put in a body. */
// unknown: the body is an untyped envelope until asRecord narrows it.
export function readErrno(body: unknown): {
	errno?: number;
	errmsg?: string;
	upgradeUrl?: string;
} {
	const record = asRecord(body);
	const errno = record?.errno;
	const errmsg = record?.errmsg;
	const upgradeUrl = record?.upgrade_url;
	return {
		errno: typeof errno === 'number' ? errno : undefined,
		errmsg:
			typeof errmsg === 'string' && errmsg.length > 0 ? errmsg : undefined,
		upgradeUrl:
			typeof upgradeUrl === 'string' && upgradeUrl.length > 0
				? upgradeUrl
				: undefined,
	};
}

export class GenderApiAPIError extends Error {
	readonly status?: number;
	/** Gender API's own `errno`, such as 40 for a refused key. */
	readonly errno?: number;
	/** True when the body reported the failure even though the status was 2xx. */
	readonly bodyError: boolean;
	/** The pricing page Gender API links for a limit that ran out. */
	readonly upgradeUrl?: string;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			errno?: number;
			bodyError?: boolean;
			upgradeUrl?: string;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GenderApiAPIError';
		this.status = options.status;
		this.errno = options.errno;
		this.bodyError = options.bodyError ?? false;
		this.upgradeUrl = options.upgradeUrl;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/** The server key was not found, or none was sent. */
	get isAuthError(): boolean {
		return this.errno === GENDER_API_ERRNO.INVALID_KEY;
	}

	/** The query limit is used up. It resets rather than being retried. */
	get isLimitReached(): boolean {
		return this.errno === GENDER_API_ERRNO.LIMIT_REACHED;
	}

	/** A country code, or the count of them, that does not match. */
	get isValidationError(): boolean {
		return (
			this.errno === GENDER_API_ERRNO.INVALID_COUNTRY ||
			this.errno === GENDER_API_ERRNO.COUNTRY_COUNT_MISMATCH ||
			this.errno === GENDER_API_ERRNO.NAME_NOT_SET ||
			this.errno === GENDER_API_ERRNO.TOO_MANY_NAMES
		);
	}

	/** Gender API's own internal failure. */
	get isServerError(): boolean {
		return this.errno === GENDER_API_ERRNO.UNKNOWN_ERROR;
	}
}

/** The message Gender API sent, with the status and errno in front. */
// unknown: an error body is untyped: the `{ errno, errmsg }` envelope, or text
// from a proxy that never reached Gender API.
export function describeGenderApiError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readErrno(body);
	const text = fields.errmsg ?? fallback;
	const label = [status, fields.errno]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Gender API ${label}: ${text}` : text;
}

export type GenderApiQueryValue = string | number | boolean;

export type GenderApiRequest = {
	path: string;
	query?: Record<string, GenderApiQueryValue | undefined>;
};

/**
 * Gender API does not publish its rate limit, but running out answers
 * `errno: 30` inside a 200 rather than a 429. The config therefore records a
 * 429 only if a proxy adds one; the handlers read `errno` for the real case.
 */
export const GENDER_API_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGenderApiRequest(
	credentials: GenderApiCredentials,
	{ path, query }: GenderApiRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GENDER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 30_000,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: {
			...query,
			key: credentials.apiKey,
		},
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: GENDER_API_RATE_LIMIT_CONFIG,
		});
		// A 200 that carries a non-zero `errno` is a failure, and the body is the
		// only place Gender API says so.
		const fields = readErrno(raw);
		if (fields.errno !== undefined && fields.errno !== 0) {
			throw new GenderApiAPIError(
				describeGenderApiError(
					undefined,
					raw,
					'Gender API refused the request',
				),
				{
					errno: fields.errno,
					bodyError: true,
					upgradeUrl: fields.upgradeUrl,
					method: 'GET',
				},
			);
		}
		return raw;
	} catch (error) {
		if (error instanceof GenderApiAPIError) throw error;
		if (error instanceof ApiError) {
			const fields = readErrno(error.body);
			throw new GenderApiAPIError(
				describeGenderApiError(error.status, error.body, error.message),
				{
					status: error.status,
					errno: fields.errno,
					upgradeUrl: fields.upgradeUrl,
					method: 'GET',
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GenderApiAPIError(error.message, {
				cause: error,
				method: 'GET',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GenderApiAPIError('Unknown Gender API error', {
			method: 'GET',
			transport: true,
		});
	}
}

/** Drops keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GenderApiQueryValue | undefined>,
): Record<string, GenderApiQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GenderApiQueryValue] => entry[1] !== undefined,
		),
	);
}
