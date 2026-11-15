import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { UnknownJson } from './json';

/**
 * The version segment is **`v1.0`**, not `v1`: a request to `/v1/contacts`
 * answers 405 Method Not Allowed, which reads like a routing bug rather than a
 * wrong base. The docs' own examples use `/v1.0`.
 */
export const SUPERCHAT_API_BASE = 'https://api.superchat.com/v1.0';

/**
 * Each workspace gets 2500 requests per 5-minute window, shared across its API
 * keys, and a trial workspace is capped at 10000 calls for its whole lifetime.
 * A 429 is therefore either a short window or an exhausted trial, and only the
 * window is worth retrying; the handler retries three times because Superchat
 * documents no way to tell them apart in the body.
 */
const SUPERCHAT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Superchat sends its failures as
 * `{ exception, exceptionCode, userErrorMessage }`. The user message is in
 * German on some routes ("Methode nicht erlaubt"), so the code is the part worth
 * matching on.
 *
 * **A missing key is 401 and a wrong key is 403.** The 403 is not a permission
 * problem, so treating it as one would send a caller looking for a scope they do
 * not need.
 */
export class SuperchatAPIError extends Error {
	readonly status?: number;
	/** The provider's exception class, such as ApplicationException. */
	readonly exception?: string;
	/** A machine-readable code, such as MethodNotAllowedException. */
	readonly code?: string;
	/** The provider's own message, which may be in German. */
	readonly userMessage?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: an error body is an exception envelope, but a proxy can answer HTML.
	readonly body?: UnknownJson;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: UnknownJson;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SuperchatAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const record = asRecord(this.body);
		this.exception = readString(record, 'exception');
		this.code = readString(record, 'exceptionCode');
		this.userMessage = readString(record, 'userErrorMessage');
	}

	/** True when the key is missing (401) or not valid (403). */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** True when the record is gone. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 'NotFoundException';
	}
}

// unknown: the record is an untyped exception body; read one field at a time.
function readString(
	record: Record<string, UnknownJson> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see SuperchatAPIError.
export function describeSuperchatError(
	status: number | undefined,
	body: UnknownJson,
	fallback: string,
): string {
	const record = asRecord(body);
	const code = readString(record, 'exceptionCode');
	const message = readString(record, 'userErrorMessage');
	// The code identifies the failure; the message can be localised, so both are
	// kept and the code leads.
	const text = [code, message].filter((part) => part !== undefined).join(': ');
	const detail = text.length > 0 ? text : fallback;
	return status === undefined ? detail : `Superchat ${status}: ${detail}`;
}

export type SuperchatQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SuperchatRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: SuperchatQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: UnknownJson; // unknown: the endpoint's input schema validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema, and the
// shape differs per route, which is what that schema is for.
export async function makeSuperchatRequest(
	apiKey: string,
	{ method, path, query, body }: SuperchatRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SUPERCHAT_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// A literal header: Superchat takes the raw token, not a Bearer value.
			'X-API-KEY': apiKey,
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
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SUPERCHAT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including the X-API-KEY header, so `util.inspect(error)` would print
			// the key.
			throw new SuperchatAPIError(
				describeSuperchatError(error.status, error.body, error.message),
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
			throw new SuperchatAPIError(error.message, { cause: error, method });
		}
		throw new SuperchatAPIError('Unknown Superchat error', { method });
	}
}
