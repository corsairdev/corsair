import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const OMNISEND_API_BASE = 'https://api.omnisend.com';

/**
 * Omnisend versions its API by date sent in the `Omnisend-Version` header, and
 * every request must carry one. This matches the spec the plugin was built
 * from (api-docs.omnisend.com, version 2026-03-15). The legacy v3 API lives on
 * a different base path (`/v3/`) with a different auth header and is not
 * supported here.
 */
export const OMNISEND_API_VERSION = '2026-03-15';

const OMNISEND_TIMEOUT_MS = 30_000;

/** One entry of a validation problem's `errors` array. */
export type OmnisendErrorEntry = {
	field?: string;
	code?: string;
	message?: string;
};

/**
 * What a problem body said, read field by field.
 *
 * Omnisend answers failures as RFC 9457 problem details
 * (`application/problem+json`): `{ type, title, detail, status, instance }`,
 * plus `errors[]` on validation failures and `retryAfter` (seconds) on some
 * rate-limit responses. The 429 delay arrives in this body; a `Retry-After`
 * header is not documented.
 */
export type OmnisendProblem = {
	type?: string;
	title?: string;
	detail?: string;
	/** Seconds, from the rate-limit problem body. */
	retryAfterSeconds?: number;
	errors?: OmnisendErrorEntry[];
};

// unknown: the body is untrusted JSON, sometimes still unparsed text.
export function readProblem(body: unknown): OmnisendProblem {
	const parsed = typeof body === 'string' ? parseJson(body) : body;
	const record = asRecord(parsed);
	if (!record) return {};
	const list = record.errors;
	const errors = Array.isArray(list)
		? list.flatMap((entry) => {
				const item = asRecord(entry);
				if (!item) return [];
				return [
					{
						field: typeof item.field === 'string' ? item.field : undefined,
						code: typeof item.code === 'string' ? item.code : undefined,
						message:
							typeof item.message === 'string' ? item.message : undefined,
					},
				];
			})
		: undefined;
	return {
		type: typeof record.type === 'string' ? record.type : undefined,
		title: typeof record.title === 'string' ? record.title : undefined,
		detail: typeof record.detail === 'string' ? record.detail : undefined,
		retryAfterSeconds:
			typeof record.retryAfter === 'number' ? record.retryAfter : undefined,
		errors: errors && errors.length > 0 ? errors : undefined,
	};
}

/** JSON.parse that returns undefined instead of throwing. */
// unknown: the text is provider output and may not be JSON at all.
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// carries the 429 delay onto the error. Omnisend sends it in the problem body
// (`retryAfter`, seconds); a `Retry-After` header is not documented, but the
// shared client reads one if it appears.
const OMNISEND_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * An Omnisend failure. `problemType` is the problem body's `type` slug, such
 * as `rate-limit-exceeded` or `validation-failed`; `retryAfter` is the delay
 * in milliseconds, taken from the problem body's `retryAfter` seconds first
 * and a `Retry-After` header second.
 */
export class OmnisendAPIError extends Error {
	readonly status?: number;
	readonly problemType?: string;
	/** Milliseconds to wait before a retry, when Omnisend sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Per-field validation errors, on a 400 validation problem. */
	readonly errors?: OmnisendErrorEntry[];

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			problemType?: string;
			retryAfter?: number;
			method?: string;
			errors?: OmnisendErrorEntry[];
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'OmnisendAPIError';
		this.status = options.status;
		this.problemType = options.problemType;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.errors = options.errors;
	}
}

/**
 * The error message from a problem body: status, then title and detail.
 *
 * The shared client's own message must never be that fallback: for a status
 * outside its fixed map it embeds the whole response body, and a rejected
 * contact write echoes what was sent.
 */
export function describeOmnisendError(
	status: number | undefined,
	body: unknown, // unknown: the untyped problem body, read field by field.
	fallback: string,
): { message: string; problemType?: string; errors?: OmnisendErrorEntry[] } {
	const problem = readProblem(body);
	const text =
		problem.detail ?? problem.errors?.[0]?.message ?? problem.title ?? fallback;
	const label =
		status === undefined
			? 'Omnisend'
			: `Omnisend ${status}${problem.title ? ` (${problem.title})` : ''}`;
	return {
		message: `${label}: ${text}`,
		problemType: problem.type,
		errors: problem.errors,
	};
}

/** The 429 delay in milliseconds: the body's `retryAfter` seconds, then a header. */
export function retryAfterMs(
	problem: OmnisendProblem,
	headerMs: number | undefined,
): number | undefined {
	if (problem.retryAfterSeconds !== undefined) {
		return problem.retryAfterSeconds * 1000;
	}
	return headerMs;
}

/** A status-only description, safe to pass as the fallback above. */
export function statusOnlyDescription(
	status: number | undefined,
	statusText: string | undefined,
): string {
	if (status === undefined) return 'request failed';
	return statusText ? `request failed (${statusText})` : 'request failed';
}

// Array values repeat the key on the wire (`status=draft&status=sent`), which
// the shared query serializer does natively.
export type OmnisendQuery = Record<
	string,
	string | number | boolean | readonly (string | number | boolean)[] | undefined
>;

export type OmnisendRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	path: string;
	query?: OmnisendQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeOmnisendRequest(
	apiKey: string,
	{ method, path, query, body }: OmnisendRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: OMNISEND_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: OMNISEND_TIMEOUT_MS,
		HEADERS: {
			// A custom scheme, not a bearer token: the current API wants its own.
			Authorization: `Omnisend-API-Key ${apiKey}`,
			// Required on every request, including with a valid key.
			'Omnisend-Version': OMNISEND_API_VERSION,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is untyped here; callers parse it with a zod schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: OMNISEND_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const described = describeOmnisendError(
				error.status,
				error.body,
				// Never error.message: on an unmapped status it embeds the body.
				statusOnlyDescription(error.status, error.statusText),
			);
			// The cause is dropped: `cause` is non-enumerable, but util.inspect
			// follows it, and ApiError.body holds the whole response.
			throw new OmnisendAPIError(described.message, {
				status: error.status,
				problemType: described.problemType,
				errors: described.errors,
				retryAfter: retryAfterMs(readProblem(error.body), error.retryAfter),
				method: error.request.method ?? method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		// The cause is kept only here: a transport failure never carried a body,
		// so there is nothing to leak.
		if (error instanceof Error || error instanceof DOMException) {
			throw new OmnisendAPIError(error.message, { cause: error, method });
		}
		throw new OmnisendAPIError('Unknown Omnisend error', { method });
	}
}
