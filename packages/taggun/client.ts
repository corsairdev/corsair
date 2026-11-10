import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TAGGUN_API_BASE = 'https://api.taggun.io';

// Taggun is synchronous and says a long supermarket receipt can take 20-30
// seconds, so corsair/http's 20 second default would abort real documents.
const TAGGUN_TIMEOUT_MS = 60_000;

// Every attempt is one billable scan, so retries belong to error-handlers.ts
// and this config only keeps Retry-After readable on the thrown error.
const TAGGUN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Taggun answers a missing key with 401 `{ message }`, a wrong key with 403
 * `{ message }`, rate limits with 429 `{ message }`, and everything from the
 * application itself with Boom's `{ statusCode, error, message }`. The three
 * shapes overlap on `message`, so the status decides which reading applies.
 */
export class TaggunAPIError extends Error {
	readonly status?: number;
	readonly statusText?: string;
	/** The HTTP method, so a handler can tell a replayable read from a write. */
	readonly method?: string;
	/** Milliseconds from a Retry-After header. Taggun may omit it on a 429. */
	readonly retryAfter?: number;
	/**
	 * Taggun's own `result` string, used by Campaign Settings Update and Delete,
	 * which report a missing campaign as a 404 body rather than a Boom error.
	 */
	readonly result?: string;

	/**
	 * True when no HTTP response arrived: a dropped connection, a DNS failure or
	 * the client timeout. The request may or may not have reached Taggun, so the
	 * handlers still refuse to replay a write, but a read can be retried.
	 */
	readonly isTransportError: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			statusText?: string;
			method?: string;
			retryAfter?: number;
			result?: string;
			isTransportError?: boolean;
		} = {},
	) {
		// The body is deliberately not kept: it can carry the caller's receipt
		// content, and the key travels in a header that ApiError redaction does
		// not cover.
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TaggunAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.statusText = options.statusText ?? cause?.statusText;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.result = options.result;
		this.isTransportError = options.isTransportError ?? false;
	}

	/** True only for the documented 429; a 403 means the key is wrong. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** 401 (no key reached Taggun) and 403 (wrong key) are both auth failures. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/**
	 * Campaign Validation is sold as a plan feature. With a valid key and the
	 * feature disabled, its operations answer 400 with a message naming the
	 * feature rather than returning an empty result, so this is not a
	 * validation failure the caller can fix by changing input.
	 */
	get isFeatureUnavailable(): boolean {
		return (
			this.status === 400 && /feature Campaign Validation/i.test(this.message)
		);
	}
}

// unknown: error bodies are untyped until asRecord narrows them; a gateway can
// answer with HTML or an empty body instead of JSON.
function readMessage(
	body: unknown /* unknown: see above */,
): string | undefined {
	const record = asRecord(body);
	const message = record?.message;
	return typeof message === 'string' && message.length > 0
		? message
		: undefined;
}

// unknown: see readMessage. Boom also carries `error`, which is a status label.
function readResult(
	body: unknown /* unknown: see readMessage */,
): string | undefined {
	const record = asRecord(body);
	const result = record?.result;
	return typeof result === 'string' && result.length > 0 ? result : undefined;
}

// unknown: see readMessage.
export function describeTaggunError(
	status: number | undefined,
	body: unknown /* unknown: an error body is untyped until read above */,
	fallback: string,
): string {
	const text = readMessage(body) ?? readResult(body) ?? fallback;
	return status === undefined ? text : `Taggun ${status}: ${text}`;
}

export type TaggunQueryValue = string | number | boolean | undefined;

export type TaggunRequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Record<string, TaggunQueryValue>;
	// unknown: every endpoint validates its body with a zod input schema first.
	body?: unknown /* unknown: see above */;
	// unknown: a multipart field holds a Blob or a primitive, per the endpoint.
	formData?: Record<string, unknown /* unknown: see above */>;
};

// unknown: callers parse the answer with the endpoint's zod output schema.
export async function makeTaggunRequest(
	apiKey: string,
	{ method, path, query, body, formData }: TaggunRequestOptions,
): Promise<unknown /* unknown: see the note above */> {
	const config: OpenAPIConfig = {
		BASE: TAGGUN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: TAGGUN_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			// Taggun reads the key from this header only; it is not a bearer
			// token, so TOKEN (which renders `Bearer`) would be rejected.
			apikey: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		// A multipart body must let fetch generate its own boundary, so the
		// media type is left unset when `formData` carries the fields.
		mediaType: formData
			? undefined
			: body === undefined
				? undefined
				: 'application/json',
		formData,
	};

	try {
		// unknown: the provider's body is untyped until the output schema parses it.
		const response = await request<unknown /* unknown: see the note above */>(
			config,
			requestOptions,
			{
				rateLimitConfig: TAGGUN_RATE_LIMIT_CONFIG,
			},
		);
		throwIfBodyReportsFailure(response, method);
		return response;
	} catch (error) {
		// A failure this function raised itself already carries its status; the
		// generic branch below would re-wrap it and drop that.
		if (error instanceof TaggunAPIError) throw error;
		if (error instanceof ApiError) {
			throw new TaggunAPIError(
				describeTaggunError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) fails instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TaggunAPIError(error.message, {
				cause: error,
				method,
				isTransportError: true,
			});
		}
		throw new TaggunAPIError('Unknown Taggun error', {
			method,
			isTransportError: true,
		});
	}
}

/**
 * Taggun answers application errors with the matching HTTP status, but Campaign
 * Settings Update and Delete put the code inside the body (`{ result,
 * statusCode: 404 }`) instead. A body that names its own failure is never a
 * success, so it is raised rather than parsed into an empty result the caller
 * reads as a write that worked.
 */
// unknown: the body is untyped until asRecord narrows it.
function throwIfBodyReportsFailure(
	body: unknown /* unknown: see above */,
	method: string,
): void {
	const record = asRecord(body);
	if (!record) return;
	const statusCode = record.statusCode;
	if (typeof statusCode !== 'number' || statusCode < 400) return;
	const message = readMessage(body) ?? readResult(body);
	throw new TaggunAPIError(
		`Taggun ${statusCode}: ${message ?? 'the response reported a failure'}`,
		{ status: statusCode, method },
	);
}

export { TAGGUN_RATE_LIMIT_CONFIG, TAGGUN_TIMEOUT_MS };
