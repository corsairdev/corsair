import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The one host the API key is ever sent to. */
export const EVENTZILLA_API_BASE = 'https://www.eventzillaapi.net/api/v2';

// Eventzilla documents no latency figure and no timeout, so corsair/http's
// default is left at 20s rather than guessed at.
const EVENTZILLA_TIMEOUT_MS = 20_000;

/**
 * Eventzilla reports errors in three unrelated shapes, all of which a caller
 * has to be able to tell apart:
 *
 * - `{ message: 'API Key is not authorized' }` with a 401 for a missing or
 *   rejected key. This is the API Gateway's own body, not the app's.
 * - `{ status, error_code, message }` for the documented application errors.
 * - `{ message: 'Missing Authentication Token' }` with a 403, which is how
 *   API Gateway answers a route that does not exist. It reads like an auth
 *   failure and is not one.
 */
export type EventzillaErrorCode =
	| 'unauthorized'
	| 'not_found'
	| 'invalid_route'
	| 'invalid_input'
	| 'rate_limited'
	| 'server'
	| 'network'
	| 'bad_response';

/** The provider's own machine-readable code, e.g. `event_not_found`. */
function readErrorCode(
	// unknown: an untyped error body until asRecord narrows it.
	body: unknown,
): string | undefined {
	const record = asRecord(body);
	const code = record?.error_code;
	return typeof code === 'string' && code.length > 0 ? code : undefined;
}

/** The human-readable half of whichever error shape arrived. */
export function describeEventzillaError(
	status: number | undefined,
	// unknown: an untyped error body; read one field at a time.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message = record?.message;
	const text =
		typeof message === 'string' && message.length > 0 ? message : fallback;
	const code = readErrorCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Eventzilla ${label}: ${text}` : text;
}

/**
 * API Gateway answers a route it does not host with 403 and
 * `Missing Authentication Token`, which is easy to mistake for a permission
 * problem. The docs list `POST /attendee/checkin`, but the route the API
 * actually serves is `POST /attendees/checkin`; that is what this distinction
 * caught. A real 403 from the application carries a `error_code` instead.
 */
function isInvalidRoute(status: number, message: string): boolean {
	return status === 403 && /Missing Authentication Token/i.test(message);
}

/**
 * Eventzilla answers several failure modes with **HTTP 200** and a body whose
 * only member is a `message`. Observed live against the real API:
 *
 * - `{"message":"API Key is not authorized"}` — a rejected key, on `/categories`
 *   and on `/transactions/{id}`. Every other route answers 401 for this.
 * - `{"message":"Unauthorized access"}` — a transaction the key may not read.
 * - `{"message":"Invalid URL / Format exception"}` — an event filter value the
 *   API does not accept, e.g. `status=Live` (only `status=live` works).
 * - `{"message":"Request could not be processed. Please try again."}` — a
 *   failed check-in, on `/attendees/checkin`.
 * - `{"message":"No events found"}` — **not** an error: it is how an empty list
 *   is returned. That one is shaped into an empty page by the endpoint.
 *
 * A parse failure on any of these would name the wrong problem, so a
 * message-only body that is not the empty-list answer is raised here as the
 * failure it is.
 */
const EMPTY_LIST_MESSAGE = /^No .+ found$/i;

const SUCCESS_WITH_ERROR_PATTERNS: ReadonlyArray<{
	pattern: RegExp;
	kind: EventzillaErrorCode;
}> = [
	{ pattern: /not authorized|unauthorized/i, kind: 'unauthorized' },
	{
		pattern: /invalid url|format exception|invalid data submitted/i,
		kind: 'invalid_input',
	},
	{ pattern: /could not be processed/i, kind: 'invalid_input' },
];

/**
 * The failure a 2xx body reports, or undefined when the body is a real payload.
 * A message-only body is either the empty-list answer (not a failure) or one of
 * the failures above.
 */
function successBodySaysError(
	// unknown: a 2xx body, untyped until asRecord narrows it.
	body: unknown,
): { message: string; kind: EventzillaErrorCode } | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	// A real payload carries its resource array; these failures carry only a
	// message. Checked on the key count so a payload that happens to add a
	// `message` field is still treated as a payload.
	const keys = Object.keys(record);
	if (keys.length !== 1 || keys[0] !== 'message') return undefined;
	const message = record.message;
	if (typeof message !== 'string') return undefined;
	if (EMPTY_LIST_MESSAGE.test(message)) return undefined;
	for (const entry of SUCCESS_WITH_ERROR_PATTERNS) {
		if (entry.pattern.test(message)) return { message, kind: entry.kind };
	}
	// Unrecognised message-only body: still not a payload the schemas accept.
	return { message, kind: 'bad_response' };
}

/** The empty-list answer's message, which an endpoint turns into an empty page. */
export function emptyListMessage(
	// unknown: a 2xx body, untyped until asRecord narrows it.
	body: unknown,
): string | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	const keys = Object.keys(record);
	if (keys.length !== 1 || keys[0] !== 'message') return undefined;
	const message = record.message;
	return typeof message === 'string' && EMPTY_LIST_MESSAGE.test(message)
		? message
		: undefined;
}

// Retrying is error-handlers.ts's job, so the client makes exactly one attempt.
// Eventzilla documents no rate-limit status or backoff at all: no 429 is
// described, and no request that reached a valid route has returned one. The
// header is still read, because a gateway in front of the API can send it.
const EVENTZILLA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class EventzillaAPIError extends Error {
	readonly status?: number;
	/** HTTP method of the failed request; decides whether it may be replayed. */
	readonly method?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The provider's `error_code`, when the body carried one. */
	readonly code?: string;
	readonly kind?: EventzillaErrorCode;

	constructor(
		message: string,
		options: {
			status?: number;
			method?: string;
			retryAfter?: number;
			code?: string;
			kind?: EventzillaErrorCode;
		} = {},
	) {
		super(message);
		this.name = 'EventzillaAPIError';
		this.status = options.status;
		this.method = options.method;
		this.retryAfter = options.retryAfter;
		this.code = options.code;
		this.kind = options.kind;
	}
}

/**
 * A failure that never reached the provider, so it carries no response body.
 * Kept separate from EventzillaAPIError so the key can never ride along in a
 * cause: this API takes its key in a header, and a header is not logged here.
 */
export class EventzillaTransportError extends Error {
	readonly kind: 'network' | 'timeout';
	readonly method?: string;

	constructor(message: string, kind: 'network' | 'timeout', method?: string) {
		super(message);
		this.name = 'EventzillaTransportError';
		this.kind = kind;
		this.method = method;
	}
}

export type EventzillaQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type EventzillaRequest = {
	method: 'GET' | 'POST' | 'PATCH';
	path: string;
	query?: EventzillaQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
// unknown: the response body is untyped; the endpoint's output schema is what
// validates it. Exported so the live suite parses the same way.
export async function makeEventzillaRequest(
	apiKey: string,
	{ method, path, query, body }: EventzillaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: EVENTZILLA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: EVENTZILLA_TIMEOUT_MS,
		// The key travels in this header and nowhere else: not in the query
		// string, which ApiError does not fully redact, and not in the body.
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: EVENTZILLA_RATE_LIMIT_CONFIG,
		}).then((body) => {
			const refusal = successBodySaysError(body);
			if (refusal !== undefined) {
				throw new EventzillaAPIError(
					`Eventzilla ${method} ${path} answered HTTP 200 with an error: ${refusal.message}`,
					{ status: 200, method, kind: refusal.kind },
				);
			}
			return body;
		});
	} catch (error) {
		// Rethrown untouched: the generic branch below would re-wrap it and drop
		// the status and kind the error just set.
		if (error instanceof EventzillaAPIError) throw error;
		if (error instanceof ApiError) {
			throw toEventzillaError(method, error);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof DOMException) {
			const timedOut = error.name === 'TimeoutError';
			throw new EventzillaTransportError(
				timedOut
					? `Eventzilla did not answer ${method} ${path} in time.`
					: `Could not reach Eventzilla for ${method} ${path}.`,
				timedOut ? 'timeout' : 'network',
				method,
			);
		}
		if (error instanceof Error) {
			throw new EventzillaTransportError(
				`Could not reach Eventzilla for ${method} ${path}: ${error.message}`,
				'network',
				method,
			);
		}
		throw new EventzillaTransportError(
			`Could not reach Eventzilla for ${method} ${path}.`,
			'network',
			method,
		);
	}
}

function toEventzillaError(
	method: string,
	error: ApiError,
): EventzillaAPIError {
	const { status } = error;
	const body = error.body;
	const providerMessage =
		asRecord(body)?.message ?? asRecord(body)?.error ?? '';
	const bodyMessage =
		typeof providerMessage === 'string' ? providerMessage : '';

	// The cause and the body are both dropped: the body is not where the key
	// travels here, but copying it would put provider payloads into every log
	// line a caller prints, and status plus code is what handlers need.
	let kind: EventzillaErrorCode;
	if (isInvalidRoute(status ?? 0, bodyMessage)) {
		kind = 'invalid_route';
	} else if (status === 401 || status === 403) {
		kind = 'unauthorized';
	} else if (status === 404) {
		kind = 'not_found';
	} else if (status === 429) {
		kind = 'rate_limited';
	} else if (status !== undefined && status >= 500) {
		kind = 'server';
	} else {
		kind = 'invalid_input';
	}

	const message =
		kind === 'invalid_route'
			? `Eventzilla ${method} ${error.url} has no such route (HTTP ${status}). The API answers an unknown route with the same 403 it uses for a missing key, so check the path first.`
			: describeEventzillaError(status, body, error.message);

	return new EventzillaAPIError(message, {
		status,
		method,
		retryAfter: error.retryAfter,
		code: readErrorCode(body),
		kind,
	});
}
