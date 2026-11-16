import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const RENDERFORM_API_BASE = 'https://api.renderform.io';

/**
 * A refusal is `{msg, status, errors?}`, and the status in the body repeats the
 * HTTP one:
 *
 * ```json
 * {"msg":"Incorrect API Key","status":400}
 * {"msg":"Resource not found","status":404}
 * ```
 *
 * Both were captured live. **A wrong key is a `400`, not a `401`**, which is why
 * `isAuthError` also reads the message: an invalid key would otherwise look like a
 * malformed body and a caller would keep retrying it.
 */
export class RenderformAPIError extends Error {
	readonly status?: number;
	/** The body's `status`, which repeats the HTTP status. */
	readonly code?: number;
	/** The `errors` list, when the failure named individual problems. */
	readonly errors?: string[];
	/** Milliseconds from a Retry-After header, when Renderform sent one. */
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
			code?: number;
			errors?: string[];
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RenderformAPIError';
		this.status = options.status;
		this.code = options.code;
		this.errors = options.errors;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The key is wrong or missing. Renderform answers a bad key with `400` and
	 * "Incorrect API Key", so the status alone is not enough.
	 */
	get isAuthError(): boolean {
		if (this.status === 401 || this.status === 403) return true;
		return /api key/i.test(this.message);
	}

	/** The template or render result does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A body Renderform refused. A `400` that is not a key failure lands here, and
	 * `errors` holds the individual reasons when it named any.
	 */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}

	/** Out of credits, which retrying cannot fix. */
	get isQuotaError(): boolean {
		return this.status === 402;
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	msg?: string;
	status?: number;
	errors?: string[];
} {
	const record = asRecord(body);
	const msg = record?.msg ?? record?.message;
	const status = record?.status;
	const rawErrors = record?.errors;
	const errors = Array.isArray(rawErrors)
		? rawErrors.filter((entry): entry is string => typeof entry === 'string')
		: undefined;
	return {
		msg: typeof msg === 'string' && msg.length > 0 ? msg : undefined,
		status: typeof status === 'number' ? status : undefined,
		errors: errors && errors.length > 0 ? errors : undefined,
	};
}

/**
 * Builds the message for an error body, appending the individual `errors` when the
 * API named any.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRenderformError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { msg, status: bodyStatus, errors } = failure(body);
	const text = msg ?? fallback;
	const label = status ?? bodyStatus;
	const head = label === undefined ? text : `Renderform ${label}: ${text}`;
	return errors ? `${head} (${errors.join('; ')})` : head;
}

/** A query value. The template list takes `name` and repeated `tags`. */
export type RenderformQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type RenderformRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path below the host, starting with `/api/…`. */
	path: string;
	query?: RenderformQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Renderform documents no numeric rate limit. A render costs credits and a cached
 * render costs none, so the honest guard against a runaway loop is the credit
 * balance rather than a rate, and a 402 is never retried.
 */
const RENDERFORM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key goes in `x-api-key`, the header the OpenAPI security scheme names. It is
 * lowercase in the spec and HTTP header names are case-insensitive, so the exact
 * casing is not load-bearing but is kept as documented.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RENDERFORM_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRenderformRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RenderformRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: RENDERFORM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the x-api-key header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RenderformAPIError(
				describeRenderformError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.status,
					errors: fields.errors,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RenderformAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RenderformAPIError('Unknown Renderform error', {
			method,
			replayable,
		});
	}
}

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
