import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { Route4MeValue } from './endpoints/call';

/**
 * Route4Me runs two API generations on two hosts, and a route's id is the only
 * thing that ties them together:
 *
 * - **v4** on `api.route4me.com/api.v4` — optimizations, plus the older
 *   `route.php` reads. The key is a **query parameter** (`api_key`).
 * - **v5** on `wh.route4me.com/modules` — routes, orders, vehicles, address
 *   book, customers and team users. This host also serves the web app, and
 *   without `Accept: application/json` it answers a **302 to the login page**
 *   even for a valid key, so every request sends that header.
 */
export const ROUTE4ME_V5_BASE = 'https://wh.route4me.com/modules';
export const ROUTE4ME_V4_BASE = 'https://api.route4me.com/api.v4';

/**
 * The v5 host is behind a web-app router. A request that does not ask for JSON
 * is redirected to the login page, which `corsair/http` follows and then
 * downloads as HTML, so a rejected key arrives as an HTML page instead of a 401
 * envelope. `Accept: application/json` is what makes the host answer the API
 * layer, and it is mandatory rather than cosmetic.
 */
export const ROUTE4ME_ACCEPT = 'application/json';

/**
 * Route4Me has two error envelopes, one per generation:
 *
 * - **v4**: `{ errors: ['Invalid API key'], error_code: 401, timestamp }`
 * - **v5**: `{ status: false, exit_code: 1, error, code: 401, messages: [...] }`
 *
 * Both carry a numeric status in the body, and the v5 body's `code` repeats the
 * HTTP status, so `describe` reads whichever is present.
 */
export class Route4MeAPIError extends Error {
	readonly status?: number;
	/** The provider's own status when it differs from the HTTP one. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, when Route4Me sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/**
	 * Whether the failing call may be sent again. Declared by the endpoint, not
	 * derived from the method: v5's list routes are POSTs that only read.
	 */
	readonly replayable: boolean;
	/** Every message the provider sent, in order. */
	readonly errors: string[];

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			retryAfter?: number;
			method?: string;
			errors?: string[];
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'Route4MeAPIError';
		this.status = options.status ?? options.code;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.errors = options.errors ?? [];
		// A transport failure never reached the provider, so it is replayable
		// only when the endpoint says the call itself is.
		this.replayable = options.replayable ?? false;
	}

	/**
	 * A rejected key. v4 answers 401, v5 answers 401 with `Unauthenticated`, and
	 * a v5 key sent without `Accept: application/json` lands on the login page
	 * instead, which is not this error at all.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The route, order or address id does not exist on this account. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

// unknown: the four container fields are read by name below; the body is
// provider JSON until the readers narrow it.
function errorBody(body: unknown): {
	messages: string[];
	code: number | undefined;
} {
	const record = asRecord(body);
	const messages: string[] = [];

	// v4: `errors` is an array of strings.
	const errors = record?.errors;
	if (Array.isArray(errors)) {
		for (const entry of errors) {
			if (typeof entry === 'string' && entry.length > 0) messages.push(entry);
		}
	}

	// v5: `messages` is an array, and `error` repeats the first one. The
	// validation body puts the summary in `error` and the details in
	// `messages`, so both are collected.
	const v5Messages = record?.messages;
	if (Array.isArray(v5Messages)) {
		for (const entry of v5Messages) {
			if (typeof entry === 'string' && entry.length > 0) messages.push(entry);
		}
	}
	const single = record?.error;
	if (
		typeof single === 'string' &&
		single.length > 0 &&
		!messages.includes(single)
	) {
		messages.unshift(single);
	}

	// v4 spells it `error_code`; v5 spells it `code`. Both are numeric, and v5
	// sometimes sends the number as a string.
	const code = record?.code ?? record?.error_code;
	const numericCode =
		typeof code === 'number'
			? code
			: typeof code === 'string' && code.trim() !== ''
				? Number(code)
				: undefined;
	return {
		messages,
		code: Number.isNaN(numericCode) ? undefined : numericCode,
	};
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `errorBody` narrows it.
 */
export function describeRoute4MeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { messages } = errorBody(body);
	const text = messages[0] ?? fallback;
	const label = status !== undefined ? `${status}` : undefined;
	const summary = label ? `Route4Me ${label}: ${text}` : text;
	// A validation response often carries several messages; the rest join it.
	return messages.length > 1
		? `${summary} (${messages.slice(1).join('; ')})`
		: summary;
}

/**
 * A query value may be explicitly undefined: the array-valued parameters
 * (`fields`, `facility_ids`) are spread in beside the filtered scalars, and
 * `getQueryString` drops an undefined entry rather than sending the string
 * "undefined".
 */
export type Route4MeQuery = Record<string, Route4MeValue | undefined>;

export type Route4MeHost = 'v4' | 'v5';

/** The two hosts, keyed the way an operation names them. */
export const ROUTE4ME_HOSTS = {
	v4: ROUTE4ME_V4_BASE,
	v5: ROUTE4ME_V5_BASE,
} as const satisfies Record<Route4MeHost, string>;

export type Route4MeRequest = {
	host: Route4MeHost;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path below the host base, starting with a slash. */
	path: string;
	query?: Route4MeQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * Whether this call may be sent again after a 5xx.
	 *
	 * The HTTP method is not a safe stand-in here: v5's `routes/list` and
	 * `orders/list` are POSTs that only read, while `orders` POST writes a row.
	 * Each endpoint declares its own answer so the handler never replays a write.
	 */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Route4Me documents neither a retry window nor a Retry-After header, and its
 * limits are per plan. The handler retries a 429 a small number of times with
 * backoff, and this config only reads the header if a gateway adds one.
 */
const ROUTE4ME_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key travels as a query parameter, which `ApiError` redacts only for the
 * literal names `api_key`, `key`, `token` and `appid`. Route4Me's name is
 * `api_key`, so the shared redaction covers it; this plugin still drops the
 * cause rather than relying on that.
 */
function configWith(host: Route4MeHost): OpenAPIConfig {
	return {
		BASE: ROUTE4ME_HOSTS[host],
		VERSION: 'v5',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The v5 host redirects to its login page without this header.
		HEADERS: { Accept: ROUTE4ME_ACCEPT },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRoute4MeRequest(
	apiKey: string,
	{ host, method, path, query, body, replayable }: Route4MeRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, api_key: apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(host), requestOptions, {
			rateLimitConfig: ROUTE4ME_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { messages, code } = errorBody(error.body);
			// The cause holds the query string, and with it the key, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new Route4MeAPIError(
				describeRoute4MeError(error.status, error.body, error.message),
				{
					status: error.status,
					code,
					retryAfter: error.retryAfter,
					method,
					errors: messages,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new Route4MeAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new Route4MeAPIError('Unknown Route4Me error', {
			method,
			replayable,
		});
	}
}
