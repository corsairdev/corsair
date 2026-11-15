import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonObject, UnknownJson } from './json';

export const SIMPLERO_API_BASE = 'https://simplero.com';

/**
 * The spec documents no rate limit and no rate-limit headers, so a 429 here
 * comes from a gateway. Retries live in error-handlers.ts.
 */
const SIMPLERO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Simplero sends two error shapes:
 *
 * - `{ "error": "Bad API key" }` on a 401, and often elsewhere.
 * - `{ "errors": ["…"] }` on a 422, one string per problem.
 *
 * A 503 can mean the idempotency store could not be checked, in which case the
 * action did not run and the same key may be retried.
 *
 * https://simplero.com/api/v2/docs
 */
export class SimpleroAPIError extends Error {
	readonly status?: number;
	/** The single message from `error`, when the API sent that shape. */
	readonly reason?: string;
	/** Every message from a 422 `errors` array. */
	readonly errors?: string[];
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
		this.name = 'SimpleroAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.reason = readString(record, 'error');
		this.errors = readStrings(record?.errors);
	}

	/** True when the API key was missing or not recognised. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * True when the key is valid but the account may not perform the change.
	 * With an `Idempotency-Key` this also means permissions changed after the
	 * original request, which is worth reading as its own case.
	 */
	get isPermissionError(): boolean {
		return this.status === 403;
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

function readStrings(
	value: UnknownJson, // unknown: `errors` is documented as a string array
): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const strings = value.filter(
		(entry): entry is string => typeof entry === 'string',
	);
	return strings.length > 0 ? strings : undefined;
}

export function describeSimpleroError(
	status: number | undefined,
	body: UnknownJson, // unknown: an error body can be text, HTML or empty
	fallback: string,
): string {
	const record = asRecord(body);
	const errors = readStrings(record?.errors);
	// A 422 carries a list rather than a sentence, so the list is the message.
	const text =
		readString(record, 'error') ??
		readString(record, 'message') ??
		(errors ? errors.join('; ') : fallback);
	return status === undefined ? text : `Simplero ${status}: ${text}`;
}

export type SimpleroQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type SimpleroRequest = {
	method: 'GET' | 'POST' | 'PATCH';
	path: string;
	query?: SimpleroQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: unknown; // unknown: the endpoint's input schema already validated it
	/**
	 * Sent as `Idempotency-Key` on a write. Simplero saves the response for 24
	 * hours and replays it to an identical retry, so this is what makes a retry
	 * of a create safe.
	 */
	idempotencyKey?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * The spec asks for an identifying User-Agent: an app name and a contact email.
 * Simplero can then reach whoever owns the integration rather than blocking it.
 */
const SIMPLERO_USER_AGENT = 'Corsair (https://corsair.dev)';

// Callers parse the body with the endpoint's zod output schema, and the shape
// differs per route, which is what that schema is for. unknown: the schema
// narrows it before a caller sees it.
export async function makeSimpleroRequest(
	apiKey: string,
	{ method, path, query, body, idempotencyKey }: SimpleroRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMPLERO_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-API-Key': apiKey,
			'User-Agent': SIMPLERO_USER_AGENT,
			Accept: 'application/json',
			...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
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
		// unknown: see the note on makeSimpleroRequest.
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SIMPLERO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including the X-API-Key header, so `util.inspect(error)` would print
			// the key.
			throw new SimpleroAPIError(
				describeSimpleroError(error.status, error.body, error.message),
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
			throw new SimpleroAPIError(error.message, { cause: error, method });
		}
		throw new SimpleroAPIError('Unknown Simplero error', { method });
	}
}
