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
 * all, so keeping the `ApiError` as `cause` would print the secret through
 * `console.error` and `util.inspect`. The client therefore drops the cause on a
 * provider failure and copies only the status and message.
 */
export type KrakenCredentials = {
	apiKey: string;
	apiSecret: string;
};

// Kraken does not publish a rate limit header or a 429 in its docs; a 401 for a
// spent account is the closest thing to a limit. The config is complete so the
// retry layer behaves predictably either way.
const KRAKEN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
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
	const message = record?.message;
	const success = record?.success;
	return {
		success: typeof success === 'boolean' ? success : undefined,
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
	};
}

/**
 * A Kraken failure. It never holds the request body, because the body carries
 * the API secret.
 */
export class KrakenAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Kraken sent one. */
	readonly retryAfter?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KrakenAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** An unknown API key, or an account that is not active. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The plan's quota is spent, which no retry can fix. */
	get isQuotaError(): boolean {
		return this.status === 403;
	}

	/** The request was malformed: a missing `url`, or no `wait` and no callback. */
	get isValidationError(): boolean {
		return this.status === 422;
	}
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
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKrakenRequest(
	credentials: KrakenCredentials,
	{ path, body }: KrakenRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KRAKEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KRAKEN_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: path,
		body: {
			...body,
			// The one place the credentials travel. Never logged, and never kept on
			// an error.
			auth: {
				api_key: credentials.apiKey,
				api_secret: credentials.apiSecret,
			},
		},
		mediaType: 'application/json',
	};

	try {
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
		if (error instanceof ApiError) {
			const fields = readFailure(error.body);
			// An HTML body is Kraken's own crash page, whose text is markup.
			const message =
				fields.message && !isHtml(fields.message)
					? fields.message
					: error.status === 500
						? 'Kraken failed to handle the request'
						: error.message;
			// The cause is dropped: `ApiError.request.body` holds the API secret,
			// and `util.inspect` would print it.
			throw new KrakenAPIError(
				describeKrakenError(error.status, { message }, message),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method: 'POST',
				},
			);
		}
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

/** Drops the keys whose value is undefined, so a body carries only what was asked for. */
// unknown: an option map per request, validated by the input schema first.
export function definedBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(body).filter(([, value]) => value !== undefined),
	);
}
