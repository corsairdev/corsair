import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TOMBA_API_BASE = 'https://api.tomba.io/v1';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`. Tomba sends `Retry-After`
// on a 429, which the docs say names when to retry.
const TOMBA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Tomba needs both the API key and the API secret on every request. */
export type TombaCredentials = { apiKey: string; apiSecret: string };

/**
 * Tomba puts its error detail in `errors: { type, message, code }`, and the
 * `type` is the machine-readable part: `authentication_failed`,
 * `unknown_record`, `insufficient_credits`. The HTTP status alone does not
 * distinguish a bad key from a valid key whose plan ran out.
 */
export class TombaAPIError extends Error {
	readonly status?: number;
	/** The documented error type, e.g. `authentication_failed`. */
	readonly type?: string;
	/** Milliseconds from a Retry-After header, when Tomba sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			type?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TombaAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.type = options.type ?? readErrorType(cause?.body);
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** The account is out of search or verification credits. No retry helps. */
	get isInsufficientCredits(): boolean {
		return this.status === 402 || this.type === 'insufficient_credits';
	}

	/**
	 * The person asked Tomba to stop processing their data, so it is withheld
	 * permanently. Retrying is both useless and inappropriate.
	 */
	get isLegalBlock(): boolean {
		return this.status === 451 || this.type === 'legal_block';
	}
}

// unknown: the error body is untyped until the nested `errors` object is read.
function readErrorType(body: unknown): string | undefined {
	const errors = asRecord(asRecord(body)?.errors);
	const type = errors?.type;
	return typeof type === 'string' && type.length > 0 ? type : undefined;
}

/**
 * Reads the message out of `errors: { type, message, code }`. A missing key
 * answers `{ errors: { type: 'authentication_failed', message: 'No user found
 * for the API supplied.' } }` with HTTP 400, so the type matters more than the
 * status.
 */
export function describeTombaError(
	status: number | undefined,
	// unknown: a proxy can answer HTML or plain text where JSON is expected.
	body: unknown,
	fallback: string,
): { message: string; type?: string } {
	const record = asRecord(body);
	const errors = asRecord(record?.errors);
	const message =
		(typeof errors?.message === 'string' && errors.message) ||
		(typeof record?.message === 'string' && record.message) ||
		fallback;
	const type =
		typeof errors?.type === 'string' && errors.type.length > 0
			? errors.type
			: undefined;
	const label = [status, type].filter((part) => part !== undefined).join(' ');
	return { message: label ? `Tomba ${label}: ${message}` : message, type };
}

export type TombaQuery = Record<string, string | number | boolean | undefined>;

export type TombaRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: TombaQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeTombaRequest(
	credentials: TombaCredentials,
	{ method, path, query, body }: TombaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TOMBA_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Tomba-Key': credentials.apiKey,
			'X-Tomba-Secret': credentials.apiSecret,
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
			rateLimitConfig: TOMBA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TombaAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeTombaError(
				error.status,
				error.body,
				error.message,
			);
			throw new TombaAPIError(described.message, {
				cause: error,
				type: described.type,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TombaAPIError(error.message, { cause: error, method });
		}
		throw new TombaAPIError('Unknown Tomba error', { method });
	}
}
