import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Discovery API v2 root. Every operation in this plugin is a GET against it.
 * @see https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 */
export const TICKETMASTER_API_BASE = 'https://app.ticketmaster.com';
export const TICKETMASTER_API_PATH = '/discovery/v2';

/**
 * Ticketmaster answers 429 once a key passes 5,000 calls a day or 5 calls a
 * second, so retries stay here: error-handlers.ts owns them and the shared
 * client must not retry a second time.
 */
export const TICKETMASTER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Every error body Ticketmaster sends is either an API-gateway `fault` or a
 * list of `errors`:
 *
 * - `{ fault: { faultstring, detail: { errorcode } } }` — 401, 429, and the
 *   404 for an unknown event/attraction/venue id.
 * - `{ errors: [{ code, detail, status }] }` — 400 for a rejected parameter.
 */
export class TicketmasterAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code, e.g. `oauth.v2.InvalidApiKey` or `DIS1035`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Ticketmaster sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are one of the two shapes above or, behind a proxy,
	// HTML or plain text.
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
		this.name = 'TicketmasterAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = readCode(this.body);
	}

	/**
	 * True for a 429. Ticketmaster also labels the same limit
	 * `policies.ratelimit.QuotaViolation`, which is what the daily cap sends.
	 */
	get isRateLimit(): boolean {
		if (this.status === 429) return true;
		return (
			this.code === 'policies.ratelimit.QuotaViolation' ||
			this.code === 'policies.ratelimit.SpikeArrestViolation'
		);
	}

	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.code === 'oauth.v2.InvalidApiKey' ||
			this.code === 'steps.oauth.v2.FailedToResolveAPIKey'
		);
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: Ticketmaster sends one of the two error shapes documented above.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const fault = asRecord(record?.fault);
	const gateway = readString(asRecord(fault?.detail), 'errorcode');
	if (gateway) return gateway;

	// unknown: each entry of `errors` is an untyped object until narrowed.
	const first = Array.isArray(record?.errors) ? record?.errors[0] : undefined;
	return readString(asRecord(first), 'code');
}

/**
 * Builds the human-readable message for a failed call, preferring the
 * provider's own text: the gateway `faultstring`, then the first entry of an
 * `errors` array, then the fallback. The status and machine-readable code are
 * prefixed when they are known.
 */
// unknown: see readCode; the list error shape nests `detail` differently.
export function describeTicketmasterError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const fault = asRecord(record?.fault);
	// unknown: first entry of the `{ errors: [...] }` shape.
	const firstError = asRecord(
		Array.isArray(record?.errors) ? record?.errors[0] : undefined,
	);
	const text =
		readString(fault, 'faultstring') ??
		readString(firstError, 'detail') ??
		readString(firstError, 'message') ??
		fallback;
	const code = readCode(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Ticketmaster ${label}: ${text}` : text;
}

/**
 * One query parameter. Arrays are sent as repeated parameters, which is what
 * Ticketmaster expects for its list filters such as `city` and `classificationName`.
 */
export type TicketmasterQueryValue =
	| string
	| number
	| boolean
	| string[]
	| undefined;

export type TicketmasterQuery = Record<string, TicketmasterQueryValue>;

export type TicketmasterRequest = {
	path: string;
	query?: TicketmasterQuery;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

const REDACTED = '[REDACTED]';

/**
 * Replaces every form of the key with `[REDACTED]`: the raw value and its
 * percent-encoded form, which is what actually appears in a recorded request
 * URL. Both are replaced because the query string is built with
 * `encodeURIComponent`, so a key containing `+`, `/` or `=` is only matched by
 * the encoded form.
 */
function redactKey(value: string, apiKey: string): string {
	if (!apiKey) return value;
	const encoded = encodeURIComponent(apiKey);
	let redacted = value.split(apiKey).join(REDACTED);
	if (encoded !== apiKey) {
		redacted = redacted.split(encoded).join(REDACTED);
	}
	return redacted;
}

/**
 * Replaces the key throughout an arbitrary error body while keeping its shape.
 *
 * Ticketmaster echoes the key in at least one error body: the 429 faultstring
 * is `Rate limit quota violation. Quota limit exceeded. Identifier : <apikey>`.
 * The body is reachable from `TicketmasterAPIError.body` and from its cause, so
 * every nested string is cleaned rather than only the top level.
 */
// unknown: an error body is arbitrary JSON from the provider or a proxy.
function redactBody(body: unknown, apiKey: string): unknown {
	if (typeof body === 'string') return redactKey(body, apiKey);
	if (Array.isArray(body)) {
		return body.map((entry) => redactBody(entry, apiKey));
	}
	const record = asRecord(body);
	if (!record) return body;
	return Object.fromEntries(
		Object.entries(record).map(([key, value]) => [
			key,
			redactBody(value, apiKey),
		]),
	);
}

/**
 * Rebuilds the `ApiError` with the key removed. `corsair/http` redacts only
 * `api_key`, `key`, `token` and `appid`, so Ticketmaster's `apikey` parameter
 * would otherwise stay readable in `url`, `request.query`, the message and
 * `body` on the error that callers, logs and the event table can all see.
 */
function redactCause(error: ApiError, apiKey: string): ApiError {
	if (!apiKey) return error;
	const query = error.request.query;
	const redactedQuery =
		query && typeof query === 'object'
			? Object.fromEntries(
					Object.entries(query).map(([key, value]) => [
						key,
						key.toLowerCase() === 'apikey' ? REDACTED : value,
					]),
				)
			: query;

	return new ApiError(
		{
			...error.request,
			url: redactKey(error.request.url, apiKey),
			query: redactedQuery,
		},
		{
			url: redactKey(error.url, apiKey),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: redactBody(error.body, apiKey),
		},
		redactKey(error.message, apiKey),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * Performs one GET against the Discovery API with the key in the `apikey` query
 * parameter, and turns any failure into a `TicketmasterAPIError`.
 *
 * The shared HTTP client is configured with `maxRetries: 0`: retries belong to
 * `error-handlers.ts`, so a 429 is not replayed twice.
 *
 * Returns `unknown` because each caller parses the body with its own output
 * schema; this layer does not know the operation's shape.
 */
export async function makeTicketmasterRequest(
	apiKey: string,
	{ path, query }: TicketmasterRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: `${TICKETMASTER_API_BASE}${TICKETMASTER_API_PATH}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The key travels in the query string, which is what the docs specify.
		// `TOKEN` is left unset: corsair/http would turn it into a bearer header.
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: { ...query, apikey: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TICKETMASTER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// ApiError redacts `api_key`, `key`, `token` and `appid` from what it
			// records, but Ticketmaster's parameter is `apikey` and the provider
			// echoes it in the 429 faultstring. Both the cause and the message
			// this throws are rebuilt with every form of the key replaced, so
			// neither a logged error nor the event table can show it.
			throw new TicketmasterAPIError(
				redactKey(
					describeTicketmasterError(error.status, error.body, error.message),
					apiKey,
				),
				{ cause: redactCause(error, apiKey) },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TicketmasterAPIError(error.message, {
				cause: error,
				method: 'GET',
			});
		}
		throw new TicketmasterAPIError('Unknown Ticketmaster error', {
			method: 'GET',
		});
	}
}
