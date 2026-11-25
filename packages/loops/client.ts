import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LOOPS_API_BASE = 'https://app.loops.so/api';

// Loops caps the baseline at 10 requests per second per team (60 per minute on
// the gated content endpoints) and answers 429 without a Retry-After header.
// error-handlers.ts owns retries, so the client makes one attempt and only
// reads a header if Loops ever sends one.
const LOOPS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** A message that says the key works but the team lacks a feature flag. */
const FEATURE_NOT_ENABLED_PATTERN = /not enabled/i;

export type LoopsRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Sent as the Idempotency-Key header; only POST /v1/transactional takes one. */
	idempotencyKey?: string;
};

export class LoopsAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header; Loops does not send one today. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method?: string;
	/** True when the request carried an Idempotency-Key, so a replay reuses it. */
	readonly hasIdempotency?: boolean;
	/** A 2xx body that said `success: false`; the status code showed success. */
	readonly envelopeFailure?: boolean;
	/** 401 whose message says a feature flag is off, not that the key is bad. */
	readonly featureNotEnabled?: boolean;
	/** Field path from a validation failure, when Loops named one. */
	readonly path?: string;
	/** Transactional email id from a validation failure, when Loops sent one. */
	readonly transactionalId?: string;
	/** The request never reached Loops (reset, DNS, abort), so replay is safe for reads. */
	readonly transport?: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			method?: string;
			hasIdempotency?: boolean;
			envelopeFailure?: boolean;
			featureNotEnabled?: boolean;
			path?: string;
			transactionalId?: string;
			transport?: boolean;
			cause?: Error;
		} = {},
	) {
		// The cause is kept only for transport errors, which never carried a
		// request body; for HTTP errors the fields copied above are everything
		// a caller needs, and the ApiError cause would sit in util.inspect output.
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LoopsAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.hasIdempotency = options.hasIdempotency;
		this.envelopeFailure = options.envelopeFailure;
		this.featureNotEnabled = options.featureNotEnabled;
		this.path = options.path;
		this.transactionalId = options.transactionalId;
		this.transport = options.transport;
	}

	/** True when a replay cannot double the effect: reads and keyed sends. */
	get canReplay(): boolean {
		return this.method === 'GET' || this.hasIdempotency === true;
	}
}

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Reads the error text Loops sends. `message` is the supported field; `error`
 * is a deprecated duplicate kept for older bodies, so it is only a fallback.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function describeLoopsError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	return (
		readString(record, 'message') ?? readString(record, 'error') ?? fallback
	);
}

// unknown: the body is an untyped error body; asRecord reads fields off it.
function loopsErrorFrom(
	status: number | undefined,
	body: unknown,
	fallback: string,
	req: LoopsRequest,
	options: {
		envelopeFailure?: boolean;
		retryAfter?: number;
	} = {},
): LoopsAPIError {
	const message = describeLoopsError(status, body, fallback);
	const text = status === undefined ? message : `Loops ${status}: ${message}`;
	const record = asRecord(body);
	const errorField = asRecord(record?.error);
	return new LoopsAPIError(text, {
		status,
		retryAfter: options.retryAfter,
		method: req.method,
		hasIdempotency: req.idempotencyKey !== undefined,
		envelopeFailure: options.envelopeFailure,
		featureNotEnabled:
			status === 401 && FEATURE_NOT_ENABLED_PATTERN.test(message),
		path: readString(errorField, 'path') ?? readString(record, 'path'),
		transactionalId: readString(record, 'transactionalId'),
	});
}

// A 2xx body that still says `success: false` is a failure: Loops answers
// contact-update validation errors with 200 and the false envelope.
// unknown: the body can be any JSON value until asRecord narrows it.
function isFailureEnvelope(body: unknown): boolean {
	return asRecord(body)?.success === false;
}

/**
 * Makes one request against the Loops API and returns the parsed JSON body.
 */
// unknown: callers parse the body with the endpoint's zod output schema; the
// client cannot know it. Bare arrays, envelopes and nulls all pass through.
export async function makeLoopsRequest(
	apiKey: string,
	req: LoopsRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: LOOPS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method: req.method,
		url: req.path,
		query: req.query,
		body: req.body,
		mediaType: req.body === undefined ? undefined : 'application/json',
		headers: req.idempotencyKey
			? { 'Idempotency-Key': req.idempotencyKey }
			: undefined,
	};

	try {
		// unknown: the generic stays unknown; the endpoint's output schema owns
		// the contract, and typing it here would skip that parse.
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: LOOPS_RATE_LIMIT_CONFIG,
		});
		if (isFailureEnvelope(raw)) {
			throw loopsErrorFrom(undefined, raw, 'Loops request failed', req, {
				envelopeFailure: true,
			});
		}
		return raw;
	} catch (error) {
		// Rethrow our own envelope failure untouched, before the ApiError branch
		// would re-wrap it and drop the parsed fields.
		if (error instanceof LoopsAPIError) throw error;
		if (error instanceof ApiError) {
			throw loopsErrorFrom(error.status, error.body, error.message, req, {
				retryAfter: error.retryAfter,
			});
		}

		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LoopsAPIError(error.message, {
				cause: error,
				method: req.method,
				hasIdempotency: req.idempotencyKey !== undefined,
				transport: true,
			});
		}
		throw new LoopsAPIError('Unknown Loops error', {
			method: req.method,
			hasIdempotency: req.idempotencyKey !== undefined,
			transport: true,
		});
	}
}
