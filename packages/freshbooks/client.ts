import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FRESHBOOKS_API_BASE = 'https://api.freshbooks.com';

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(
	record: Record<string, unknown> | null | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' ? value : undefined;
}

/** One entry of the accounting family's `response.errors` array. */
export type FreshBooksErrorEntry = {
	errno?: number;
	message: string;
};

/**
 * Builds the error message for a failed call from the body FreshBooks sent.
 * The families differ (see plugin-docs.yaml): accounting wraps errors in
 * `response.errors`, the projects/timetracking and auth families answer with
 * `{ error }` or `{ message }` at the top level.
 */
export function describeFreshBooksError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const response = asRecord(record?.response);
	const errors = Array.isArray(response?.errors) ? response?.errors : [];
	const first = asRecord(errors[0]);
	const text =
		readString(first, 'message') ??
		readString(record, 'error_description') ??
		readString(record, 'error') ??
		readString(record, 'message') ??
		fallback;
	const errno = readNumber(first, 'errno');
	const label = [status, errno === undefined ? undefined : `errno ${errno}`]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `FreshBooks ${label}: ${text}` : text;
}

/**
 * Reads the accounting family's error entries out of a body, whatever the
 * HTTP status said.
 */
export function readFreshBooksErrors(body: unknown): FreshBooksErrorEntry[] {
	const record = asRecord(body);
	const response = asRecord(record?.response);
	const raw = Array.isArray(response?.errors) ? response?.errors : [];
	return raw.flatMap((entry) => {
		const record = asRecord(entry);
		const message = readString(record, 'message');
		if (!message) return [];
		const errno = readNumber(record, 'errno');
		return [{ message, errno }];
	});
}

/**
 * The API key is an OAuth 2 access token that expires after 12 hours and
 * whose refresh token is single-use, so the caller supplies a fresh token
 * when the old one expires. No idempotency-key mechanism exists, so a failed
 * write must never be replayed by the transport; error-handlers.ts decides
 * retries from the method recorded on FreshBooksAPIError.
 */
const FRESHBOOKS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * FreshBooks reports failures with `status`, the extracted `errno` where the
 * accounting family sent one, and the HTTP `method`, which error-handlers.ts
 * uses to keep writes off the 5xx replay path. The ApiError cause is not
 * attached: it holds the whole request, whose `Authorization` header carries
 * the access token and which no core redaction covers.
 */
export class FreshBooksAPIError extends Error {
	readonly status?: number;
	readonly errno?: number;
	/** Milliseconds from a Retry-After header, when FreshBooks sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, undefined for transport errors. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			errno?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message);
		this.name = 'FreshBooksAPIError';
		this.status = options.status;
		this.errno = options.errno;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}
}

export type FreshBooksRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	/** Bracket keys such as `search[email]` are encoded by the transport. */
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers, such as the 204 on time entry delete.
export async function makeFreshBooksRequest(
	apiKey: string,
	{ method, path, query, body }: FreshBooksRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: FRESHBOOKS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TOKEN renders as `Authorization: Bearer <token>`; the access token
		// is the account's key.
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
			rateLimitConfig: FRESHBOOKS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Copy the fields the handlers need and drop the cause: it holds
			// the request with the Authorization header, and the response body
			// is re-read through describeFreshBooksError below.
			const [entry] = readFreshBooksErrors(error.body);
			throw new FreshBooksAPIError(
				describeFreshBooksError(error.status, error.body, error.message),
				{
					status: error.status,
					errno: entry?.errno,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// Transport failure: nothing reached FreshBooks, so `method` is the
			// caller's intent and reads may be replayed.
			throw new FreshBooksAPIError(error.message, { method });
		}
		throw new FreshBooksAPIError('Unknown FreshBooks error', { method });
	}
}
