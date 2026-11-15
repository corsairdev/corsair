import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MAPBOX_API_BASE = 'https://api.mapbox.com';

// Mapbox's own rate-limit headers, sent on every response:
// x-rate-limit-limit, x-rate-limit-interval (seconds) and x-rate-limit-reset
// (a Unix timestamp in seconds). Retry-After is not documented but is read in
// case a gateway sends it.
const MAPBOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// error-handlers.ts owns retries, so the client makes one attempt.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-rate-limit-reset',
		remaining: 'x-rate-limit-remaining',
		limit: 'x-rate-limit-limit',
	},
};

/** The `code` values Mapbox sends with HTTP 200 when the answer is "no". */
export type MapboxEnvelope = 'navigation';

/**
 * Mapbox authenticates with an `access_token` query parameter, and `ApiError`
 * only redacts `api_key`, `key`, `token` and `appid`. So this error never
 * carries the `ApiError`, its URL, its query or the response body: it copies
 * the few fields a handler needs, and `message` is scrubbed of the token.
 */
export class MapboxAPIError extends Error {
	readonly status?: number;
	/** Mapbox's code: `error_code` on geocoding, `code` elsewhere. */
	readonly code?: string;
	/** Milliseconds to wait, from Retry-After or x-rate-limit-reset. */
	readonly retryAfter?: number;
	readonly method?: string;
	/** True when the request never got an HTTP answer (reset, DNS, timeout). */
	readonly transport: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
		} = {},
	) {
		super(message);
		this.name = 'MapboxAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record:
		| Record<string, unknown /* unknown: an untyped JSON object */>
		| null
		| undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function scrub(text: string, apiKey: string): string {
	return apiKey ? text.split(apiKey).join('[REDACTED]') : text;
}

/**
 * Error bodies seen on the live API:
 *
 * - geocoding: `{ message, error_code }`
 * - directions, matrix, isochrone, optimization: `{ message, code }`, or
 *   `{ message, error_detail }` on a bad token
 * - tilequery and some 404s: `{ message }`
 * - a missing route: an empty body or an HTML page
 */
// unknown: the error body is JSON, an HTML page or empty.
export function describeMapboxError(
	status: number,
	// unknown: an error body is whatever the API or a proxy sent.
	body: unknown /* unknown: see above */,
	apiKey: string,
): { message: string; code?: string } {
	const record = asRecord(body);
	const text = readString(record, 'message');
	const code = readString(record, 'code') ?? readString(record, 'error_code');
	if (!text) {
		return { message: `Mapbox ${status}: request failed`, code };
	}
	const detail = readString(record, 'error_detail');
	const label = code ? `${status} ${code}` : `${status}`;
	return {
		message: scrub(
			`Mapbox ${label}: ${text}${detail ? ` (${detail})` : ''}`,
			apiKey,
		),
		code,
	};
}

export type MapboxQuery = Record<string, string | number | boolean | undefined>;

export type MapboxRequest = {
	path: string;
	query?: MapboxQuery;
	/** `navigation`: a 200 whose `code` is not "Ok" is an error. */
	envelope?: MapboxEnvelope;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** `Number.prototype.toString` switches to exponent form below 1e-6. */
export function formatNumber(value: number): string {
	const text = String(value);
	if (!/e/i.test(text)) return text;
	return value.toFixed(10).replace(/\.?0+$/, '');
}

/** One `{longitude},{latitude}` pair, longitude first as Mapbox expects. */
export function formatCoordinate(point: {
	longitude: number;
	latitude: number;
}): string {
	return `${formatNumber(point.longitude)},${formatNumber(point.latitude)}`;
}

/** Semicolon-separated pairs, as the navigation APIs take in the path. */
export function formatCoordinates(
	points: readonly { longitude: number; latitude: number }[],
): string {
	return points.map(formatCoordinate).join(';');
}

function parseBody(
	// unknown: the raw body, before the endpoint's zod output schema sees it.
	body: unknown /* unknown: see above */,
	apiKey: string,
): unknown /* unknown: see above */ {
	// Geocoding answers `application/vnd.geo+json`, which the shared client does
	// not recognise as JSON, so the body arrives as text. The text is scrubbed
	// before parsing for the same reason the object branch is: a response can
	// echo the token, and a parsed body then carries it into any caller, log or
	// error that serialises the result.
	if (typeof body === 'string') {
		try {
			return JSON.parse(scrub(body, apiKey));
		} catch {
			throw new MapboxAPIError(
				scrub('Mapbox returned a body that is not JSON', apiKey),
				{ method: 'GET' },
			);
		}
	}
	if (body === undefined || body === null) {
		throw new MapboxAPIError('Mapbox returned an empty body', {
			method: 'GET',
		});
	}
	return JSON.parse(scrub(JSON.stringify(body), apiKey));
}

function assertEnvelopeOk(
	// unknown: a parsed body, which this function narrows itself.
	body: unknown /* unknown: see above */,
): void {
	const record = asRecord(body);
	const code = readString(record, 'code');
	if (code !== undefined && code !== 'Ok') {
		const text = readString(record, 'message');
		throw new MapboxAPIError(`Mapbox ${code}${text ? `: ${text}` : ''}`, {
			status: 200,
			code,
			method: 'GET',
		});
	}
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMapboxRequest(
	apiKey: string,
	{ path, query, envelope }: MapboxRequest,
	// unknown: callers parse the answer with the operation's output schema.
): Promise<unknown /* unknown: see above */> {
	const config: OpenAPIConfig = {
		BASE: MAPBOX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: { ...query, access_token: apiKey },
	};

	// unknown: the raw response body, narrowed by parseBody below.
	let body: unknown /* unknown: see above */;
	try {
		// unknown: the shared client returns whatever JSON or text came back.
		body = await request<unknown /* unknown: see above */>(
			config,
			requestOptions,
			{
				rateLimitConfig: MAPBOX_RATE_LIMIT_CONFIG,
			},
		);
	} catch (error) {
		if (error instanceof ApiError) {
			const { message, code } = describeMapboxError(
				error.status,
				error.body,
				apiKey,
			);
			throw new MapboxAPIError(message, {
				status: error.status,
				code,
				retryAfter: error.retryAfter,
				method: 'GET',
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			const cause = asRecord(error.cause);
			const causeCode = readString(cause, 'code');
			throw new MapboxAPIError(
				scrub(
					`Mapbox request failed: ${error.message}${causeCode ? ` (${causeCode})` : ''}`,
					apiKey,
				),
				{ method: 'GET', transport: true },
			);
		}
		throw new MapboxAPIError('Unknown Mapbox error', {
			method: 'GET',
			transport: true,
		});
	}

	const parsed = parseBody(body, apiKey);
	if (envelope === 'navigation') assertEnvelopeOk(parsed);
	return parsed;
}
