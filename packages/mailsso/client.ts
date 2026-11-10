import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MAILSSO_API_BASE = 'https://api.mails.so';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Mails.so does not document that header or
// any rate limit.
const MAILSSO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

const SUBSCRIPTION_MESSAGE = /paid subscription/i;

/** An untyped response body: each endpoint's zod output schema gives it a shape. */
export type MailssoBody = unknown; // unknown: the body's shape differs per route (enveloped for validate, bare for batch jobs).

function readStringField(body: MailssoBody, key: string): string | undefined {
	const value = asRecord(body)?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Mails.so answers failures as `{ data: null, error: '<message>' }`, and the
 * batch routes add `error_code` (for example `BATCH_TOO_SMALL`). A request that
 * succeeds can still carry a non-null `error`, so a 2xx body is checked too.
 */
export class MailssoAPIError extends Error {
	readonly status?: number;
	/** The provider's `error_code`, when the body carries one. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Mails.so sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the request failed before any response arrived. */
	readonly transport: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MailssoAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.code = options.code ?? readStringField(cause?.body, 'error_code');
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.transport = options.transport ?? false;
	}

	/** True for a 429. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

/**
 * Batch validation needs a paid plan. Mails.so answers a free key with
 * `Paid subscription required to use list validations`, documented as a 401,
 * so it is told apart from a bad key by its message and never retried.
 */
export class MailssoSubscriptionRequiredError extends MailssoAPIError {
	constructor(
		message: string,
		options: ConstructorParameters<typeof MailssoAPIError>[1] = {},
	) {
		super(message, options);
		this.name = 'MailssoSubscriptionRequiredError';
	}
}

function toApiError(
	message: string,
	options: ConstructorParameters<typeof MailssoAPIError>[1],
): MailssoAPIError {
	return SUBSCRIPTION_MESSAGE.test(message)
		? new MailssoSubscriptionRequiredError(message, options)
		: new MailssoAPIError(message, options);
}

export type MailssoQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MailssoRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: MailssoQuery;
	body?: Record<string, string[]>;
	/**
	 * Set on the batch status read only: a running job answers 202 with a
	 * non-null `error` that is not a failure (see readJobInProgress).
	 */
	allowInProgress?: boolean;
};

/**
 * While a batch job runs, GET /v1/batch/{id} answers HTTP 202 with
 * `{ data: { id, created_at, status: 'processing' }, error: 'Job is still
 * processing' }`. That non-null `error` is a progress note, not a failure.
 *
 * The exception is limited to that exact note: a real failure can also carry
 * `data.id` and `status: 'processing'` (for example an error raised while a job
 * is mid-flight), and treating every message as progress would leave the caller
 * polling a job that has already failed.
 */
export const JOB_IN_PROGRESS_MESSAGE = 'Job is still processing';

export function readJobInProgress(body: MailssoBody): MailssoBody | undefined {
	const record = asRecord(body);
	const data = asRecord(record?.data);
	const message = readStringField(record, 'error');
	if (message !== JOB_IN_PROGRESS_MESSAGE) return undefined;
	return typeof data?.id === 'string' && data.status === 'processing'
		? data
		: undefined;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema: Mails.so wraps
// single validations in `{ data, error }` but returns batch jobs bare.
export async function makeMailssoRequest(
	apiKey: string,
	{ method, path, query, body, allowInProgress }: MailssoRequest,
): Promise<MailssoBody> {
	const config: OpenAPIConfig = {
		BASE: MAILSSO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'x-mails-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let raw: MailssoBody;
	try {
		raw = await request<MailssoBody>(config, requestOptions, {
			// unknown: same untyped body.
			rateLimitConfig: MAILSSO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw toApiError(
				readStringField(error.body, 'error') ??
					`Mails.so ${error.status}: ${error.message}`,
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MailssoAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new MailssoAPIError('Unknown Mails.so error', {
			method,
			transport: true,
		});
	}

	// A 2xx whose body still says error is a failure, except a running job on
	// the status read. Thrown outside the try so the catch above cannot re-wrap it.
	const message = readStringField(raw, 'error');
	if (
		message !== undefined &&
		!(allowInProgress && readJobInProgress(raw) !== undefined)
	) {
		throw toApiError(message, {
			status: 200,
			method,
			code: readStringField(raw, 'error_code'),
		});
	}
	return raw;
}
