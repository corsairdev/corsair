import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { RadarValue } from './endpoints/call';

/** The only host. */
export const RADAR_API_BASE = 'https://api.radar.io/v1';

/**
 * Radar's error body wraps its message in a `meta` object, and the same `meta`
 * key carries the success code, so a 200 and a 400 differ only in the code:
 *
 * ```json
 * { "meta": { "code": 400, "param": "latitude",
 *             "message": "latitude: Invalid latitude. Valid range: [-90, 90]." } }
 * ```
 *
 * The `code` inside `meta` repeats the HTTP status. Two statuses need care: a
 * `402` means the organisation is disabled or the usage quota is exhausted, and
 * no retry fixes either; a `429` covers a real rate limit *and* selective
 * throttling, where the docs say no state changed.
 */
export class RadarAPIError extends Error {
	readonly status?: number;
	/** The `meta.code`, which repeats the HTTP status. */
	readonly code?: number;
	/** The parameter Radar blamed, such as `latitude`. */
	readonly param?: string;
	/** Milliseconds from a Retry-After header, when Radar sent one. */
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
			param?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RadarAPIError';
		this.status = options.status;
		this.code = options.code;
		this.param = options.param;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** A missing or rejected key. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/**
	 * The quota is used up or the organisation is disabled. Radar answers both a
	 * spent balance and a throughput limit with a status that looks retryable, so
	 * this is kept separate and never retried.
	 */
	get isQuotaError(): boolean {
		return this.status === 402;
	}

	/** The user, trip or geofence does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body or query Radar refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 409;
	}

	/** A country blocklist refusal, which no retry can clear. */
	get isLegalError(): boolean {
		return this.status === 451;
	}
}

/**
 * Reads `meta` out of a Radar body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function metaOf(body: unknown): Record<string, unknown> | null {
	return asRecord(asRecord(body)?.meta);
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `metaOf` narrows it.
 */
export function describeRadarError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const meta = metaOf(body);
	const message = meta?.message;
	const param = meta?.param;
	const text =
		typeof message === 'string' && message.length > 0 ? message : fallback;
	const label = status !== undefined ? `${status}` : undefined;
	const summary = label ? `Radar ${label}: ${text}` : text;
	// The message usually repeats the parameter, but a proxy can drop it.
	return typeof param === 'string' && !text.includes(param)
		? `${summary} (param: ${param})`
		: summary;
}

export type RadarQuery = Record<string, RadarValue | undefined>;

export type RadarRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path below `/v1`, starting with a slash. */
	path: string;
	query?: RadarQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Radar documents per-endpoint limits (10 or 100 requests a second) but no
 * `Retry-After`, so this config reads the header if a gateway adds one and the
 * handler owns the retry count.
 */
const RADAR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Radar takes the key **bare** in the `Authorization` header — no `Bearer`
 * prefix — which is why it is set as a literal header rather than through
 * `TOKEN`.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RADAR_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: apiKey },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRadarRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RadarRequest,
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
			rateLimitConfig: RADAR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const meta = metaOf(error.body);
			const code = meta?.code;
			// The cause holds the request, and with it the Authorization header,
			// so the fields the handlers need are copied and the cause is dropped.
			throw new RadarAPIError(
				describeRadarError(error.status, error.body, error.message),
				{
					status: error.status,
					code: typeof code === 'number' ? code : undefined,
					param: typeof meta?.param === 'string' ? meta.param : undefined,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RadarAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RadarAPIError('Unknown Radar error', { method, replayable });
	}
}
