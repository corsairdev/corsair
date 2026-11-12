import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GATHERUP_API_BASE = 'https://app.gatherup.com';

// A feedback request batch and a feedback list over a long window can take
// longer than the 20 second default in corsair/http.
const GATHERUP_TIMEOUT_MS = 60_000;

/**
 * Every call needs both a bearer token and a `clientId`:
 *
 * ```
 * Authorization: Bearer <token>
 * ?clientId=<id>&agent=<agent id>
 * ```
 *
 * `agent` is optional and only needed when the token belongs to an owner
 * rather than the client, so it is passed through when configured.
 */
export type GatherupCredentials = {
	apiKey: string;
	clientId: string;
	/** Only for an owner-level token that acts on behalf of a client. */
	agent?: string;
};

/**
 * GatherUp reports a failure **inside a 200**:
 *
 * ```json
 * { "errorCode": 2, "errorMessage": "Invalid clientId" }
 * ```
 *
 * A live probe of `/api/test` with a bad token answered exactly that with
 * HTTP 200, so the status alone cannot be trusted. The client throws whenever
 * `errorCode` is present and non-zero, whatever the status was.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readError(body: unknown): {
	errorCode?: number;
	errorMessage?: string;
} {
	const record = asRecord(body);
	const code = record?.errorCode;
	const message = record?.errorMessage;
	return {
		errorCode: typeof code === 'number' ? code : undefined,
		errorMessage:
			typeof message === 'string' && message.length > 0 ? message : undefined,
	};
}

/**
 * GatherUp documents **5 requests a second**, and answers 503 above it rather
 * than 429. The rate-limit config therefore treats a 503 as a rate limit, which
 * is what the docs say it means; `isRateLimitError` is what lets that through.
 */
const GATHERUP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429 || status === 503,
};

/**
 * A GatherUp failure.
 *
 * The body is dropped: a customer payload carries the recipient's name, email
 * and phone, and a feedback list carries what reviewers wrote.
 */
export class GatherupAPIError extends Error {
	readonly status?: number;
	/** GatherUp's own `errorCode`, such as 2 for an invalid clientId. */
	readonly errorCode?: number;
	/** True when the body reported the failure even though the status was 2xx. */
	readonly bodyError: boolean;
	/** Milliseconds from a Retry-After header, when GatherUp sent one. */
	readonly retryAfter?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			errorCode?: number;
			bodyError?: boolean;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GatherupAPIError';
		this.status = options.status;
		this.errorCode = options.errorCode;
		this.bodyError = options.bodyError ?? false;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/**
	 * GatherUp answers 503 above its 5-a-second limit, so a 503 is a rate limit
	 * rather than an outage. A 429 is accepted too, in case a proxy adds one.
	 */
	get isRateLimit(): boolean {
		return this.status === 429 || this.status === 503;
	}

	/** No token, or one the account refused. */
	get isAuthError(): boolean {
		return this.status === 401 || this.errorCode === 2;
	}

	/** The token works but this client is not reachable from it. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** The business, customer or feedback is not there. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A field GatherUp refused. */
	get isValidationError(): boolean {
		return this.status === 400;
	}
}

/** The message GatherUp sent, with the status and body code in front. */
// unknown: an error body is untyped: the `{ errorCode, errorMessage }` envelope,
// or text from a proxy that never reached GatherUp.
export function describeGatherupError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readError(body);
	const text = fields.errorMessage ?? fallback;
	const label = [status, fields.errorCode]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `GatherUp ${label}: ${text}` : text;
}

export type GatherupQueryValue = string | number | boolean;

export type GatherupRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	/** Path-specific query parameters; `clientId` and `agent` are added here. */
	query?: Record<string, GatherupQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// each resource has its own shape.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGatherupRequest(
	credentials: GatherupCredentials,
	{ method, path, query, body }: GatherupRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GATHERUP_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: GATHERUP_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${credentials.apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// `clientId` is required on every call, and `agent` only when configured.
		query: {
			...query,
			clientId: credentials.clientId,
			agent: credentials.agent,
		},
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: GATHERUP_RATE_LIMIT_CONFIG,
		});
		// A 200 that carries an `errorCode` is a failure, and the only way to tell
		// is the body. A probe of `/api/test` confirmed this with a bad token.
		const fields = readError(raw);
		if (fields.errorCode !== undefined && fields.errorCode !== 0) {
			throw new GatherupAPIError(
				describeGatherupError(undefined, raw, 'GatherUp refused the request'),
				{ errorCode: fields.errorCode, bodyError: true, method },
			);
		}
		return raw;
	} catch (error) {
		if (error instanceof GatherupAPIError) throw error;
		if (error instanceof ApiError) {
			const fields = readError(error.body);
			throw new GatherupAPIError(
				describeGatherupError(error.status, error.body, error.message),
				{
					status: error.status,
					errorCode: fields.errorCode,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new GatherupAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GatherupAPIError('Unknown GatherUp error', {
			method,
			transport: true,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GatherupQueryValue | undefined>,
): Record<string, GatherupQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GatherupQueryValue] => entry[1] !== undefined,
		),
	);
}
