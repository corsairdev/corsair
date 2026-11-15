import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const COINMARKETCAP_API_BASE = 'https://pro-api.coinmarketcap.com';

// The heaviest call is listings with limit=5000, which CoinMarketCap answers
// in a few seconds; the extra headroom covers a slow CloudFront path.
const COINMARKETCAP_TIMEOUT_MS = 30_000;

/**
 * The `status` object every CoinMarketCap response carries, read as strings.
 *
 * `error_code` is a number on `/v1` and `/v2` routes and a string on `/v3`
 * routes, and `elapsed` follows the same split, so both are read loosely here
 * and the output schemas keep the provider's type.
 */
export type CoinMarketCapStatusFields = {
	timestamp?: string;
	error_code?: string | number;
	error_message?: string | null;
	elapsed?: string | number;
	credit_count?: number;
	notice?: string | null;
	total_count?: number;
};

/** `error_code` as a number, whichever type the route used. */
export function readErrorCode(
	// unknown: an untyped JSON record; the field is type-checked on read.
	record: Record<string, unknown> | null | undefined,
): number | undefined {
	const value = record?.error_code;
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}
	return undefined;
}

// unknown: the body is an untyped JSON payload until asRecord narrows it.
export function readStatus(
	// unknown: the untyped response body, narrowed by asRecord.
	body: unknown,
): Record<string, unknown> | null | undefined {
	// unknown: see the parameter.
	return asRecord(asRecord(body)?.status);
}

// unknown: same open body; these helpers narrow one field at a time.
function readString(
	// unknown: as readErrorCode; one field is narrowed at a time.
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. CoinMarketCap sends Retry-After on some
// 429s and none on others; the handler falls back to its own delay.
const COINMARKETCAP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * CoinMarketCap answers with an HTTP status *and* a `status` object, and the
 * two do not always agree: the same 429 body carries `error_code` 1008 for a
 * minute limit, 1009 for a daily one, 1010 for a monthly one and 1011 for an IP
 * limit, while `error_code` 1022 (anonymous limit) arrives on a 429 as well.
 * Both are kept so the handlers can tell a retryable throttle from a plan that
 * has to change.
 */
export class CoinMarketCapAPIError extends Error {
	readonly status?: number;
	/** The numeric `status.error_code`, whichever type the route used. */
	readonly code?: number;
	readonly creditCount?: number;
	/** Milliseconds from a Retry-After header, when CoinMarketCap sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are the `{ status: {...} }` envelope above, but a
	// proxy can answer with HTML or text.
	readonly body?: unknown; // unknown: only the status envelope is kept, and it is untyped.

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown; // unknown: see the class field.
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'CoinMarketCapAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.method = options.method ?? cause?.request.method;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		// Resolve the body before reading it: a cause is how the ApiError path
		// supplies one.
		const body = options.body ?? cause?.body;
		// The body is kept only for the envelope fields: ApiError does not
		// redact a body, and CoinMarketCap never echoes the key in one.
		const status = readStatus(body);
		this.code = readErrorCode(status);
		const credits = status?.credit_count;
		this.creditCount = typeof credits === 'number' ? credits : undefined;
		this.body = status ? { status } : undefined;
	}

	/** 1008 and 1011 are throttle windows; 1009, 1010 and 1022 are plan limits. */
	get isRetryableThrottle(): boolean {
		return this.status === 429 && (this.code === 1008 || this.code === 1011);
	}

	/** A plan or credit limit that waiting out one window will not clear. */
	get isPlanLimit(): boolean {
		return this.code === 1009 || this.code === 1010 || this.code === 1022;
	}
}

// unknown: see CoinMarketCapAPIError.
export function describeCoinMarketCapError(
	status: number | undefined,
	body: unknown, // unknown: an untyped error body, read field by field.
	fallback: string,
): string {
	const statusObject = readStatus(body);
	const text =
		readString(statusObject, 'error_message') ??
		readString(asRecord(body), 'error_message') ??
		fallback;
	const code = readErrorCode(statusObject);
	const label = [status, code !== undefined ? `code ${code}` : undefined]
		.filter((part) => part !== undefined)
		.join(', ');
	return label ? `CoinMarketCap ${label}: ${text}` : text;
}

/**
 * A 2xx body that still reports a failure. CoinMarketCap's `/v3` catch-all
 * answers HTTP 200 with `error_code: "500"` for a route it does not serve, so
 * a status object is not proof of success. Returns the error to throw, or
 * undefined.
 */
// unknown: raw provider JSON before the endpoint's output schema parses it.
export function errorFromEnvelope(
	body: unknown, // unknown: raw JSON before the output schema parses it.
): CoinMarketCapAPIError | undefined {
	const status = readStatus(body);
	const code = readErrorCode(status);
	if (code === undefined || code === 0) return undefined;
	return new CoinMarketCapAPIError(
		describeCoinMarketCapError(200, body, 'CoinMarketCap request failed'),
		{ status: code, body },
	);
}

export type CoinMarketCapQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type CoinMarketCapRequest = {
	method: 'GET';
	path: string;
	query?: CoinMarketCapQuery;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeCoinMarketCapRequest(
	apiKey: string,
	{ method, path, query }: CoinMarketCapRequest,
	// unknown: callers parse the body with the operation's zod output schema.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: COINMARKETCAP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: COINMARKETCAP_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			'X-CMC_PRO_API_KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
	};

	try {
		// unknown: the body is untyped here; callers parse it with a zod schema.
		return await request<unknown>(config, requestOptions, {
			// unknown: see the return type.
			rateLimitConfig: COINMARKETCAP_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CoinMarketCapAPIError(
				describeCoinMarketCapError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new CoinMarketCapAPIError(error.message, { cause: error, method });
		}
		throw new CoinMarketCapAPIError('Unknown CoinMarketCap error', { method });
	}
}
