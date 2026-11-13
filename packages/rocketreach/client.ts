import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ROCKETREACH_API_BASE = 'https://api.rocketreach.co/api/v2';

/**
 * RocketReach answers a failure with a flat object naming the problem:
 *
 * ```json
 * {"detail":"Invalid API key","error_code":"authentication_failed"}
 * ```
 *
 * `error_code` is usually a string slug (`authentication_failed`,
 * `not_found`), but the email-verification route's insufficient-credits body
 * puts the integer `202` there instead, so both forms are kept in the error
 * and its message. The body is read rather than the status alone, because
 * a `403` means two different things (see `isOutOfLookupCredits`).
 */
export class RocketReachAPIError extends Error {
	readonly status?: number;
	/** The body's `error_code`, a slug such as authentication_failed, or 202. */
	readonly code?: string | number;
	/** Milliseconds from a Retry-After header, when RocketReach sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;
	/** The `credit_type` on an insufficient-credits 402, such as email_verification. */
	readonly creditType?: string;
	/** Where to buy more, from an insufficient-credits 402. */
	readonly purchaseUrl?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string | number;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
			creditType?: string;
			purchaseUrl?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RocketReachAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
		this.creditType = options.creditType;
		this.purchaseUrl = options.purchaseUrl;
	}

	/** The key is missing, wrong, or revoked. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * A `403` on a search or lookup route means the lookup credit balance is
	 * empty, not that the key lacks permission: the docs say "Running out of
	 * lookup credits is different ... the search and lookup endpoints return 403
	 * Forbidden with an explanatory detail and no structured credit fields."
	 * Only `/email/verify` reports credits as a `402`, and it names the pool.
	 */
	get isOutOfLookupCredits(): boolean {
		return this.status === 403 && this.creditType === undefined;
	}

	/** A `402` is the email-verification pool: it names `credit_type` and a purchase URL. */
	get isOutOfCredits(): boolean {
		return this.status === 402;
	}

	/** The profile, company or request the caller asked about does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A parameter RocketReach refused, or a body over 2.5 MB. The `413` is
	 * included because it is the same fix: send less.
	 */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 413 || this.status === 422;
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	message?: string;
	code?: string | number;
	creditType?: string;
	purchaseUrl?: string;
} {
	const record = asRecord(body);
	const detail = record?.detail;
	const message = record?.message;
	const code = record?.error_code;
	const creditType = record?.credit_type;
	const purchaseUrl = record?.purchase_url;
	return {
		message:
			typeof detail === 'string' && detail.length > 0
				? detail
				: typeof message === 'string' && message.length > 0
					? message
					: undefined,
		code:
			typeof code === 'string' || typeof code === 'number' ? code : undefined,
		creditType: typeof creditType === 'string' ? creditType : undefined,
		purchaseUrl: typeof purchaseUrl === 'string' ? purchaseUrl : undefined,
	};
}

/**
 * Builds the message for an error body, keeping RocketReach's `detail` because
 * it is the only explanation a `403` carries.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRocketReachError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, code } = failure(body);
	const text = message ?? fallback;
	const label = status === undefined ? '' : `RocketReach ${status}`;
	const codeText = code === undefined ? undefined : String(code);
	const withCode =
		codeText !== undefined && codeText.length > 0 && codeText !== text
			? `${label ? `${label} (${codeText})` : codeText}`
			: label;
	return withCode ? `${withCode}: ${text}` : text;
}

/**
 * A query value. RocketReach's lookups are flat scalars, and a search's arrays
 * travel in the JSON body rather than the query string.
 */
export type RocketReachQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RocketReachRequest = {
	method: 'GET' | 'POST';
	/** Path below `/api/v2`, starting with a slash. */
	path: string;
	query?: RocketReachQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
	/**
	 * A response header to return instead of the body, used for the bulk routes
	 * whose only useful answer is the `RR-Request-ID` to poll with.
	 */
	responseHeader?: string;
};

/**
 * The global ceiling is **10 requests per second** across every endpoint, and
 * each route adds its own per-minute limit that varies by plan. A `429` carries
 * a `Retry-After` in seconds, which is the only backoff RocketReach documents.
 */
const ROCKETREACH_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key goes in `Api-Key`. The docs call the `api_key` query parameter
 * deprecated, so it is never used: a key in a URL is logged by every proxy on
 * the way.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: ROCKETREACH_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'Api-Key': apiKey },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRocketReachRequest(
	apiKey: string,
	{ method, path, query, body, replayable, responseHeader }: RocketReachRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
		responseHeader,
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: ROCKETREACH_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the Api-Key header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RocketReachAPIError(
				describeRocketReachError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					creditType: fields.creditType,
					purchaseUrl: fields.purchaseUrl,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RocketReachAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RocketReachAPIError('Unknown RocketReach error', {
			method,
			replayable,
		});
	}
}
