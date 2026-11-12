import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Businessmap is Kanbanize's current name, and every account is served from its
 * own subdomain, so the base URL is built per account.
 */
export function kanbanizeBaseUrl(subdomain: string): string {
	return `https://${subdomain}.kanbanize.com/api/v2`;
}

/** The codes Businessmap sends when a limit is hit, on either window. */
const RATE_LIMIT_CODES = new Set(['RL01', 'RL02']);
/** The code it sends when the key is wrong or revoked. */
const INVALID_KEY_CODE = 'A001';
const LOGIN_REQUIRED_CODE = 'A002';

// unknown: the body is an untyped error body until asRecord narrows it.
function errorObject(body: unknown): {
	code?: string;
	message?: string;
	reference?: string;
	retryAfter?: number;
} {
	const error = asRecord(asRecord(body)?.error);
	// `details` is where the rate-limit body carries its own countdown, in
	// seconds: `{ limit, requests, retry_after }`.
	const details = asRecord(error?.details);
	const read = (record: Record<string, unknown> | null, key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	const retryAfter = details?.retry_after;
	return {
		code: read(error, 'code'),
		message: read(error, 'message'),
		reference: read(error, 'reference'),
		retryAfter: typeof retryAfter === 'number' ? retryAfter : undefined,
	};
}

// The API publishes two windows and answers 429 for either; a 429 without a
// body code still means a rate limit, so both forms reach the same handler.
const KANBANIZE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) => {
		const code = errorObject(body).code;
		return status === 429 || (code !== undefined && RATE_LIMIT_CODES.has(code));
	},
};

/**
 * Businessmap wraps every failure in `{ error: { code, message, reference,
 * details } }`. `code` is a four-character identifier, and `details` names the
 * values that caused it.
 *
 * The body is not kept on the error: a card create echoes the request back in
 * `details`, and that can carry a card description a caller would rather not
 * see in a log line.
 */
export class KanbanizeAPIError extends Error {
	readonly status?: number;
	/** Businessmap's four-character code, such as `B001` or `RL02`. */
	readonly code?: string;
	/** Support reference for the same failure. */
	readonly reference?: string;
	/** Milliseconds to wait, from a Retry-After header or the body's `retry_after`. */
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
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KanbanizeAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		const fields = errorObject(cause?.body);
		this.status = options.status ?? cause?.status;
		this.code = fields.code;
		this.reference = fields.reference;
		// The body's seconds win only when no header carried a delay.
		this.retryAfter =
			options.retryAfter ??
			cause?.retryAfter ??
			(fields.retryAfter !== undefined ? fields.retryAfter * 1000 : undefined);
		this.method = options.method ?? cause?.request.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return (
			this.status === 429 ||
			(this.code !== undefined && RATE_LIMIT_CODES.has(this.code))
		);
	}

	/** A key that Businessmap rejected: the wrong key, or one since regenerated. */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.code === INVALID_KEY_CODE ||
			this.code === LOGIN_REQUIRED_CODE
		);
	}
}

/** The message Businessmap wrapped, with the status and code in front. */
// unknown: an error body is untyped: `{ error: { code, message } }`, or text
// from a proxy that never reached Businessmap.
export function describeKanbanizeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = errorObject(body);
	const text = fields.message ?? fallback;
	const label = [status, fields.code]
		.filter((part) => part !== undefined)
		.join(' ');
	const summary = label ? `Businessmap ${label}: ${text}` : text;
	return fields.reference
		? `${summary} (reference ${fields.reference})`
		: summary;
}

export type KanbanizeQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[];
export type KanbanizeRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, KanbanizeQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// Businessmap takes a different body shape on each resource.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204, which is how every delete on the API answers.
export async function makeKanbanizeRequest(
	apiKey: string,
	subdomain: string,
	{ method, path, query, body }: KanbanizeRequest,
): Promise<unknown> {
	if (!subdomain) {
		throw new KanbanizeAPIError(
			'Businessmap needs the account subdomain, such as acme for acme.kanbanize.com',
			{ method },
		);
	}

	const config: OpenAPIConfig = {
		BASE: kanbanizeBaseUrl(subdomain),
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', apikey: apiKey },
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
			rateLimitConfig: KANBANIZE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new KanbanizeAPIError(
				describeKanbanizeError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KanbanizeAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KanbanizeAPIError('Unknown Businessmap error', {
			method,
			transport: true,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KanbanizeQueryValue | undefined>,
): Record<string, KanbanizeQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KanbanizeQueryValue] => entry[1] !== undefined,
		),
	);
}

/**
 * Businessmap documents `explode: false` on every list parameter, so a list
 * travels as one comma-separated value. `corsair/http` repeats a key for each
 * element of an array, which the API reads as a single unknown ID and answers
 * with nothing, so arrays are joined here instead.
 */
export function queryFor(
	query: Record<string, KanbanizeQueryValue | undefined>,
): Record<string, string | number | boolean> {
	const joined: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		joined[key] = Array.isArray(value)
			? value.join(',')
			: (value as string | number | boolean);
	}
	return joined;
}
