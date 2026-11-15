import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TONEDEN_API_BASE = 'https://www.toneden.io/api/v1';

export const TONEDEN_OAUTH_AUTHORIZE_URL =
	'https://www.toneden.io/auth/oauth2/authorize';
export const TONEDEN_OAUTH_TOKEN_URL =
	'https://www.toneden.io/auth/oauth2/token';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const TONEDEN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * ToneDen's error body is not documented per route. The API answers a JSON
 * object with a `message` or `error` field on failure, and `/links/validPath`
 * answers 200 with `{ valid: false, reason }` for an unusable path, which is a
 * success with a negative answer rather than an error.
 */
export class ToneDenAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when ToneDen sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
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
		this.name = 'ToneDenAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** The access token was rejected, or has no scope for this route. */
	get isAuthError(): boolean {
		return this.status === 401;
	}
}

export function describeToneDenError(
	status: number | undefined,
	// unknown: the error body is an untyped JSON object or a proxy page.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message =
		(typeof record?.message === 'string' && record.message) ||
		(typeof record?.error === 'string' && record.error) ||
		(typeof record?.error_description === 'string' &&
			record.error_description) ||
		fallback;
	return status === undefined ? message : `ToneDen ${status}: ${message}`;
}

export type ToneDenQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type ToneDenRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: ToneDenQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeToneDenRequest(
	accessToken: string,
	{ method, path, query, body }: ToneDenRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TONEDEN_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TONEDEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ToneDenAPIError) throw error;
		if (error instanceof ApiError) {
			throw new ToneDenAPIError(
				describeToneDenError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ToneDenAPIError(error.message, { cause: error, method });
		}
		throw new ToneDenAPIError('Unknown ToneDen error', { method });
	}
}
