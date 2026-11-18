import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Neutrino API runs the same service behind several endpoints with cloud
 * failover: the multicloud `neutrinoapi.net` host first, then single-cloud and
 * geofenced hosts. The multicloud host is the documented default.
 */
export const NEUTRINO_API_BASE = 'https://neutrinoapi.net';

// Retries belong to error-handlers.ts. Neutrino documents no Retry-After, so
// the name is kept only so a proxy that sends one is honoured.
const NEUTRINO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Neutrino takes two credentials on every call: the account's `user-id` and one
 * of its API keys. Its own docs allow combining them in one `API-Key` header as
 * `user-id:api-key`, which is what this plugin sends, so neither credential
 * lands in a query string that a proxy would log. The key builder returns the
 * pair already combined, so this is `ctx.key` as it arrives.
 */
export type NeutrinoCredentials = string;

/** Core's request timeout when an operation sets none. */
const DEFAULT_TIMEOUT_MS = 20_000;

/** The code Neutrino sends when the credentials are wrong or missing. */
const ACCESS_DENIED = 43;

// unknown: the record is an untyped error body; one field is read at a time.
function readNumber(
	record: Record<string, unknown> | null | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' ? value : undefined;
}

// unknown: see readNumber.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every error is `{ "api-error": <number>, "api-error-msg": "..." }` with a
 * non-200 status. The numeric code is what distinguishes a bad credential (43)
 * from a bad parameter, and the message is always upper case.
 *
 * An HTTP failure stays core's `ApiError` (see `sanitizeApiError`), so its
 * status and Retry-After reach core and the handlers. This class covers only a
 * transport failure, which never had a response.
 */
export class NeutrinoAPIError extends Error {
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NeutrinoAPIError';
		this.method = options.method;
	}
}

/**
 * Rebuilds Neutrino's HTTP error as a core `ApiError`, so its status and
 * Retry-After reach core (R8). The sent form and query are dropped: a
 * form-body call carries the API key, which core does not redact.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const record = asRecord(error.body);
	const code = readNumber(record, 'api-error');
	const message = readString(record, 'api-error-msg');
	const envelope =
		code === undefined && message === undefined
			? undefined
			: { 'api-error': code, 'api-error-msg': message };
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: envelope,
		},
		describeNeutrinoError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: see NeutrinoAPIError.
export function describeNeutrinoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'api-error-msg') ??
		(typeof body === 'string' && body.length > 0
			? body.slice(0, 200)
			: undefined) ??
		fallback;
	const code = readNumber(record, 'api-error');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Neutrino ${label}: ${text}` : text;
}

export type NeutrinoQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type NeutrinoRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: NeutrinoQuery;
	/** A urlencoded body, which is the form Neutrino documents for POST. */
	form?: Record<string, string | number | boolean | undefined>;
	/**
	 * Core aborts a request after 20 s. Email Verify (an SMTP probe) and the
	 * methods that load a page can take up to a minute, so they set more.
	 */
	timeoutMs?: number;
};

/** Urlencodes a form, dropping unset fields rather than sending "undefined". */
function encodeForm(
	form: Record<string, string | number | boolean | undefined>,
): string {
	const params = new URLSearchParams();
	for (const [name, value] of Object.entries(form)) {
		if (value !== undefined) params.append(name, String(value));
	}
	return params.toString();
}

// unknown: callers parse the body with the endpoint's zod output schema. Several
// Neutrino methods answer a file rather than JSON, so a caller checks first.
export async function makeNeutrinoRequest(
	credentials: NeutrinoCredentials,
	{ method, path, query, form, timeoutMs }: NeutrinoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NEUTRINO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs ?? DEFAULT_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			'API-Key': credentials,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		// Neutrino takes POST parameters urlencoded, and `corsair/http` passes a
		// string body through with whatever media type it is given.
		body: form ? encodeForm(form) : undefined,
		mediaType: form ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NEUTRINO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new NeutrinoAPIError(error.message, { cause: error, method });
		}
		throw new NeutrinoAPIError('Unknown Neutrino error', { method });
	}
}
