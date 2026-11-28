import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DUB_API_BASE = 'https://api.dub.co';

// unknown: the body is an untyped error body until asRecord narrows it. Dub
// wraps every failure in { error: { code, message, doc_url } }.
function errorRecord(body: unknown): Record<string, unknown> | undefined {
	return asRecord(asRecord(body)?.error) ?? undefined;
}

function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readErrorCode(body: unknown): string | undefined {
	return readString(errorRecord(body), 'code');
}

// Core's request() retries a 429 three times, honouring Retry-After. A
// gateway 429 carries no body code, so the status alone counts as a rate
// limit; the body code covers the rest.
export const DUB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	// The limit header tells a plan with no quota for the route (Dub's free
	// plan gets X-RateLimit-Limit: 0 on analytics) from a busy one.
	headerNames: {
		retryAfter: 'retry-after',
		limit: 'x-ratelimit-limit',
		remaining: 'x-ratelimit-remaining',
	},
	isRateLimitError: (status, body) =>
		status === 429 || readErrorCode(body) === 'rate_limit_exceeded',
};

/** Dub's machine-readable error code (`not_found`, `rate_limit_exceeded`) on an ApiError. */
export function dubErrorCode(error: unknown): string | undefined {
	return error instanceof ApiError ? readErrorCode(error.body) : undefined;
}

/**
 * True when replaying the request cannot duplicate its effect: reads, and the
 * upsert routes Dub documents as idempotent (create-or-update by domain+key
 * or partner+url).
 */
export function isReplaySafe(
	method: string | undefined,
	url: string | undefined,
): boolean {
	return method === 'GET' || (method === 'PUT' && /\/upsert$/.test(url ?? ''));
}

/**
 * A request that never got a response (connection reset, DNS failure,
 * timeout). It carries the method and route so the error handlers replay only
 * reads and upserts; an HTTP error is core's ApiError instead.
 */
export class DubTransportError extends Error {
	readonly method: string;
	readonly path: string;

	constructor(method: string, path: string, cause: unknown) {
		const message =
			cause instanceof Error || cause instanceof DOMException
				? cause.message
				: 'Dub request failed before a response';
		super(message, { cause });
		this.name = 'DubTransportError';
		this.method = method;
		this.path = path;
	}
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent request on `ApiError.request`: its headers hold the key
 * and its body can hold customer emails, names and destination URLs. The
 * error is rebuilt without them, keeping the status, method, route and
 * rate-limit fields the handlers and core read. Only Dub's `{ error: { code,
 * message, doc_url } }` envelope stays on the body.
 */
export function withoutRequestData(error: ApiError): ApiError {
	const envelope = errorRecord(error.body);
	const code = readString(envelope, 'code');
	const message = readString(envelope, 'message');
	const docUrl = readString(envelope, 'doc_url');
	return new ApiError(
		{
			method: error.request.method,
			url: error.request.url,
			body: error.request.body === undefined ? undefined : REDACTED,
		},
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: envelope
				? {
						error: {
							code,
							message: message ? redactEmails(message) : message,
							doc_url: docUrl,
						},
					}
				: undefined,
		},
		// Core's message for an unlisted status embeds the whole response
		// body, so the fallback is the status text only.
		describeDubError(
			error.status,
			error.body,
			error.statusText || 'request failed',
		),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

const EMAIL_PATTERN = /[^\s@"'<>(),;:]+@[^\s@"'<>(),;:]+\.[^\s@"'<>(),;:]+/g;

/**
 * Dub echoes some input in its messages (an invalid tag name, a taken key),
 * which can carry a customer's email address. Addresses are replaced before
 * the message lands in an error.
 */
export function redactEmails(text: string): string {
	return text.replace(EMAIL_PATTERN, '[email]');
}

export function describeDubError(
	status: number | undefined,
	// unknown: error bodies are usually the envelope, but a proxy can answer
	// with HTML or text.
	body: unknown,
	fallback: string,
): string {
	const record = errorRecord(body);
	const text = redactEmails(readString(record, 'message') ?? fallback);
	const code = readErrorCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Dub ${label}: ${text}` : text;
}

export type DubQuery = Record<string, string | number | boolean | undefined>;

export type DubRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: DubQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Upserts only: lets a 5xx or a dropped connection be replayed. */
	idempotent?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/** What one call needs from the endpoint context. */
export type DubCallContext = { key: string };

// unknown: callers parse the body with the endpoint's zod output schema. It is
// a string rather than JSON for qr.get, which answers image/svg+xml.
export async function makeDubRequest(
	ctx: DubCallContext,
	{ method, path, query, body }: DubRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DUB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Bearer ${ctx.key}` },
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
			rateLimitConfig: DUB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw new DubTransportError(method, path, error);
	}
}
