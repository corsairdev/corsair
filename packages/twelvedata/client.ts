import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TWELVEDATA_API_BASE = 'https://api.twelvedata.com';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const TWELVEDATA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Twelve Data reports failure with HTTP 200 as well as with 4xx: a bad symbol
 * answers `200 { code: 400, status: 'error', message: '...' }`. On top of that,
 * a batch answer can carry a `status: 'error'` per symbol while the request as a
 * whole is a 200. The status code alone therefore says nothing, and
 * `assertOk` reads the body.
 */
export class TwelveDataAPIError extends Error {
	readonly status?: number;
	/** The provider's own numeric code, which repeats the HTTP status. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TwelveDataAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status ?? options.code;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code ?? readCode(cause?.body);
	}

	get isRateLimit(): boolean {
		// Twelve Data answers a 429 for the per-minute limit. Its daily API-credit
		// limit also answers 429, distinguished only by the message.
		return this.status === 429;
	}

	/** The plan does not include the endpoint, which no retry will change. */
	get isPlanLimit(): boolean {
		return this.status === 403;
	}
}

// unknown: the body is `{ code, message }` on failure and the data on success.
function readCode(body: unknown): number | undefined {
	const code = asRecord(body)?.code;
	return typeof code === 'number' ? code : undefined;
}

export function describeTwelveDataError(
	status: number | undefined,
	// unknown: a proxy can answer HTML or text where JSON is expected.
	body: unknown,
	fallback: string,
): { message: string; code?: number } {
	const record = asRecord(body);
	const message =
		(typeof record?.message === 'string' && record.message) || fallback;
	const code = typeof record?.code === 'number' ? record.code : undefined;
	const label = [status, code === undefined ? undefined : `code ${code}`]
		.filter((part) => part !== undefined)
		.join(' ');
	return {
		message: label ? `Twelve Data ${label}: ${message}` : message,
		code,
	};
}

/**
 * Throws when a 200 body still says `status: 'error'`. A single-symbol answer and
 * a batch answer both carry that field, so this is what turns a silently failed
 * lookup into an error.
 */
export function assertOk(
	// unknown: the raw body, before the operation's output schema runs.
	raw: unknown,
	operation: string,
): void {
	const record = asRecord(raw);
	if (record?.status !== 'error') return;
	const message =
		typeof record.message === 'string' ? record.message : 'no message given';
	const code = typeof record.code === 'number' ? record.code : undefined;
	throw new TwelveDataAPIError(`${operation} was refused: ${message}`, {
		code,
	});
}

export type TwelveDataQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TwelveDataRequest = {
	method: 'GET';
	path: string;
	query?: TwelveDataQuery;
};

export async function makeTwelveDataRequest(
	apiKey: string,
	{ method, path, query }: TwelveDataRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TWELVEDATA_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, apikey: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TWELVEDATA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TwelveDataAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeTwelveDataError(
				error.status,
				error.body,
				error.message,
			);
			throw new TwelveDataAPIError(described.message, {
				cause: error,
				code: described.code,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TwelveDataAPIError(error.message, { cause: error, method });
		}
		throw new TwelveDataAPIError('Unknown Twelve Data error', { method });
	}
}
