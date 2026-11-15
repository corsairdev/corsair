import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonObject, UnknownJson } from './json';

/**
 * One host for every account: unlike the Classic API, the host does not vary by
 * subdomain, and the bearer token identifies the tenant.
 */
export const SIMPLEKPI_API_BASE = 'https://api.simplekpi.com';

/**
 * Two limits apply and a request has to satisfy both: 300 per 60 seconds per
 * client and 600 per 60 seconds per key. Both answer 429 with a Retry-After.
 * Retries live in error-handlers.ts, so the client makes one attempt.
 */
const SIMPLEKPI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Failures are RFC 7807 problem details, served as `application/problem+json`:
 *
 * ```json
 * { "type", "title", "status", "detail", "instance", "trace_id" }
 * ```
 *
 * A 400 caused by the request contents adds `errors`, a map from field name to
 * the list of things wrong with it. That map is the part worth showing a
 * caller, so it is exposed directly.
 *
 * https://support.simplekpi.com/ai-core/api/errors
 */
export class SimplekpiAPIError extends Error {
	readonly status?: number;
	/** The problem type URI, when the API sent one. */
	readonly type?: string;
	/** What went wrong with this request, as opposed to its type. */
	readonly detail?: string;
	/** Field name to messages, from a 400 validation failure. */
	readonly fieldErrors?: Record<string, string[]>;
	/** The server's trace id, for a support request. */
	readonly traceId?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// A problem body is typed, but a proxy can answer HTML or nothing at all.
	readonly body?: UnknownJson; // unknown: see the note above

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: UnknownJson; // unknown: same open problem body as the field above
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SimplekpiAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.type = readString(record, 'type');
		this.detail = readString(record, 'detail');
		this.traceId = readString(record, 'trace_id');
		this.fieldErrors = readFieldErrors(record?.errors);
	}

	/** True when the key was missing, malformed, unrecognised, expired or revoked. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * True when the key is valid but lacks the scope the route needs. A write
	 * scope does not imply its read scope, so this is a real and common case.
	 */
	get isScopeError(): boolean {
		return this.status === 403;
	}
}

// The record is an untyped problem body; read one field at a time.
function readString(
	record: JsonObject | null | undefined, // unknown: untyped problem body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** A 400 `errors` object maps a field name to a list of messages. */
function readFieldErrors(
	value: UnknownJson, // unknown: `errors` maps fields to message arrays
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
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function describeSimplekpiError(
	status: number | undefined,
	body: UnknownJson, // unknown: a problem body can be text, HTML or empty
	fallback: string,
): string {
	const record = asRecord(body);
	const fieldErrors = readFieldErrors(record?.errors);
	// A validation 400 carries the field errors and a generic `title` ("One or
	// more validation errors occurred"), so the field map is the useful part and
	// wins over the title. `detail`, when present, is written for a human and
	// wins over both.
	const text =
		readString(record, 'detail') ??
		(fieldErrors ? describeFieldErrors(fieldErrors) : undefined) ??
		readString(record, 'title') ??
		fallback;
	return status === undefined ? text : `SimpleKPI ${status}: ${text}`;
}

function describeFieldErrors(errors: Record<string, string[]>): string {
	return Object.entries(errors)
		.map(([field, messages]) => `${field}: ${messages.join('; ')}`)
		.join('. ');
}

export type SimplekpiQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SimplekpiRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: SimplekpiQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: UnknownJson; // unknown: the endpoint's input schema validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema. It is undefined
// for the 204 every delete answers. unknown: the shape differs per route, which
// is what the endpoint's output schema is for.
export async function makeSimplekpiRequest(
	apiKey: string,
	{ method, path, query, body }: SimplekpiRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMPLEKPI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// A literal header, because the token is not a Bearer value the core
			// client can build from a resolver: sending it this way keeps the
			// exact `Bearer <key>` shape the API documents.
			Authorization: `Bearer ${apiKey}`,
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
		// unknown: see the note on makeSimplekpiRequest.
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SIMPLEKPI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including the Authorization header, so `util.inspect(error)` would
			// print the key. The fields below are what a caller and the replay
			// gate need.
			throw new SimplekpiAPIError(
				describeSimplekpiError(error.status, error.body, error.message),
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
			throw new SimplekpiAPIError(error.message, { cause: error, method });
		}
		throw new SimplekpiAPIError('Unknown SimpleKPI error', { method });
	}
}
