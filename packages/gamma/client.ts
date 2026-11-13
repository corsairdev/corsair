import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GAMMA_API_BASE = 'https://public-api.gamma.app';

// A generation runs for minutes, and an export likewise, so the client's timeout
// only has to cover the create and the poll; the work itself is asynchronous.
const GAMMA_TIMEOUT_MS = 60_000;

/**
 * Gamma answers a failure as `{ message, statusCode }`, and adds a `code` on
 * the cases a caller can act on:
 *
 * - `402` with `Insufficient credits remaining` means the workspace is out; the
 *   agent routes say the same with `403` and `code: insufficient_credits`.
 * - `403` with `code: individual_analytics_required` means the plan or a
 *   permission is short.
 * - `429` with `code: workspace_concurrency_limit_exceeded` means either the
 *   HTTP rate limit or too many in-flight jobs; it carries `Retry-After`.
 * - `409` with `code: edit_in_progress` when an edit already runs on that Gamma.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readError(body: unknown): {
	message?: string;
	code?: string;
	statusCode?: number;
} {
	const record = asRecord(body);
	const message = record?.message;
	const code = record?.code;
	const statusCode = record?.statusCode;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'string' && code.length > 0 ? code : undefined,
		statusCode: typeof statusCode === 'number' ? statusCode : undefined,
	};
}

/**
 * Gamma documents `Retry-After` on a 429 and also publishes three rate-limit
 * headers, so the delay comes from the response rather than a fixed guess.
 * error-handlers.ts owns the retry, so the client makes one attempt.
 */
const GAMMA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Gamma failure.
 *
 * The body is dropped. A completed generation carries an `exportUrl` that is a
 * bearer-capable download link, which the docs say to treat as a secret, and a
 * failed one can carry the prompt back; neither belongs on an error that a
 * caller might log.
 */
export class GammaAPIError extends Error {
	readonly status?: number;
	/** Gamma's own code, such as `workspace_concurrency_limit_exceeded`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Gamma sent one. */
	readonly retryAfter?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GammaAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		// The HTTP limit and the in-flight job cap share a 429 and a code.
		return this.status === 429;
	}

	/** A missing or invalid key, which no retry fixes. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * The workspace has no credits, which no retry fixes. Classic routes answer
	 * 402; the agent routes answer 403 with `code: insufficient_credits`.
	 */
	get isQuotaError(): boolean {
		return (
			this.status === 402 ||
			(this.status === 403 && this.code === 'insufficient_credits')
		);
	}

	/** Short plan, wrong permissions, or the wrong kind of gamma ID. */
	get isPermissionError(): boolean {
		return this.status === 403 && !this.isQuotaError;
	}

	/** Another edit is running on this Gamma. */
	get isConflict(): boolean {
		return this.status === 409;
	}

	/** A parameter or a record Gamma cannot find. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 404;
	}

	/** The service is busy and says to retry. */
	get isServiceBusy(): boolean {
		return this.status === 503;
	}
}

/** The message Gamma sent, with the status and code in front. */
// unknown: an error body is untyped: the `{ message, statusCode, code }`
// envelope, or text from a proxy that never reached Gamma.
export function describeGammaError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readError(body);
	const text = fields.message ?? fallback;
	const label = [status, fields.code]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Gamma ${label}: ${text}` : text;
}

export type GammaQueryValue = string | number | boolean;

export type GammaRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: Record<string, GammaQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// the generation bodies are large nested documents.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGammaRequest(
	apiKey: string,
	{ method, path, query, body }: GammaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GAMMA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: GAMMA_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
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
			rateLimitConfig: GAMMA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = readError(error.body);
			throw new GammaAPIError(
				describeGammaError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new GammaAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GammaAPIError('Unknown Gamma error', {
			method,
			transport: true,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GammaQueryValue | undefined>,
): Record<string, GammaQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GammaQueryValue] => entry[1] !== undefined,
		),
	);
}

/** Drops the undefined keys of a request body, so Gamma sees only what was sent. */
// unknown: a nested generation body, validated by the input schema first.
export function definedBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(body).filter(([, value]) => value !== undefined),
	);
}
