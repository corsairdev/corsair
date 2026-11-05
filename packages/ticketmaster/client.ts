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
 * Rebuilds the `ApiError` with the `apikey` value replaced. `corsair/http`
 * redacts only `api_key`, `key`, `token` and `appid`, so Ticketmaster's `apikey`
 * parameter would otherwise stay readable in `url` and `request.query` on the
 * error that callers, logs and the event table can all see.
 */
function redactCause(error: ApiError, apiKey: string): ApiError {
	if (!apiKey) return error;
	const redactUrl = (value: string): string =>
		value.split(apiKey).join(REDACTED);
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
			url: redactUrl(error.request.url),
			query: redactedQuery,
		},
		{
			url: redactUrl(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// unknown: callers parse the body with the endpoint's zod output schema.
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
			// ApiError redacts `api_key`, `key`, `token` and `appid` from the URL
			// it records, but Ticketmaster's parameter is `apikey`, so the key is
			// still in `error.url` and `error.request.query`. Rebuild an
			// equivalent `ApiError` with the value replaced, so the key cannot
			// leak through a logged or serialized error.
			throw new TicketmasterAPIError(
				describeTicketmasterError(error.status, error.body, error.message),
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
