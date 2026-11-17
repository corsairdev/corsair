import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TOMTOM_API_BASE = 'https://api.tomtom.com';

// Core retries a 429 three times, honouring Retry-After (R8). `resetTime` is
// left out: a daily-quota reset header would turn into a day-long wait.
const TOMTOM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A request that never reached TomTom (DNS, reset, timeout). HTTP failures are
 * not wrapped: core's `ApiError` passes through unchanged, so its `status`,
 * `retryAfter` and `body` (TomTom's `detailedError` envelope) reach core and
 * the caller. The key travels as the `key` query parameter, which ApiError
 * redacts.
 */
export class TomTomAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TomTomAPIError';
		this.method = options.method;
	}
}

/** TomTom's own error code from an ApiError body, e.g. `Unauthorized`. */
// unknown: the error body is untyped until the nested objects are read.
export function tomTomErrorCode(body: unknown): string | undefined {
	return readCode(body);
}

// unknown: the error body is untyped until the nested objects are read.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const detailed = asRecord(record?.detailedError);
	if (typeof detailed?.code === 'string') return detailed.code;
	const error = asRecord(record?.error);
	return typeof error?.code === 'string' ? error.code : undefined;
}

export function describeTomTomError(
	status: number | undefined,
	// unknown: the body is the documented detailedError envelope, or a proxy page.
	body: unknown,
	fallback: string,
): { message: string; code?: string } {
	const record = asRecord(body);
	const detailed = asRecord(record?.detailedError);
	const error = asRecord(record?.error);
	const text =
		(typeof detailed?.message === 'string' && detailed.message) ||
		(typeof error?.description === 'string' && error.description) ||
		(typeof record?.message === 'string' && record.message) ||
		fallback;
	const code =
		(typeof detailed?.code === 'string' && detailed.code) ||
		(typeof error?.code === 'string' && error.code) ||
		undefined;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return { message: label ? `TomTom ${label}: ${text}` : text, code };
}

export type TomTomQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type TomTomRequest = {
	method: 'GET';
	path: string;
	query?: TomTomQuery;
};

const REDACTED = '[REDACTED]';

/**
 * Query parameters that hold exact coordinates: a bounding box, a flow point,
 * and the search bias position.
 */
const LOCATION_QUERY = new Set(['bbox', 'point', 'lat', 'lon']);

/**
 * Path segments that hold a search text, an address or coordinates: the search
 * query, the geocoded address, the reverse-geocoded point and the route's
 * waypoints. Each is replaced by a marker, so the route stays readable.
 */
const LOCATION_PATHS: [RegExp, string][] = [
	// Greedy up to the last `.json` before the query, so a search text that
	// itself contains `.json` is masked whole.
	[
		/(search\/2\/(?:search|geocode|reverseGeocode)\/)[^/?#]+(\.json)(?=$|[?#])/,
		`$1${REDACTED}$2`,
	],
	[/(routing\/1\/calculateRoute\/)[^/?#]+(\/json)/, `$1${REDACTED}$2`],
];

function maskLocation(value: string): string {
	let masked = value;
	for (const [pattern, replacement] of LOCATION_PATHS) {
		masked = masked.replace(pattern, replacement);
	}
	const at = masked.indexOf('?');
	if (at === -1) return masked;
	const params = masked
		.slice(at + 1)
		.split('&')
		.map((pair) => {
			const name = pair.split('=')[0] ?? '';
			return LOCATION_QUERY.has(name) ? `${name}=${REDACTED}` : pair;
		});
	return `${masked.slice(0, at)}?${params.join('&')}`;
}

/**
 * R8 keeps exact coordinates and customer data out of errors, and core's
 * ApiError redacts only credential names, so a TomTom error would keep the
 * address, coordinates or bounding box from the path and query. When the
 * request carried any, the same ApiError is rebuilt with those masked in both
 * URLs and `request.query`; status, message, response body and rate-limit
 * fields are kept. Otherwise core's error passes through unchanged.
 */
function withoutLocation(error: ApiError): ApiError {
	const url = maskLocation(error.url);
	const requestUrl = maskLocation(error.request.url);
	const query = error.request.query;
	const queryHasLocation = Object.keys(query ?? {}).some((key) =>
		LOCATION_QUERY.has(key),
	);
	if (
		url === error.url &&
		requestUrl === error.request.url &&
		!queryHasLocation
	) {
		return error;
	}
	const maskedQuery = query
		? Object.fromEntries(
				Object.entries(query).map(([key, value]) => [
					key,
					LOCATION_QUERY.has(key) ? REDACTED : value,
				]),
			)
		: undefined;
	return new ApiError(
		{
			...error.request,
			url: requestUrl,
			...(maskedQuery ? { query: maskedQuery } : {}),
		},
		{
			url,
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
}

/**
 * TomTom takes the key as the `key` query parameter, which `ApiError` redacts.
 * Core's error passes through, rebuilt only to mask location data
 * (`withoutLocation`).
 */
export async function makeTomTomRequest(
	apiKey: string,
	{ method, path, query }: TomTomRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TOMTOM_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, key: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TOMTOM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutLocation(error);
		if (error instanceof TomTomAPIError) throw error;
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TomTomAPIError(error.message, { cause: error, method });
		}
		throw new TomTomAPIError('Unknown TomTom error', { method });
	}
}

/** The same deadline core's request() applies, covering the body read too. */
const TILE_TIMEOUT_MS = 20_000;
/** Core's retry budget for a 429, which the tile route has to apply itself. */
const TILE_MAX_RETRIES = 3;

function retryAfterMs(response: Response): number | undefined {
	const seconds = Number(response.headers.get('Retry-After'));
	return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;
}

/**
 * Raster tiles are PNG bytes, which core's `request()` would decode as text and
 * corrupt, so the tile route is fetched here and returned as base64. It applies
 * what `request()` would: a 20 s deadline over the request and the body, and up
 * to three retries of a 429 that honour Retry-After (1, 2, 4 s otherwise). A
 * failure still throws core's `ApiError` (the key redacted by its URL
 * handling), so the same handlers apply.
 */
export async function fetchTomTomTile(
	apiKey: string,
	path: string,
): Promise<{ content_type: string; base64: string }> {
	const url = new URL(path, `${TOMTOM_API_BASE}/`);
	url.searchParams.set('key', apiKey);
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: { key: apiKey },
	};
	for (let attempt = 0; ; attempt += 1) {
		const signal = AbortSignal.timeout(TILE_TIMEOUT_MS);
		let response: Response;
		let bytes: Buffer | undefined;
		let errorText = '';
		try {
			response = await fetch(url, { headers: { Accept: 'image/png' }, signal });
			if (response.ok) {
				bytes = Buffer.from(await response.arrayBuffer());
			} else {
				errorText = await response.text();
			}
		} catch (error) {
			throw new TomTomAPIError(
				error instanceof Error ? error.message : 'TomTom tile request failed',
				{ cause: error instanceof Error ? error : undefined, method: 'GET' },
			);
		}
		if (bytes) {
			return {
				content_type: response.headers.get('Content-Type') ?? 'image/png',
				base64: bytes.toString('base64'),
			};
		}
		const retryAfter = retryAfterMs(response);
		if (response.status === 429 && attempt < TILE_MAX_RETRIES) {
			await new Promise((resolve) =>
				setTimeout(
					resolve,
					// An explicit Retry-After is honoured as sent, like core does;
					// only the computed fallback is capped.
					retryAfter ?? Math.min(1000 * 2 ** attempt, 60_000),
				),
			);
			continue;
		}
		let body: unknown = errorText; // unknown: JSON error envelope or plain text
		if ((response.headers.get('Content-Type') ?? '').includes('json')) {
			try {
				body = JSON.parse(errorText);
			} catch {
				body = errorText;
			}
		}
		throw new ApiError(
			requestOptions,
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body,
			},
			describeTomTomError(response.status, body, response.statusText).message,
			{ retryAfter },
		);
	}
}

/** Joins two coordinates as `lat,lon`, which every TomTom path parameter takes. */
export function point(latitude: number, longitude: number): string {
	return `${latitude},${longitude}`;
}
