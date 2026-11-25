import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LISTCLEAN_API_BASE = 'https://api.listclean.xyz/v1';

// A single verification runs SMTP checks against the recipient's mail
// exchanger, which can take tens of seconds on a slow domain.
const LISTCLEAN_TIMEOUT_MS = 60_000;

// Listclean documents no rate limit and no Retry-After, and a live burst of 12
// requests produced no 429 and no rate-limit headers. This keeps the default
// shape complete (request.ts replaces the defaults wholesale) so a Retry-After
// would still be read if Listclean ever sends one.
const LISTCLEAN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Every Listclean answer is `{ success, error_code, message, data }` with an
 * integer `success`: `1` on success, `0` on failure, including over a 2xx
 * status. Two documented quirks:
 *
 * - An unknown route answers 404 with an HTML CodeIgniter page, not the
 *   envelope, so a non-object body must fail loudly rather than parse as an
 *   empty result.
 * - `GET /account/profile/` answers its 401 without `error_code` and with
 *   `data: []`, so neither field is required to read the failure.
 */
// unknown: the body is an untyped error body until asRecord narrows it; only
// the three envelope fields are read, so no stricter type fits.
export function readEnvelope(body: unknown): {
	success?: number;
	message?: string;
	errorCode?: number;
} {
	const record = asRecord(body);
	const success = record?.success;
	const message = record?.message;
	const errorCode = record?.error_code;
	return {
		success: typeof success === 'number' ? success : undefined,
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		errorCode: typeof errorCode === 'number' ? errorCode : undefined,
	};
}

/** The message Listclean sent, with the status and its error code in front. */
// unknown: the body is the envelope above, or text from a proxy that never
// reached Listclean.
export function describeListcleanError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const envelope = readEnvelope(body);
	const text = envelope.message ?? fallback;
	const label = [status, envelope.errorCode]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Listclean ${label}: ${text}` : text;
}

/**
 * A Listclean failure: an HTTP error, a 2xx body whose envelope says
 * `success: 0`, or a request that got no answer at all.
 */
export class ListcleanAPIError extends Error {
	readonly status?: number;
	/** Listclean's own `error_code`, an integer (`0` on most failures). */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, when Listclean sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request got no HTTP answer (reset, DNS, abort, timeout). */
	readonly transport: boolean;
	/**
	 * True only for operations a retry cannot repeat on the provider:
	 * `verify.email` spends a credit even when the answer is lost, batch
	 * submit creates a second billed job, and delete is destructive. Every
	 * handler gates retries on this flag, never on the method alone.
	 */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ListcleanAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.replayable = options.replayable ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A missing, wrong or expired key (both 401 wordings Listclean sends). */
	get isAuthError(): boolean {
		return this.status === 401;
	}
}

export type ListcleanQueryValue = string | number | boolean;

export type ListcleanRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: Record<string, ListcleanQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** See {@link ListcleanAPIError.replayable}. */
	replayable: boolean;
	/**
	 * True for the JSON result download. That route answers a bare JSON stream
	 * (octet-stream), not the envelope, and corsair/http hands an
	 * octet-stream body back as text.
	 */
	download?: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, ListcleanQueryValue | undefined>,
): Record<string, ListcleanQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, ListcleanQueryValue] => entry[1] !== undefined,
		),
	);
}

/**
 * The result download answers a JSON stream as text; an HTML page (a wrong
 * route or id) must fail here rather than become an empty result list.
 */
// unknown: the body arrives as text or parsed JSON depending on the
// content-type, so the download row's shape is the caller's output schema.
function parseDownloadBody(raw: unknown): unknown {
	if (typeof raw !== 'string') return raw;
	try {
		return JSON.parse(raw) as unknown;
	} catch {
		throw new ListcleanAPIError(
			'Listclean answered a body that is not JSON on a result download; an HTML page means the route or list id does not exist',
		);
	}
}

/**
 * Validates the envelope of a successful answer and returns the whole
 * envelope record. Endpoints read `data` with {@link envelopeData} and the
 * `message` with {@link envelopeMessage}.
 */
// unknown: each endpoint's output schema parses what this returns.
function validateEnvelope(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) {
		throw new ListcleanAPIError(
			'Listclean answered a body that is not the JSON envelope; an HTML page means the route does not exist',
		);
	}
	const envelope = readEnvelope(record);
	if (envelope.success !== 1) {
		throw new ListcleanAPIError(
			describeListcleanError(undefined, record, 'Listclean reported a failure'),
			{ code: envelope.errorCode },
		);
	}
	return record;
}

// unknown: callers parse the body with the endpoint's zod output schema, so
// the client's return type stays unknown by design.
export async function makeListcleanRequest(
	apiKey: string,
	{ method, path, query, body, replayable, download }: ListcleanRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: LISTCLEAN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: LISTCLEAN_TIMEOUT_MS,
		// The key rides in this header as a plain value; Listclean documents no
		// Bearer or Basic scheme (spec, section "Authentication").
		HEADERS: { Accept: 'application/json', 'X-Auth-Token': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: query ? definedQuery(query) : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the endpoint's zod output schema parses the body.
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: LISTCLEAN_RATE_LIMIT_CONFIG,
		});
		return download ? parseDownloadBody(raw) : validateEnvelope(raw);
	} catch (error) {
		if (error instanceof ListcleanAPIError) throw error;
		if (error instanceof ApiError) {
			// The key travels in a header, which ApiError does not print, so the
			// error is rebuilt without the cause and the body: only the status,
			// the envelope message and Retry-After are carried over.
			throw new ListcleanAPIError(
				describeListcleanError(error.status, error.body, error.message),
				{
					status: error.status,
					code: readEnvelope(error.body).errorCode,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new ListcleanAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				replayable,
			});
		}
		throw new ListcleanAPIError('Unknown Listclean error', {
			method,
			transport: true,
			replayable,
		});
	}
}

/** The `data` payload of the envelope the client already validated. */
// unknown: the payload's shape is the endpoint's output schema, not one fixed type.
export function envelopeData(raw: unknown): unknown {
	return asRecord(raw)?.data;
}

/** The envelope `message`, which the delete answer documents in place of data. */
// unknown: the output schema validates this as a string; here it is untyped.
export function envelopeMessage(raw: unknown): unknown {
	return asRecord(raw)?.message;
}
