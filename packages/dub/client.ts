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

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. A gateway 429 carries no body code, so the
// status alone must count as a rate limit; the body code covers the rest.
const DUB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 || readErrorCode(body) === 'rate_limit_exceeded',
};

/**
 * The key travels in the Authorization header, which neither the error message
 * nor the error body echoes, so the cause is dropped for HTTP failures and the
 * body is read for the message only. Transport errors keep their cause.
 */
export class DubAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code from the error envelope, e.g. `not_found`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Dub sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// True when replaying cannot duplicate the effect: reads, and links.upsert,
	// the one write Dub documents as idempotent. Every other write gets false,
	// so SERVER_ERROR cannot replay it.
	readonly idempotent: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			idempotent?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DubAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method;
		this.idempotent = options.idempotent ?? false;
		this.code = options.code;
	}

	get isRateLimit(): boolean {
		return this.status === 429 || this.code === 'rate_limit_exceeded';
	}
}

export function describeDubError(
	status: number | undefined,
	// unknown: error bodies are usually the envelope, but a proxy can answer
	// with HTML or text.
	body: unknown,
	fallback: string,
): string {
	const record = errorRecord(body);
	const text = readString(record, 'message') ?? fallback;
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
	// Set only on links.upsert. Dub offers no idempotency keys, so every other
	// write must not be replayed on a 5xx.
	idempotent?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// a string rather than JSON for qr.get, which answers image/svg+xml.
export async function makeDubRequest(
	apiKey: string,
	{ method, path, query, body, idempotent }: DubRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DUB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	const replaySafe = method === 'GET' || idempotent === true;

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DUB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DubAPIError(
				describeDubError(error.status, error.body, error.message),
				{
					status: error.status,
					code: readErrorCode(error.body),
					retryAfter: error.retryAfter,
					method,
					idempotent: replaySafe,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new DubAPIError(error.message, {
				cause: error,
				method,
				idempotent: replaySafe,
			});
		}
		throw new DubAPIError('Unknown Dub error', {
			method,
			idempotent: replaySafe,
		});
	}
}
