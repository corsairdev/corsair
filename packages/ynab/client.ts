import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const YNAB_API_BASE = 'https://api.ynab.com/v1';

/**
 * The API is documented as `budgets`, and newer docs have renamed the concept
 * to **plans** — both paths are served, so the plugin uses `budgets`, which is
 * what every existing client uses.
 */
const YNAB_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
 * YNAB answers a failure as `{ error: { id, name, detail } }`, where `id` is
 * the HTTP status as a string and `name` is a short machine name such as
 * `unauthorized` or `not_found`.
 *
 * A **429 carries a `Retry-After`** and is worth waiting out, while a **400
 * `bad_request`** never is — the docs are explicit that a malformed delta
 * request is rejected rather than partially applied.
 */
export class YnabAPIError extends Error {
	readonly status?: number;
	/** The short name, e.g. `unauthorized` or `not_found`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when YNAB sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
	// with HTML or text.
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
		this.name = 'YnabAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		this.code = readString(asRecord(asRecord(this.body)?.error), 'name');
	}

	/**
	 * True for a missing, wrong or revoked token. YNAB answers 401 for all
	 * three, with no distinction, so a caller only learns the credential is the
	 * problem.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.code === 'unauthorized';
	}

	/** True when the budget or the resource inside it does not exist. */
	get isNotFound(): boolean {
		// YNAB names this one `resource_not_found`, so both are matched.
		return (
			this.status === 404 ||
			this.code === 'not_found' ||
			this.code === 'resource_not_found'
		);
	}

	/** True when the subscription lapsed, which YNAB reports as a 403. */
	get isSubscriptionLapsed(): boolean {
		return this.status === 403;
	}
}

// unknown: see YnabAPIError.
export function describeYnabError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const error = asRecord(asRecord(body)?.error);
	const text =
		readString(error, 'detail') ?? readString(error, 'name') ?? fallback;
	const name = readString(error, 'name');
	const label = [status, name].filter((part) => part !== undefined).join(' ');
	return label ? `YNAB ${label}: ${text}` : text;
}

export type YnabQuery = Record<string, string | number | boolean | undefined>;

export type YnabRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
	query?: YnabQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment; budget and entity ids are UUIDs. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * YNAB reads dates as `yyyy-MM-dd`, with no time and no zone. A full ISO
 * timestamp is accepted by the write routes but is stored as the date part, so
 * the plugin takes the documented form.
 */
export const YNAB_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeYnabRequest(
	apiKey: string,
	{ method, path, query, body }: YnabRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: YNAB_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
			rateLimitConfig: YNAB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new YnabAPIError(
				describeYnabError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new YnabAPIError(error.message, { cause: error, method });
		}
		throw new YnabAPIError('Unknown YNAB error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isYnabFailure(error: unknown): error is YnabAPIError {
	return error instanceof YnabAPIError;
}
