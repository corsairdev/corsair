import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NANGO_API_BASE = 'https://api.nango.dev';

/**
 * A transport failure (timeout, DNS, reset) that never got a response. An HTTP
 * error stays core's `ApiError` (see `sanitizeApiError`), so its status and
 * Retry-After reach core's retry logic and the plugin's error handlers.
 */
export class NangoError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NangoError';
		this.method = options.method;
	}
}

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Nango's `invalid_body` / `invalid_query_params` errors carry no message, only
 * `errors: [{ code, message, path }]`; the first one says what to fix.
 */
// unknown: the errors list is untrusted error JSON.
function validationDetail(errors: unknown): string | undefined {
	if (!Array.isArray(errors) || errors.length === 0) return undefined;
	const first = asRecord(errors[0]);
	const message = readString(first, 'message');
	if (!message) return undefined;
	const path = Array.isArray(first?.path) ? first.path.join('.') : '';
	const more = errors.length > 1 ? ` (+${errors.length - 1} more)` : '';
	return `${path ? `${path}: ` : ''}${message}${more}`;
}

/**
 * Reads Nango's `{ error: { code, message } }` envelope. Older routes answer
 * `{ error: "text" }` or `{ message }`; a proxied upstream error can be any
 * body, so only these fields are kept.
 */
// unknown: the body is whatever Nango or the proxied API sent.
export function readNangoError(body: unknown): {
	code?: string;
	message?: string;
} {
	const record = asRecord(body);
	const error = record?.error;
	if (typeof error === 'string') return { message: error };
	const nested = asRecord(error);
	return {
		code: readString(nested, 'code'),
		message:
			readString(nested, 'message') ??
			readString(record, 'message') ??
			validationDetail(nested?.errors),
	};
}

/**
 * Rebuilds an HTTP error as a core `ApiError` (R8) without the request body,
 * query and headers, and without the query string in the URL: an import sends
 * third-party credentials, list filters can hold end-user tags, and a proxy
 * call sends whatever the caller passes on to the end customer's account.
 *
 * Only Nango's own error text is kept (its `error` envelope), with the
 * environment key cut out. A proxy error body comes from the end customer's
 * API and can echo their data, so for `/proxy/` calls only the status and an
 * error code survive. Core's own message is never reused: for an unknown body
 * it embeds the whole response.
 */
function sanitizeApiError(error: ApiError, apiKey: string): ApiError {
	const redact = (text: string): string =>
		apiKey.length > 0 ? text.split(apiKey).join('[REDACTED]') : text;
	const {
		body: _body,
		formData: _formData,
		query: _query,
		headers: _headers,
		...requestInfo
	} = error.request;
	const isProxy = requestInfo.url.startsWith('/proxy/');
	const parsed = readNangoError(error.body);
	const code = parsed.code;
	const message =
		isProxy || parsed.message === undefined
			? undefined
			: redact(parsed.message);
	const label = [error.status, code].filter((part) => part !== undefined);
	const fallback = isProxy
		? 'the external API returned an error (body withheld)'
		: error.statusText || 'request failed';
	return new ApiError(
		requestInfo,
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body:
				code === undefined && message === undefined
					? undefined
					: { error: { code, message } },
		},
		`Nango ${isProxy ? 'proxy ' : ''}${label.join(' ')}: ${message ?? fallback}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** Nango's error code on a core ApiError, e.g. `unknown_connection`. */
export function nangoErrorCode(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	return readNangoError(error.body).code;
}

export type NangoQuery = Record<
	string,
	| string
	| number
	| boolean
	| readonly string[]
	| Readonly<Record<string, string>>
	| undefined
>;

export type NangoRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: NangoQuery;
	headers?: Record<string, string | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and a
	// proxy body is whatever the end customer's API expects.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204, and a string when the proxied API answers non-JSON.
export async function nangoRequest(
	apiKey: string,
	{ method, path, query, headers, body }: NangoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NANGO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
	const definedHeaders = Object.fromEntries(
		Object.entries(headers ?? {}).filter(([, value]) => value !== undefined),
	);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		headers: definedHeaders,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// Core retries a 429 up to three times and honours Retry-After.
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error, apiKey);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NangoError(`Nango request failed: ${error.message}`, {
				cause: error,
				method,
			});
		}
		throw new NangoError('Nango request failed', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Encodes a proxy path segment by segment. `.` and `..` segments are refused so
 * a path cannot climb out of `/proxy/` onto Nango's own API with the
 * environment key.
 */
export function proxyPath(path: string): string {
	const trimmed = path.replace(/^\/+/, '');
	const segments = trimmed.split('/');
	if (segments.some((part) => part === '.' || part === '..'))
		throw new Error('Proxy path may not contain "." or ".." segments');
	return `/proxy/${segments.map((part) => encodeURIComponent(part)).join('/')}`;
}
