import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LUSHA_API_BASE = 'https://api.lusha.com';

/** The message Lusha sends (per its error-codes page) when the account is out of credits. */
const INSUFFICIENT_CREDITS_MESSAGE = 'insufficient credits';

export type LushaRequest = {
	method: 'GET' | 'POST';
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * The call charges credits on success (every search and enrich call).
	 * Lusha re-charges on every repeat, so a 5xx on a metered call is not
	 * replayed: the first attempt may already have started work.
	 */
	metered?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: the body is an untyped error body until the helpers narrow it.
function readString(record: Record<string, unknown>, key: string): string | undefined {
	const value = record[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Reads Lusha's error message. The documented shape is
 * `{statusCode, message, errors?}`, but the live 401 body instead carries
 * `error: "Unauthorized"` and `timestamp`, so every field is optional here.
 */
export function describeLushaError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	if (!record) return fallback;
	const message =
		readString(record, 'message') ?? readString(record, 'error') ?? fallback;
	const errors = record.errors;
	const details = Array.isArray(errors)
		? errors.filter((item): item is string => typeof item === 'string')
		: [];
	const summary = `Lusha ${status ?? 'error'}: ${message}`;
	return details.length > 0 ? `${summary} (${details.join('; ')})` : summary;
}

/**
 * Lusha's error taxonomy: https://docs.lusha.com/docs/errors (402 out of
 * credits, 401 bad key, 403 plan restriction, 400 bad request, 429 rate
 * limited, 409 duplicate name, 451 legal block, 5xx server).
 */
export class LushaAPIError extends Error {
	readonly status?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;
	/** Milliseconds from a Retry-After header, when a gateway sent one. */
	readonly retryAfter?: number;
	/**
	 * True when repeating the request cannot charge credits twice or repeat a
	 * side effect. Transport failures are always safe: the request never
	 * reached Lusha. A 5xx on a metered call is not, because the first attempt
	 * may already have processed it.
	 */
	readonly safeToReplay: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			method?: string;
			retryAfter?: number;
			safeToReplay?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LushaAPIError';
		this.status = options.status;
		this.method = options.method;
		this.retryAfter = options.retryAfter;
		this.safeToReplay = options.safeToReplay ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	get isAuthError(): boolean {
		return this.status === 401;
	}

	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** 402, or the documented message (matched defensively in case the status differs). */
	get outOfCredits(): boolean {
		return this.status === 402 || this.message.toLowerCase().includes(INSUFFICIENT_CREDITS_MESSAGE);
	}
}

// Lusha rate limits per account (25 requests/second default; account.usage 5
// requests/minute) with `x-rate-limit-minute/hourly/daily` and
// `x-*-requests-left/usage` response headers and no `Retry-After`, so backoff
// is client-chosen and `corsair/http` cannot return those headers anyway.
// error-handlers.ts owns retries, so the client makes one attempt and only
// reads a Retry-After into the error if a gateway sends one.
const LUSHA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: LUSHA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			// Lusha names the header exactly `api_key` (lowercase, underscore);
			// any other spelling is rejected.
			api_key: apiKey,
		},
	};
}

/**
 * Sends one operation and returns the response body. Lusha reports failures
 * through HTTP status codes, so no envelope check is needed here; the per-item
 * soft miss (an `error` object inside a result) is documented data and is
 * parsed by the output schema.
 */
export async function makeLushaRequest(
	apiKey: string,
	{ method, path, body, metered }: LushaRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: LUSHA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof LushaAPIError) throw error;
		if (error instanceof ApiError) {
			throw new LushaAPIError(
				describeLushaError(error.status, error.body, error.message),
				{
					status: error.status,
					method,
					retryAfter: error.retryAfter,
					// A 5xx means the request reached Lusha; on a metered call the
					// first attempt may already have charged or started a job, so a
					// replay is not safe. Every other status is not retried anyway.
					safeToReplay: !metered || (error.status ?? 0) < 500,
					// The ApiError cause is dropped: it carries the raw body, and the
					// key travels in a header that error messages must never quote.
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LushaAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
				// A transport failure never reached Lusha, so repeating cannot
				// charge a second time (every operation here is a read).
				safeToReplay: true,
			});
		}
		throw new LushaAPIError('Unknown Lusha error', { method });
	}
}
