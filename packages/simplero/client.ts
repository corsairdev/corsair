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
 * comes from a gateway. Core retries it three times on Retry-After (R8); the
 * plugin's handler does not add more.
 */
const SIMPLERO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A request that never reached Simplero (DNS, reset, timeout). HTTP failures
 * are not wrapped: core's `ApiError` passes through (see `withoutRequestData`) so
 * its `status`, `retryAfter`, `request` and `body` reach core and the caller.
 * The key travels in the config headers, which core never copies onto an error.
 *
 * Simplero sends two error shapes, `{ "error": "Bad API key" }` (401 and often
 * elsewhere) and `{ "errors": ["…"] }` on a 422; `describeSimpleroError` turns
 * either into a sentence. A 503 can mean the idempotency store could not be
 * checked, in which case the action did not run.
 *
 * https://simplero.com/api/v2/docs
 */
export class SimpleroAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SimpleroAPIError';
		this.method = options.method;
	}
}

/**
 * Query filters that carry a person's details: the contact and subscription
 * lists filter by email and name, and `q` is free-text search.
 */
const PERSONAL_QUERY = new Set(['email', 'first_names', 'last_name', 'q']);
const REDACTED = '[REDACTED]';

function maskUrl(value: string): string {
	const at = value.indexOf('?');
	if (at === -1) return value;
	const params = value
		.slice(at + 1)
		.split('&')
		.map((pair) => {
			const raw = pair.split('=')[0] ?? '';
			let name = raw;
			try {
				name = decodeURIComponent(raw);
			} catch {
				name = raw;
			}
			return PERSONAL_QUERY.has(name) ? `${raw}=${REDACTED}` : pair;
		});
	return `${value.slice(0, at)}?${params.join('&')}`;
}

/**
 * Core's ApiError is passed through unchanged unless the request carried
 * personal data: a sent body (contacts and purchases hold names, emails,
 * addresses) or a personal query filter, which core keeps on `request` and in
 * `url`. Only then is it rebuilt, with the body dropped and those filters
 * masked; status, message, response body and rate-limit fields are kept, and
 * Simplero's own text stays readable on `body`.
 */
function withoutRequestData(error: ApiError): ApiError {
	const { body: sentBody, query, ...request } = error.request;
	const personalQuery = Object.keys(query ?? {}).some((key) =>
		PERSONAL_QUERY.has(key),
	);
	if (sentBody === undefined && !personalQuery) return error;
	const maskedQuery = query
		? Object.fromEntries(
				Object.entries(query).map(([key, value]) => [
					key,
					PERSONAL_QUERY.has(key) ? REDACTED : value,
				]),
			)
		: undefined;
	return new ApiError(
		{
			...request,
			url: maskUrl(error.request.url),
			...(maskedQuery ? { query: maskedQuery } : {}),
		},
		{
			url: maskUrl(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
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
 * The spec asks for an identifying User-Agent of the form `App (contact email)`,
 * and Simplero has answered 400 "Incorrect User-Agent" to one without an email.
 * team@corsair.dev is Corsair's published contact address.
 */
export const SIMPLERO_USER_AGENT = 'Corsair (team@corsair.dev)';

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
		if (error instanceof ApiError) throw withoutRequestData(error);
		// A transport failure never held a body or headers, so its cause is safe to
		// keep. DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SimpleroAPIError(error.message, { cause: error, method });
		}
		throw new SimpleroAPIError('Unknown Simplero error', { method });
	}
}
