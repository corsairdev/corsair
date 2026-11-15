import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TOMTOM_API_BASE = 'https://api.tomtom.com';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const TOMTOM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * TomTom answers every failure with `{ detailedError: { code, message } }`, and
 * the `code` is a short string such as `Unauthorized`, `BadRequest` or
 * `TooManyRequests`. A few routes use `{ error: { description } }` instead, so
 * both are read.
 */
export class TomTomAPIError extends Error {
	readonly status?: number;
	/** The provider's own code, e.g. `Unauthorized`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when TomTom sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TomTomAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code ?? readCode(cause?.body);
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/**
	 * A 403 from TomTom is a key that does not cover the product or the region,
	 * not a transient failure, so it is not retried.
	 */
	get isPermission(): boolean {
		return this.status === 403;
	}
}

// unknown: the error body is untyped until the nested objects are read.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const detailed = asRecord(record?.detailedError);
	if (typeof detailed?.code === 'string') return detailed.code;
	const error = asRecord(record?.error);
	return typeof error?.code === 'string' ? error.code : undefined;
}

export function describeTomTomError(
	status: number | undefined,
	// unknown: the body is the documented detailedError envelope, or a proxy page.
	body: unknown,
	fallback: string,
): { message: string; code?: string } {
	const record = asRecord(body);
	const detailed = asRecord(record?.detailedError);
	const error = asRecord(record?.error);
	const text =
		(typeof detailed?.message === 'string' && detailed.message) ||
		(typeof error?.description === 'string' && error.description) ||
		(typeof record?.message === 'string' && record.message) ||
		fallback;
	const code =
		(typeof detailed?.code === 'string' && detailed.code) ||
		(typeof error?.code === 'string' && error.code) ||
		undefined;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return { message: label ? `TomTom ${label}: ${text}` : text, code };
}

export type TomTomQuery = Record<string, string | number | boolean | undefined>;

export type TomTomRequest = {
	method: 'GET';
	path: string;
	query?: TomTomQuery;
};

/**
 * TomTom takes the key as the `key` query parameter, which is one of the four
 * names `ApiError` redacts, so the cause is kept: it cannot leak the key.
 */
export async function makeTomTomRequest(
	apiKey: string,
	{ method, path, query }: TomTomRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TOMTOM_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, key: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TOMTOM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TomTomAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeTomTomError(
				error.status,
				error.body,
				error.message,
			);
			throw new TomTomAPIError(described.message, {
				cause: error,
				code: described.code,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TomTomAPIError(error.message, { cause: error, method });
		}
		throw new TomTomAPIError('Unknown TomTom error', { method });
	}
}

/** Joins two coordinates as `lat,lon`, which every TomTom path parameter takes. */
export function point(latitude: number, longitude: number): string {
	return `${latitude},${longitude}`;
}
