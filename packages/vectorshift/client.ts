import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const VECTORSHIFT_API_BASE = 'https://api.vectorshift.ai/v1';

/**
 * The docs call this API a beta and warn that behaviour may change. Pinning the
 * base here keeps any such change to one place.
 */
const VECTORSHIFT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * VectorShift answers a failure as `{ error: "..." }`, and some routes instead
 * as `{ status: "failed", error }`. A missing key is reported with its own
 * messages — `Missing authorization header`, `Invalid authorization header
 * format` or `Invalid API key` — rather than a status code alone, so those are
 * matched by text as well.
 */
export class VectorshiftAPIError extends Error {
	readonly status?: number;
	/** The machine-readable code, when the route sends one. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when VectorShift sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
	// with HTML or text.
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
		this.name = 'VectorshiftAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		this.code = readString(record, 'code');
	}

	/**
	 * True for a missing key as well as a bad one: the API distinguishes them,
	 * and to a caller both mean the credential needs fixing.
	 */
	get isAuthError(): boolean {
		if (this.status === 401) return true;
		// unknown: the message is untyped until read as one field.
		const message = readString(asRecord(this.body), 'error');
		if (message === undefined) return false;
		// The three documented forms; a bad key carries a parser detail after
		// the prefix, so this matches on the start rather than the whole string.
		return (
			message.startsWith('Missing authorization header') ||
			message.startsWith('Invalid authorization header format') ||
			message.startsWith('Invalid API key')
		);
	}

	/** True when a body field failed validation. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

// unknown: see VectorshiftAPIError.
export function describeVectorshiftError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'error') ?? fallback;
	const code = readString(record, 'code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `VectorShift ${label}: ${text}` : text;
}

export type VectorshiftQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type VectorshiftRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: VectorshiftQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment; ids come from the caller. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeVectorshiftRequest(
	apiKey: string,
	{ method, path, query, body }: VectorshiftRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: VECTORSHIFT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: VECTORSHIFT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new VectorshiftAPIError(
				describeVectorshiftError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new VectorshiftAPIError(error.message, { cause: error, method });
		}
		throw new VectorshiftAPIError('Unknown VectorShift error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isVectorshiftFailure(
	error: unknown,
): error is VectorshiftAPIError {
	return error instanceof VectorshiftAPIError;
}
