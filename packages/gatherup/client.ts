import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GATHERUP_API_BASE = 'https://app.gatherup.com';

// A feedback request batch and a feedback list over a long window can take
// longer than the 20 second default in corsair/http.
const GATHERUP_TIMEOUT_MS = 60_000;

/**
 * Every call needs both a bearer token and a `clientId`:
 *
 * ```
 * Authorization: Bearer <token>
 * ?clientId=<id>&agent=<agent id>
 * ```
 *
 * `agent` is optional and only needed when the token belongs to an owner
 * rather than the client, so it is passed through when configured.
 */
export type GatherupCredentials = {
	apiKey: string;
	clientId: string;
	/** Only for an owner-level token that acts on behalf of a client. */
	agent?: string;
};

/**
 * GatherUp reports a failure **inside a 200**:
 *
 * ```json
 * { "errorCode": 2, "errorMessage": "Invalid clientId" }
 * ```
 *
 * A live probe of `/api/test` with a bad token answered exactly that with
 * HTTP 200, so the status alone cannot be trusted. The client throws whenever
 * `errorCode` is present and non-zero, whatever the status was.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readError(body: unknown): {
	errorCode?: number;
	errorMessage?: string;
} {
	const record = asRecord(body);
	const code = record?.errorCode;
	const message = record?.errorMessage;
	return {
		errorCode: typeof code === 'number' ? code : undefined,
		errorMessage:
			typeof message === 'string' && message.length > 0 ? message : undefined,
	};
}

/**
 * GatherUp documents **5 requests a second**, and answers 503 above it rather
 * than 429. The rate-limit config therefore treats a 503 as a rate limit, which
 * is what the docs say it means; `isRateLimitError` is what lets that through.
 */
const GATHERUP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429 || status === 503,
};

/**
 * A GatherUp failure that never became an HTTP error: a 200 whose body carries
 * a non-zero `errorCode`, or a request that got no answer (a reset, DNS
 * failure, abort or timeout).
 *
 * An HTTP error stays core's `ApiError` (see `sanitizeApiError`), so its status,
 * Retry-After and rate-limit fields reach core and the error handlers.
 * `gatherupErrorInfo` reads either kind.
 */
export class GatherupAPIError extends Error {
	/** GatherUp's own `errorCode`, such as 2 for an invalid clientId. */
	readonly errorCode?: number;
	/** True when the body reported the failure even though the status was 2xx. */
	readonly bodyError: boolean;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			errorCode?: number;
			bodyError?: boolean;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GatherupAPIError';
		this.errorCode = options.errorCode;
		this.bodyError = options.bodyError ?? false;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}
}

/** What a GatherUp failure means to a caller, read from either error kind. */
export type GatherupErrorInfo = {
	status?: number;
	/** GatherUp's own `errorCode`, such as 2 for an invalid clientId. */
	errorCode?: number;
	method?: string;
	/** Milliseconds from a Retry-After header, when GatherUp sent one. */
	retryAfter?: number;
	bodyError: boolean;
	transport: boolean;
	timedOut: boolean;
	/**
	 * GatherUp answers 503 above its 5-a-second limit, so a 503 is a rate limit
	 * rather than an outage. A 429 is accepted too, in case a proxy adds one.
	 */
	isRateLimit: boolean;
	/** No token, or one the account refused. */
	isAuthError: boolean;
	/** The token works but this client is not reachable from it. */
	isPermissionError: boolean;
	/** The business, customer or feedback is not there. */
	isNotFound: boolean;
	/** A field GatherUp refused. */
	isValidationError: boolean;
};

// unknown: anything can be thrown; only ApiError and GatherupAPIError carry fields.
export function gatherupErrorInfo(error: unknown): GatherupErrorInfo {
	const http = error instanceof ApiError ? error : undefined;
	const own = error instanceof GatherupAPIError ? error : undefined;
	const status = http?.status;
	const errorCode = http ? readError(http.body).errorCode : own?.errorCode;
	return {
		status,
		errorCode,
		method: http?.request.method ?? own?.method,
		retryAfter: http?.retryAfter,
		bodyError: own?.bodyError ?? false,
		transport: own?.transport ?? false,
		timedOut: own?.timedOut ?? false,
		isRateLimit: status === 429 || status === 503,
		isAuthError: status === 401 || errorCode === 2,
		isPermissionError: status === 403,
		isNotFound: status === 404,
		isValidationError: status === 400,
	};
}

// GatherUp's messages can quote what a request carried, such as
// "Invalid email: jane@example.com". A customer's name, address or phone and
// the bearer token must not reach an error, so addresses and phone-shaped
// numbers are replaced, then every other value the request sent.
const EMAIL_ADDRESS = /[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[^\s@<>"'(),;:]+/g;
// A run of digits with the usual phone separators, counted as a phone once it
// holds at least 7 digits, so a business or customer ID stays readable.
// A run of 10 or more digits with no separators also reads as a phone, which is
// how a provider often echoes a number it normalised.
const PHONE_NUMBER = /\+?\(?\d[\d\s().-]{5,}\d/g;

/**
 * The string values a request sent (body, query, token), longest first, so a
 * message that quotes any of them back can have it replaced. Every length
 * counts, because a customer can be named "Li"; `redactPersonal` matches the
 * short ones only as whole words.
 */
// unknown: the sent body is any JSON the endpoint's schema built.
export function sentValues(...sources: unknown[]): string[] {
	const found = new Set<string>();
	// unknown: walks nested JSON of any shape.
	const walk = (value: unknown): void => {
		if (typeof value === 'string') {
			if (value.trim().length > 0) found.add(value);
		} else if (typeof value === 'number' && Math.abs(value) >= 1_000_000) {
			found.add(String(value));
		} else if (Array.isArray(value)) {
			value.forEach(walk);
		} else if (value !== null && typeof value === 'object') {
			Object.values(value).forEach(walk);
		}
	};
	sources.forEach(walk);
	return [...found].sort((a, b) => b.length - a.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function redactPersonal(text: string, sent: string[] = []): string {
	let redacted = text
		.replace(EMAIL_ADDRESS, '[email]')
		.replace(PHONE_NUMBER, (match) => {
			const digits = match.replace(/\D/g, '').length;
			return (digits >= 7 && /[\s().+-]/.test(match)) || digits >= 10
				? '[phone]'
				: match;
		});
	for (const value of sent) {
		// A value of 3 characters or fewer is matched as a whole word, so "Li"
		// is caught without rewriting "Invalid".
		const pattern =
			value.length <= 3
				? `(?<![\\p{L}\\p{N}])${escapeRegExp(value)}(?![\\p{L}\\p{N}])`
				: escapeRegExp(value);
		redacted = redacted.replace(new RegExp(pattern, 'giu'), '[redacted]');
	}
	return redacted;
}

/** The message GatherUp sent, with the status and body code in front. */
// unknown: an error body is untyped: the `{ errorCode, errorMessage }` envelope,
// or text from a proxy that never reached GatherUp.
export function describeGatherupError(
	status: number | undefined,
	body: unknown,
	fallback: string,
	sent: string[] = [],
): string {
	const fields = readError(body);
	const text = redactPersonal(fields.errorMessage ?? fallback, sent);
	const label = [status, fields.errorCode]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `GatherUp ${label}: ${text}` : text;
}

export type GatherupQueryValue = string | number | boolean;

export type GatherupRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	/** Path-specific query parameters; `clientId` and `agent` are added here. */
	query?: Record<string, GatherupQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// each resource has its own shape.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGatherupRequest(
	credentials: GatherupCredentials,
	{ method, path, query, body }: GatherupRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GATHERUP_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: GATHERUP_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${credentials.apiKey}`,
		},
	};

	// `clientId` is required on every call, and `agent` only when configured.
	// GatherUp reads them from the query on a GET and from the body on a POST,
	// PUT or DELETE, so a write carries them in both places.
	const auth = definedQuery({
		clientId: credentials.clientId,
		agent: credentials.agent,
	});
	const sendBody =
		method === 'GET' ? body : { ...(asRecord(body) ?? {}), ...auth };

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, ...auth },
		body: sendBody,
		mediaType: sendBody === undefined ? undefined : 'application/json',
	};
	const sent = sentValues(sendBody, query, credentials);

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: GATHERUP_RATE_LIMIT_CONFIG,
		});
		// A 200 that carries an `errorCode` is a failure, and the only way to tell
		// is the body. A probe of `/api/test` confirmed this with a bad token.
		const fields = readError(raw);
		if (fields.errorCode !== undefined && fields.errorCode !== 0) {
			throw new GatherupAPIError(
				describeGatherupError(
					undefined,
					raw,
					'GatherUp refused the request',
					sent,
				),
				{ errorCode: fields.errorCode, bodyError: true, method },
			);
		}
		return raw;
	} catch (error) {
		if (error instanceof GatherupAPIError) throw error;
		if (error instanceof ApiError) throw sanitizeApiError(error, sent);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new GatherupAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GatherupAPIError('Unknown GatherUp error', {
			method,
			transport: true,
		});
	}
}

/**
 * Core's `ApiError` keeps the sent body and query: a customer's name, email and
 * phone, and the client ID. GatherUp's error body can quote them back. The
 * error is rebuilt as an `ApiError` with the same status and rate-limit fields,
 * GatherUp's `{ errorCode, errorMessage }` envelope (addresses and phone
 * numbers replaced) as the body, and the sent body, form data and query
 * dropped.
 */
function sanitizeApiError(error: ApiError, sent: string[]): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const fields = readError(error.body);
	const envelope = Object.fromEntries(
		Object.entries({
			errorCode: fields.errorCode,
			errorMessage:
				fields.errorMessage === undefined
					? undefined
					: redactPersonal(fields.errorMessage, sent),
		}).filter(([, value]) => value !== undefined),
	);
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: envelope,
		},
		describeGatherupError(error.status, error.body, error.message, sent),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GatherupQueryValue | undefined>,
): Record<string, GatherupQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GatherupQueryValue] => entry[1] !== undefined,
		),
	);
}
