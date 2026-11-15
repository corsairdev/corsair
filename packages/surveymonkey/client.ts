import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * SurveyMonkey answers every documented path under `https://api.surveymonkey.com/v3`.
 * The OAuth token exchange also returns an `access_url` per account, and the
 * vendor says an account may live on another datacenter; a caller can override
 * the host for that case, and the override is limited to `surveymonkey.com` so a
 * stored value cannot point the bearer token at another machine.
 */
export const SURVEYMONKEY_API_BASE = 'https://api.surveymonkey.com/v3';

/** The domain every SurveyMonkey datacenter host lives under. */
const SURVEYMONKEY_DOMAIN = 'surveymonkey.com';

/** A SurveyMonkey host is `api.` plus optional labels under the domain. */
const HOST_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.surveymonkey\.com$/;

/**
 * Reduces what was configured to a `surveymonkey.com` host and returns the
 * `https://` root the API hangs off. Accepts the default (`api.surveymonkey.com`),
 * a pasted address (`https://api.surveymonkey.com/v3/`), and the datacenter host
 * the token exchange reports. Rejects everything else: another domain, an IP
 * address, a port, a path, and a protocol other than https.
 */
export function normalizeSurveymonkeyBase(host: string): string {
	const trimmed = host.trim();
	if (!trimmed) {
		throw new Error(
			'[surveymonkey] api host is required, e.g. api.surveymonkey.com',
		);
	}

	let value = trimmed;
	if (trimmed.includes('://')) {
		let url: URL;
		try {
			url = new URL(trimmed);
		} catch {
			throw new Error('[surveymonkey] api host is not a valid URL');
		}
		if (url.protocol !== 'https:') {
			throw new Error('[surveymonkey] api host must use https');
		}
		if (url.username || url.password) {
			throw new Error('[surveymonkey] api host must not contain credentials');
		}
		value = url.host;
	}

	// A loop rather than a trailing-slash regex, which CodeQL flags as ReDoS on
	// uncontrolled input.
	while (value.endsWith('/')) {
		value = value.slice(0, -1);
	}

	const hostName = value.toLowerCase();
	if (!HOST_PATTERN.test(hostName)) {
		throw new Error(
			'[surveymonkey] api host must be a surveymonkey.com host, e.g. api.surveymonkey.com',
		);
	}
	// The version is added here, so a pasted `/v3` or `/v3/` cannot double it.
	return `https://${hostName}/v3`;
}

/**
 * SurveyMonkey errors answer a JSON envelope with a nested object:
 * `{ "error": { "id": "1011", "name": "Authorization Error", "message": "...",
 * "docs": "...", "http_status_code": 401 } }`. A revoked token answers a
 * different shape, `{ "status": 1, "errmsg": "Client revoked access grant" }`,
 * which is why both are read.
 */
export class SurveymonkeyAPIError extends Error {
	readonly status?: number;
	/** The API's numeric error id, as a string, when the body carries one. */
	readonly code?: string;
	/** The API's short name for the error, when the body carries one. */
	readonly errorName?: string;
	/** A link to the vendor docs for this error, when the body carries one. */
	readonly docs?: string;
	/** Milliseconds from a Retry-After header, when SurveyMonkey sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errorName?: string;
			docs?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SurveymonkeyAPIError';
		this.status = options.status;
		this.code = options.code;
		this.errorName = options.errorName;
		this.docs = options.docs;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	get isNotFound(): boolean {
		return this.status === 404;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** 400 is a field or a filter the API rejected, so a retry repeats it. */
	get isValidation(): boolean {
		return this.status === 400;
	}
}

/**
 * Reads a SurveyMonkey error body into a message and its parts.
 *
 * Two shapes occur. A failed request answers
 * `{ error: { id, name, message, docs, http_status_code } }`, and a revoked
 * token answers `{ status: 1, errmsg: "..." }` as documented under token
 * revocation.
 *
 * unknown: the body is untyped until the guards here narrow it.
 */
export function describeSurveymonkeyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): { message: string; code?: string; errorName?: string; docs?: string } {
	const record = asRecord(body);
	const nested = asRecord(record?.error);

	const name = typeof nested?.name === 'string' ? nested.name : undefined;
	const detail =
		typeof nested?.message === 'string' ? nested.message : undefined;
	const errmsg = typeof record?.errmsg === 'string' ? record.errmsg : undefined;
	const text =
		[detail, errmsg].find(
			(value) => typeof value === 'string' && value.length > 0,
		) ?? fallback;

	const id = nested?.id;
	const code =
		typeof id === 'string'
			? id
			: typeof id === 'number'
				? String(id)
				: undefined;
	const docs = typeof nested?.docs === 'string' ? nested.docs : undefined;

	const prefix = status === undefined ? '' : `SurveyMonkey ${status}: `;
	const label = name && !text.includes(name) ? `${name}: ${text}` : text;
	return { message: `${prefix}${label}`, code, errorName: name, docs };
}

export type SurveymonkeyRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path after `/v3`, e.g. `/surveys`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. A draft or private app gets 120 requests a minute and
// 500 a day, and the response carries the remaining counts in
// `X-Ratelimit-App-Global-Minute-*` and `...-Day-*` headers. A 429 is handled in
// error-handlers.ts.
const SURVEYMONKEY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one request. SurveyMonkey authenticates with a **bearer token**: either
 * a private app's access token from its settings page, or one obtained through
 * the OAuth 2.0 flow. It also asks for `Content-Type: application/json` on a
 * write.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeSurveymonkeyRequest(
	host: string,
	accessToken: string,
	{ method, path, query, body }: SurveymonkeyRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: normalizeSurveymonkeyBase(host),
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// Lowercase `bearer` is what the vendor documents; the header is
			// case-insensitive, so this matches their examples exactly.
			Authorization: `bearer ${accessToken}`,
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SURVEYMONKEY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof SurveymonkeyAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeSurveymonkeyError(
				error.status,
				error.body,
				error.message,
			);
			throw new SurveymonkeyAPIError(described.message, {
				cause: error,
				status: error.status,
				code: described.code,
				errorName: described.errorName,
				docs: described.docs,
				retryAfter: error.retryAfter,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SurveymonkeyAPIError(error.message, { cause: error, method });
		}
		throw new SurveymonkeyAPIError('Unknown SurveyMonkey error', { method });
	}
}
