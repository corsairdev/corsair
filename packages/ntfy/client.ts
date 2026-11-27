import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NTFY_API_BASE = 'https://ntfy.sh';

// A garbage Bearer token makes even public-topic calls fail with 401 40101,
// so the plugin sends the real key on every call and never a placeholder.
export type NtfyQuery = Record<string, string | number | boolean | undefined>;

export type NtfyRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: NtfyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
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

// unknown: the error body is untyped until asRecord narrows it; ntfy error
// bodies are { code, http, error, link }.
function readNtfyCode(body: unknown): number | undefined {
	const code = asRecord(body)?.code;
	return typeof code === 'number' ? code : undefined;
}

/**
 * ntfy error bodies carry a numeric ntfy code beside the HTTP status
 * ({ code: 42905, http: 429, error: "..." }), which the error handlers match
 * on. The request body and the ApiError cause are not copied: the key travels
 * in a header, but the body can echo caller content.
 */
export class NtfyAPIError extends Error {
	readonly status?: number;
	readonly ntfyCode?: number;
	readonly retryAfter?: number;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			status?: number;
			ntfyCode?: number;
			retryAfter?: number;
			method?: string;
			// Retained only for transport errors, which never held a body.
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NtfyAPIError';
		this.status = options.status;
		this.ntfyCode = options.ntfyCode;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	/** A 429 by status, or the bandwidth-exceeded poll code by body. */
	get isRateLimit(): boolean {
		return this.status === 429 || this.ntfyCode === 42905;
	}
}

// unknown: see readNtfyCode; a proxy can also answer HTML or text.
function describeNtfyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = asRecord(body)?.error;
	const message = typeof text === 'string' && text.length > 0 ? text : fallback;
	return status === undefined ? message : `ntfy ${status}: ${message}`;
}

// unknown: callers parse the body with the endpoint's zod output schema; a
// poll returns NDJSON text and an empty body is undefined or ''.
export async function makeNtfyRequest(
	apiKey: string,
	{ method, path, query, body }: NtfyRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NTFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		// unknown: a poll returns NDJSON text, a publish a JSON object; the
		// endpoint's output schema parses whichever comes back.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NTFY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new NtfyAPIError(
				describeNtfyError(error.status, error.body, error.message),
				{
					status: error.status,
					ntfyCode: readNtfyCode(error.body),
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NtfyAPIError(error.message, { cause: error, method });
		}
		throw new NtfyAPIError('Unknown ntfy error', { method });
	}
}

/**
 * Parses a poll response body: application/x-ndjson, one JSON object per
 * line, possibly empty. Tombstone and stream-keepalive events are filtered
 * out; only `event: "message"` rows remain.
 */
// unknown: raw is the response body the client returned, a string or not.
export function parseNtfyNdjson(raw: unknown): unknown[] {
	if (typeof raw !== 'string') return [];
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
