import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { UnknownJson } from './json';

export const SIGNWELL_API_BASE = 'https://www.signwell.com/api';

/**
 * SignWell's documented rate limits are tight: 100 requests per 60 seconds per
 * token, 20 per minute in test mode, and 30 per minute for document and
 * template creation. Retries live in error-handlers.ts, so the client makes one
 * attempt and only records Retry-After for the handler to use.
 */
const SIGNWELL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A transport failure (timeout, DNS, reset) before SignWell answered; HTTP
 * errors stay core's ApiError. SignWell has two error body shapes, and the
 * status tells them apart:
 *
 * - 422 `{ errors: { field: [message, …] } }` for validation problems, one
 *   entry per field that failed.
 * - everything else `{ message, meta: { error, message, messages } }`, where
 *   `meta.error` is a machine-readable code such as `api_key_unauthorized_error`.
 *
 * A 429 carries `{ error }` instead, which is why `message` alone is not enough.
 */
export class SignwellAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code from `meta.error`, when SignWell sent one. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Field name to messages, from a 422. */
	readonly fieldErrors?: Record<string, string[]>;
	// An error body is one of the shapes above, but a proxy can answer HTML or
	// plain text instead, so no static type covers it.
	readonly body?: unknown; // unknown: a proxy can answer non-JSON on failure

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: unknown; // unknown: same open error body as the field above
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SignwellAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.code = readString(asRecord(record?.meta), 'error');
		this.fieldErrors = readFieldErrors(record?.errors);
	}

	/** True when the token is missing, revoked or not valid. */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.code === 'missing_authorization_key_error' ||
			this.code === 'api_key_unauthorized_error'
		);
	}
}

// The record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined, // unknown: untyped body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * A 422 `errors` object maps a field name to an array of messages, but SignWell
 * also nests objects for some fields, so anything else is flattened to a single
 * message rather than dropped.
 */
function readFieldErrors(
	value: unknown, // unknown: strings, arrays of strings, or nested objects
): Record<string, string[]> | undefined {
	const record = asRecord(value);
	if (!record) return undefined;

	const out: Record<string, string[]> = {};
	for (const [field, messages] of Object.entries(record)) {
		if (typeof messages === 'string') {
			out[field] = [messages];
		} else if (Array.isArray(messages)) {
			const strings = messages.filter(
				(entry): entry is string => typeof entry === 'string',
			);
			if (strings.length > 0) out[field] = strings;
		} else {
			// unknown: a nested object of field errors; JSON keeps it readable.
			out[field] = [JSON.stringify(messages)];
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function describeSignwellError(
	status: number | undefined,
	body: unknown, // unknown: see SignwellAPIError, an error body can be anything
	fallback: string,
): string {
	const record = asRecord(body);
	const meta = asRecord(record?.meta);
	const fieldErrors = asRecord(record?.errors);
	// A 422 has no message of its own. Only the field names go in the message:
	// SignWell's per-field messages can echo the submitted value (an email, a
	// phone number). The full errors object stays on the error's `body`.
	const text =
		readString(record, 'error') ??
		readString(meta, 'message') ??
		readString(record, 'message') ??
		(fieldErrors && Object.keys(fieldErrors).length > 0
			? `invalid fields: ${Object.keys(fieldErrors).join(', ')}`
			: fallback);
	return status === undefined ? text : `SignWell ${status}: ${text}`;
}

export type SignwellQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type SignwellRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: SignwellQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: unknown; // unknown: the endpoint's input schema already validated it
	/** Extra headers, e.g. `X-TestMode-Enabled`. */
	headers?: Record<string, string>;
	/** Accept header, for the routes that answer a PDF or ZIP. */
	accept?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema. It is undefined
// for the bodyless answers: 204 on every delete. unknown: the shape differs per
// route, which is exactly what the endpoint's output schema is for.
export async function makeSignwellRequest(
	apiKey: string,
	{ method, path, query, body, headers, accept }: SignwellRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIGNWELL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-Api-Key': apiKey,
			Accept: accept ?? 'application/json',
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<UnknownJson>(config, requestOptions, {
			// unknown: see above
			rateLimitConfig: SIGNWELL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Still core's ApiError, so handlers and core keep its status and rate
			// limit fields (rule R8). It is rebuilt only to drop echoed request data:
			// the request body holds recipient emails and phone numbers, and core's
			// fallback message would print a 422 body that can echo them back.
			throw new ApiError(
				{ method: error.request.method, url: error.request.url },
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				describeSignwellError(
					error.status,
					error.body,
					`SignWell request failed with HTTP ${error.status}`,
				),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// A transport failure never held a body or headers, so its cause is safe
		// to keep, and it is what tells a retry that nothing reached SignWell.
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SignwellAPIError(error.message, { cause: error, method });
		}
		throw new SignwellAPIError('Unknown SignWell error', { method });
	}
}
