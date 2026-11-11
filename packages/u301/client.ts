import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The REST host. The docs site is `u301.com/docs`; the API lives on its own host
 * and is versioned in the path, and the official SDK hard-codes version `3`.
 */
export const U301_API_BASE = 'https://api.u301.com/v3';

/**
 * U301 needs **two** credentials: an API key, and a workspace ID that routes the
 * call to the right workspace. The key goes in `Authorization: Bearer`, and the
 * workspace in the `workspaceId` query parameter on every single call.
 *
 * They are carried together in the one key string a Corsair plugin receives,
 * separated by a newline, because there is no second key slot. `parseU301Key`
 * is the only place that layout is known.
 */
export const U301_KEY_SEPARATOR = '\n';

/** A refusal is `{message, code?, requestId?, errors?}`; live it is just a message. */
export class U301APIError extends Error {
	readonly status?: number;
	/** The body's `code`, such as UNAUTHORIZED or RATE_LIMITED. */
	readonly code?: string;
	/** The body's `requestId`, which U301 support asks for. */
	readonly requestId?: string;
	/** Per-field problems, when the API named them. */
	readonly details?: { field: string; message: string }[];
	/** Milliseconds from a Retry-After header, when U301 sent one. */
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
			requestId?: string;
			details?: { field: string; message: string }[];
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'U301APIError';
		this.status = options.status;
		this.code = options.code;
		this.requestId = options.requestId;
		this.details = options.details;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The key or workspace is wrong, so no call on this key can succeed. */
	get isAuthError(): boolean {
		return (
			this.status === 401 ||
			this.status === 403 ||
			this.code === 'UNAUTHORIZED' ||
			this.code === 'FORBIDDEN'
		);
	}

	/** The short link or domain does not exist. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 'NOT_FOUND';
	}

	/** A body U301 refused, including a bad destination URL. */
	get isValidationError(): boolean {
		return (
			this.status === 400 ||
			this.status === 422 ||
			this.code === 'BAD_REQUEST' ||
			this.code === 'VALIDATION_FAILED' ||
			this.name === 'ZodError'
		);
	}

	/**
	 * The monthly link allowance is spent. Newly created links count toward it and
	 * an oversized bulk request answers **429** without creating anything, so this
	 * is a quota rather than a rate limit even though the status looks like one.
	 */
	get isQuotaError(): boolean {
		return this.code === 'RATE_LIMITED' || this.status === 429;
	}
}

/**
 * Reads a refusal body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	message?: string;
	code?: string;
	requestId?: string;
	details?: { field: string; message: string }[];
} {
	const record = asRecord(body);
	const message = record?.message;
	const code = record?.code;
	const requestId = record?.requestId;
	const rawErrors = record?.errors;
	const details = Array.isArray(rawErrors)
		? rawErrors.flatMap((entry) => {
				const problem = asRecord(entry);
				const field = problem?.field;
				const text = problem?.message;
				return typeof field === 'string' && typeof text === 'string'
					? [{ field, message: text }]
					: [];
			})
		: undefined;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'string' && code.length > 0 ? code : undefined,
		requestId:
			typeof requestId === 'string' && requestId.length > 0
				? requestId
				: undefined,
		details: details && details.length > 0 ? details : undefined,
	};
}

/**
 * Builds the message for an error body. A keyless call answers a bare
 * `{"message":""}`, so an empty message falls back to something a caller can read.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeU301Error(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, code, requestId, details } = failure(body);
	const text = message ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const head = label ? `U301 ${label}: ${text}` : text;
	const withFields = details
		? `${head} (${details.map((d) => `${d.field}: ${d.message}`).join('; ')})`
		: head;
	return requestId ? `${withFields} [request ${requestId}]` : withFields;
}

/** The credentials a U301 call needs. */
export type U301Credentials = { apiKey: string; workspaceId: string };

/**
 * Packs the two credentials into the single key string Corsair passes around.
 *
 * The workspace ID is not a secret, but it is per-account configuration and there
 * is no other slot for it, so it rides with the key rather than being a required
 * plugin option a caller could forget.
 */
export function composeU301Key(apiKey: string, workspaceId: string): string {
	return `${apiKey}${U301_KEY_SEPARATOR}${workspaceId}`;
}

/**
 * Unpacks the key. A value that looks like `<key>\n<workspace>` is split; anything
 * else is treated as a bare key with no workspace, which the caller reports as a
 * configuration error rather than sending a request that must fail.
 */
export function parseU301Key(composite: string): {
	apiKey: string;
	workspaceId: string | null;
} {
	const index = composite.indexOf(U301_KEY_SEPARATOR);
	if (index <= 0) return { apiKey: composite, workspaceId: null };
	const apiKey = composite.slice(0, index).trim();
	const workspaceId = composite.slice(index + 1).trim();
	return {
		apiKey,
		workspaceId: workspaceId.length > 0 ? workspaceId : null,
	};
}

/** A query value. `workspaceId` is added to every call. */
export type U301Query = Record<string, string | number | boolean | undefined>;

export type U301Request = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path below `/v3`, starting with a slash. */
	path: string;
	query?: U301Query;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * U301 documents a `429` for the monthly link allowance rather than for a request
 * rate, so `corsair/http` must not treat it as a rate limit and retry it: doing so
 * would spend the allowance again. Retries live in error-handlers.ts.
 */
const U301_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	// A 429 here is the link quota, which no amount of waiting fixes.
	isRateLimitError: () => false,
};

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: U301_API_BASE,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeU301Request(
	compositeKey: string,
	{ method, path, query, body, replayable }: U301Request,
): Promise<unknown> {
	const { apiKey, workspaceId } = parseU301Key(compositeKey);
	if (!workspaceId) {
		// Sending without it would return a 401 that looks like a bad key, so the real
		// problem is reported here instead.
		throw new U301APIError(
			'U301 needs a workspace ID as well as an API key: set the key to "<api key>\\n<workspace id>".',
			{ method, replayable },
		);
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, workspaceId },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: U301_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the bearer token, so the fields
			// the handlers need are copied and the cause is dropped.
			throw new U301APIError(
				describeU301Error(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					requestId: fields.requestId,
					details: fields.details,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new U301APIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new U301APIError('Unknown U301 error', { method, replayable });
	}
}
