import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NTFY_API_BASE = 'https://ntfy.sh';

export type NtfyQuery = Record<string, string | number | boolean | undefined>;

export type NtfyRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: NtfyQuery;
	/** Extra headers: publish headers on a file upload, X-Token on token delete. */
	headers?: Record<string, string | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Sent as-is with this media type instead of JSON (a file upload). */
	rawMediaType?: string;
	/** `binary` returns `{ bytes, contentType }` (attachment downloads). */
	responseType?: 'binary';
};

/** Where a call goes and with what credential. */
export type NtfyTarget = {
	baseUrl: string;
	/** A `tk_` access token, or `username:password` for HTTP Basic. Empty: anonymous. */
	key: string;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const NTFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** `https://ntfy.example.com/` -> `https://ntfy.example.com`; refuses non-http(s). */
export function normalizeNtfyBaseUrl(value: string): string {
	const url = new URL(value.trim());
	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		throw new Error(`ntfy server URL must be http(s), got ${url.protocol}`);
	}
	return url.toString().replace(/\/+$/, '');
}

/**
 * The Authorization header for a credential: a `tk_` token (or any token
 * without a colon) as Bearer, `username:password` as Basic. An absent key
 * sends no header: ntfy answers anonymous calls on open topics, but a bad
 * header is a 401 even there.
 */
export function ntfyAuthorization(key: string): string | undefined {
	if (!key) return undefined;
	if (!key.startsWith('tk_') && key.includes(':')) {
		return `Basic ${Buffer.from(key).toString('base64')}`;
	}
	return `Bearer ${key}`;
}

/** The numeric ntfy code (e.g. 42905, 40101) from an ApiError body `{ code, http, error, link }`. */
export function ntfyErrorCode(error: unknown): number | undefined {
	if (!(error instanceof ApiError)) return undefined;
	let body: unknown = error.body;
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		} catch {
			return undefined;
		}
	}
	const code = asRecord(body)?.code;
	return typeof code === 'number' ? code : undefined;
}

// unknown: callers parse the body with the endpoint's zod output schema; a
// poll returns NDJSON text, a file download `{ bytes, contentType }`, and an
// empty body is undefined or ''. Core's ApiError passes through unchanged.
export async function makeNtfyRequest(
	target: NtfyTarget,
	{
		method,
		path,
		query,
		headers,
		body,
		rawMediaType,
		responseType,
	}: NtfyRequest,
): Promise<unknown> {
	const authorization = ntfyAuthorization(target.key);
	const extraHeaders: Record<string, string> = {};
	for (const [name, value] of Object.entries(headers ?? {})) {
		if (value !== undefined && value !== '') extraHeaders[name] = value;
	}
	const config: OpenAPIConfig = {
		BASE: target.baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: responseType === 'binary' ? '*/*' : 'application/json',
			...(authorization ? { Authorization: authorization } : {}),
			...extraHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : (rawMediaType ?? 'application/json'),
		...(responseType ? { responseType } : {}),
	};

	return await request<unknown>(config, requestOptions, {
		rateLimitConfig: NTFY_RATE_LIMIT_CONFIG,
	});
}

/**
 * Parses a poll response body: application/x-ndjson, one JSON object per
 * line, possibly empty. Tombstone and stream-keepalive events are filtered
 * out; only `event: "message"` rows remain.
 */
// unknown: raw is the response body the client returned, a string or not.
export function parseNtfyNdjson(raw: unknown): unknown[] {
	// An unknown or empty topic answers 200 with no body.
	if (raw === undefined || raw === null || raw === '') return [];
	if (typeof raw !== 'string') {
		throw new Error(`ntfy poll answered ${typeof raw} instead of NDJSON text`);
	}
	const lines = raw.split('\n');
	// unknown: rows are revalidated by the endpoint's output schema.
	const messages: unknown[] = [];
	for (const line of lines) {
		if (line.length === 0) continue;
		// unknown: a line can be any JSON value until asRecord narrows it.
		const parsed: unknown = JSON.parse(line);
		if (asRecord(parsed)?.event === 'message') messages.push(parsed);
	}
	return messages;
}
