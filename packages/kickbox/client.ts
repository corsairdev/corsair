import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Two hosts, because the disposable check is a different service:
 *
 * - `api.kickbox.com/v2/verify` takes the key and verifies one address.
 * - `open.kickbox.com/v1/disposable/:address` is free and keyless, which is why
 *   it is on its own host.
 *
 * An EU-only account is served from `api.eu.kickbox.com`, so the host is a
 * plugin option rather than a constant.
 */
export const KICKBOX_API_BASE = 'https://api.kickbox.com';
export const KICKBOX_EU_API_BASE = 'https://api.eu.kickbox.com';
export const KICKBOX_OPEN_BASE = 'https://open.kickbox.com';

// Verification reaches an SMTP server, and Kickbox's own default timeout is six
// seconds with a ceiling of thirty. The HTTP timeout sits five seconds above that
// ceiling, so a check that uses all thirty still has time to send its answer
// back instead of being aborted after Kickbox has charged for it.
const KICKBOX_TIMEOUT_MS = 35_000;

/**
 * Kickbox answers a failure with the same envelope as a success:
 * `{ success: false, code, message }`, where `code` is an upper-case string
 * such as `FORBIDDEN` rather than a status. A spent balance has no code.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readFailure(body: unknown): {
	success?: boolean;
	code?: string;
	message?: string;
} {
	const record = asRecord(body);
	const read = (key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	const success = record?.success;
	const message = read('message');
	// A spent balance arrives as a 403 with only `message: "Insufficient
	// balance"` and no code (live API, 11-14), so the code is filled in here to
	// keep it apart from a refused key, which is also a 403.
	const code =
		read('code') ??
		(message && /insufficient balance/i.test(message)
			? 'INSUFFICIENT_BALANCE'
			: undefined);
	return {
		success: typeof success === 'boolean' ? success : undefined,
		code,
		message,
	};
}

// Kickbox publishes no Retry-After and a 429 for a rate limit, so the handler's
// own backoff is the only delay.
const KICKBOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Kickbox failure.
 *
 * There is one trap worth naming: Kickbox answers `200` with
 * `{ success: false }` for a refused key or a spent balance, so a caller that
 * trusted the status alone would read a failure as a verification result with
 * every field missing. The client throws on that body instead.
 *
 * The key travels in the query string, so the body is dropped: `ApiError`
 * redacts `apikey` in a URL, but it does not redact a body, and a validation
 * failure echoes the request.
 */
export class KickboxAPIError extends Error {
	readonly status?: number;
	/** Kickbox's own code, such as `FORBIDDEN` or `INSUFFICIENT_BALANCE`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Kickbox sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;
	/**
	 * True when the request went to the paid verification host. A dropped or
	 * timed-out paid request may still have been charged, so it is not replayed.
	 */
	readonly paid: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
			paid?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KickboxAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
		this.paid = options.paid ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A refused or missing key. A spent balance is also a 403, but not this. */
	get isAuthError(): boolean {
		if (this.isQuotaError) return false;
		return (
			this.status === 401 || this.status === 403 || this.code === 'FORBIDDEN'
		);
	}

	/** The account has run out of verification credits, which no retry fixes. */
	get isQuotaError(): boolean {
		return this.code === 'INSUFFICIENT_BALANCE';
	}

	/** The address or domain was refused before any lookup. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

/** The message Kickbox sent, with its code in front. */
// unknown: an error body is untyped: a `{ success, code, message }` envelope,
// or text from a proxy that never reached Kickbox.
export function describeKickboxError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readFailure(body);
	const text = fields.message ?? fallback;
	const label = [status, fields.code]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Kickbox ${label}: ${text}` : text;
}

export type KickboxQueryValue = string | number | boolean;

export type KickboxRequest = {
	method: 'GET';
	/** The base to send to, which differs between the keyed and open services. */
	base: string;
	path: string;
	query?: Record<string, KickboxQueryValue | undefined>;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKickboxRequest(
	apiKey: string,
	{ method, base, path, query }: KickboxRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KICKBOX_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	// Everything except the open host spends a verification credit.
	const paid = base !== KICKBOX_OPEN_BASE;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
	};

	try {
		const body = await request<unknown>(config, requestOptions, {
			rateLimitConfig: KICKBOX_RATE_LIMIT_CONFIG,
		});
		// A 200 that says `success: false` is still a failure, and the only way
		// to tell is the body.
		const failure = readFailure(body);
		if (failure.success === false) {
			throw new KickboxAPIError(
				describeKickboxError(undefined, body, 'Kickbox refused the request'),
				{ status: 200, code: failure.code, method, paid },
			);
		}
		return body;
	} catch (error) {
		if (error instanceof KickboxAPIError) throw error;
		if (error instanceof ApiError) {
			const fields = readFailure(error.body);
			throw new KickboxAPIError(
				describeKickboxError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					retryAfter: error.retryAfter,
					method,
					paid,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new KickboxAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
				paid,
			});
		}
		throw new KickboxAPIError('Unknown Kickbox error', {
			method,
			transport: true,
			paid,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KickboxQueryValue | undefined>,
): Record<string, KickboxQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KickboxQueryValue] => entry[1] !== undefined,
		),
	);
}
