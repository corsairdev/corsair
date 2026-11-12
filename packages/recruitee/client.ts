import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { RecruiteeValue } from './endpoints/call';

/** The only host. */
export const RECRUITEE_API_BASE = 'https://api.recruitee.com';

/**
 * Every ATS route sits under the company: `/c/{company_id}/…`. The id travels
 * in the path, so it is a second credential beside the bearer token, and a token
 * belongs to exactly one company — using it for another answers 401.
 */
export function companyPath(companyId: string | number, path: string): string {
	return `/c/${encodeURIComponent(String(companyId))}${path}`;
}

/**
 * Recruitee has **three** error shapes, and which one arrives depends on the
 * route and how far the request got:
 *
 * - `{ errors: [{ code, data, message }] }`
 * - The ATS routes: `{ error: 'Resource access requires authentication!',
 *   error_code: null }` on a 401, `{ error: ['Page not found'] }` on a 404
 * - A bare `401` with no body at all, before the app layer.
 *
 * The message is read from whichever is present. A `401` from a revoked token is
 * permanent: the docs say a token cannot be regenerated, so a new one has to be
 * created rather than retried.
 */
export class RecruiteeAPIError extends Error {
	readonly status?: number;
	/** The `errors[0].code`, such as `unauthorized` or `not_found`. */
	readonly code?: string;
	/** The `error_code` from the older shape, when it was set. */
	readonly errorCode?: string;
	/** Every message the body carried, in order. */
	readonly errors: string[];
	/** Milliseconds from a Retry-After header, when one arrived. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errorCode?: string;
			errors?: string[];
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RecruiteeAPIError';
		this.status = options.status;
		this.code = options.code;
		this.errorCode = options.errorCode;
		this.errors = options.errors ?? [];
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * A missing, revoked or wrong-company token. Recruitee cannot regenerate a
	 * token, so this is always terminal.
	 */
	get isAuthError(): boolean {
		return (
			this.status === 401 || this.status === 403 || this.code === 'unauthorized'
		);
	}

	/** The candidate, offer or department does not exist. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 'not_found';
	}

	/** A body Recruitee refused. It validates a candidate and an offer on write. */
	get isValidationError(): boolean {
		const status = this.status;
		return (
			status === 400 ||
			status === 422 ||
			this.code === 'unprocessable_entity' ||
			this.code === 'bad_request'
		);
	}
}

/**
 * Reads the messages out of any of the three envelopes.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function errorBody(body: unknown): {
	messages: string[];
	code?: string;
	errorCode?: string;
} {
	const record = asRecord(body);
	const messages: string[] = [];

	// The current shape: an array of `{ code, data, message }`.
	const list = record?.errors;
	if (Array.isArray(list)) {
		for (const entry of list) {
			const message = asRecord(entry)?.message;
			if (typeof message === 'string' && message.length > 0) {
				messages.push(message);
			}
		}
	}

	// The older ATS shape: `error` is a string beside `error_code` on a 401,
	// and an array of strings on a 404 (`["Page not found"]`) or a 422.
	const single = record?.error;
	if (typeof single === 'string' && single.length > 0) messages.push(single);
	if (Array.isArray(single)) {
		for (const entry of single) {
			if (typeof entry === 'string' && entry.length > 0) messages.push(entry);
		}
	}

	const first =
		Array.isArray(list) && list.length > 0 ? asRecord(list[0]) : null;
	const code = record?.code ?? first?.code;
	const errorCode = record?.error_code;
	return {
		messages,
		code: typeof code === 'string' ? code : undefined,
		errorCode:
			typeof errorCode === 'string'
				? errorCode
				: typeof errorCode === 'number'
					? String(errorCode)
					: undefined,
	};
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until `errorBody` narrows it.
 */
export function describeRecruiteeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { messages, code } = errorBody(body);
	const text = messages[0] ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = label ? `Recruitee ${label}: ${text}` : text;
	return messages.length > 1
		? `${summary} (${messages.slice(1).join('; ')})`
		: summary;
}

export type RecruiteeQuery = Record<string, RecruiteeValue | undefined>;

export type RecruiteeRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** Path starting with `/c/<company>`. */
	path: string;
	query?: RecruiteeQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Recruitee documents **1000 requests per minute** per token. It does not
 * document a `Retry-After`, so the handler retries on its own backoff and reads
 * the header only if a gateway adds one.
 */
const RECRUITEE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 500,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Bearer token; the company id travels in the path, not here. */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RECRUITEE_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRecruiteeRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RecruiteeRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: RECRUITEE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { messages, code, errorCode } = errorBody(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RecruiteeAPIError(
				describeRecruiteeError(error.status, error.body, error.message),
				{
					status: error.status,
					code,
					errorCode,
					errors: messages,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RecruiteeAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RecruiteeAPIError('Unknown Recruitee error', {
			method,
			replayable,
		});
	}
}
