import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEMPLATED_API_BASE = 'https://api.templated.io/v1';

/**
 * Templated answers failures in two shapes:
 *
 * - `{ error: "API key not valid. ..." }` from the auth layer, on 401 and on a
 *   request with no key at all.
 * - `{ timestamp, status, error, path }` from the framework, on a 404 or a
 *   rejected request.
 *
 * Both carry the message under `error`, so that one field serves either.
 * https://templated.io/docs
 */
export class TemplatedAPIError extends Error {
	readonly status?: number;
	/** The provider's short label from the framework envelope, e.g. "Not Found". */
	readonly code?: string;
	/** The request path the framework envelope names, when present. */
	readonly path?: string;
	/** Milliseconds from a Retry-After header, when Templated sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			path?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TemplatedAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
		this.path = options.path;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Templated documents no Retry-After.
const TEMPLATED_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TemplatedErrorDetails = {
	message?: string;
	code?: string;
	path?: string;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of either JSON envelope.
function readErrorDetails(body: unknown): TemplatedErrorDetails {
	const record = asRecord(body);
	if (!record) return {};
	const error = record.error;
	const path = record.path;
	return {
		message: typeof error === 'string' && error.length > 0 ? error : undefined,
		// The framework envelope repeats the label in `error`, so `code` is only
		// set when a numeric status also arrived.
		code:
			typeof record.status === 'number' && typeof error === 'string'
				? error
				: undefined,
		path: typeof path === 'string' && path.length > 0 ? path : undefined,
	};
}

// unknown: same open error body as readErrorDetails.
export function describeTemplatedError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	const text = details.message ?? fallback;
	return status === undefined ? text : `Templated ${status}: ${text}`;
}

export type TemplatedQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type TemplatedRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: TemplatedQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * Multipart parts. corsair/http appends a Blob or string as-is and repeats an
	 * array value under the same key, which is what the upload route needs for a
	 * file part and repeated tags.
	 */
	formData?: Record<
		string,
		string | number | boolean | Blob | string[] | undefined
	>;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the 204 answers on the deletes.
export async function makeTemplatedRequest(
	apiKey: string,
	{ method, path, query, body, formData }: TemplatedRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TEMPLATED_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Templated reads the key from a bearer header.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: formData === undefined ? body : undefined,
		formData,
		// A multipart request must not carry a Content-Type: fetch writes the
		// boundary itself, and setting the header breaks the parse.
		mediaType:
			formData !== undefined
				? undefined
				: body === undefined
					? undefined
					: 'application/json',
	};

	try {
		// unknown: the response shape is the endpoint's concern; the caller
		// parses it with its zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TEMPLATED_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TemplatedAPIError(
				describeTemplatedError(error.status, error.body, error.message),
				{ cause: error, code: details.code, path: details.path },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TemplatedAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TemplatedAPIError('Unknown Templated error', { method });
	}
}
