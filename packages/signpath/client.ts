import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The spec's server is `/Api`, and every operation below `/v1` carries the
 * organization id in the path, so the base ends at `/Api`.
 */
export const SIGNPATH_API_BASE = 'https://app.signpath.io/Api';

/**
 * Signing requests are asynchronous: a submit answers as soon as SignPath has
 * queued the work. The artifact upload on `SubmitWithArtifact` can carry a
 * release build of several hundred MB, so the 20 second default is too short.
 */
const SIGNPATH_TIMEOUT_MS = 120_000;

// Retries live in error-handlers.ts, so the client makes one attempt and only
// records Retry-After. SignPath documents no rate limit and sends no
// rate-limit headers; a 429 from a gateway still reaches the handler because
// the complete config below keeps `enabled` and `headerNames` set.
const SIGNPATH_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * SignPath answers every failure with RFC 7807 `application/problem+json`:
 * `{ type, title, status, detail, traceId }`. `detail` is the message worth
 * showing; `title` is the generic reason phrase.
 */
export class SignpathAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The server's trace id, useful in a support request. */
	readonly traceId?: string;
	// A problem body is `{ type, title, status, detail, traceId }` by contract,
	// but a proxy can answer HTML or plain text instead.
	readonly body?: unknown; // unknown: a proxy can answer non-JSON on failure

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: unknown; // unknown: same open problem body as the field above
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SignpathAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.traceId = readString(asRecord(this.body), 'traceId');
	}

	/** True when the caller's token was rejected or lacks the organization. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** True when the caller is authenticated but the operation is not allowed. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}
}

// The record is an untyped problem body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined, // unknown: untyped body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeSignpathError(
	status: number | undefined,
	body: unknown, // unknown: see SignpathAPIError, the body can be anything
	fallback: string,
): string {
	const record = asRecord(body);
	// `detail` carries the specific reason ("Project 'x' already exists"),
	// `title` only the reason phrase, so detail wins when both are present.
	const text =
		readString(record, 'detail') ?? readString(record, 'title') ?? fallback;
	return status === undefined ? text : `SignPath ${status}: ${text}`;
}

export type SignpathQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type SignpathRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: SignpathQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: unknown; // unknown: the endpoint's input schema already validated it
	/** A multipart body; `request` builds the FormData from these fields. */
	formData?: Record<string, unknown>; // unknown: string or File parts
	/** Overrides the default JSON media type, e.g. for XML. */
	mediaType?: string;
	/** Accept header, for the routes that answer XML or PEM rather than JSON. */
	accept?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema. It is undefined
// for the bodyless answers: 204 on Edit, and the downloads, which this client
// does not fetch. unknown: the endpoint's output schema narrows it.
export async function makeSignpathRequest(
	apiKey: string,
	{ method, path, query, body, formData, mediaType, accept }: SignpathRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: SIGNPATH_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: SIGNPATH_TIMEOUT_MS,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			Accept: accept ?? 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		formData,
		// A multipart body must leave Content-Type unset so fetch adds the
		// boundary; only an explicit JSON/XML media type is worth sending.
		mediaType:
			formData !== undefined ? undefined : (mediaType ?? 'application/json'),
	};

	try {
		// unknown: see the note above; the caller parses this with its schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SIGNPATH_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached. ApiError carries the request,
			// including the Authorization header, so `util.inspect(error)` on a
			// wrapped cause would print the token. The fields below are everything
			// a caller and the replay gate need.
			throw new SignpathAPIError(
				describeSignpathError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// A transport failure never held a body or headers, so its cause is safe
		// to keep, and it is what tells a retry that nothing reached SignPath.
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SignpathAPIError(error.message, { cause: error, method });
		}
		throw new SignpathAPIError('Unknown SignPath error', { method });
	}
}
