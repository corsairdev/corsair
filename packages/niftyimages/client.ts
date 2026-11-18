import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NIFTYIMAGES_API_BASE = 'https://api.niftyimages.com/v1';

// Retries belong to error-handlers.ts. NiftyImages documents no Retry-After, so
// the name is kept only so a proxy that sends one is honoured.
const NIFTYIMAGES_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
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

/**
 * NiftyImages documents five status codes and one error body:
 * `{ "message": "Your API Key does not appear to be valid" }` on a 401. A 404
 * can answer an ASP.NET HTML page rather than JSON.
 *
 * An HTTP failure stays core's `ApiError` (see `sanitizeApiError`), so its
 * status and Retry-After reach core. This class covers only a transport failure,
 * which never had a response.
 */
export class NiftyimagesAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NiftyimagesAPIError';
		this.method = options.method;
	}
}

/**
 * Rebuilds the HTTP error as a core `ApiError` with a readable message, keeping
 * status, Retry-After and the rate-limit fields (R8). The body keeps only the
 * provider's `message`; the sent body is dropped, because a Data Store record
 * holds subscriber data.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const message = readString(asRecord(error.body), 'message');
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: message ? { message } : undefined,
		},
		describeNiftyimagesError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: see NiftyimagesAPIError.
export function describeNiftyimagesError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	if (typeof body === 'string' && body.trimStart().startsWith('<')) {
		return `NiftyImages ${status ?? ''}: the API answered an HTML page instead of JSON, which means the path does not exist.`.trim();
	}
	const message = readString(asRecord(body), 'message');
	const text = message ?? fallback;
	const label = status === undefined ? '' : `NiftyImages ${status}: `;
	return `${label}${text}`;
}

export type NiftyimagesQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type NiftyimagesRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: NiftyimagesQuery;
	/**
	 * A JSON body. The suspend calls send a bare `true` or `false`, so this is
	 * any JSON value rather than an object.
	 */
	// unknown: each endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNiftyimagesRequest(
	apiKey: string,
	{ method, path, query, body }: NiftyimagesRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NIFTYIMAGES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The header form, rather than the query or Basic alternatives the docs
		// also allow, so the key stays out of a URL that a proxy would log.
		HEADERS: { Accept: 'application/json', ApiKey: apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		// Core JSON-encodes the body for a JSON media type, so the suspend calls'
		// bare boolean goes out as `true` or `false`, as documented.
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NIFTYIMAGES_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NiftyimagesAPIError(error.message, { cause: error, method });
		}
		throw new NiftyimagesAPIError('Unknown NiftyImages error', { method });
	}
}

/** Encodes one path segment. Widget keys are GUIDs but user ids may not be. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
