import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GENDERAPIIO_API_BASE = 'https://api.genderapi.io';

/**
 * GenderAPI.io v2 takes the account's 24-character key as a bearer token:
 *
 * ```
 * Authorization: Bearer <key>
 * ```
 *
 * A missing or unknown key does **not** fail. The API falls back to an
 * IP-scoped trial of 10 credits per 24 hours, and says so in
 * `meta.access.mode` (`ip_trial`) with a reason. A live probe with no key
 * answered 200 and charged the trial, so the key is optional here by design.
 *
 * A disabled, expired or restricted key is different: those do **not** fall
 * back, and answer 403.
 * Reference: https://genderapi.io/api-documentation
 */
export type GenderApiIoCredentials = {
	/** The 24-character API key. Absent means the IP-scoped trial is used. */
	apiKey?: string;
};

/** The codes the `/api/v2/errors` catalog documents. */
export const GENDERAPIIO_ERROR_CODES = {
	INVALID_JSON: 'invalid_json',
	QUERY_NOT_SUPPORTED: 'query_not_supported',
	VALIDATION_ERROR: 'validation_error',
	TRIAL_BATCH_LIMIT: 'trial_batch_limit',
	INVALID_API_KEY: 'invalid_api_key',
	ACCESS_DENIED: 'access_denied',
	KEY_DISABLED: 'key_disabled',
	KEY_EXPIRED: 'key_expired',
	INSUFFICIENT_CREDITS: 'insufficient_credits',
	NOT_FOUND: 'not_found',
	METHOD_NOT_ALLOWED: 'method_not_allowed',
	PAYLOAD_TOO_LARGE: 'payload_too_large',
	UNSUPPORTED_MEDIA_TYPE: 'unsupported_media_type',
	RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
	CONCURRENCY_LIMIT: 'concurrency_limit',
	AI_UNAVAILABLE: 'ai_unavailable',
	PREDICTION_TIMEOUT: 'prediction_timeout',
	INTERNAL_ERROR: 'internal_error',
} as const;

/**
 * Every failure is an RFC 7807 problem document, not a bare message:
 *
 * ```json
 * {
 *   "type": "urn:genderapi:problem:validation_error",
 *   "title": "validation error",
 *   "status": 422,
 *   "detail": "The request does not match the schema.",
 *   "code": "validation_error",
 *   "action": "correct_request",
 *   "errors": [{ "pointer": "/type", "message": "must be equal to one of the allowed values" }]
 * }
 * ```
 */
// unknown: the body is an untyped problem document until asRecord narrows it.
export function readProblem(body: unknown): {
	code?: string;
	title?: string;
	detail?: string;
	action?: string;
	fieldErrors?: Array<{ pointer?: string; message?: string }>;
	billingStatus?: string;
} {
	const record = asRecord(body);
	const billingStatus = asRecord(asRecord(record?.meta)?.usage)?.billing_status;
	const code = record?.code;
	const title = record?.title;
	const detail = record?.detail;
	const action = record?.action;
	const rawErrors = record?.errors;
	const fieldErrors = Array.isArray(rawErrors)
		? rawErrors.map((entry) => {
				const field = asRecord(entry);
				return {
					pointer:
						typeof field?.pointer === 'string' ? field.pointer : undefined,
					message:
						typeof field?.message === 'string' ? field.message : undefined,
				};
			})
		: undefined;
	return {
		code: typeof code === 'string' ? code : undefined,
		title: typeof title === 'string' ? title : undefined,
		detail:
			typeof detail === 'string' && detail.length > 0 ? detail : undefined,
		action: typeof action === 'string' ? action : undefined,
		fieldErrors,
		billingStatus:
			typeof billingStatus === 'string' ? billingStatus : undefined,
	};
}

export class GenderApiIoAPIError extends Error {
	readonly status?: number;
	/** The catalog code, such as `insufficient_credits`. */
	readonly code?: string;
	/** What the catalog says a caller should do, such as `add_credits_or_wait_for_reset`. */
	readonly action?: string;
	/** Per-field validation failures, when the request did not match the schema. */
	readonly fieldErrors?: Array<{ pointer?: string; message?: string }>;
	/**
	 * `meta.usage.billing_status` from the problem document: `not_charged`,
	 * `confirmed` or `unconfirmed`. The catalog says to check it before sending
	 * a failed prediction again.
	 */
	readonly billingStatus?: string;
	/** Milliseconds from `Retry-After`, when the API sent one. */
	readonly retryAfter?: number;
	/** The request ID, which support asks for on a billing problem. */
	readonly requestId?: string;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			action?: string;
			fieldErrors?: Array<{ pointer?: string; message?: string }>;
			billingStatus?: string;
			retryAfter?: number;
			requestId?: string;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GenderApiIoAPIError';
		this.status = options.status;
		this.code = options.code;
		this.action = options.action;
		this.fieldErrors = options.fieldErrors;
		this.billingStatus = options.billingStatus;
		this.retryAfter = options.retryAfter;
		this.requestId = options.requestId;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/**
	 * 429 covers both the rate limit and the concurrency limit. The catalog says
	 * to respect Retry-After, and that a retry is a new billed operation.
	 */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A key the API recognized but refused, or the header was missing. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/**
	 * A key that exists but cannot be used: disabled, expired, restricted, or an
	 * account with no credits. These never fall back to the trial.
	 */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** The balance cannot cover even one credit. */
	get isCreditError(): boolean {
		return this.code === GENDERAPIIO_ERROR_CODES.INSUFFICIENT_CREDITS;
	}

	/** A body or query the schema refused. */
	get isValidationError(): boolean {
		return this.status === 422 || this.status === 400;
	}

	/** The route does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A billed request whose outcome is unknown. Every POST route is billed, and
	 * the catalog says a failed prediction (any 5xx: 500 `internal_error`, 502,
	 * 503, 504 `prediction_timeout`) must have its billing checked before it is
	 * sent again, because a repeat is a new billed operation. A timeout or a
	 * dropped connection on a POST is the same case: the first attempt may have
	 * been charged. The free GET routes can still be retried.
	 */
	get needsBillingCheck(): boolean {
		if (this.code === 'billing_reconciliation_required') return true;
		return (
			this.method === 'POST' && (this.transport || (this.status ?? 0) >= 500)
		);
	}
}

/**
 * The GenderAPI.io fields of a thrown error. An HTTP failure reaches callers as
 * core's ApiError (R8) carrying the problem document; this reads it into the
 * same shape a transport failure has, so the handlers can treat both alike.
 */
// unknown: a caught rejection has no static type.
export function genderApiIoErrorInfo(
	error: unknown,
): GenderApiIoAPIError | undefined {
	if (error instanceof GenderApiIoAPIError) return error;
	if (!(error instanceof ApiError)) return undefined;
	const problem = readProblem(error.body);
	const requestId = asRecord(error.body)?.request_id;
	return new GenderApiIoAPIError(error.message, {
		status: error.status,
		code: problem.code,
		action: problem.action,
		fieldErrors: problem.fieldErrors,
		billingStatus: problem.billingStatus,
		retryAfter: error.retryAfter,
		requestId: typeof requestId === 'string' ? requestId : undefined,
		method: error.request.method,
	});
}

/**
 * The problem document without anything a caller sent. The catalog's fields are
 * fixed text, but `errors[].value` or an unknown field could echo a name, an
 * email or a phone number.
 */
// unknown: the error body is untrusted JSON.
function safeProblem(body: unknown): Record<string, unknown> | undefined {
	const record = asRecord(body);
	if (!record) return undefined;
	const problem = readProblem(body);
	const kept: Record<string, unknown> = {};
	for (const key of ['type', 'title', 'status', 'detail', 'code', 'action']) {
		if (record[key] !== undefined) kept[key] = record[key];
	}
	if (typeof record.request_id === 'string')
		kept.request_id = record.request_id;
	if (problem.fieldErrors) kept.errors = problem.fieldErrors;
	if (problem.billingStatus) {
		kept.meta = { usage: { billing_status: problem.billingStatus } };
	}
	return kept;
}

/** A readable message from the problem document. */
// unknown: an error body is untyped: a problem document, or text from a proxy
// that never reached GenderAPI.io.
export function describeGenderApiIoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const problem = readProblem(body);
	const text = problem.detail ?? problem.title ?? fallback;
	const label = [status, problem.code].filter(Boolean).join(' ');
	return label ? `GenderAPI.io ${label}: ${text}` : text;
}

export type GenderApiIoRequest = {
	method: 'GET' | 'POST';
	path: string;
	// unknown: the endpoint's input schema has already validated the body, and
	// each route has its own shape.
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

/**
 * The catalog documents 429 for both `rate_limit_exceeded` and
 * `concurrency_limit` and says to respect Retry-After. Because a retry is a new
 * billed operation, the client does not retry on its own; the handlers decide.
 */
const GENDERAPIIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGenderApiIoRequest(
	credentials: GenderApiIoCredentials,
	{ method, path, body, query }: GenderApiIoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GENDERAPIIO_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 30_000,
		HEADERS: {
			Accept: 'application/json',
			// Omitting the header entirely is what asks for the IP trial; sending an
			// empty `Bearer ` would be a different, invalid key.
			...(credentials.apiKey
				? { Authorization: `Bearer ${credentials.apiKey}` }
				: {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GENDERAPIIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Core's ApiError goes through (R8), minus the names, emails and phone
			// numbers that were sent, and the query of the GET routes.
			const url = new URL(error.url);
			url.search = '';
			throw new ApiError(
				{ ...error.request, body: undefined, query: undefined },
				{
					url: url.toString(),
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: safeProblem(error.body),
				},
				describeGenderApiIoError(
					error.status,
					safeProblem(error.body),
					`HTTP ${error.status}`,
				),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GenderApiIoAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GenderApiIoAPIError('Unknown GenderAPI.io error', {
			method,
			transport: true,
		});
	}
}
