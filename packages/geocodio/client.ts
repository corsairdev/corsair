import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Geocodio reports version `v2.1` as current and warns on older ones, so this
 * plugin targets it. Two hosts serve it: the self-serve one below, and an
 * enterprise host for accounts that have one.
 */
export const GEOCODIO_BASE = 'https://api.geocod.io/v2.1';
export const GEOCODIO_ENTERPRISE_BASE = 'https://api.enterprise.geocod.io/v2.1';

/** A single lookup answers in well under a minute. */
const DEFAULT_TIMEOUT_MS = 60_000;
/**
 * Geocodio processes a synchronous batch of up to 10,000 entries in one
 * request, which can run for minutes, so batch POSTs get ten minutes.
 */
export const BATCH_TIMEOUT_MS = 600_000;

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

/**
 * Only for a request that got no answer (DNS, reset, timeout). An HTTP error
 * reaches the handlers as core's `ApiError`, with its status and `retryAfter`.
 */
export class GeocodioAPIError extends Error {
	/** The request method, so the handlers replay only a GET. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GeocodioAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/** Geocodio's message, with the status in front. */
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
	/** Overrides the one-minute timeout, for batches. */
	timeoutMs?: number;
};

/**
 * Geocodio's limit is per plan, and a burst answers 429. A 429 is refused
 * before any lookup runs, so core retries it, honouring `Retry-After`.
 */
const GEOCODIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGeocodioRequest(
	credentials: GeocodioCredentials,
	enterprise: boolean,
	{ method, path, query, body, timeoutMs }: GeocodioRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: enterprise ? GEOCODIO_ENTERPRISE_BASE : GEOCODIO_BASE,
		VERSION: '2.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs ?? DEFAULT_TIMEOUT_MS,
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
			// Core's ApiError goes through (R8), minus the addresses and
			// coordinates that were sent in the query or body. Only the error
			// envelope's fixed fields are kept from the response.
			const fields = readError(error.body);
			const safeBody = {
				error: fields.error,
				reference: fields.reference,
				_warnings: fields.warnings,
			};
			throw new ApiError(
				{ ...error.request, query: undefined, body: undefined },
				{
					url: withoutQuery(error.url),
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: safeBody,
				},
				describeGeocodioError(error.status, safeBody, `HTTP ${error.status}`),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
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

/** The URL without its query string, which carries the address sent. */
function withoutQuery(url: string): string {
	const index = url.indexOf('?');
	return index === -1 ? url : url.slice(0, index);
}

/**
 * Geocodio reads `fields` as one comma-separated parameter. Repeated
 * `fields=a&fields=b` keys keep only the last one.
 */
export function fieldsParam(fields: string[] | undefined): string | undefined {
	return fields && fields.length > 0 ? fields.join(',') : undefined;
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
