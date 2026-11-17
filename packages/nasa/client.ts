import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * NASA serves these APIs from five hosts. Only api.nasa.gov (and the APOD feed
 * on science.nasa.gov) accepts an API key; EONET, EPIC and the Image Library
 * answer without one.
 */
export const NASA_HOSTS = {
	api: 'https://api.nasa.gov',
	apod: 'https://science.nasa.gov',
	eonet: 'https://eonet.gsfc.nasa.gov',
	epic: 'https://epic.gsfc.nasa.gov',
	images: 'https://images-api.nasa.gov',
} as const;

export type NasaHost = keyof typeof NASA_HOSTS;

/** Hosts that read the `api_key` query parameter. */
const KEYED_HOSTS: ReadonlySet<NasaHost> = new Set<NasaHost>(['api', 'apod']);

// Core's request() retries a 429 three times with backoff, so the 429 handler
// in error-handlers.ts does not retry again. NASA sends no Retry-After header;
// the header name stays in case a gateway in front of it does.
const NASA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 3,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: every host answers with its own error shape, so the body is read
// field by field until one of the known envelopes matches.
function readString(
	record: Record<string, unknown> | null | undefined, // unknown: open error body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * The machine-readable code from a failed request, or undefined when the error
 * is not core's ApiError or the body has none. NASA's hosts answer:
 *
 * - api.nasa.gov: `{ error: { code, message } }`, 403 `API_KEY_INVALID` or
 *   `API_KEY_MISSING` for a key problem and 429 `OVER_RATE_LIMIT` for the
 *   hourly (or, for DEMO_KEY, daily) limit.
 * - science.nasa.gov (WordPress): `{ code, message, data: { status } }`.
 * - images-api.nasa.gov: `{ reason }`, no code.
 * - eonet.gsfc.nasa.gov and epic.gsfc.nasa.gov: an HTML 500 page.
 */
export function nasaErrorCode(
	error: unknown, // unknown: any thrown value; only core's ApiError has a body
): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const record = asRecord(error.body);
	return (
		readString(asRecord(record?.error), 'code') ?? readString(record, 'code')
	);
}

/**
 * Query parameters that carry the caller's own data and must not travel with an
 * error into logs. `bbox` is a set of exact coordinates (plugin rules R8);
 * core's ApiError already redacts `api_key`.
 */
const PRIVATE_QUERY_PARAMS = ['bbox'] as const;

function redactQueryParams(url: string): string {
	try {
		const parsed = new URL(url);
		let changed = false;
		for (const name of PRIVATE_QUERY_PARAMS) {
			if (parsed.searchParams.has(name)) {
				parsed.searchParams.set(name, '[REDACTED]');
				changed = true;
			}
		}
		return changed ? parsed.toString() : url;
	} catch {
		return url;
	}
}

/**
 * Rebuilds core's ApiError without the private query values it echoes in `url`
 * and `request`. Status, retryAfter and the provider's body stay as they were,
 * so the error handlers and core's retry logic see the same error.
 */
function withoutPrivateQuery(error: ApiError): ApiError {
	const query = error.request.query;
	const hasPrivate =
		query !== undefined &&
		PRIVATE_QUERY_PARAMS.some((name) => query[name] !== undefined);
	if (!hasPrivate) return error;
	const redactedQuery = { ...query };
	for (const name of PRIVATE_QUERY_PARAMS) {
		if (redactedQuery[name] !== undefined) redactedQuery[name] = '[REDACTED]';
	}
	const stripped = new ApiError(
		{
			...error.request,
			url: redactQueryParams(error.request.url),
			query: redactedQuery,
		},
		{
			url: redactQueryParams(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	stripped.stack = error.stack;
	return stripped;
}

export type NasaQuery = Record<string, string | number | boolean | undefined>;

export type NasaRequest = {
	method: 'GET';
	host: NasaHost;
	path: string;
	query?: NasaQuery;
};

// unknown: callers parse the body with the endpoint's zod output schema; the
// transport returns whatever the host sent.
export async function makeNasaRequest(
	apiKey: string,
	{ method, host, path, query }: NasaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NASA_HOSTS[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: KEYED_HOSTS.has(host) ? { ...query, api_key: apiKey } : query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			// unknown: see above
			rateLimitConfig: NASA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through as an ApiError (plugin rules R8), only
		// without the coordinates a bbox search echoes.
		if (error instanceof ApiError) throw withoutPrivateQuery(error);
		throw error;
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
