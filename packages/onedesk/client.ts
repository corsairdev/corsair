import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The public API lives on the per-organization app host; there is no shared
 * api.onedesk.com route. A self-hosted or white-label installation answers on
 * its own host, which the `host` option overrides.
 */
export const ONEDESK_API_BASE = 'https://app.onedesk.com';

export const ONEDESK_API_PREFIX = '/rest/public';

/** Documented upload and detail responses can take a while. */
const ONEDESK_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the transport makes one attempt and only
// reads Retry-After into the error.
//
// The Retry-After value is parsed by core (`async-core/rate-limit.ts`), which
// uses parseInt and therefore ignores an HTTP-date form. That parser cannot be
// reached from here and core is outside a plugin PR's scope (R1), so the
// plugin keeps the numeric form it can get and relies on its own backoff when
// the header is a date. See the PR notes for the follow-up.
const ONEDESK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * OneDesk signals failure two ways, and the HTTP status is not one of them for
 * the second:
 *
 * - a non-2xx status, which corsair/http turns into an `ApiError`
 * - **HTTP 200 with a `code` field that is not `SUCCESS`**, which every
 *   create, update and filter call can return
 *
 * `ERROR_SECURITY_ACCESS` in a 200 is an authorization failure, and
 * `ERROR_SERVICE_UNAVAILABLE` is worth another attempt. Both are recorded on
 * the error so error-handlers.ts can tell them apart without re-parsing.
 */
export class OnedeskAPIError extends Error {
	readonly status?: number;
	/** OneDesk's own code, e.g. `ERROR_SECURITY_ACCESS`. */
	readonly code?: string;
	readonly retryAfter?: number;
	readonly method?: string;
	/** The path that failed, without the query, for the retry decision. */
	readonly path?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			path?: string;
		} = {},
	) {
		// No cause is kept: it carries the request body, which holds customer
		// records and, on an upload, the raw file.
		super(message);
		this.name = 'OnedeskAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.path = options.path;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	get isAuthFailure(): boolean {
		return this.status === 401;
	}

	get isPermissionFailure(): boolean {
		return this.status === 403 || this.code === 'ERROR_SECURITY_ACCESS';
	}

	/** OneDesk's own transient failure, delivered with HTTP 200. */
	get isTransient(): boolean {
		return this.code === 'ERROR_SERVICE_UNAVAILABLE';
	}

	/** A delete or a timer change, which must never be replayed. */
	get isDestructive(): boolean {
		return (
			this.path?.includes('/timers/cancel') === true ||
			this.path?.includes('/timers/pause') === true
		);
	}
}

/**
 * Reads the `code` from a response envelope. Some calls answer a bare string
 * code instead of an object, so both shapes are accepted.
 */
// unknown: the value is a 2xx envelope with no schema yet applied.
export function envelopeCode(raw: unknown): string | undefined {
	if (typeof raw === 'string') return raw;
	const code = asRecord(raw)?.code;
	return typeof code === 'string' ? code : undefined;
}

/**
 * Turns a 2xx response that says the call failed into an error. OneDesk's
 * success value is `SUCCESS`; every documented failure code is either
 * `ERROR_*` or `INTERNAL_ERROR`, so anything else is passed through rather
 * than guessed at.
 */
// unknown: see envelopeCode.
export function throwIfEnvelopeFailed(
	raw: unknown,
	context: { method?: string; path?: string },
): void {
	const code = envelopeCode(raw);
	if (!code || code === 'SUCCESS') return;
	// A bare string body is the code itself; an object's `code` is only a
	// failure when it says so.
	const isFailure = code.startsWith('ERROR_') || code === 'INTERNAL_ERROR';
	if (!isFailure) return;
	throw new OnedeskAPIError(`OneDesk returned ${code}`, {
		status: 200,
		code,
		method: context.method,
		path: context.path,
	});
}

export type OnedeskQueryValue = string | number | boolean | undefined;

export type OnedeskRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: Record<string, OnedeskQueryValue>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Multipart fields; takes precedence over `body` when set. */
	formData?: Record<string, string | Blob>;
};

export type OnedeskClientOptions = {
	/** A self-hosted or white-label host, e.g. `https://acme.onedesk.com`. */
	host?: string;
};

/**
 * The host is a full origin with no path or credentials. A value that fails
 * this would send the API key to whatever host it names, so it is rejected
 * rather than normalised.
 */
export function resolveBase(host: string | undefined): string {
	if (!host) return ONEDESK_API_BASE;
	let url: URL;
	try {
		url = new URL(host);
	} catch {
		throw new OnedeskAPIError(
			`"${host}" is not a URL. Pass the OneDesk origin, for example https://acme.onedesk.com.`,
		);
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		throw new OnedeskAPIError('The OneDesk host must be an http or https URL.');
	}
	if (url.username || url.password || url.search || url.hash) {
		throw new OnedeskAPIError(
			'The OneDesk host must not carry credentials, a query or a fragment.',
		);
	}
	// A path would be prepended to `/rest/public/...` and silently reach the
	// wrong route, so only the origin (with a trailing slash) is accepted.
	if (url.pathname !== '/' && url.pathname !== '') {
		throw new OnedeskAPIError(
			`"${host}" must be an origin with no path. Pass something like https://acme.onedesk.com.`,
		);
	}
	return url.origin;
}

/**
 * A transport failure never reached OneDesk, so it is reported as its own
 * class: error-handlers.ts can then replay reads without risking a duplicate
 * write, since nothing was recorded on the server.
 */
export class OnedeskTransportError extends OnedeskAPIError {
	constructor(message: string, options: { method?: string; path?: string }) {
		super(message, options);
		this.name = 'OnedeskTransportError';
	}
}

// unknown: callers parse the success body with the endpoint's zod schema.
export async function makeOnedeskRequest(
	apiKey: string,
	{ method, path, query, body, formData }: OnedeskRequest,
	options: OnedeskClientOptions = {},
): Promise<unknown> {
	const hasBody = method === 'POST';
	const url = `${ONEDESK_API_PREFIX}${path}`;

	const config: OpenAPIConfig = {
		BASE: resolveBase(options.host),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: ONEDESK_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'OD-Public-API-Key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query,
		formData,
		// A multipart request must not also carry a JSON body or media type.
		body: formData ? undefined : hasBody ? (body ?? {}) : undefined,
		mediaType:
			formData || !hasBody ? undefined : 'application/json; charset=utf-8',
	};

	try {
		// unknown: callers parse the success body with the endpoint's schema.
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: ONEDESK_RATE_LIMIT_CONFIG,
		});
		// A 200 can still be a failure; the endpoint's schema assumes success.
		throwIfEnvelopeFailed(raw, { method, path });
		return raw;
	} catch (error) {
		if (error instanceof OnedeskAPIError) throw error;
		if (error instanceof ApiError) {
			throw new OnedeskAPIError(
				describeOnedeskError(error.status, error.body, apiKey),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method: error.request.method,
					path,
				},
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new OnedeskTransportError(error.message, { method, path });
		}
		throw new OnedeskTransportError('Unknown OneDesk error', { method, path });
	}
}

/**
 * OneDesk answers 401 with an empty body, so a status with no message has to
 * become one a caller can act on.
 *
 * A provider that echoes the request back can put the key in the body, and
 * this message is both thrown **and** written to `corsair_events`, so the key
 * is stripped here rather than at either destination.
 */
// unknown: an error body is untyped until asRecord narrows it.
function describeOnedeskError(
	status: number,
	body: unknown,
	apiKey: string,
): string {
	const record = asRecord(body);
	for (const key of ['message', 'error', 'detail'] as const) {
		const value = record?.[key];
		if (typeof value === 'string' && value.length > 0) {
			return redactKey(`OneDesk HTTP ${status}: ${value}`, apiKey);
		}
	}
	if (status === 401) {
		return 'OneDesk rejected the API key: check that it is active and allowed to reach this endpoint.';
	}
	return `OneDesk HTTP ${status}`;
}

/** Removes the key from text that is about to be thrown or stored. */
export function redactKey(message: string, apiKey: string): string {
	if (!apiKey) return message;
	// Escape the key: it may contain characters that are regex operators.
	const escaped = apiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return message.replace(new RegExp(escaped, 'g'), '[redacted]');
}
