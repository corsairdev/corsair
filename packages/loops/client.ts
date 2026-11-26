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
	/** Sent as the Idempotency-Key header (POST /v1/transactional and /v1/events/send). */
	idempotencyKey?: string;
};

/**
 * Errors from a request that can run again without doubling its effect: reads
 * (GET) and sends that carried an Idempotency-Key. error-handlers.ts only
 * retries 5xx and transport failures that are in here.
 */
const replayable = new WeakSet<object>();

export function isReplayable(error: Error): boolean {
	return replayable.has(error);
}

// The same truthiness test decides whether the header is sent, so a request
// counts as keyed only when Loops really got a key.
function canReplay(req: LoopsRequest): boolean {
	return req.method === 'GET' || Boolean(req.idempotencyKey);
}

/**
 * Loops' 409 for a reused key quotes the key, and a caller's key can hold an
 * email address or an order id, so it is cut from the message and body.
 */
// unknown: the error body is untyped JSON; only its strings are rewritten.
function withoutKey(value: unknown, key: string | undefined): unknown {
	if (!key) return value;
	if (typeof value === 'string')
		return value.split(key).join('[idempotency key]');
	if (Array.isArray(value)) return value.map((item) => withoutKey(item, key));
	const record = asRecord(value);
	if (!record) return value;
	return Object.fromEntries(
		Object.entries(record).map(([name, item]) => [name, withoutKey(item, key)]),
	);
}

/** True for a 401 whose message says a feature flag is off, not that the key is bad. */
export function isFeatureNotEnabled(error: Error): boolean {
	return (
		error instanceof ApiError &&
		error.status === 401 &&
		FEATURE_NOT_ENABLED_PATTERN.test(error.message)
	);
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

/**
 * Rebuilds core's ApiError without the request body and headers, which hold
 * contact data, template variables and attachments, and with Loops' own
 * message. Status, response body and rate-limit fields stay for the handlers.
 */
// unknown: the body is an untyped error body; describeLoopsError reads it.
function loopsApiError(
	req: LoopsRequest,
	status: number,
	statusText: string,
	body: unknown,
	fallback: string,
	rateLimit?: {
		retryAfter?: number;
		rateLimitReset?: number;
		rateLimitRemaining?: number;
		rateLimitLimit?: number;
	},
): ApiError {
	const safeBody = withoutKey(body, req.idempotencyKey);
	const message = describeLoopsError(status, safeBody, fallback);
	const error = new ApiError(
		{ method: req.method, url: req.path },
		{
			url: `${LOOPS_API_BASE}${req.path}`,
			ok: false,
			status,
			statusText,
			body: safeBody,
		},
		`Loops ${status}: ${withoutKey(message, req.idempotencyKey)}`,
		rateLimit,
	);
	if (canReplay(req)) replayable.add(error);
	return error;
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

	// unknown: the generic stays unknown; the endpoint's output schema owns
	// the contract, and typing it here would skip that parse.
	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: LOOPS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw loopsApiError(
				req,
				error.status,
				error.statusText,
				error.body,
				error.message,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// Transport failures (reset, DNS, timeout) never reached Loops; they
		// carry no request data, so they go up unchanged.
		if (error instanceof Error && canReplay(req)) replayable.add(error);
		throw error;
	}
	if (isFailureEnvelope(raw)) {
		throw loopsApiError(req, 200, 'OK', raw, 'Loops request failed');
	}
	return raw;
}
