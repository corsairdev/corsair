import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The only host. */
export const REDCIRCLE_API_BASE = 'https://api.redcircleapi.com';

/**
 * RedCircle reports every failure in `request_info`, and a `success: false`
 * there is the only signal — the body's shape is otherwise the same as a
 * success:
 *
 * ```json
 * { "request_info": { "success": false, "message": "Supplied api_key is not valid" } }
 * ```
 *
 * A `503` is different: RedCircle raises it during a parsing incident so it does
 * **not** serve partial data, and the body carries `retry_after` in **seconds**.
 * The plugin reads that and turns it into the same millisecond field a
 * `Retry-After` header would produce.
 */
export class RedcircleAPIError extends Error {
	readonly status?: number;
	/** The message from `request_info.message`. */
	readonly detail?: string;
	/** Milliseconds from a `Retry-After` header or the body's `retry_after`. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			detail?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RedcircleAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The key is missing or not valid. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * The account is out of credits or has a payment problem. No retry fixes it,
	 * and it arrives as a 402 rather than a 429, so it is kept separate.
	 */
	get isQuotaError(): boolean {
		return this.status === 402;
	}

	/** A parameter or combination RedCircle refused; the message names it. */
	get isValidationError(): boolean {
		return this.status === 400;
	}

	/** The path or verb does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A parsing incident. RedCircle says the request was **not** charged and
	 * supplies `retry_after`, so this is the one failure that is always safe to
	 * repeat, read or write.
	 */
	get isIncident(): boolean {
		return this.status === 503;
	}
}

/**
 * Reads `request_info` and the body-level `retry_after`.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function infoOf(body: unknown): {
	success: boolean;
	message?: string;
	retryAfterSeconds?: number;
} {
	const record = asRecord(body);
	const info = asRecord(record?.request_info);
	const message = info?.message;
	// The 503 body is the one that documents `retry_after`, and it is seconds.
	const retry = record?.retry_after;
	return {
		success: info?.success === true,
		message: typeof message === 'string' ? message : undefined,
		retryAfterSeconds: typeof retry === 'number' ? retry : undefined,
	};
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `infoOf` narrows it.
 */
export function describeRedcircleError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message } = infoOf(body);
	const text = message ?? fallback;
	const label = status !== undefined ? `${status}` : undefined;
	return label ? `RedCircle ${label}: ${text}` : text;
}

export type RedcircleQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RedcircleRequest = {
	method: 'GET';
	/** Path starting with a slash, such as `/request`. */
	path: string;
	query?: RedcircleQuery;
	/** Declared per operation so only a call that cannot write is replayed. */
	replayable: boolean;
};

/**
 * RedCircle rate-limits some plans and endpoints and documents a `429` for that,
 * but no `Retry-After`; the 503 body's `retry_after` is read into the error
 * instead. The handler owns the retry count.
 */
const REDCIRCLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key travels as the `api_key` query parameter, which `ApiError` redacts.
 * The cause is still dropped rather than relying on that, because the request URL
 * would otherwise carry it into any log of the error.
 */
function configWith(): OpenAPIConfig {
	return {
		BASE: REDCIRCLE_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRedcircleRequest(
	apiKey: string,
	{ method, path, query, replayable }: RedcircleRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, api_key: apiKey },
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(), requestOptions, {
			rateLimitConfig: REDCIRCLE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { message, retryAfterSeconds } = infoOf(error.body);
			const bodyDelay =
				retryAfterSeconds !== undefined ? retryAfterSeconds * 1000 : undefined;
			// The cause holds the query string, and with it the key, so the fields
			// the handlers need are copied and the cause is dropped.
			throw new RedcircleAPIError(
				describeRedcircleError(error.status, error.body, error.message),
				{
					status: error.status,
					detail: message,
					// A real header wins over the documented body field.
					retryAfter: error.retryAfter ?? bodyDelay,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RedcircleAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RedcircleAPIError('Unknown RedCircle error', {
			method,
			replayable,
		});
	}
}
