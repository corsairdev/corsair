import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * This plugin wraps Segment's Public API only (api.segmentapis.com, one
 * Bearer token). The Tracking/ingest API on api.segment.io takes a different
 * credential (a per-source write key) and answers 200 {"success": true} for
 * events it silently drops, so it is out of scope here.
 */
export const SEGMENT_API_BASE = 'https://api.segmentapis.com';

/** Spec default when a caller omits a page size. */
export const SEGMENT_DEFAULT_PAGE_SIZE = 200;

// error-handlers.ts owns retries; the client makes one attempt and only reads
// the timing headers into the error.
const SEGMENT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the record is Segment's untyped `{ errors: [...] }` error envelope.
function firstErrorMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	// unknown: the errors element is untyped until each field is read.
	const first = asRecord((record?.errors as unknown[] | undefined)?.[0]);
	const message = first?.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

// A per-endpoint 429 carries `data.msBeforeNext`; a token-level 429 relies on
// the Retry-After header instead.
// unknown: the record is Segment's untyped error envelope.
function msBeforeNext(body: unknown): number | undefined {
	const value = asRecord(asRecord(body)?.data)?.msBeforeNext;
	return typeof value === 'number' && value >= 0 ? value : undefined;
}

/**
 * Segment's Public API error shape is `{ errors: [{ type, message }] }`.
 * Source responses embed `writeKeys` (secrets), so this error never carries
 * the request or response body: only the status, the timing numbers and the
 * message string travel.
 */
export class SegmentAPIError extends Error {
	readonly status?: number;
	/** Milliseconds to wait: a Retry-After header, else a 429's msBeforeNext. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			method?: string;
			// Retained only for transport failures, whose cause never held a
			// response body; HTTP errors pass none.
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SegmentAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}
}

// Array values repeat the parameter (form/explode), which is how Segment
// reads a repeated query key.
export type SegmentQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type SegmentRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: SegmentQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function pathSegment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Segment reads page parameters as dot-style query params (`pagination.count=5`)
 * and docs say list endpoints fail validation when pagination is omitted, so
 * count always ships: the documented default when the caller passes none.
 */
export function paginationQuery(count?: number, cursor?: string): SegmentQuery {
	return {
		'pagination.count': count ?? SEGMENT_DEFAULT_PAGE_SIZE,
		'pagination.cursor': cursor,
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
// undefined for none of this plugin's routes: every documented 200 has a
// `{ data: ... }` JSON body.
export async function makeSegmentRequest(
	apiKey: string,
	{ method, path, query, body }: SegmentRequest,
	baseUrl?: string,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: baseUrl ?? SEGMENT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
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
			rateLimitConfig: SEGMENT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const methodOf = error.request.method;
			const retryAfter =
				error.retryAfter ??
				(error.status === 429 ? msBeforeNext(error.body) : undefined);
			const text = firstErrorMessage(error.body) ?? error.message;
			throw new SegmentAPIError(`Segment ${error.status}: ${text}`, {
				status: error.status,
				retryAfter,
				method: methodOf,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		// Transport failures never reached the provider, so keeping their cause
		// is safe: it carries no response body.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SegmentAPIError(error.message, {
				method,
				cause: error instanceof Error ? error : undefined,
			});
		}
		throw new SegmentAPIError('Unknown Segment error', { method });
	}
}
