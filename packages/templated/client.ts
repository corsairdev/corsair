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
		// Renders run synchronously; an mp4 of up to 90 s can take minutes, and
		// core's default is 20 s. An aborted render is not retried (DEFAULT).
		TIMEOUT: 300_000,
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
		if (error instanceof ApiError) throw stripRequestData(error);
		throw error;
	}
}

/**
 * Core's ApiError keeps the request it failed on, including the render
 * payload (layer text and images, often a client's data) and an upload's file
 * bytes. This rebuilds it without the body, form data and query, and keeps
 * what core and the handlers read: status, body, Retry-After and the method.
 * It is still core's ApiError, with the provider's message.
 */
export function stripRequestData(error: ApiError): ApiError {
	return new ApiError(
		{
			method: error.request.method,
			url: error.request.url.split('?')[0] ?? '',
		},
		{
			url: error.url.split('?')[0] ?? '',
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		describeTemplatedError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
