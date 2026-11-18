import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FOLLOWUPBOSS_API_BASE = 'https://api.followupboss.com/v1';

/**
 * FUB identifies every calling system through the X-System (name) and
 * X-System-Key (key issued at system registration) headers. A registered key
 * raises the rate limits (global 250 per 10s instead of 125), so it is a typed
 * plugin option rather than a constant; it is omitted when the caller has not
 * registered, because sending an unregistered key value is worse than sending
 * none. https://docs.followupboss.com/reference/identification
 */
export type FollowUpBossSystemIdentity = {
	systemName?: string;
	systemKey?: string;
};

// Error bodies are `{ errorMessage: string }` per the Error Responses guide;
// proxies can still answer with HTML or text, so the body stays untyped until
// asRecord narrows it.
function readErrorMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const value = record?.errorMessage;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * FUB sends `Retry-After` in seconds on 429; corsair/http converts it to
 * milliseconds. error-handlers.ts owns retries, so the client makes one
 * attempt and only reads Retry-After into the error.
 */
const FOLLOWUPBOSS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

export class FollowUpBossAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when FUB sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are `{ errorMessage }` per the docs, but a proxy
	// can answer with HTML or text.
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
		this.name = 'FollowUpBossAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}
}

export function describeFollowUpBossError(
	status: number | undefined,
	// unknown: the error body is `{ errorMessage }` or proxy HTML/text.
	body: unknown,
	fallback: string,
): string {
	const text = readErrorMessage(body) ?? fallback;
	return status === undefined ? text : `Follow Up Boss ${status}: ${text}`;
}

export type FollowUpBossQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type FollowUpBossRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: FollowUpBossQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for the bodyless answers, such as the 204 on DELETE
// /appointments/{id} and POST /people/ignoreUnclaimed.
export async function makeFollowUpBossRequest(
	apiKey: string,
	{ method, path, query, body }: FollowUpBossRequest,
	identity: FollowUpBossSystemIdentity = {},
): Promise<unknown> {
	// Basic auth per the Authentication guide: the API key is the username and
	// the password is empty. corsair/http would rewrite a TOKEN into a Bearer
	// header, so the documented Basic form is built here and TOKEN stays unset.
	const config: OpenAPIConfig = {
		BASE: FOLLOWUPBOSS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
			'X-System': identity.systemName ?? 'corsair',
			...(identity.systemKey ? { 'X-System-Key': identity.systemKey } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		// FUB defines request bodies only on POST and PUT today, but reactions
		// delete carries one, so the body is forwarded for DELETE as well.
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: FOLLOWUPBOSS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new FollowUpBossAPIError(
				describeFollowUpBossError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new FollowUpBossAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new FollowUpBossAPIError('Unknown Follow Up Boss error', { method });
	}
}
