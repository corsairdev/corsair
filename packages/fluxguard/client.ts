import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FLUXGUARD_API_BASE = 'https://api.fluxguard.com';

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. Fluxguard does not document a limit or a Retry-After
// header; leaving `headerNames` out throws on the first 429, and dropping it
// would discard the header if one ever appears.
const FLUXGUARD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Fluxguard answers every error with `{ message }`: `Forbidden` for a bad or
 * missing key, `Missing Authentication Token` for a route or method that does
 * not exist, and `Invalid request body` for a malformed body. The status is the
 * only thing that separates them.
 */
export class FluxguardAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Fluxguard sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'FluxguardAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}

	/** 403 with `Forbidden` covers both a bad key and a plan that lacks the API. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}
}

export type FluxguardRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers, such as a successful crawl trigger.
export async function makeFluxguardRequest(
	apiKey: string,
	{ method, path, body }: FluxguardRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: FLUXGUARD_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The key rides in a header, so ApiError's query redaction still holds
		// and the cause is safe to keep.
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: FLUXGUARD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new FluxguardAPIError(describeFluxguardError(error), {
				cause: error,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new FluxguardAPIError(error.message, { cause: error, method });
		}
		throw new FluxguardAPIError('Unknown Fluxguard error', { method });
	}
}

export function describeFluxguardError(error: ApiError): string {
	const body = asRecord(error.body);
	const detail = readString(body, 'message') ?? error.message;
	return `Fluxguard ${error.status}: ${detail}`;
}
