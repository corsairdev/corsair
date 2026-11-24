import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The Moz API exposes one JSON-RPC 2.0 endpoint; the method name in the body
 * picks the operation (https://moz.com/api/docs/guides/getting-started).
 */
export const MOZ_API_BASE = 'https://api.moz.com';
export const MOZ_JSONRPC_PATH = '/jsonrpc';

/**
 * The request id must be at least 24 characters of letters, numbers and
 * hyphens; a v4 UUID meets both rules.
 */
export function mozRequestId(): string {
	return crypto.randomUUID();
}

/**
 * The JSON-RPC error member (https://moz.com/api/docs/guides/error-handling).
 * unknown: each field is read from untrusted JSON and narrowed before use.
 */
type MozErrorMember = {
	code?: unknown;
	status?: unknown;
	httpStatus?: unknown;
	message?: unknown;
	data?: unknown;
};

const REDACTED = '[REDACTED]';

/** The JSON-RPC error code of a Moz error, e.g. -32651 for a bad token. */
// unknown: an error body is whatever JSON Moz (or its edge) sent.
export function mozErrorCode(body: unknown): number | undefined {
	const code = asRecord(asRecord(body)?.error)?.code;
	return typeof code === 'number' ? code : undefined;
}

/** `error.data.issue`, the field Moz says to branch on (e.g. rate_limited). */
// unknown: see mozErrorCode.
export function mozErrorIssue(body: unknown): string | undefined {
	const issue = asRecord(asRecord(asRecord(body)?.error)?.data)?.issue;
	return typeof issue === 'string' ? issue : undefined;
}

// unknown: see mozErrorCode.
export function mozErrorMessage(
	status: number,
	body: unknown,
	fallback: string,
): string {
	const error = asRecord(asRecord(body)?.error) as MozErrorMember | undefined;
	const data = asRecord(error?.data);
	const message =
		typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: fallback || 'request failed';
	const code = typeof error?.code === 'number' ? ` ${error.code}` : '';
	const issue = typeof data?.issue === 'string' ? ` (${data.issue})` : '';
	// `data.key` names the offending request field; `data.value` can echo the
	// value sent (a customer's domain or address), so only the key is quoted.
	const key = typeof data?.key === 'string' ? ` at ${data.key}` : '';
	const text = `Moz ${status}${code}: ${message}${issue}${key}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Drops `error.data.value`, which can echo request data back. */
// unknown: see mozErrorCode.
function withoutEchoedValue(body: unknown): unknown {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	const data = asRecord(error?.data);
	if (!record || !error || !data || !('value' in data)) return body;
	return { ...record, error: { ...error, data: { ...data, value: REDACTED } } };
}

/**
 * A Moz failure as core's ApiError, without the request body (it can hold
 * Moz Local business details) and with Moz's message. The status is the
 * envelope's (`status` or `httpStatus`) when the HTTP layer said 200.
 */
// unknown: see mozErrorCode.
export function mozApiError(
	method: string,
	httpStatus: number,
	statusText: string,
	body: unknown,
	rateLimit: {
		retryAfter?: number;
		rateLimitReset?: number;
		rateLimitRemaining?: number;
		rateLimitLimit?: number;
	} = {},
): ApiError {
	const error = asRecord(asRecord(body)?.error) as MozErrorMember | undefined;
	const envelopeStatus =
		typeof error?.status === 'number'
			? error.status
			: typeof error?.httpStatus === 'number'
				? error.httpStatus
				: undefined;
	const status =
		httpStatus >= 200 && httpStatus < 300 && envelopeStatus
			? envelopeStatus
			: httpStatus;
	const safeBody = withoutEchoedValue(body);
	return new ApiError(
		{ method: 'POST', url: MOZ_JSONRPC_PATH, body: REDACTED },
		{
			url: `${MOZ_API_BASE}${MOZ_JSONRPC_PATH}`,
			ok: false,
			status,
			statusText,
			body: safeBody,
		},
		mozErrorMessage(status, safeBody, `${method} failed`),
		rateLimit,
	);
}

export const MOZ_DEFAULT_TIMEOUT_MS = 60_000;

/**
 * Sends one JSON-RPC request and returns its `result`. A body with an
 * `error` member is a failure whatever the HTTP status.
 */
export async function makeMozRequest(
	key: string,
	method: string,
	// unknown: the endpoint's input schema has already validated the payload.
	data: unknown,
): Promise<unknown> {
	if (!key) {
		throw new Error('Moz API token is missing.');
	}
	// A token with whitespace or control characters makes `new Headers()`
	// throw an error that quotes the value; refuse it first, without the value.
	if (!/^[\x21-\x7e]+$/.test(key)) {
		throw new Error(
			'Moz API token has characters a header cannot carry; re-copy it from the Moz API dashboard.',
		);
	}
	const config: OpenAPIConfig = {
		BASE: MOZ_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: MOZ_DEFAULT_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			'x-moz-token': key,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: MOZ_JSONRPC_PATH,
		body: {
			jsonrpc: '2.0',
			id: mozRequestId(),
			method,
			params: { data: data ?? {} },
		},
		mediaType: 'application/json',
	};

	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw mozApiError(method, error.status, error.statusText, error.body, {
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			});
		}
		throw error;
	}

	const envelope = asRecord(raw);
	if (envelope && asRecord(envelope.error)) {
		throw mozApiError(method, 200, 'OK', raw);
	}
	if (!envelope || !('result' in envelope)) {
		throw mozApiError(method, 502, 'Bad Gateway', {
			error: { message: `Moz returned no result for ${method}` },
		});
	}
	return envelope.result;
}
