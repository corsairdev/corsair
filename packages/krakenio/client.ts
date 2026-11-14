import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KRAKEN_API_BASE = 'https://api.kraken.io';

// An optimization holds the connection open while Kraken fetches and re-encodes
// the image, and a large PDF can take well over the 20 second default in
// corsair/http.
const KRAKEN_TIMEOUT_MS = 120_000;

/**
 * Kraken authenticates **inside the JSON body**, not with a header:
 *
 * ```json
 * { "auth": { "api_key": "...", "api_secret": "..." } }
 * ```
 *
 * That matters for error handling. `ApiError` redacts only query parameters
 * named `api_key`, `key`, `token` or `appid`, and it does not redact a body at
 * all, so the `ApiError` core throws would print the secret through
 * `console.error` and `util.inspect`. The client therefore rethrows it as a
 * new `ApiError` without the request body (`sanitizeApiError`).
 */
export type KrakenCredentials = {
	apiKey: string;
	apiSecret: string;
};

// Kraken does not publish a rate limit header or a 429 in its docs. If one
// arrives, core retries it three times, honouring Retry-After: Kraken refused
// the request before running it, so nothing was fetched or billed. The 429
// handler then adds no retries of its own.
const KRAKEN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Kraken answers a failure with `{ success: false, message }`, on a status that
 * varies: 401 for an unknown key, 422 for a missing parameter, 500 for its own
 * failure. A 200 with `success: false` is also possible on a per-image failure.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readFailure(body: unknown): {
	success?: boolean;
	message?: string;
} {
	const record = asRecord(body);
	// `/user_status` names its reason `error`; the optimize routes say `message`.
	const message = record?.message ?? record?.error;
	const success = record?.success;
	return {
		success: typeof success === 'boolean' ? success : undefined,
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
	};
}

/**
 * A Kraken failure that is not an HTTP error: a 200 whose body says
 * `success: false`, or a request that got no answer (a reset, DNS failure,
 * abort or timeout).
 *
 * An HTTP error stays core's `ApiError`, rebuilt without the request body (see
 * `sanitizeApiError`), so its status, Retry-After and rate-limit fields reach
 * core and the error handlers.
 */
export class KrakenAPIError extends Error {
	readonly status?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KrakenAPIError';
		this.status = options.status;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/**
 * Kraken refused the key or secret. The optimize routes say 401;
 * `/user_status` says 404 "User not found" (seen live on 11-14).
 */
// unknown: callers pass whatever they caught; `instanceof ApiError` narrows it.
export function isKrakenAuthFailure(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	return (
		error.status === 401 ||
		(error.status === 404 && error.request.url === '/user_status')
	);
}

/** The message Kraken sent, with the status in front. */
// unknown: an error body is untyped: a `{ success, message }` envelope, or an
// HTML error page from the framework.
export function describeKrakenError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readFailure(body).message ?? fallback;
	return status === undefined ? text : `Kraken ${status}: ${text}`;
}

// Kraken renders an unhandled failure as an HTML page, so a message read from
// that page would be markup. The envelope is what a caller should see instead.
function isHtml(value: string): boolean {
	return value.trimStart().startsWith('<');
}

export type KrakenRequest = {
	path: string;
	// unknown: the endpoint's input schema has already validated the body, which
	// is a JSON document with an `auth` block added here.
	body: Record<string, unknown>;
	/**
	 * A file for `/v1/upload`. Kraken then takes a multipart form: the file part
	 * and a `data` part holding the JSON options. A JSON body there answers 500.
	 */
	file?: { bytes: Uint8Array; filename: string };
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKrakenRequest(
	credentials: KrakenCredentials,
	{ path, body, file }: KrakenRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KRAKEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KRAKEN_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	const payload = {
		...body,
		// The one place the credentials travel. Never logged, and never kept on
		// an error.
		auth: {
			api_key: credentials.apiKey,
			api_secret: credentials.apiSecret,
		},
	};
	const requestOptions: ApiRequestOptions = file
		? {
				method: 'POST',
				url: path,
				// corsair/http serializes the `data` object as JSON text and lets
				// fetch set the multipart boundary.
				formData: {
					data: payload,
					file: new File([file.bytes], file.filename),
				},
			}
		: {
				method: 'POST',
				url: path,
				body: payload,
				mediaType: 'application/json',
			};

	try {
		// unknown: the caller parses the response with the endpoint's output schema.
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: KRAKEN_RATE_LIMIT_CONFIG,
		});
		// A 200 that says `success: false` is a failure, and the only way to tell
		// is the body.
		const failure = readFailure(raw);
		if (failure.success === false) {
			// The body says no even though the status said yes, so the status is
			// not part of the message: `200` would read as a success.
			const text = failure.message ?? 'Kraken refused the request';
			throw new KrakenAPIError(`Kraken refused the request: ${text}`, {
				status: 200,
				method: 'POST',
			});
		}
		return raw;
	} catch (error) {
		if (error instanceof KrakenAPIError) throw error;
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, and its cause is the
			// only thing that says why the connection dropped.
			throw new KrakenAPIError(error.message, {
				cause: error,
				method: 'POST',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KrakenAPIError('Unknown Kraken error', {
			method: 'POST',
			transport: true,
		});
	}
}

/**
 * Core's `ApiError` keeps `request.body` (or `formData`), and here that holds
 * the API secret, which `util.inspect` would print. The error is rebuilt as an
 * `ApiError` with the same method, route, status and rate-limit fields, the
 * request body dropped, and Kraken's envelope as the body. Kraken renders an
 * unhandled failure as an HTML page, so markup is never used as the message;
 * a fixed message that names the status takes its place.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const { body: _body, formData: _formData, ...request } = error.request;
	const fields = readFailure(error.body);
	const message =
		fields.message && !isHtml(fields.message) ? fields.message : undefined;
	const fallback =
		error.status >= 500
			? 'Kraken failed to handle the request'
			: 'Kraken refused the request';
	return new ApiError(
		request,
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: { success: false, ...(message ? { message } : {}) },
		},
		describeKrakenError(
			error.status,
			{ message: message ?? fallback },
			fallback,
		),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** Drops the keys whose value is undefined, so a body carries only what was asked for. */
// unknown: an option map per request, validated by the input schema first.
export function definedBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(body).filter(([, value]) => value !== undefined),
	);
}
