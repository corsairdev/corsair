import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Every JSON operation is a GET against this single query endpoint. */
const ALPHA_VANTAGE_API_BASE = 'https://www.alphavantage.co';

/**
 * The sliding-window analytics endpoint is served from a different host and
 * does not take a `function` parameter — it is addressed by path instead, and
 * its query parameters are upper-case.
 */
const ALPHA_VANTAGE_ANALYTICS_BASE = 'https://alphavantageapi.co';

/**
 * Alpha Vantage's free tier is a daily allowance (25 requests) rather than a
 * short sliding window, and it does not send Retry-After. Retrying a daily
 * exhaustion is pointless, so the retry budget here is small and exists for
 * transport-level blips; the daily limit is surfaced to the caller instead.
 */
const ALPHA_VANTAGE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 2,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * The CSV endpoints bypass the shared transport, so they need their own
 * ceiling. `LISTING_STATUS` is around a megabyte, hence the generous value.
 */
const CSV_REQUEST_TIMEOUT_MS = 30_000;

export type AlphaVantageErrorKind =
	| 'rate_limit'
	| 'premium'
	| 'invalid_request';

/**
 * Alpha Vantage answers every request with HTTP 200 — including failures, which
 * are signalled by a key in the JSON body. This error carries the classification
 * so the error handlers do not have to re-parse message text.
 */
export class AlphaVantageApiError extends Error {
	readonly kind: AlphaVantageErrorKind;
	readonly payload: Record<string, unknown>;

	constructor(
		kind: AlphaVantageErrorKind,
		message: string,
		payload: Record<string, unknown>,
	) {
		super(message);
		this.name = 'AlphaVantageApiError';
		this.kind = kind;
		this.payload = payload;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Classifies an Alpha Vantage response body and throws when it carries an
 * error. Three body keys are used by the provider, none of which change the
 * HTTP status:
 *
 * - `Error Message` — malformed call (unknown function, missing parameter).
 * - `Note` — the call-frequency limit was hit.
 * - `Information` — either the daily allowance is exhausted or the endpoint is
 *   premium-only. The two are distinguished by the text.
 *
 * A bad *symbol* is not reported here at all: Alpha Vantage returns a
 * well-formed envelope with an empty payload (e.g. `{"Global Quote": {}}`), so
 * emptiness is checked by the individual endpoint handlers, not centrally.
 */
export function assertNoAlphaVantageError(body: unknown): void {
	if (!isRecord(body)) return;

	const errorMessage = body['Error Message'];
	if (typeof errorMessage === 'string') {
		throw new AlphaVantageApiError(
			'invalid_request',
			`Alpha Vantage rejected the request: ${errorMessage}`,
			body,
		);
	}

	const note = body.Note;
	if (typeof note === 'string') {
		throw new AlphaVantageApiError(
			'rate_limit',
			`Alpha Vantage call frequency limit reached: ${note}`,
			body,
		);
	}

	const information = body.Information;
	if (typeof information === 'string') {
		const text = information.toLowerCase();
		if (text.includes('premium endpoint')) {
			throw new AlphaVantageApiError(
				'premium',
				`Alpha Vantage premium endpoint: ${information}`,
				body,
			);
		}
		throw new AlphaVantageApiError(
			'rate_limit',
			`Alpha Vantage daily allowance reached: ${information}`,
			body,
		);
	}
}

export type AlphaVantageQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Core's `ApiError` redacts a known set of sensitive query parameters —
 * `api_key`, `key`, `token`, `appid` — but Alpha Vantage spells its parameter
 * `apikey`, with no underscore, which is not in that set. Without this, a
 * failed request would carry the caller's live API key in `error.url` and
 * `error.request.query` and into anything that logs the error.
 *
 * Every transport below therefore routes its failures through
 * `sanitizeApiError`, which rebuilds the error with the key already replaced.
 * `instanceof ApiError` still holds, so the plugin's error handlers and core's
 * retry logic are unaffected.
 */
const REDACTED = '[REDACTED]';

function redactApiKeyInUrl(url: string): string {
	// Operates on the raw string: the value may be a relative url, and a
	// malformed one must still be scrubbed rather than thrown away.
	return url.replace(/([?&]apikey=)[^&#]*/gi, `$1${REDACTED}`);
}

/**
 * Rebuilds an `ApiError` with the Alpha Vantage key removed from its url,
 * request query and message. Non-`ApiError` values are returned untouched.
 */
export function sanitizeApiError(error: unknown): unknown {
	if (!(error instanceof ApiError)) return error;

	const query = error.request.query
		? {
				...error.request.query,
				...('apikey' in error.request.query ? { apikey: REDACTED } : {}),
			}
		: error.request.query;

	const sanitized = new ApiError(
		{
			...error.request,
			url: redactApiKeyInUrl(error.request.url),
			...(query ? { query } : {}),
		},
		{
			url: redactApiKeyInUrl(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			// A gateway's error page commonly echoes the request URI, so a string
			// body is scrubbed too rather than only the url.
			body:
				typeof error.body === 'string'
					? redactApiKeyInUrl(error.body)
					: error.body,
		},
		redactApiKeyInUrl(error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	sanitized.stack = error.stack;
	return sanitized;
}

/**
 * Issues a JSON request against the Alpha Vantage query endpoint.
 *
 * `functionName` is the provider's `function` parameter, which is not always
 * the same as this plugin's operation name — `companyOverview` calls
 * `OVERVIEW`, `getDividends` calls `DIVIDENDS`.
 */
export async function makeAlphaVantageRequest<T>(
	functionName: string,
	apiKey: string,
	query: AlphaVantageQuery = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ALPHA_VANTAGE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: 'query',
		mediaType: 'application/json; charset=utf-8',
		query: {
			...query,
			function: functionName,
			apikey: apiKey,
		},
	};

	let body: T;
	try {
		body = await request<T>(config, requestOptions, {
			rateLimitConfig: ALPHA_VANTAGE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw sanitizeApiError(error);
	}

	assertNoAlphaVantageError(body);
	return body;
}

/**
 * Issues a request against the separate analytics host, which is addressed by
 * path rather than by a `function` parameter.
 */
export async function makeAlphaVantageAnalyticsRequest<T>(
	path: string,
	apiKey: string,
	query: AlphaVantageQuery = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ALPHA_VANTAGE_ANALYTICS_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		mediaType: 'application/json; charset=utf-8',
		query: {
			...query,
			apikey: apiKey,
		},
	};

	let body: T;
	try {
		body = await request<T>(config, requestOptions, {
			rateLimitConfig: ALPHA_VANTAGE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw sanitizeApiError(error);
	}

	assertNoAlphaVantageError(body);
	return body;
}

/**
 * Splits one CSV line, honouring double-quoted fields that contain commas.
 * Alpha Vantage quotes company names such as `"Alphabet, Inc."`, so a plain
 * `split(',')` corrupts every row after the first quoted field.
 */
export function splitCsvLine(line: string): string[] {
	const fields: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === '"') {
			// A doubled quote inside a quoted field is a literal quote.
			if (inQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === ',' && !inQuotes) {
			fields.push(current);
			current = '';
		} else {
			current += char;
		}
	}
	fields.push(current);
	return fields;
}

/** Turns an Alpha Vantage CSV payload into one record per data row. */
export function parseCsv(csv: string): Record<string, string>[] {
	const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
	const headerLine = lines[0];
	if (headerLine === undefined) return [];

	const header = splitCsvLine(headerLine).map((column) => column.trim());
	return lines.slice(1).map((line) => {
		const values = splitCsvLine(line);
		const row: Record<string, string> = {};
		header.forEach((column, index) => {
			row[column] = (values[index] ?? '').trim();
		});
		return row;
	});
}

/**
 * Issues a request for one of the three operations that answer with CSV rather
 * than JSON — `LISTING_STATUS`, `EARNINGS_CALENDAR` and `IPO_CALENDAR`, all
 * served as `Content-Type: application/x-download`.
 *
 * These cannot go through the shared JSON transport, which parses the body as
 * JSON. `fetch` is used directly and the text is parsed here instead.
 */
export async function makeAlphaVantageCsvRequest(
	functionName: string,
	apiKey: string,
	query: AlphaVantageQuery = {},
): Promise<Record<string, string>[]> {
	const url = new URL('/query', ALPHA_VANTAGE_API_BASE);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			url.searchParams.set(key, String(value));
		}
	}
	url.searchParams.set('function', functionName);
	url.searchParams.set('apikey', apiKey);

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: 'query',
		mediaType: 'text/csv',
		query: { ...query, function: functionName, apikey: apiKey },
	};

	// One fetch. A 429 is thrown as ApiError so RATE_LIMIT_ERROR is the only
	// retry layer — an inner loop here would multiply with that handler.
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'text/csv' },
			signal: AbortSignal.timeout(CSV_REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Alpha Vantage ${functionName} request failed: ${redactApiKeyInUrl(reason)}`,
		);
	}

	const text = await response.text();
	if (!response.ok) {
		const retryAfter = parseRetryAfter(response.headers.get('Retry-After'));
		throw sanitizeApiError(
			new ApiError(
				requestOptions,
				{
					url: url.toString(),
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: redactApiKeyInUrl(text.slice(0, 500)),
				},
				`Alpha Vantage ${functionName} returned HTTP ${response.status}`,
				{
					retryAfter:
						retryAfter === undefined ? undefined : Math.min(retryAfter, 5_000),
				},
			),
		);
	}

	// An Alpha Vantage error on a CSV endpoint still arrives as HTTP 200, but as
	// a JSON body rather than CSV.
	const trimmed = text.trimStart();
	if (trimmed.startsWith('{')) {
		try {
			assertNoAlphaVantageError(JSON.parse(trimmed));
		} catch (error) {
			if (error instanceof AlphaVantageApiError) throw error;
			// A body that opens with `{` but does not parse is not an error
			// envelope; fall through and let the CSV parser deal with it.
		}
	}

	return parseCsv(text);
}

/** Seconds or an HTTP date, per RFC 9110, converted to milliseconds. */
export function parseRetryAfter(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds)) return Math.max(0, seconds) * 1000;
	const when = Date.parse(header);
	return Number.isNaN(when) ? undefined : Math.max(0, when - Date.now());
}
