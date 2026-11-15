import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GEOKEO_BASE = 'https://geokeo.com';

/**
 * Geokeo answers **HTTP 200 for everything**, including a refused key:
 *
 * ```json
 * {"status": "ACCESS_DENIED"}
 * ```
 *
 * A live probe with a bad key answered exactly that on both routes, and a
 * request with no key at all answered `{"status":"INVALID_REQUEST"}`. So the
 * status line says nothing and `status` in the body is the only signal.
 *
 * The key travels as the `api` query parameter.
 * Reference: https://geokeo.com/documentation.php
 */
export type GeokeoCredentials = {
	/** The API key from the dashboard's API tab. */
	apiKey?: string;
};

/** The `status` values Geokeo documents. */
export const GEOKEO_STATUS = {
	/** Results were found; start reading them. */
	OK: 'ok',
	/** A required parameter is missing or invalid. */
	INVALID_REQUEST: 'INVALID_REQUEST',
	/** The key was refused, or an IP or HTTP referrer restriction blocked it. */
	ACCESS_DENIED: 'ACCESS_DENIED',
	/** Above the daily allowance. Responses are throttled past 30% of quota. */
	OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
	/**
	 * The query was valid but matched nothing. The docs say this request **is
	 * not charged**, so it is a result rather than a failure.
	 */
	ZERO_RESULTS: 'ZERO_RESULTS',
} as const;

/** The `status` and `credits` fields every answer carries. */
// unknown: the body is an untyped envelope until asRecord narrows it.
export function readStatus(body: unknown): {
	status?: string;
	credits?: string;
} {
	const record = asRecord(body);
	const status = record?.status;
	const credits = record?.credits;
	return {
		status: typeof status === 'string' ? status : undefined,
		credits: typeof credits === 'string' ? credits : undefined,
	};
}

/**
 * A refusal Geokeo put in the body of an HTTP 200 (`code`), or a transport
 * failure before any answer. A real HTTP error status comes through as core's
 * `ApiError` instead.
 */
export class GeokeoAPIError extends Error {
	/** Geokeo's own code, such as `ACCESS_DENIED`. */
	readonly code?: string;
	/** The credits link Geokeo sends with each answer, when there was one. */
	readonly creditsUrl?: string;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			code?: string;
			creditsUrl?: string;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GeokeoAPIError';
		this.code = options.code;
		this.creditsUrl = options.creditsUrl;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/** The key was refused, or an IP or referrer restriction blocked the call. */
	get isAuthError(): boolean {
		return this.code === GEOKEO_STATUS.ACCESS_DENIED;
	}

	/** The daily allowance is used up. */
	get isQuotaError(): boolean {
		return this.code === GEOKEO_STATUS.OVER_QUERY_LIMIT;
	}

	/** A required parameter was missing or invalid. */
	get isValidationError(): boolean {
		return this.code === GEOKEO_STATUS.INVALID_REQUEST;
	}
}

/** A readable message from the body's `status`. */
// unknown: an error body is untyped: Geokeo's `{ status }`, or text from a proxy
// that never reached the API.
export function describeGeokeoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readStatus(body);
	const code = fields.status ?? fallback;
	// Geokeo's status line is always 200, so it says nothing; the code is the
	// whole message.
	return status && status !== 200
		? `Geokeo ${status}: ${code}`
		: `Geokeo: ${code}`;
}

export type GeokeoQueryValue = string | number | boolean;

export type GeokeoRequest = {
	path: string;
	query: Record<string, GeokeoQueryValue | undefined>;
};

/**
 * The docs describe throttling rather than a hard rate limit, and a used-up
 * quota arrives as HTTP 200 with `OVER_QUERY_LIMIT`, so a real 429 can only
 * come from a proxy in front of the API. Core retries that 429 itself (three
 * times, honouring `Retry-After`), so the handlers do not retry it again.
 */
const GEOKEO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGeokeoRequest(
	credentials: GeokeoCredentials,
	{ path, query }: GeokeoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GEOKEO_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 30_000,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: {
			...query,
			api: credentials.apiKey,
		},
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: GEOKEO_RATE_LIMIT_CONFIG,
		});
		// A 200 with a non-ok `status` is a failure, and the body is the only
		// place Geokeo says so. `ZERO_RESULTS` is deliberately not an error: the
		// docs say it is not charged, and an empty result list is a valid answer.
		const fields = readStatus(raw);
		if (
			fields.status !== undefined &&
			fields.status !== GEOKEO_STATUS.OK &&
			fields.status !== GEOKEO_STATUS.ZERO_RESULTS
		) {
			throw new GeokeoAPIError(
				describeGeokeoError(undefined, raw, 'Geokeo refused the request'),
				{
					code: fields.status,
					creditsUrl: fields.credits,
					method: 'GET',
				},
			);
		}
		return raw;
	} catch (error) {
		if (error instanceof GeokeoAPIError) throw error;
		if (error instanceof ApiError) {
			// Core's ApiError goes through (R8), so its status and retryAfter reach
			// the handlers. It is rebuilt without the query string: core redacts
			// `key` and `api_key` but not Geokeo's `api` parameter, so the URL and
			// request would otherwise carry the key, plus the address or
			// coordinates. Only Geokeo's `status` is kept from the body.
			const fields = readStatus(error.body);
			const safeBody = fields.status ? { status: fields.status } : undefined;
			const url = new URL(error.url);
			url.search = '';
			throw new ApiError(
				{ ...error.request, query: undefined },
				{
					url: url.toString(),
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: safeBody,
				},
				describeGeokeoError(error.status, safeBody, `HTTP ${error.status}`),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GeokeoAPIError(error.message, {
				cause: error,
				method: 'GET',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GeokeoAPIError('Unknown Geokeo error', {
			method: 'GET',
			transport: true,
		});
	}
}

/** Drops keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GeokeoQueryValue | undefined>,
): Record<string, GeokeoQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GeokeoQueryValue] => entry[1] !== undefined,
		),
	);
}
