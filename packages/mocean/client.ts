import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOCEAN_API_BASE = 'https://rest.moceanapi.com/rest/2';

/**
 * Every Mocean response defaults to XML; the plugin asks for JSON on every
 * call. The parameter belongs in the query for GETs and in the form body for
 * POSTs, which the endpoints set.
 */
export const MOCEAN_RESP_FORMAT = 'json';

/**
 * Mocean answers most failures with HTTP 200/202 and a body status code, so
 * the client throws after reading the body. The status means different things
 * per API family: 2 is "insufficient balance" for SMS and number lookup but
 * "Authorization failed" for Verify, whose throttled code is 1 (SMS's 1).
 */
export type MoceanFamily = 'sms' | 'verify' | 'query';

/** The body statuses Mocean documents as "try again": nothing was processed. */
const RETRYABLE_BODY_STATUSES = new Set([40, 45]);

/** The verify family's own codes for the same two conditions. */
const VERIFY_RETRYABLE_BODY_STATUSES = new Set([3, 21]);

/**
 * Wraps the error fields the handlers match on. `bodyStatus` carries the
 * body's numeric status, which is the real error signal on a 2xx.
 */
export class MoceanAPIError extends Error {
	readonly status?: number;
	/** The body's numeric status, e.g. 1 for auth failed on SMS. */
	readonly bodyStatus?: number;
	/** The family whose status table applies. */
	readonly family?: MoceanFamily;
	/** Milliseconds from a Retry-After header, when Mocean sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;
	// unknown: an error body is JSON when json was requested, but the 401
	// path answers XML regardless.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			bodyStatus?: number;
			family?: MoceanFamily;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MoceanAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.bodyStatus = options.bodyStatus ?? readBodyStatus(this.body);
		this.family = options.family;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.replayable = options.replayable;
	}

	/** True for an HTTP 401 or the family's body auth-failed status. */
	get isAuthError(): boolean {
		if (this.status === 401) return true;
		const authStatus = this.family === 'verify' ? 2 : 1;
		return this.bodyStatus === authStatus;
	}

	/** True when the account cannot pay for the operation. */
	get isBalanceError(): boolean {
		return this.family === 'verify'
			? this.bodyStatus === 18
			: this.bodyStatus === 2;
	}

	/** True for throttling: retrying later is the documented remedy. */
	get isThrottled(): boolean {
		// The verify family codes throttling as 1; every other family uses 32.
		return (
			this.bodyStatus === 32 ||
			(this.family === 'verify' && this.bodyStatus === 1)
		);
	}

	/** True for the documented "try again" statuses: nothing was processed. */
	get isRetryableServerSide(): boolean {
		if (this.family === 'verify') {
			return VERIFY_RETRYABLE_BODY_STATUSES.has(this.bodyStatus as number);
		}
		return RETRYABLE_BODY_STATUSES.has(this.bodyStatus as number);
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

// unknown: the record is an untyped error body; read one field at a time.
function readNumber(
	record: Record<string, unknown> | null | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' ? value : undefined;
}

// unknown: the body is an untyped error or response body; only the status
// field is read.
function readBodyStatus(body: unknown): number | undefined {
	return readNumber(asRecord(body), 'status');
}

// unknown: the body is JSON on most failures, but the 401 path answers XML
// regardless of the requested format, so it is typed open.
export function describeMoceanError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'err_msg') ??
		readString(record, 'error') ??
		readString(record, 'message');
	if (text) {
		return status === undefined
			? `Mocean: ${text}`
			: `Mocean ${status}: ${text}`;
	}
	// The 401 path answers XML even when JSON was requested. URL-decode the
	// err_msg out of it rather than printing the whole document.
	if (typeof body === 'string' && body.includes('err_msg')) {
		const match = /<err_msg>([^<]+)<\/err_msg>/.exec(body);
		const decoded = match?.[1]?.replace(/\+/g, ' ');
		if (decoded) {
			return status === undefined
				? `Mocean: ${decoded}`
				: `Mocean ${status}: ${decoded}`;
		}
	}
	if (typeof body === 'string' && body.trim().length > 0) {
		return status === undefined
			? `Mocean: ${body.trim()}`
			: `Mocean ${status}: ${body.trim()}`;
	}
	return status === undefined
		? `Mocean: ${fallback}`
		: `Mocean ${status}: ${fallback}`;
}

export type MoceanQuery = Record<string, string | number | boolean | undefined>;

export type MoceanRequest = {
	family: MoceanFamily;
	method: 'GET' | 'POST';
	path: string;
	query?: MoceanQuery;
	/**
	 * A string body is sent verbatim with `mediaType` (Mocean takes
	 * form-encoded bodies); anything else is serialized as JSON.
	 */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	mediaType?: string;
	/**
	 * True when a 5xx or a network drop can replay the request: reads only.
	 * A send that may have reached the gateway is never replayed.
	 */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Mocean does not document that header;
// throttling (body status 32) is the documented rate-limit signal.
const MOCEAN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMoceanRequest(
	apiKey: string,
	{ family, method, path, query, body, mediaType, replayable }: MoceanRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MOCEAN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			// The current API authenticates with a Bearer API token.
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType,
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: MOCEAN_RATE_LIMIT_CONFIG,
		});
		// A 2xx body with a nonzero status is the normal failure path here.
		const bodyStatus = readBodyStatus(raw);
		if (bodyStatus !== undefined && bodyStatus !== 0) {
			throw new MoceanAPIError(
				describeMoceanError(
					undefined,
					raw,
					`request failed (status ${bodyStatus})`,
				),
				{
					status: undefined,
					body: raw,
					bodyStatus,
					family,
					method,
					replayable,
				},
			);
		}
		return raw;
	} catch (error) {
		// Rethrow our own error untouched: the generic branch below would
		// re-wrap it and hide the fields the handlers match on.
		if (error instanceof MoceanAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new MoceanAPIError(
				describeMoceanError(error.status, error.body, error.message),
				{ cause: error, family, replayable },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MoceanAPIError(error.message, {
				cause: error,
				family,
				method,
				replayable,
			});
		}
		throw new MoceanAPIError('Unknown Mocean error', { family, replayable });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Builds the urlencoded form body Mocean takes, with `mocean-resp-format`
 * always set so the answer comes back as JSON.
 */
export function moceanForm(
	fields: Record<string, string | number | boolean | undefined>,
): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) params.set(key, String(value));
	}
	params.set('mocean-resp-format', MOCEAN_RESP_FORMAT);
	return params.toString();
}
