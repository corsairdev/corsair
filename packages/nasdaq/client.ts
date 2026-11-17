import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NASDAQ_API_BASE = 'https://data.nasdaq.com/api/v3';

// Core's request() retries a 429 three times with backoff; the QEAx07 handler
// in error-handlers.ts adds the documented 30-second wait on top. Nasdaq
// documents no Retry-After header, so the name is kept only so a proxy that
// sends one is honoured.
const NASDAQ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 3,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Nasdaq's own code, e.g. `QEAx01`, from the `quandl_error` envelope. */
// unknown: the body is whatever the gateway or the API sent.
function readQuandlCode(body: unknown): string | undefined {
	return readString(asRecord(asRecord(body)?.quandl_error), 'code');
}

/** Nasdaq's message from the `quandl_error` envelope. */
// unknown: see readQuandlCode.
function readQuandlMessage(body: unknown): string | undefined {
	return readString(asRecord(asRecord(body)?.quandl_error), 'message');
}

/**
 * Nasdaq Data Link answers two ways, and only one is JSON:
 *
 * - A bad key or a bad query is a 400 with `{ quandl_error: { code, message } }`.
 *   `QEAx01` is an unknown key, `QESx06` a stale cursor, `QEPx04` a missing key.
 * - Its Incapsula gateway answers 403 with an HTML page and no JSON at all, on
 *   the `/datasets/` time-series routes requested without a browser User-Agent.
 *   That is a block, not an auth failure, and the two read identically to a
 *   caller that only looks at the status.
 *
 * An HTTP failure stays core's `ApiError` (see `sanitizeApiError`), so its
 * status, Retry-After and rate-limit fields reach core and the handlers. This
 * class covers only a transport failure, which never had a response.
 */
export class NasdaqAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NasdaqAPIError';
		this.method = options.method;
	}
}

/**
 * Rebuilds Nasdaq's HTTP error as a core `ApiError` with the key removed.
 *
 * Nasdaq echoes the submitted key in `quandl_error.message`, and core redacts
 * the request URL and query but not `ApiError.body`. So the body is replaced
 * with a `quandl_error` envelope whose message has the key stripped, and the
 * sent query is dropped.
 */
function sanitizeApiError(error: ApiError, apiKey: string): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const code = readQuandlCode(error.body);
	const message = readQuandlMessage(error.body);
	const envelope =
		code === undefined && message === undefined
			? undefined
			: {
					quandl_error: {
						code,
						message:
							message === undefined ? undefined : withoutKey(message, apiKey),
					},
				};
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: envelope,
		},
		describeNasdaqError(error.status, error.body, error.message, apiKey),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** Removes the submitted key from provider text, wherever it appears. */
function withoutKey(text: string, apiKey: string): string {
	return apiKey.length > 0 ? text.split(apiKey).join('[REDACTED]') : text;
}

// unknown: see NasdaqAPIError.
export function describeNasdaqError(
	status: number | undefined,
	body: unknown,
	fallback: string,
	apiKey = '',
): string {
	// A 403 with no JSON body is the gateway's HTML page, not the API.
	if (status === 403 && readQuandlCode(body) === undefined) {
		return 'Nasdaq blocked the request at its gateway with a 403 before it reached the API. The /datasets time-series routes reject non-browser clients; the /datatables routes do not.';
	}

	const text =
		readQuandlMessage(body) ??
		// A 404 is a Rails HTML page, and a 410 is a bare line of text.
		(status === 404
			? 'No such route. Nasdaq Data Link serves tables under /datatables/{vendor}/{table}; there is no /datatables listing route.'
			: fallback);
	const code = readQuandlCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = label ? `Nasdaq ${label}: ${text}` : text;
	return withoutKey(summary, apiKey);
}

export type NasdaqQuery = Record<string, string | number | boolean | undefined>;

export type NasdaqRequest = {
	method: 'GET';
	path: string;
	query?: NasdaqQuery;
};

// unknown: callers parse the body with the endpoint's zod output schema; the
// transport returns whatever the API sent.
export async function makeNasdaqRequest(
	apiKey: string,
	{ method, path, query }: NasdaqRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NASDAQ_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, api_key: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NASDAQ_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error, apiKey);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new NasdaqAPIError(error.message, { cause: error, method });
		}
		throw new NasdaqAPIError('Unknown Nasdaq error', { method });
	}
}

/** Encodes one path segment. A table code like `MER/F1` keeps its slash. */
export function tablePath(code: string): string {
	return code.split('/').map(encodeURIComponent).join('/');
}
