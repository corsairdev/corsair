import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const WEBSCRAPERIO_API_BASE = 'https://api.webscraper.io/api/v1';

/**
 * The Cloud API takes the key as an `api_token` **query parameter**, not a
 * header. There is no bearer auth and no second credential.
 */
export const WEBSCRAPERIO_TOKEN_PARAM = 'api_token';

const WEBSCRAPERIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * The Cloud API answers two different error shapes, depending on which layer
 * refused the call:
 *
 * - a **handled** failure is `{ success: false, error: "..." }` — this is what
 *   a bad token produces;
 * - an **unrouted** request is Laravel's own `{ message: "The route ... could
 *   not be found." }`, which means the path is wrong rather than the key.
 *
 * The second is worth distinguishing: on this API a 404 is a typo in the
 * route, not a missing sitemap.
 */
export class WebscraperioAPIError extends Error {
	readonly status?: number;
	/** True when the call reached the application and was refused by it. */
	readonly handled: boolean;
	/** Milliseconds from a Retry-After header, when sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually one of the two shapes above.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'WebscraperioAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		// The handled shape is the one with a `success` flag.
		this.handled = asRecord(this.body)?.success === false;
	}

	/** True when the token was rejected, for any credential reason. */
	get isAuthError(): boolean {
		if (this.status === 401 || this.status === 403) return true;
		const error = readString(asRecord(this.body), 'error') ?? '';
		return error.toLowerCase().includes('api_token');
	}

	/**
	 * True when the token itself is wrong. A 403 means a working token without
	 * the plan for this call, which is the permission case rather than this one.
	 */
	get isInvalidToken(): boolean {
		if (this.status === 401) return true;
		const error = readString(asRecord(this.body), 'error') ?? '';
		return error.toLowerCase().includes('api_token');
	}

	/** True when the route does not exist, which is a mistyped path. */
	get isRouteNotFound(): boolean {
		if (this.status !== 404) return false;
		const message = readString(asRecord(this.body), 'message') ?? '';
		return message.includes('could not be found');
	}

	/** True when the sitemap itself is missing. */
	get isNotFound(): boolean {
		return this.status === 404 && !this.isRouteNotFound;
	}
}

// unknown: see WebscraperioAPIError.
export function describeWebscraperioError(
	status: number | undefined,
	body: unknown,
	fallback: string,
	apiKey?: string,
): string {
	const record = asRecord(body);
	const raw =
		readString(record, 'error') ?? readString(record, 'message') ?? fallback;
	// The provider echoes the token in a bad-key message.
	const text = apiKey ? redactToken(raw, apiKey) : raw;
	return status ? `Web Scraper Cloud ${status}: ${text}` : text;
}

export type WebscraperioQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type WebscraperioRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: WebscraperioQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment; sitemap ids are numeric but passed as strings. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeWebscraperioRequest(
	apiKey: string,
	{ method, path, query, body }: WebscraperioRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: WEBSCRAPERIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// The token travels on the query string, beside the endpoint's own.
		query: { ...query, [WEBSCRAPERIO_TOKEN_PARAM]: apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WEBSCRAPERIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The token travels as `api_token`, which the shared redactor does not
			// know, so it would stay readable in `cause.url` and in the cause's
			// request query. Only the fields the handlers need are copied.
			throw new WebscraperioAPIError(
				describeWebscraperioError(
					error.status,
					error.body,
					redactToken(error.message, apiKey),
					apiKey,
				),
				{
					status: error.status,
					// The body is kept because `handled` and the error text come from it,
					// but the token it may echo is removed first.
					body: redactBody(error.body, apiKey),
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WebscraperioAPIError(error.message, { cause: error, method });
		}
		throw new WebscraperioAPIError('Unknown Web Scraper Cloud error', {
			method,
		});
	}
}

/** Removes the submitted token anywhere the provider echoed it back. */
export function redactToken(text: string, apiKey: string): string {
	if (!apiKey) return text;
	return text.split(apiKey).join('[redacted]');
}

/** A copy of an error body with the submitted token removed from its strings. */
function redactBody(body: unknown, apiKey: string): unknown {
	if (!apiKey || typeof body !== 'object' || body === null) return body;
	const walk = (value: unknown): unknown => {
		if (typeof value === 'string') return redactToken(value, apiKey);
		if (Array.isArray(value)) return value.map(walk);
		if (typeof value === 'object' && value !== null) {
			return Object.fromEntries(
				Object.entries(value as Record<string, unknown>).map(([k, v]) => [
					k,
					walk(v),
				]),
			);
		}
		return value;
	};
	return walk(body);
}

/** Narrows a caught value to this plugin's error. */
export function isWebscraperioFailure(
	error: unknown,
): error is WebscraperioAPIError {
	return error instanceof WebscraperioAPIError;
}
