import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The Push API, which is not the same host as the read API. Everything is
 * written to `push.userlist.com` and processed asynchronously: success is a
 * `202` with no body, so nothing comes back to validate.
 */
export const USERLIST_PUSH_API_BASE = 'https://push.userlist.com';

/**
 * The Push API authenticates with `Authorization: Push <key>`, not Bearer. The
 * scheme is part of the credential, and a Bearer token is a 401.
 */
export const USERLIST_AUTH_SCHEME = 'Push';

/** 1,000 requests a minute per account, and 100 KB per request body. */
const USERLIST_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
 * The Push API answers `{ status, code, errors: [...] }` — an *array* of
 * messages under `errors`, not the single `error` object most APIs use.
 *
 * A `202` is the only success, and it carries no body: the payload was queued,
 * not applied. That is why every write here resolves to an acknowledgement
 * rather than an object.
 */
export class UserlistAPIError extends Error {
	readonly status?: number;
	/** The stable code, e.g. `unauthorized` or `unprocessable_content`. */
	readonly code?: string;
	/** Every message Userflow sent, one per failed field when validating. */
	readonly errors?: readonly string[];
	/** Milliseconds from a Retry-After header, when Userlist sent one. */
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
		this.name = 'UserlistAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		this.code = readString(record, 'code');
		// The body also repeats the status as a number; the HTTP status is the
		// authority, so it is not read from here.
		const errors = record?.errors;
		this.errors = Array.isArray(errors)
			? errors.filter((entry): entry is string => typeof entry === 'string')
			: undefined;
	}

	/** True for a wrong Push key, or a token sent with the wrong scheme. */
	get isAuthError(): boolean {
		return this.status === 401 || this.code === 'unauthorized';
	}

	/** True when the payload was rejected; `errors` says why, per field. */
	get isValidationError(): boolean {
		return this.status === 422 || this.code === 'unprocessable_content';
	}

	/**
	 * True when the request body passed the 100 KB cap. Retrying the same body
	 * cannot succeed, so the caller has to send less.
	 */
	get isTooLarge(): boolean {
		return this.status === 413 || this.code === 'payload_too_large';
	}
}

// unknown: see UserlistAPIError.
export function describeUserlistError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const errors = record?.errors;
	const text = Array.isArray(errors)
		? errors.filter((entry) => typeof entry === 'string').join('; ')
		: (readString(record, 'message') ?? fallback);
	const code = readString(record, 'code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Userlist ${label}: ${text}` : text;
}

export type UserlistQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type UserlistRequest = {
	method: 'POST' | 'DELETE';
	path: string;
	query?: UserlistQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: the Push API answers 202 with no body, so this is undefined on
// success. Callers shape their own acknowledgement.
export async function makeUserlistRequest(
	apiKey: string,
	{ method, path, query, body }: UserlistRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: USERLIST_PUSH_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `${USERLIST_AUTH_SCHEME} ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		// A DELETE carries a body here, which is how the Push API removes an
		// object by identifier.
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: USERLIST_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new UserlistAPIError(
				describeUserlistError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new UserlistAPIError(error.message, { cause: error, method });
		}
		throw new UserlistAPIError('Unknown Userlist error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isUserlistFailure(error: unknown): error is UserlistAPIError {
	return error instanceof UserlistAPIError;
}
