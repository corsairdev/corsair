import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Every endpoint is a POST under this host, with the path in the body's place. */
export const ADYNTEL_API_BASE = 'https://api.adyntel.com';

// A scrape can take most of a minute: Adyntel's own Google endpoint documents a
// 60 second sync limit, so corsair/http's 20 second default would abort calls
// that the API still answers.
const ADYNTEL_TIMEOUT_MS = 90_000;

// Adyntel puts the key and the account email in the JSON body, not in a header.
// Both are checked on every call, so a key alone is a 401.
const ADYNTEL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Marker message that makes a 204 raise an `ApiError` instead of resolving an
 * empty body, so the caller can tell "the API found nothing" from "the body
 * could not be read". `catchErrorCodes` only needs the status to be a key.
 */
const NO_CONTENT = 'No Content';

// unknown: the body is an untyped error body until asRecord narrows it.
function readMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	return readString(record, 'message') ?? readString(record, 'detail');
}

function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Adyntel answers errors in two shapes. Most endpoints send
 * `{ message }`, the TikTok ones send `{ detail }`.
 *
 * Docs: https://docs.adyntel.com/openapi-docs/existing-endpoints
 */
export class AdyntelAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Adyntel sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The Adyntel operation name, e.g. `googleAds`, used to pick a retry. */
	readonly operation?: string;
	/**
	 * A non-zero business code the API sent with a 200, as TikTok's endpoints
	 * do. Distinguishes a provider rejection from a transport failure, which
	 * both arrive here without an HTTP status.
	 */
	readonly providerCode?: number;
	// unknown: error bodies are usually `{ message }` or `{ detail }`, but a
	// proxy in front of the API can answer with HTML or plain text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
			operation?: string;
			providerCode?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'AdyntelAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.operation = options.operation;
		this.providerCode = options.providerCode;
	}

	/** True for a 429. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** True when the API answered 200 but reported a failure in its body. */
	get isProviderRejection(): boolean {
		return this.providerCode !== undefined;
	}
}

// unknown: see AdyntelAPIError.
export function describeAdyntelError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readMessage(body) ?? fallback;
	return status === undefined ? text : `Adyntel ${status}: ${text}`;
}

export type AdyntelRequest = {
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body: unknown;
	/** The API's own operationId; it names reads in error-handlers.ts. */
	operation: string;
};

/**
 * A 204 is the API's "nothing found" answer, and several endpoints use it. It
 * is returned as its own kind rather than as an `undefined` body, because
 * `corsair/http` also yields `undefined` when reading a 200 body throws. Those
 * two must not be confused: one is an empty result, the other is a failed read
 * that has to surface.
 */
export type AdyntelResponse =
	| { kind: 'body'; body: unknown }
	| { kind: 'no-content' };

/**
 * `ApiError` retains the `ApiRequestOptions` it was built from, and this
 * plugin's request body carries the API key and the account email. Copying only
 * the fields a caller can act on keeps both credentials out of the cause, so
 * logging the error or shipping it to an error tracker cannot leak them.
 * `ApiError` redacts only URL and query parameters, not the body.
 */
function sanitizeApiError(error: ApiError): Error {
	const sanitized = new Error(error.message);
	sanitized.name = 'ApiError';
	Object.assign(sanitized, {
		status: error.status,
		statusText: error.statusText,
		url: error.url,
		retryAfter: error.retryAfter,
	});
	return sanitized;
}

// unknown: the response body has not been parsed by the output schema yet, and
// the same openness covers the `request` call inside.
export async function makeAdyntelRequest(
	credentials: { apiKey: string; email: string },
	{ path, body, operation }: AdyntelRequest,
): Promise<AdyntelResponse> {
	const config: OpenAPIConfig = {
		BASE: ADYNTEL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: ADYNTEL_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/${path}`,
		// Credentials go last so an endpoint's own field cannot overwrite them.
		body: {
			...(asRecord(body) ?? {}),
			email: credentials.email,
			api_key: credentials.apiKey,
		},
		mediaType: 'application/json',
		// `errors` replaces the whole default map, so it keeps every status this
		// plugin already handled and adds 204 at the lowest priority: 204 is the
		// API's "nothing found" and is the only status that may resolve empty.
		errors: {
			400: 'Bad Request',
			401: 'Unauthorized',
			403: 'Forbidden',
			404: 'Not Found',
			429: 'Too Many Requests',
			500: 'Internal Server Error',
			502: 'Bad Gateway',
			503: 'Service Unavailable',
			204: NO_CONTENT,
		},
	};

	try {
		const result = await request<unknown>(config, requestOptions, {
			rateLimitConfig: ADYNTEL_RATE_LIMIT_CONFIG,
		});
		// A real 204 never reaches this line: it is raised through the `errors`
		// map above and handled in the catch. `corsair/http` returns `undefined`
		// here when a 2xx body could not be read, which is a failure, not an
		// empty result, so it must not be reported as no-content.
		if (result === undefined) {
			throw new AdyntelAPIError(
				`Adyntel ${operation} returned an unreadable body`,
				{ method: 'POST', operation },
			);
		}
		return { kind: 'body', body: result };
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 204) return { kind: 'no-content' };
			throw new AdyntelAPIError(
				describeAdyntelError(error.status, error.body, error.message),
				{
					// The sanitized cause is a plain Error, so the status this class
					// reads is passed explicitly rather than copied from the cause.
					status: error.status,
					retryAfter: error.retryAfter,
					method: 'POST',
					cause: sanitizeApiError(error),
					operation,
				},
			);
		}
		// Re-throw our own unreadable-body error rather than wrapping it again.
		if (error instanceof AdyntelAPIError) throw error;
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new AdyntelAPIError(error.message, {
				cause: error,
				method: 'POST',
				operation,
			});
		}
		throw new AdyntelAPIError('Unknown Adyntel error', {
			method: 'POST',
			operation,
		});
	}
}
