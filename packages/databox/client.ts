import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DATABOX_API_BASE = 'https://api.databox.com';

// A metric's first sync can take up to two minutes, and metrics.getData waits
// for it, so that endpoint raises its own timeout; everything else keeps
// corsair/http's 20 second default.
export const DATABOX_METRIC_DATA_TIMEOUT_MS = 150_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Databox sends that header on 429 and on a
// retryable 409 (modification_in_progress), so both statuses get their headers
// read; the handlers decide what actually retries.
const DATABOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
	isRateLimitError: (status) => status === 429 || status === 409,
};

// unknown: the body is an untyped envelope until asRecord narrows it.
function firstError(
	body: unknown,
): { code?: string; message?: string; field?: string } | undefined {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!Array.isArray(errors) || errors.length === 0) return undefined;
	const first = asRecord(errors[0]);
	if (!first) return undefined;
	return {
		code: readString(first, 'code'),
		message: readString(first, 'message'),
		field: readString(first, 'field'),
	};
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every Databox error, HTTP or envelope, arrives as
 * `{ requestId, status: 'error', errors: [{ code, message, field?, type }] }`.
 * The message names the first error's code and field when present, so an
 * agent can fix its input without re-reading the body.
 */
export function describeDataboxError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const first = firstError(body);
	const label = [status, first?.code]
		.filter((part) => part !== undefined)
		.join(' ');
	const summary = label
		? `Databox ${label}: ${first?.message ?? fallback}`
		: (first?.message ?? fallback);
	return first?.field ? `${summary} (field: ${first.field})` : summary;
}

export class DataboxAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code when present, such as `invalid_input`. */
	readonly code?: string;
	/** The request field the error names, when present. */
	readonly field?: string;
	/** Milliseconds from a Retry-After header, when Databox sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when replaying the request cannot repeat a side effect. */
	readonly replaySafe: boolean;
	// unknown: error bodies are usually the documented envelope, but a proxy
	// can answer with HTML or text.
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
			replaySafe?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DataboxAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.replaySafe = options.replaySafe ?? false;
		const first = firstError(this.body);
		this.code = first?.code;
		this.field = first?.field;
	}

	/** True when the fetch timed out or Databox answered 408. */
	get isTimeout(): boolean {
		if (this.status === 408) return true;
		const cause = this.cause;
		return (
			cause instanceof DOMException &&
			(cause.name === 'TimeoutError' || cause.name === 'AbortError')
		);
	}
}

/**
 * Databox documents its errors with real HTTP statuses, but the envelope
 * carries `status` on every answer, so a 2xx body that still says `error` is
 * treated as a failure rather than passed to the output schema.
 */
// unknown: a success body is arbitrary JSON until the endpoint schema parses it.
function errorFromEnvelope(
	body: unknown,
	options: { method?: string; replaySafe?: boolean },
): DataboxAPIError | undefined {
	const record = asRecord(body);
	if (!record || record.status !== 'error') return undefined;
	return new DataboxAPIError(
		describeDataboxError(
			undefined,
			body,
			'Databox returned an error envelope on a success status',
		),
		{ body, method: options.method, replaySafe: options.replaySafe },
	);
}

export type DataboxQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type DataboxRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: DataboxQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * Sent as `x-account-id`: acts on one account of the organization instead
	 * of the organization tied to the key. Only for organizations with
	 * accounts enabled; ignored by key validation and account listing.
	 */
	accountId?: number;
	/**
	 * Sent as `Idempotency-Key`: Databox returns the original response for
	 * the same key within 24 hours on creation and ingestion calls.
	 */
	idempotencyKey?: string;
	/**
	 * True when replaying the request cannot repeat a side effect. Gates 5xx
	 * and timeout retries in error-handlers.ts.
	 */
	replaySafe?: boolean;
	/** Per-request timeout override in milliseconds. */
	timeoutMs?: number;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeDataboxRequest(
	apiKey: string,
	{
		method,
		path,
		query,
		body,
		accountId,
		idempotencyKey,
		replaySafe,
		timeoutMs,
	}: DataboxRequest,
): Promise<unknown> {
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'x-api-key': apiKey,
	};
	if (accountId !== undefined) headers['x-account-id'] = String(accountId);
	if (idempotencyKey !== undefined) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	const config: OpenAPIConfig = {
		BASE: DATABOX_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		const response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: DATABOX_RATE_LIMIT_CONFIG,
		});
		const envelopeError = errorFromEnvelope(response, { method, replaySafe });
		if (envelopeError) throw envelopeError;
		return response;
	} catch (error) {
		// An envelope error thrown above must pass through untouched, or the
		// branches below re-wrap it and drop its code and field.
		if (error instanceof DataboxAPIError) throw error;
		if (error instanceof ApiError) {
			throw new DataboxAPIError(
				describeDataboxError(error.status, error.body, error.message),
				{ cause: error, replaySafe },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new DataboxAPIError(error.message, {
				cause: error,
				method,
				replaySafe,
			});
		}
		throw new DataboxAPIError('Unknown Databox error', {
			method,
			replaySafe,
		});
	}
}
