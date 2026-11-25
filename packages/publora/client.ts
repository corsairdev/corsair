import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Official Publora REST host. Every path below is relative to `/api/v1`.
 * Docs: https://docs.publora.com
 * Spec: https://docs.publora.com/openapi.json
 */
export const PUBLORA_API_BASE = 'https://api.publora.com/api/v1';

/**
 * Publora answers a rate-limited call with 429 and a `Retry-After` header.
 * This is the only 429 retry layer; the plugin handler must not add another.
 */
const PUBLORA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 2,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type PubloraQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type PubloraRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// JSON bodies differ per operation; each endpoint's Zod input schema has
	// already checked the fields, so the client only passes them through.
	body?: Record<string, unknown>;
	query?: PubloraQuery;
	/** Sent as `Idempotency-Key`; a repeat with the same body returns the first result. */
	idempotencyKey?: string;
};

/** Drop undefined values so we don't send `?foo=undefined`. */
export function compactQuery(query: PubloraQuery): PubloraQuery {
	const out: PubloraQuery = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/**
 * Same as {@link compactQuery}, for JSON bodies. Values stay `unknown`: the
 * body was validated by the endpoint's input schema and is only copied here.
 */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}

/** Encodes one path segment (a post group id) so it cannot change the route. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Issues a Publora request with the API key in `x-publora-key`.
 *
 * Failures stay as `ApiError` so status, body (`error` / `code`) and
 * rate-limit metadata reach the plugin error handlers. Wrapping them would
 * drop `retryAfter` and skip RATE_LIMIT_ERROR.
 *
 * Auth: an API key from the API page of the Publora dashboard.
 * Docs: https://docs.publora.com/authentication
 */
export async function makePubloraRequest<T>(
	endpoint: string,
	apiKey: string,
	options: PubloraRequestOptions = {},
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('publora', 'api_key');
	}

	const { method = 'GET', body, query, idempotencyKey } = options;
	const hasBody = method !== 'GET' && method !== 'DELETE' && body !== undefined;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'x-publora-key': apiKey,
		// Lets Publora tell traffic from this plugin apart from other clients.
		'x-publora-client': 'corsair',
	};
	if (hasBody) {
		headers['Content-Type'] = 'application/json';
	}
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	const config: OpenAPIConfig = {
		BASE: PUBLORA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};

	const compact = query ? compactQuery(query) : undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? 'application/json; charset=utf-8' : undefined,
		query: compact && Object.keys(compact).length > 0 ? compact : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: PUBLORA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw error instanceof ApiError ? withoutRequestData(error) : error;
	}
}

const REDACTED = '[REDACTED]';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const URL_PATTERN = /\bhttps?:\/\/\S+/gi;

/**
 * Publora echoes each failed media URL in `mediaResults[].url` and again
 * inside `mediaResults[].error` ("Fetching <signed URL> returned HTTP 403").
 * Those URLs are the caller's data, so each entry keeps only `ok` and its
 * stable `code`, and any URL left in a top-level string is replaced. The
 * rest (`error`, `code`, `field`, per-platform validation) is Publora's own.
 * Spec: the `mediaResults` 400 examples in https://docs.publora.com/openapi.json
 */
function scrubResponseBody(body: unknown): unknown {
	if (!isRecord(body)) return body;
	const scrubbed: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		scrubbed[key] =
			typeof value === 'string' ? value.replace(URL_PATTERN, REDACTED) : value;
	}
	if (Array.isArray(body.mediaResults)) {
		scrubbed.mediaResults = body.mediaResults.map((result) =>
			isRecord(result) ? { ok: result.ok, code: result.code } : REDACTED,
		);
	}
	return scrubbed;
}

/**
 * Rebuilds the ApiError without the request body (post text, connection ids,
 * media and webhook URLs) and headers (the API key), keeping status,
 * statusText, Publora's error body and the rate-limit metadata the error
 * handlers and core read (R8).
 */
export function withoutRequestData(error: ApiError): ApiError {
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
		},
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: scrubResponseBody(error.body),
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
