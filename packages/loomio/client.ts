import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Loomio's hosted service. Self-hosted installs set their own origin. */
export const LOOMIO_DEFAULT_BASE_URL = 'https://www.loomio.com';

// /api/user0 is the canonical user-API prefix. /api/b2 routes to the same
// controllers, but a translation layer (Api::User0::LegacyB2Fields) renames
// poll fields there (vote_count_eligible -> voters_count and similar), which
// would break the output schemas. Never point requests at /api/b2.
// /api/server0 is the Server API of a self-hosted install (server key).
export const LOOMIO_API_PREFIXES = {
	user: '/api/user0',
	server: '/api/server0',
} as const;

export const LOOMIO_API_BASE = `${LOOMIO_DEFAULT_BASE_URL}${LOOMIO_API_PREFIXES.user}`;

export type LoomioApi = keyof typeof LOOMIO_API_PREFIXES;

export type LoomioRequest = {
	/** Which API the path belongs to; defaults to the User API. */
	api?: LoomioApi;
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** True when the path names a record id, so a 403 may mean permission. */
	resourceScoped?: boolean;
};

const LOCAL_HTTP_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Validates a Loomio installation URL and returns its origin. HTTPS only
 * (plain http only for localhost), no credentials, query or fragment; a path
 * other than `/` is refused so the key can't be sent to a sub-path proxy.
 */
export function normalizeLoomioBaseUrl(raw: string): string {
	let url: URL;
	try {
		url = new URL(raw.trim());
	} catch {
		throw new Error('Loomio base_url must be an absolute URL');
	}
	const localHttp =
		url.protocol === 'http:' && LOCAL_HTTP_HOSTS.has(url.hostname);
	if (
		(url.protocol !== 'https:' && !localHttp) ||
		url.username !== '' ||
		url.password !== '' ||
		url.search !== '' ||
		url.hash !== '' ||
		(url.pathname !== '/' && url.pathname !== '')
	) {
		throw new Error(
			'Loomio base_url must be an https origin such as https://loomio.example.org, without a path, credentials, query, or fragment',
		);
	}
	return url.origin;
}

// unknown: the record is an untyped error body; read one field at a time.
function readErrorValue(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | number | undefined {
	const value = record?.[key];
	return typeof value === 'string' || typeof value === 'number'
		? value
		: undefined;
}

/**
 * Renders a Loomio error body as one line. Bodies seen in the docs and source:
 * `{"error":"You are not authorized..."}` (403), `{"error":404}` (missing
 * record, the value is the bare number), `{"error":400}`, and
 * `{"errors":{field:["message"]}}` (422 validation).
 */
export function readLoomioErrorDetail(
	// unknown: the body is one of the open error shapes until a field narrows it.
	body: unknown,
): string | undefined {
	const record = asRecord(body);
	const error = readErrorValue(record, 'error');
	if (error !== undefined) {
		return typeof error === 'number' ? `HTTP ${error}` : error;
	}
	const errors = asRecord(record?.errors);
	if (!errors) return undefined;
	return Object.entries(errors)
		.map(([field, messages]) => {
			const list = Array.isArray(messages)
				? messages.filter((m) => typeof m === 'string').join(', ')
				: '';
			return list.length > 0 ? `${field}: ${list}` : field;
		})
		.join('; ');
}

export function describeLoomioError(
	status: number | undefined,
	// unknown: a provider failure body is one of the shapes readLoomioErrorDetail covers.
	body: unknown,
	resourceScoped: boolean,
): string {
	const detail = readLoomioErrorDetail(body);
	if (status === 403 && resourceScoped) {
		const note =
			'the record may not exist, or the key is valid but lacks permission on it';
		return detail ? `Loomio 403: ${detail} (${note})` : `Loomio 403: ${note}`;
	}
	if (detail) {
		return `Loomio ${status ?? ''}: ${detail}`.replace('Loomio :', 'Loomio:');
	}
	return status === undefined
		? 'Loomio request failed'
		: `Loomio request failed (${status})`;
}

/**
 * Core keeps the sent body on `ApiError.request`. Loomio bodies carry
 * discussion and comment text, recipient and member email addresses, so the
 * error is rebuilt without the body and headers (the key rides in the
 * Authorization header). Status and rate-limit fields stay, because the error
 * handlers and core's retries read them. The provider body keeps only the
 * `error`/`errors` fields that describe the failure.
 */
export function withoutRequestData(
	error: ApiError,
	resourceScoped: boolean,
): ApiError {
	const record = asRecord(error.body);
	const body =
		record && ('error' in record || 'errors' in record)
			? { error: record.error, errors: record.errors }
			: undefined;
	return new ApiError(
		{
			method: error.request.method,
			url: error.request.url,
			path: error.request.path,
			body: error.request.body === undefined ? undefined : '[REDACTED]',
		},
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		describeLoomioError(error.status, error.body, resourceScoped),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeLoomioRequest(
	connection: { key: string; baseUrl?: string },
	{
		api = 'user',
		method,
		path,
		query,
		body,
		resourceScoped = false,
	}: LoomioRequest,
): Promise<unknown> {
	const origin = connection.baseUrl
		? normalizeLoomioBaseUrl(connection.baseUrl)
		: LOOMIO_DEFAULT_BASE_URL;
	const config: OpenAPIConfig = {
		BASE: `${origin}${LOOMIO_API_PREFIXES[api]}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: connection.key,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	// Core retries a 429 itself (three times, honouring Retry-After). Loomio
	// sends no rate-limit headers; the hosted install throttles at 900
	// requests per 5 minutes per IP (Rack::Attack).
	try {
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, resourceScoped);
		}
		// Node's Headers rejects a key with a stray newline and quotes the
		// whole header value (the key) in its TypeError. Rebuild such errors
		// without the key and without the cause that still holds it.
		// Checked by shape, not instanceof: the TypeError can come from
		// another realm (undici's), where instanceof Error is false.
		const message = asRecord(error)?.message;
		if (
			connection.key.length > 0 &&
			typeof message === 'string' &&
			message.includes(connection.key)
		) {
			throw new TypeError(message.split(connection.key).join('[REDACTED]'));
		}
		throw error;
	}
}
