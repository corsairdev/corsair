import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SPONDYR_API_BASE = 'https://client.spondyr.io/api/v1.0.0';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale with whatever it is handed, so a partial one
// either skips the rate-limit block or throws reading `headerNames`.
const SPONDYR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Spondyr credentials. Both are required on every request. */
export type SpondyrCredentials = { apiKey: string; applicationToken: string };

/**
 * Spondyr answers every failure, including a bad key, with HTTP 400 and a body
 * that still carries `APIStatus: 'ERROR'`. Some routes answer 404 for the same
 * reason. The status code alone says nothing, so this error reads the envelope.
 *
 * A 200 with `APIStatus: 'ERROR'` is also a failure. The endpoints call
 * `assertApiStatus` on every body for that reason.
 */
export class SpondyrAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Spondyr sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;
	/** The provider's machine-readable status: `OK` or `ERROR`. */
	readonly apiStatus?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			apiStatus?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SpondyrAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.apiStatus = options.apiStatus;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

/** Reads `ErrorMessage` and `APIStatus` out of a Spondyr envelope. */
export function describeSpondyrError(
	status: number | undefined,
	// unknown: provider or proxy bodies have no fixed shape.
	body: unknown, // unknown: the provider or a proxy decides the body shape.
	fallback: string,
): { message: string; apiStatus?: string } {
	const record = asRecord(body);
	const errorMessage = record?.ErrorMessage;
	const apiStatus = record?.APIStatus;
	const text =
		typeof errorMessage === 'string' && errorMessage.length > 0
			? errorMessage
			: (typeof record?.Message === 'string' && record.Message) || fallback;
	return {
		message: status === undefined ? text : `Spondyr ${status}: ${text}`,
		apiStatus: typeof apiStatus === 'string' ? apiStatus : undefined,
	};
}

export type SpondyrQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SpondyrRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: SpondyrQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Spondyr takes its two credentials as `APIKey` and `ApplicationToken`. Both
 * work as query parameters or as JSON body fields, and both also work as
 * headers, which is what this client uses: a header keeps them out of the URL,
 * where a proxy log or an ApiError would otherwise capture them.
 *
 * The read routes send only a query string, so without the headers there is no
 * body to carry them.
 */
export async function makeSpondyrRequest(
	credentials: SpondyrCredentials,
	{ method, path, query, body }: SpondyrRequest,
): Promise<unknown> {
	// unknown: each operation's output schema types the answer.
	const config: OpenAPIConfig = {
		BASE: SPONDYR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			APIKey: credentials.apiKey,
			ApplicationToken: credentials.applicationToken,
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
			// unknown: see above.
			rateLimitConfig: SPONDYR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof SpondyrAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeSpondyrError(
				error.status,
				error.body,
				error.message,
			);
			throw new SpondyrAPIError(described.message, {
				cause: error,
				apiStatus: described.apiStatus,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SpondyrAPIError(error.message, { cause: error, method });
		}
		throw new SpondyrAPIError('Unknown Spondyr error', { method });
	}
}
