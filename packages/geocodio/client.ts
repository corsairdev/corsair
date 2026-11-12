import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Geoapify reports version `v2.1` as current and warns on older ones, so this
 * plugin targets it. Two hosts serve it: the self-serve one below, and an
 * enterprise host for accounts that have one.
 */
export const GEOCODIO_BASE = 'https://api.geocod.io/v2.1';
export const GEOCODIO_ENTERPRISE_BASE = 'https://api.enterprise.geocod.io/v2.1';

/**
 * The key travels as the `api_key` query parameter, or as a bearer token in the
 * `Authorization` header. The plugin uses the query parameter, which is the
 * documented default and works on every plan.
 */
export type GeocodioCredentials = {
	apiKey?: string;
};

/**
 * An error answers one small envelope:
 *
 * ```json
 * {
 *   "error": "Invalid API key",
 *   "reference": "https://www.geocod.io/geocodio-403-forbidden-error/"
 * }
 * ```
 *
 * A live probe with a bad key answered exactly that with HTTP 403, and no
 * `_warnings` array, because the key never reached a version check.
 */
// unknown: the body is an untyped envelope until asRecord narrows it.
export function readError(body: unknown): {
	error?: string;
	reference?: string;
	warnings?: string[];
} {
	const record = asRecord(body);
	const error = record?.error;
	const reference = record?.reference;
	const rawWarnings = record?._warnings;
	return {
		error: typeof error === 'string' && error.length > 0 ? error : undefined,
		reference:
			typeof reference === 'string' && reference.length > 0
				? reference
				: undefined,
		warnings: Array.isArray(rawWarnings)
			? rawWarnings.filter(
					(entry): entry is string => typeof entry === 'string',
				)
			: undefined,
	};
}

export class GeocodioAPIError extends Error {
	readonly status?: number;
	/** Geoapify's own message, such as `Invalid API key`. */
	readonly reason?: string;
	/** A documentation link for this class of error. */
	readonly reference?: string;
	/**
	 * Non-fatal warnings. An older API version answers one here rather than
	 * failing, so they are kept and surfaced.
	 */
	readonly warnings?: string[];
	/** Milliseconds from `Retry-After`, when Geocodio sent one. */
	readonly retryAfter?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			reason?: string;
			reference?: string;
			warnings?: string[];
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GeocodioAPIError';
		this.status = options.status;
		this.reason = options.reason;
		this.reference = options.reference;
		this.warnings = options.warnings;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/**
	 * 429 is the documented rate limit. Geocodio bills per lookup rather than
	 * per request, so a batch that is too large is a 422 instead.
	 */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A missing or invalid key, which answers 403 rather than 401. */
	get isAuthError(): boolean {
		return this.status === 403;
	}

	/** A query the API refused, such as an address it could not parse. */
	get isValidationError(): boolean {
		return this.status === 422 || this.status === 400;
	}

	/** The list or job does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

/** Geoapify's message, with the status in front. */
// unknown: an error body is untyped: the `{ error, reference }` envelope, or
// text from a proxy that never reached Geocodio.
export function describeGeocodioError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readError(body);
	const text = fields.error ?? fallback;
	return status ? `Geocodio ${status}: ${text}` : text;
}

export type GeocodioQueryValue = string | number | boolean;

export type GeocodioRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	/**
	 * Repeated parameters travel as an array, which the query builder expands
	 * into one `key=value` per entry. Geocodio spells a repeated key with a
	 * trailing `[]`, such as `destinations[]`.
	 */
	query?: Record<string, GeocodioQueryValue | GeocodioQueryValue[] | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// each route has its own shape.
	body?: unknown;
};

/**
 * Geocodio's limit is per plan, and a burst answers 429. The client does not
 * retry on its own because the handlers decide, and because a lookup is billed.
 */
const GEOCODIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGeocodioRequest(
	credentials: GeocodioCredentials,
	enterprise: boolean,
	{ method, path, query, body }: GeocodioRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: enterprise ? GEOCODIO_ENTERPRISE_BASE : GEOCODIO_BASE,
		VERSION: '2.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 60_000,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, api_key: credentials.apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GEOCODIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = readError(error.body);
			throw new GeocodioAPIError(
				describeGeocodioError(error.status, error.body, error.message),
				{
					status: error.status,
					reason: fields.error,
					reference: fields.reference,
					warnings: fields.warnings,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GeocodioAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GeocodioAPIError('Unknown Geocodio error', {
			method,
			transport: true,
		});
	}
}

/** Drops keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GeocodioQueryValue | GeocodioQueryValue[] | undefined>,
): Record<string, GeocodioQueryValue | GeocodioQueryValue[]> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GeocodioQueryValue | GeocodioQueryValue[]] =>
				entry[1] !== undefined,
		),
	);
}
