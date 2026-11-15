import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const CERTSPOTTER_API_BASE = 'https://api.certspotter.com/v1';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`. Cert Spotter does send
// `Retry-After` on an empty page, which tells a poller when to ask again.
const CERTSPOTTER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Cert Spotter's error codes are stable and documented one by one, so the code
 * is worth keeping next to the status: `rate_limited` and `timeout` are the two
 * a caller may act on, and `lagging_client` is specific to the firehose.
 */
export class CertSpotterAPIError extends Error {
	readonly status?: number;
	/** The documented machine-readable code, e.g. `bad_credentials`. */
	readonly code?: string;
	/** The field the error is about, when Cert Spotter named one. */
	readonly field?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
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
		this.name = 'CertSpotterAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		const body = asRecord(cause?.body);
		this.code = readString(body, 'code');
		this.field = readString(body, 'field');
	}

	get isRateLimit(): boolean {
		// The provider documents `rate_limited` as the code for exceeding the
		// plan's request rate, and answers 429.
		return this.status === 429 || this.code === 'rate_limited';
	}

	/** The search exceeded the plan's query timeout. Retrying will not help. */
	get isTimeout(): boolean {
		return this.code === 'timeout';
	}

	/** A subscription lapsed; the provider says to renew it. */
	get isPaymentRequired(): boolean {
		return this.code === 'payment_required' || this.status === 402;
	}
}

// unknown: Cert Spotter bodies are untyped JSON until read field by field.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: the error body is the documented `{ code, message, field }` object,
// but a proxy can answer HTML or text.
export function describeCertSpotterError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const code = readString(record, 'code');
	const text = readString(record, 'message') ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Cert Spotter ${label}: ${text}` : text;
}

export type CertSpotterQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type CertSpotterRequest = {
	method: 'GET';
	path: string;
	query?: CertSpotterQuery;
};

/**
 * Cert Spotter accepts the key as a Bearer token or as HTTP Basic with the key
 * as the username and an empty password. Bearer is used here: `corsair/http`
 * only renders Basic when both username and password are non-empty, so an
 * empty password could not be expressed through USERNAME/PASSWORD.
 */
export async function makeCertSpotterRequest(
	apiKey: string,
	{ method, path, query }: CertSpotterRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: CERTSPOTTER_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: CERTSPOTTER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof CertSpotterAPIError) throw error;
		if (error instanceof ApiError) {
			throw new CertSpotterAPIError(
				describeCertSpotterError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new CertSpotterAPIError(error.message, { cause: error, method });
		}
		throw new CertSpotterAPIError('Unknown Cert Spotter error', { method });
	}
}
