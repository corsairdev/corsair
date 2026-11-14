import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The market-data API that was published as Polygon.io now answers on both
 * hosts: `polygon.io` redirects its site to `massive.com`, while
 * `api.polygon.io` and `api.massive.com` serve the same routes. The historical
 * host is the one this plugin's name refers to, and the docs' own sample
 * payloads still print it, so it stays the base.
 */
export const POLYGONIO_API_BASE = 'https://api.polygon.io';

/** The two ways the API accepts a key: this query parameter, or a bearer header. */
export const POLYGONIO_KEY_PARAM = 'apiKey';

/**
 * The API documents a free tier of 5 calls a minute and sends no Retry-After,
 * so handlers own the retries and the fallback delay is the documented window.
 */
const POLYGONIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Every response carries `status`, which is `OK`, `DELAYED` or `ERROR`. A 401
 * carries `error` instead, and a key it does not recognise answers
 * `"Unknown API Key"`.
 */
export class PolygonioAPIError extends Error {
	readonly status?: number;
	/** The API's own `status` or `error` text, such as `ERROR`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached the API (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when the API rejected the key rather than the request. */
	readonly credentialsRejected: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PolygonioAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
	}
}

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

// untrusted: error bodies are untyped JSON until narrowed one field at a time.
function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The API's `status`, such as `OK`, `DELAYED` or `ERROR`. */
export function readEnvelopeStatus(body: Untyped): string | undefined {
	return readString(asRecord(body), 'status');
}

/** The API's `error` text on a rejected request, such as `Unknown API Key`. */
export function readEnvelopeError(body: Untyped): string | undefined {
	return readString(asRecord(body), 'error');
}

const CREDENTIAL_MESSAGE = /api key/i;

/**
 * A 401 means the key is missing, unrecognised or not entitled to the route. The
 * API puts the reason in `error`, and the first two are credential problems, so
 * those are the ones this flags.
 */
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status !== 401 && status !== 403) return false;
	const error = readEnvelopeError(body);
	return error !== undefined && CREDENTIAL_MESSAGE.test(error);
}

/**
 * Builds the message from the API's `error` or `message`, and keeps the key out
 * of it: the key can ride in the query string, and `ApiError` redacts only a
 * fixed set of parameter names, of which `apiKey` is one.
 */
export function describePolygonioError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const text =
		readEnvelopeError(body) ??
		readString(asRecord(body), 'message') ??
		readString(asRecord(body), 'status') ??
		fallback;
	return status !== undefined ? `Polygon.io ${status}: ${text}` : text;
}

export type PolygonioQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type PolygonioRequest = {
	method: 'GET';
	path: string;
	query?: PolygonioQuery;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Reads an absolute `next_url` the API returned, keeping only its path and
 * query so the request stays on the configured base.
 *
 * The URL already carries the caller's `cursor` and the original filters, so
 * nothing is rebuilt here: it is the API's own next page. Any `apiKey` the
 * provider echoed is dropped, because the client appends the caller's own.
 */
export function nextPagePath(nextUrl: string): string {
	const url = new URL(nextUrl);
	url.searchParams.delete(POLYGONIO_KEY_PARAM);
	const search = url.searchParams.toString();
	return search ? `${url.pathname}?${search}` : url.pathname;
}

// The body is returned untyped because the caller's output schema is the only
// thing that knows its shape.
export async function makePolygonioRequest(
	apiKey: string,
	{ method, path, query }: PolygonioRequest,
): Promise<Untyped> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('polygonio', 'api_key');
	}
	if (/[\r\n]/.test(apiKey)) {
		throw new PolygonioAPIError('The API key must not contain newlines');
	}

	const config: OpenAPIConfig = {
		BASE: POLYGONIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, [POLYGONIO_KEY_PARAM]: apiKey },
	};

	try {
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: POLYGONIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new PolygonioAPIError(
				describePolygonioError(error.status, error.body, error.statusText),
				{
					status: error.status,
					code: readEnvelopeError(error.body) ?? readEnvelopeStatus(error.body),
					retryAfter: error.retryAfter,
					method,
					credentialsRejected: isCredentialRejection(error.status, error.body),
				},
			);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PolygonioAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PolygonioAPIError('Unknown Polygon.io error', {
			method,
			transport: true,
		});
	}
}
