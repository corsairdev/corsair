import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KIT_API_BASE = 'https://api.kit.com';

// A bulk subscriber import is asynchronous and can answer 202 with a job to
// follow, so the 20 second default in corsair/http is too tight for it.
const KIT_TIMEOUT_MS = 60_000;

/**
 * Kit answers every failure with `{ errors: [ "...", ... ] }`, an array of
 * plain strings rather than objects. Some routes add `error` or `message`; the
 * array is the one shape every failure carries.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readErrors(body: unknown): string[] {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!Array.isArray(errors)) {
		const message = record?.message ?? record?.error;
		return typeof message === 'string' && message.length > 0 ? [message] : [];
	}
	return errors.filter(
		(entry): entry is string => typeof entry === 'string' && entry.length > 0,
	);
}

/**
 * Kit documents a minutely and a per-second request limit and answers 429 with
 * `Retry-After` when one is hit. error-handlers.ts owns the retry, so the client
 * makes one attempt and only reads the header into the error.
 */
const KIT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Kit failure.
 *
 * `errors` is flattened into one message so a caller sees every reason Kit gave
 * rather than the first. The body is dropped: a subscriber create echoes the
 * address back, and an address is personal data that should not ride along on
 * an error into a log.
 */
export class KitAPIError extends Error {
	readonly status?: number;
	/** Every message Kit sent, in its own order. */
	readonly errors: string[];
	/** Milliseconds from a Retry-After header, when Kit sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			errors?: string[];
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KitAPIError';
		this.status = options.status;
		this.errors = options.errors ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The key is real but the plan or the account does not permit this call. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** The payload is larger than Kit takes in one bulk request. */
	get isTooLarge(): boolean {
		return this.status === 413;
	}
}

/** Kit's messages joined, with the status in front. */
// unknown: an error body is untyped: an `{ errors: string[] }` envelope, or
// text from a proxy that never reached Kit.
export function describeKitError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const messages = readErrors(body);
	const text = messages.length > 0 ? messages.join('; ') : fallback;
	return status === undefined ? text : `Kit ${status}: ${text}`;
}

export type KitQueryValue = string | number | boolean;

export type KitRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, KitQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// each resource has its own attributes.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204, which is how an unsubscribe and a tag removal answer.
export async function makeKitRequest(
	apiKey: string,
	{ method, path, query, body }: KitRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KIT_API_BASE,
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KIT_TIMEOUT_MS,
		// Kit takes the key in `X-Kit-Api-Key`; an `Authorization: Bearer` header
		// is the OAuth path and not what an API key uses.
		HEADERS: { Accept: 'application/json', 'X-Kit-Api-Key': apiKey },
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
			rateLimitConfig: KIT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const errors = readErrors(error.body);
			throw new KitAPIError(
				describeKitError(error.status, error.body, error.message),
				{
					status: error.status,
					errors,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new KitAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KitAPIError('Unknown Kit error', { method, transport: true });
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KitQueryValue | undefined>,
): Record<string, KitQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KitQueryValue] => entry[1] !== undefined,
		),
	);
}
