import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TOMBA_API_BASE = 'https://api.tomba.io/v1';

/**
 * A 429 is either a per-second or per-minute window, which `Retry-After`
 * names and a short wait fixes, or a used-up daily limit or count/sources
 * balance, which no retry fixes before midnight UTC. Only the first kind is
 * handed to core's retry loop.
 */
export function isQuotaExhausted(
	// unknown: the error body is untyped until the nested `errors` object is read.
	body: unknown,
): boolean {
	const errors = asRecord(asRecord(body)?.errors);
	const message = typeof errors?.message === 'string' ? errors.message : '';
	return /daily|balance|used up|quota|credits/i.test(message);
}

// error-handlers.ts owns 429 retries. Core's request() retries every 429 it
// sees (its catch path checks only the status), which would sleep out a
// daily-limit Retry-After of many hours, so its own loop is off and the
// handler retries only a per-second or per-minute window. The object has to
// be complete: request.ts replaces its defaults wholesale. No `resetTime`:
// Tomba's `x-ratelimit-reset` is not an epoch.
const TOMBA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Tomba needs both the API key and the API secret on every request. */
export type TombaCredentials = { apiKey: string; apiSecret: string };

/**
 * The documented `errors.type` of a failed call: `authentication_failed`,
 * `unknown_record`, `quota_exceeded`, `rate_limit`, `legal_block` and so on.
 * Tomba answers a missing key with HTTP 400, so the type matters more than the
 * status.
 */
export function tombaErrorType(error: unknown): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const type = asRecord(asRecord(error.body)?.errors)?.type;
	return typeof type === 'string' && type.length > 0 ? type : undefined;
}

const EMAIL = /[^\s"'<>@]+@[^\s"'<>@]+\.[^\s"'<>@]+/g;

// unknown: any JSON value; strings get email addresses masked.
function maskEmails(value: unknown): unknown {
	if (typeof value === 'string') return value.replace(EMAIL, '[email]');
	if (Array.isArray(value)) return value.map(maskEmails);
	const record = asRecord(value);
	if (!record) return value;
	return Object.fromEntries(
		Object.entries(record).map(([key, entry]) => [key, maskEmails(entry)]),
	);
}

/**
 * Core's ApiError keeps the request's query and URL, and Tomba's queries are
 * the person being looked up: email addresses, names, phone numbers, LinkedIn
 * URLs. This rebuilds the error without them and keeps everything the error
 * handlers and core read: status, body, Retry-After and the method.
 */
export function stripRequestData(error: ApiError): ApiError {
	const errors = asRecord(asRecord(error.body)?.errors);
	const type = typeof errors?.type === 'string' ? errors.type : undefined;
	const detail =
		typeof errors?.message === 'string' ? errors.message : error.statusText;
	const message = String(
		maskEmails(
			`Tomba ${[error.status, type].filter(Boolean).join(' ')}: ${detail}`,
		),
	);
	const path = error.request.url.split('?')[0] ?? error.request.url;
	return new ApiError(
		{ method: error.request.method, url: path },
		{
			url: error.url.split('?')[0] ?? '',
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: maskEmails(error.body),
		},
		message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export type TombaQuery = Record<string, string | number | boolean | undefined>;

export type TombaRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: TombaQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeTombaRequest(
	credentials: TombaCredentials,
	{ method, path, query, body }: TombaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TOMBA_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Tomba asks for at least 180 s: lookups and verifications run live
		// against mail servers. Core's default is 20 s.
		TIMEOUT: 180_000,
		HEADERS: {
			Accept: 'application/json',
			'X-Tomba-Key': credentials.apiKey,
			'X-Tomba-Secret': credentials.apiSecret,
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
			rateLimitConfig: TOMBA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw stripRequestData(error);
		throw error;
	}
}
