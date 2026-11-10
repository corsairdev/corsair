import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The only host; Rentman runs one version of the API and migrates callers. */
export const RENTMAN_API_BASE = 'https://api.rentman.net';

/**
 * Rentman authenticates with a JWT from **Configuration → Integrations → API**.
 * Only the most recently generated token is valid, so regenerating one
 * invalidates every other integration using the account.
 */
export class RentmanAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Rentman sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/**
	 * Whether the failing call may be sent again. Declared by the endpoint: a
	 * GET is safe, a create is not.
	 */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RentmanAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** No token, or one that has been superseded or revoked. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The record does not exist, or the id is not a number Rentman accepts. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body or filter Rentman refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

/**
 * Reads the message out of a Rentman error body. The gateway and the app layer
 * spell the key differently:
 *
 * - API Gateway, before the app runs: `{ "message": "Unauthorized" }`
 * - API Gateway denials: `{ "Message": "User is not authorized …" }`
 * - The app's own validation errors: `{ "errors": { field: [msg] } }`
 *
 * unknown: the body is provider JSON until this reader narrows it.
 */
export function describeRentmanError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);

	const direct = record?.message ?? record?.Message ?? record?.detail;
	const text =
		typeof direct === 'string' && direct.length > 0 ? direct : undefined;

	// The app's validation envelope groups messages by field name.
	const errors = asRecord(record?.errors);
	let validation: string | undefined;
	if (errors) {
		const parts: string[] = [];
		for (const [field, value] of Object.entries(errors)) {
			if (Array.isArray(value)) {
				for (const entry of value) {
					if (typeof entry === 'string' && entry.length > 0) {
						parts.push(`${field}: ${entry}`);
					}
				}
			} else if (typeof value === 'string' && value.length > 0) {
				parts.push(`${field}: ${value}`);
			}
		}
		validation = parts.length > 0 ? parts.join('; ') : undefined;
	}

	const body_ = text ?? validation ?? fallback;
	const label = status !== undefined ? `${status}` : undefined;
	return label ? `Rentman ${label}: ${body_}` : body_;
}

export type RentmanQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RentmanRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path starting with a slash, e.g. `/contacts`. */
	path: string;
	query?: RentmanQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Rentman documents no throughput window and no `Retry-After`, so this config
 * exists only to read the header if a gateway adds one; the handler owns the
 * retry count.
 */
const RENTMAN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The token travels as a bearer header, which `corsair/http` builds from
 * `TOKEN`. A 403 from the gateway means the token is not accepted, not that the
 * record is missing, which the error class keeps separate.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RENTMAN_API_BASE,
		VERSION: '1.20.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json', 'Content-Type': 'application/json' },
	};
}

/**
 * Pulls the opaque cursor out of `next_page_url`. Rentman warns that the token
 * is not to be constructed or edited, so it is returned to the caller verbatim
 * rather than decoded, and `next_page_url` is exposed as well for callers that
 * would rather follow it.
 * unknown: `page` and its `next_page_url` are provider fields.
 */
export function readNextCursor(page: unknown): string | null {
	const next = asRecord(page)?.next_page_url;
	if (typeof next !== 'string' || next.length === 0) return null;
	const match = /[?&]cursor=([^&]+)/.exec(next);
	if (!match?.[1]) return null;
	return decodeURIComponent(match[1]);
}

// unknown: `page` is the provider envelope, untyped until `asRecord` narrows
// it, and `next_page_url` is only a string when Rentman actually sent one.
export function readNextPageUrl(page: unknown): string | null {
	const next = asRecord(page)?.next_page_url;
	return typeof next === 'string' && next.length > 0 ? next : null;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRentmanRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RentmanRequest,
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
			rateLimitConfig: RENTMAN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RentmanAPIError(
				describeRentmanError(error.status, error.body, error.message),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RentmanAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RentmanAPIError('Unknown Rentman error', {
			method,
			replayable,
		});
	}
}
