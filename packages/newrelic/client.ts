import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * New Relic has two surfaces, and they take the same user key differently:
 *
 * - REST v2 at `api.newrelic.com/v2` takes it in an `Api-Key` header.
 * - NerdGraph at `api.newrelic.com/graphql` is GraphQL and takes it in an
 *   `API-Key` header.
 *
 * EU accounts use `api.eu.newrelic.com` for both, so the host is switchable.
 */
export const NEWRELIC_REST_HOSTS = {
	us: 'https://api.newrelic.com/v2',
	eu: 'https://api.eu.newrelic.com/v2',
} as const;

/**
 * NerdGraph is a single endpoint, and the transport appends a slash to an empty
 * path, so its base carries the path and the request sends only `'/'` removed.
 * `https://api.newrelic.com/graphql/` answers 404 while the bare form answers.
 */
export const NEWRELIC_GRAPHQL_BASE = {
	us: 'https://api.newrelic.com',
	eu: 'https://api.eu.newrelic.com',
} as const;

/** The single NerdGraph path, relative to the base above. */
const GRAPHQL_PATH = '/graphql';

export type NewrelicRegion = keyof typeof NEWRELIC_REST_HOSTS;

// New Relic answers a 429 when a key exceeds its rate limit and documents a
// Retry-After. Retries belong to error-handlers.ts; this only reports the wait.
const NEWRELIC_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: a response body arrives as parsed JSON. This helper reads one named
// string from it, and the caller decides what the record is.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * New Relic's error bodies come in two shapes:
 *
 * - REST v2: `{ "error": { "title": "..." } }`, or `{ "errors": [{ "message" }] }`.
 * - NerdGraph: `{ "errors": [{ "message", "locations", "path", "extensions" }] }`,
 *   which is the GraphQL spec's shape. A 200 can still carry `errors`, which is
 *   how a bad NRQL query reports itself.
 */
export class NewrelicAPIError extends Error {
	/** Every message New Relic sent, in order. */
	readonly messages: string[];
	/** GraphQL extension codes, e.g. `FORBIDDEN` for a missing role. */
	readonly codes: string[];
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			messages?: string[];
			codes?: string[];
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NewrelicAPIError';
		this.messages = options.messages ?? [];
		this.codes = options.codes ?? [];
		this.method = options.method;
	}

	/** A GraphQL permission failure arrives as a 200 with a FORBIDDEN code. */
	get isPermissionError(): boolean {
		return this.codes.some(
			(code) => code === 'FORBIDDEN' || code === 'UNAUTHORIZED',
		);
	}
}

/**
 * Pulls every message and extension code out of an `errors` array. Exported so
 * the 200-with-errors case is testable without a live call.
 */
// unknown: the error array's element shape differs between REST v2 and GraphQL.
export function readErrors(body: unknown): {
	messages: string[];
	codes: string[];
} {
	// REST v2 answers most failures as `{ "error": { "title": "..." } }`.
	const single = readString(asRecord(asRecord(body)?.error), 'title');
	if (single) return { messages: [single], codes: [] };
	const list = asRecord(body)?.errors;
	if (!Array.isArray(list)) return { messages: [], codes: [] };
	const messages: string[] = [];
	const codes: string[] = [];
	for (const entry of list) {
		const record = asRecord(entry);
		const message = readString(record, 'message');
		if (message) messages.push(message);
		const code = readString(asRecord(record?.extensions), 'code');
		if (code) codes.push(code);
	}
	return { messages, codes };
}

// unknown: same parsed body as readErrors, which may be any JSON value.
export function describeNewrelicError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { messages } = readErrors(body);
	const text = messages.length > 0 ? messages.join('; ') : fallback;
	const label = status === undefined ? '' : `New Relic ${status}: `;
	return `${label}${text}`;
}

/**
 * Rebuilds New Relic's HTTP error as a core `ApiError`, so its status and
 * Retry-After reach core and the error handlers (R8).
 *
 * The sent body is dropped. The provider's `{ errors: [{ message }] }` array is
 * kept, because the message is what a caller reads.
 */
function sanitizeApiError(error: ApiError): ApiError {
	const {
		body: _body,
		formData: _formData,
		query: _query,
		...request
	} = error.request;
	const { messages } = readErrors(error.body);
	const envelope =
		messages.length === 0
			? undefined
			: { errors: messages.map((message) => ({ message })) };
	return new ApiError(
		{ ...request, url: request.url.split('?')[0] ?? request.url },
		{
			url: error.url.split('?')[0] ?? error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: envelope,
		},
		describeNewrelicError(error.status, error.body, error.message),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * A query value may be an array: `corsair/http` repeats the key for each entry,
 * which is how REST v2 reads `names[]` and `values[]`.
 */
export type NewrelicQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type NewrelicRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** A path under /v2, or undefined for a NerdGraph call. */
	path?: string;
	query?: NewrelicQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Set for a GraphQL call, which posts a query document. */
	graphql?: {
		query: string;
		// unknown: GraphQL variables are typed per document, and `NEWRELIC_NRQL_DOCUMENT`
		// declares `$accountId: Int!` and `$query: Nrql!`. Each caller validates those
		// two values against its own input schema before it builds this object, so a
		// shared type here would only restate what the endpoint already proved.
		variables?: Record<string, unknown>;
	};
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNewrelicRequest(
	apiKey: string,
	region: NewrelicRegion,
	{ method, path, query, body, graphql }: NewrelicRequest,
): Promise<unknown> {
	const isGraphql = graphql !== undefined;
	const config: OpenAPIConfig = {
		BASE: isGraphql
			? NEWRELIC_GRAPHQL_BASE[region]
			: NEWRELIC_REST_HOSTS[region],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'API-Key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method: isGraphql ? 'POST' : method,
		url: isGraphql ? GRAPHQL_PATH : (path ?? ''),
		query,
		body: isGraphql ? graphql : body,
		mediaType: isGraphql || body !== undefined ? 'application/json' : undefined,
	};

	try {
		const result = await request<unknown>(config, requestOptions, {
			rateLimitConfig: NEWRELIC_RATE_LIMIT_CONFIG,
		});
		// A GraphQL call answers 200 with an errors array when the query is bad.
		const errors = readErrors(result);
		if (errors.messages.length > 0) {
			throw new NewrelicAPIError(errors.messages.join('; '), {
				messages: errors.messages,
				codes: errors.codes,
				method: 'POST',
			});
		}
		return result;
	} catch (error) {
		// Rethrow the error raised above rather than wrapping it again. It is the
		// only kind NewrelicAPIError covers now: a GraphQL call that answered 200
		// with an errors array.
		if (error instanceof NewrelicAPIError) throw error;
		// An HTTP failure stays core's ApiError (see `sanitizeApiError`) so its
		// status and Retry-After reach core (R8).
		if (error instanceof ApiError) throw sanitizeApiError(error);
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NewrelicAPIError(error.message, {
				cause: error,
				method: isGraphql ? 'POST' : method,
			});
		}
		throw new NewrelicAPIError('Unknown New Relic error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
