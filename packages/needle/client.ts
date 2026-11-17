import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NEEDLE_API_BASE = 'https://needle.app/api/v1';

// Core's request() retries a 429 three times and honours the Retry-After that
// Needle sends with its per-account limits, so the 429 handler in
// error-handlers.ts does not retry again.
const NEEDLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 3,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped error payload; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every Needle error is `{ requestId, error, data? }` with no machine-readable
 * code, so the HTTP status is the only classification and `requestId` is what
 * their support asks for. It is kept on the error for that reason.
 *
 * An HTTP failure stays core's `ApiError` (see `sanitizeApiError`), so its
 * status and Retry-After reach core and the handlers. This class covers only a
 * transport failure, which never had a response.
 */
export class NeedleAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NeedleAPIError';
		this.method = options.method;
	}
}

/**
 * Rebuilds Needle's HTTP error as a core `ApiError`, keeping its status,
 * rate-limit fields and the provider's `{ requestId, error }` body.
 *
 * The sent body is dropped: it holds lead names, email addresses and message
 * text, and Needle quotes field-level detail back in `data`. The request id is
 * the part support needs, and it survives in the body.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const record = asRecord(error.body);
	const envelope =
		record === null
			? undefined
			: {
					requestId: readString(record, 'requestId'),
					error: readString(record, 'error'),
					data: asRecord(record)?.data,
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
		describeNeedleError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: see NeedleAPIError.
export function describeNeedleError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'error') ?? fallback;
	const requestId = readString(record, 'requestId');
	const label = status === undefined ? '' : `Needle ${status}: `;
	return requestId
		? `${label}${text} (requestId ${requestId})`
		: `${label}${text}`;
}

export type NeedleQuery = Record<string, string | number | boolean | undefined>;

export type NeedleRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: NeedleQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204.
export async function makeNeedleRequest(
	apiKey: string,
	{ method, path, query, body }: NeedleRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NEEDLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NEEDLE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new NeedleAPIError(error.message, { cause: error, method });
		}
		throw new NeedleAPIError('Unknown Needle error', { method });
	}
}

/** Encodes one path segment. Identities can carry `@` and slashes. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
