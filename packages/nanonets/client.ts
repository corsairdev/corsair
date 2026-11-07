import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NANONETS_API_BASE = 'https://app.nanonets.com/api/v2';

// Files above three pages can take minutes; the documented guidance is to
// poll async results roughly every few minutes, so reads sit well within a
// generous timeout.
const NANONETS_TIMEOUT_MS = 120_000;

function isCode(value: unknown): value is number {
	return typeof value === 'number';
}

function readErrorText(body: unknown): string | undefined {
	const record = asRecord(body);
	const message = record?.message;
	if (typeof message === 'string' && message.length > 0) return message;
	// unknown: per-endpoint OpenAPI blocks document plain-text error bodies.
	if (typeof body === 'string' && body.length > 0) return body;
	return undefined;
}

/**
 * Nanonets answers errors with
 * `{ message, code, errors: [{ reason, message }] }`, or occasionally plain
 * text. Documented statuses: 400 invalid input, 401 bad key, 402 free API
 * calls exhausted, 403 forbidden, 404 model or resource missing, 429 rate
 * limited (predict calls, per model per minute), 500, 503.
 */
export class NanonetsAPIError extends Error {
	readonly status?: number;
	/** The HTTP status echoed in the error body's code field, when present. */
	readonly code?: number;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** True only for operations a replay can safely repeat (reads). */
	readonly replaySafe?: boolean;
	// unknown: error bodies are the shape above or plain text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			replaySafe?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NanonetsAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.replaySafe = options.replaySafe ?? false;
		const record = asRecord(this.body);
		const code = record?.code;
		this.code = isCode(code) ? code : undefined;
	}

	/** True for the 429 the four predict endpoints answer when the per-model window is full. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** True for the 402 Nanonets answers when the free API call quota is spent. */
	get isQuotaExhausted(): boolean {
		return this.status === 402;
	}
}

// unknown: see NanonetsAPIError.
export function describeNanonetsError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readErrorText(body) ?? fallback;
	return status !== undefined ? `Nanonets ${status}: ${text}` : text;
}

export type NanonetsQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type NanonetsRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: NanonetsQuery;
	/** Multipart form fields; array values repeat the field. */
	form?: Record<string, string | string[]>;
	/** Pre-encoded body (urlencoded string or JSON-as-text) with its media type. */
	rawBody?: string;
	/** JSON body, serialized by corsair/http. */
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	mediaType?: string;
	/**
	 * Reads set this so a 5xx can be retried; predictions, training and every
	 * workflow action leave it off because Nanonets offers no idempotency key.
	 */
	replaySafe?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt. Nanonets
// documents 429 with 30s→60s→120s backoff and no Retry-After header; one is
// still honored when sent.
const NANONETS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

/**
 * Authentication is the documented HTTP Basic scheme with the API key as
 * username and an empty password. corsair/http's built-in Basic support
 * needs a non-empty password, so the header is built here.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNanonetsRequest(
	apiKey: string,
	{
		method,
		path,
		query,
		form,
		rawBody,
		body,
		mediaType,
		replaySafe,
	}: NanonetsRequest,
): Promise<unknown> {
	const authorization = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
	const config: OpenAPIConfig = {
		BASE: NANONETS_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: NANONETS_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: authorization },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		formData: form,
		body: rawBody ?? body,
		mediaType,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NANONETS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The ApiError cause is dropped: its captured request would carry
			// the Basic credentials in the Authorization header.
			throw new NanonetsAPIError(
				describeNanonetsError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					replaySafe: replaySafe ?? false,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NanonetsAPIError(error.message, {
				cause: error,
				replaySafe: replaySafe ?? false,
			});
		}
		throw new NanonetsAPIError('Unknown Nanonets error', {
			replaySafe: replaySafe ?? false,
		});
	}
}
