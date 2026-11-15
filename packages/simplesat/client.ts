import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonObject, UnknownJson } from './json';

export const SIMPLESAT_API_BASE = 'https://api.simplesat.io';

/**
 * Simplesat documents no rate limit and no rate-limit headers, so a 429 here
 * comes from a gateway. Retries live in error-handlers.ts.
 */
const SIMPLESAT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Simplesat's failures come in two shapes:
 *
 * - `{ "detail": "Invalid Token." }` for auth, a missing record, and a
 *   malformed request.
 * - `{ "field": ["This field is required."] }` for a 400 that names fields,
 *   which is what `customers/bulk` and `responses/create-or-update` answer.
 *
 * **A bad key answers 403, not 401.** The API answers `403 Invalid Token.` for
 * a missing or unrecognised token on every route, so a 403 here is an auth problem
 * rather than a permission one, which is the opposite of most providers.
 *
 * Contract: https://developer.simplesat.io/api
 */
export class SimplesatAPIError extends Error {
	readonly status?: number;
	/** The single message from `detail`, when the API sent that shape. */
	readonly detail?: string;
	/** Field name to messages, from a 400 that names fields. */
	readonly fieldErrors?: Record<string, string[]>;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// An error body is one of the shapes above, but a proxy can answer HTML or
	// nothing at all.
	readonly body?: UnknownJson; // unknown: see the note above

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: UnknownJson; // unknown: same open error body as the field above
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SimplesatAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.detail = readString(record, 'detail');
		this.fieldErrors = readFieldErrors(this.body);
	}

	/**
	 * True when the key is missing, unrecognised or lacks a route's scope.
	 * Simplesat answers 403 for all of those, so a 401 is included in case it
	 * ever starts using one.
	 */
	get isAuthError(): boolean {
		if (this.status === 401 || this.status === 403) return true;
		const detail = this.detail?.toLowerCase() ?? '';
		return (
			detail.includes('invalid token') ||
			detail.includes('no api key') ||
			detail.includes('not authenticated')
		);
	}

	/** True when the record was not found, which Simplesat reports as a 404. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

// The record is an untyped error body; read one field at a time.
function readString(
	record: JsonObject | null | undefined, // unknown: untyped error body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * A 400 body maps a field name to its messages. `detail` is a string rather
 * than a list, so it is not mistaken for a field named `detail`.
 */
function readFieldErrors(
	body: UnknownJson, // unknown: an error body, whose fields are checked below
): Record<string, string[]> | undefined {
	const record = asRecord(body);
	if (!record) return undefined;

	const out: Record<string, string[]> = {};
	for (const [field, messages] of Object.entries(record)) {
		if (field === 'detail') continue;
		if (Array.isArray(messages)) {
			const strings = messages.filter(
				(entry): entry is string => typeof entry === 'string',
			);
			if (strings.length > 0) out[field] = strings;
		} else if (typeof messages === 'string') {
			out[field] = [messages];
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function describeSimplesatError(
	status: number | undefined,
	body: UnknownJson, // unknown: an error body can be text, HTML or empty
	fallback: string,
): string {
	const record = asRecord(body);
	const fieldErrors = readFieldErrors(body);
	const text =
		readString(record, 'detail') ??
		(fieldErrors ? describeFieldErrors(fieldErrors) : fallback);
	return status === undefined ? text : `Simplesat ${status}: ${text}`;
}

function describeFieldErrors(errors: Record<string, string[]>): string {
	return Object.entries(errors)
		.map(([field, messages]) => `${field}: ${messages.join('; ')}`)
		.join('. ');
}

export type SimplesatQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SimplesatRequest = {
	method: 'GET' | 'POST' | 'PUT';
	path: string;
	query?: SimplesatQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: unknown; // unknown: the endpoint's input schema already validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema, and the shape
// differs per route, which is what that schema is for. unknown: the schema
// narrows it before a caller sees it.
export async function makeSimplesatRequest(
	apiKey: string,
	{ method, path, query, body }: SimplesatRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMPLESAT_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// A literal header: the key is not a Bearer token, and the header name
			// is Simplesat's own.
			'X-Simplesat-Token': apiKey,
			Accept: 'application/json',
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
		// unknown: see the note on makeSimplesatRequest.
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SIMPLESAT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including the X-Simplesat-Token header, so `util.inspect(error)`
			// would print the key.
			throw new SimplesatAPIError(
				describeSimplesatError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// A transport failure never held a body or headers, so its cause is safe to
		// keep. DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SimplesatAPIError(error.message, { cause: error, method });
		}
		throw new SimplesatAPIError('Unknown Simplesat error', { method });
	}
}
