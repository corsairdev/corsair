import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LOB_API_BASE = 'https://api.lob.com/v1';

// unknown: the body is an untyped error envelope until asRecord narrows it.
export function readErrorBody(body: unknown): {
	code?: string;
	message?: string;
} {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	return {
		// The uploads surface answers flat (`{ code: 403, message }`) where
		// code is a number, so only the wrapped envelope yields a code.
		code: typeof error?.code === 'string' ? error.code : undefined,
		message:
			typeof error?.message === 'string'
				? error.message
				: typeof record?.message === 'string'
					? record.message
					: undefined,
	};
}

// Core retries a 429 three times (1 s, 2 s, 4 s), which spans Lob's 5-second
// window. A 429 means Lob refused the request before doing anything, so the
// retry is safe for mail sends too. Lob sends no Retry-After header.
const LOB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	// Lob's X-Rate-Limit-Reset marks the 5-second window; core's backoff
	// already spans it, so only a gateway's Retry-After is read.
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 || readErrorBody(body).code === 'rate_limit_exceeded',
};

/** What the error handlers need to know about the request that failed. */
export type LobRequestInfo = {
	method: LobRequest['method'];
	/** True when the request carried an Idempotency-Key, so a replay is safe. */
	hasIdempotency: boolean;
	/**
	 * True when the request never got an HTTP answer: connection reset, DNS
	 * failure, timeout. Such an error has no status.
	 */
	transportFailure: boolean;
};

const requestInfo = new WeakMap<object, LobRequestInfo>();

/** Attaches the request facts to an error makeLobRequest throws. */
export function recordLobRequestInfo(
	error: object,
	info: LobRequestInfo,
): void {
	requestInfo.set(error, info);
}

/** The request facts recorded for an error thrown by makeLobRequest. */
export function lobRequestInfo(error: Error): LobRequestInfo | undefined {
	return requestInfo.get(error);
}

/** Machine-readable code from Lob's error envelope, e.g. `rate_limit_exceeded`. */
export function lobErrorCode(error: Error): string | undefined {
	return error instanceof ApiError ? readErrorBody(error.body).code : undefined;
}

export function describeLobError(
	status: number | undefined,
	// unknown: a proxy can answer with HTML or text instead of Lob's envelope.
	body: unknown,
	fallback: string,
): string {
	const { code, message } = readErrorBody(body);
	const text = message ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Lob ${label}: ${text}` : text;
}

// unknown: scalar, array or one-level object values. Core writes arrays as
// repeated keys and objects as `key[sub]=value` (Lob's deepObject filters).
export type LobQuery = Record<string, unknown>;

export type LobRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: LobQuery;
	// unknown: the endpoint's input schema has already validated the body.
	// A FormData body goes out as multipart (uploads, Informed Delivery).
	body?: unknown;
	/** Extra headers: Idempotency-Key on mail sends, Lob-Version, x-lang-output. */
	headers?: Record<string, string>;
};

/** Encodes one path segment; rejects values that would change the route. */
export function segment(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Lob path value');
	}
	return encodeURIComponent(value);
}

/**
 * Rebuilds core's ApiError without the request body: mailpiece bodies carry
 * recipient names and street addresses, and bank account bodies carry account
 * numbers. Status, Lob's error envelope and rate-limit facts stay.
 */
function withoutRequestData(error: ApiError, method: string): ApiError {
	return new ApiError(
		{ method: error.request.method ?? method, url: error.request.url },
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		describeLobError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for bodyless successes.
export async function makeLobRequest(
	apiKey: string,
	{ method, path, query, body, headers }: LobRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: LOB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// HTTP Basic with the key as username and an empty password. Corsair's
		// config USERNAME/PASSWORD path requires both non-empty, so the header
		// is built here instead.
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
		},
	};

	const isForm = body instanceof FormData;
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		headers,
		// FormData sets its own multipart boundary.
		mediaType: body === undefined || isForm ? undefined : 'application/json',
	};

	const info = (transportFailure: boolean): LobRequestInfo => ({
		method,
		hasIdempotency: Boolean(headers?.['Idempotency-Key']),
		transportFailure,
	});

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: LOB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const rebuilt = withoutRequestData(error, method);
			recordLobRequestInfo(rebuilt, info(false));
			throw rebuilt;
		}
		// Transport failures (DOMException timeouts included) never got an HTTP
		// answer; they pass through unchanged with the request facts attached.
		if (error !== null && typeof error === 'object') {
			recordLobRequestInfo(error, info(true));
		}
		throw error;
	}
}
