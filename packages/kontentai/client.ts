import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The Delivery API serves published content from a CDN:
 * `https://deliver.kontent.ai/<environmentId>/<path>`.
 *
 * A preview environment is the same host with a preview token in an
 * `Authorization` header, which is the only call that needs one. The plugin uses
 * the one host and sends the token only when a preview read asks for it, so a
 * production read never carries a credential to a CDN request.
 */
export const KONTENT_DELIVERY_BASE = 'https://deliver.kontent.ai';

// Content is served from a CDN and answers quickly, and the largest read here is
// a page of 2,000 items, so the 20 second default in corsair/http is enough.
const KONTENT_TIMEOUT_MS = 30_000;

// The Delivery API documents a 429 for its rate limit and sends no Retry-After,
// so error-handlers.ts owns the retry and the client only reads the header.
const KONTENT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A Kontent failure:
 *
 * ```json
 * { "message": "...", "request_id": "...", "error_code": 100, "specific_code": 0 }
 * ```
 *
 * `error_code` distinguishes a missing environment (105) from a missing item
 * (100) or type (101), which the HTTP status alone cannot: all three answer 404.
 * `request_id` is what Kontent support asks for.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readError(body: unknown): {
	message?: string;
	requestId?: string;
	errorCode?: number;
	specificCode?: number;
} {
	const record = asRecord(body);
	const read = (key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	const errorCode = record?.error_code;
	const specificCode = record?.specific_code;
	return {
		message: read('message'),
		requestId: read('request_id'),
		errorCode: typeof errorCode === 'number' ? errorCode : undefined,
		specificCode: typeof specificCode === 'number' ? specificCode : undefined,
	};
}

// The codes a caller can act on, from live probes.
/** The environment ID does not exist. */
export const KONTENT_ENVIRONMENT_NOT_FOUND = 105;
/** A content item, type or taxonomy with that codename is missing. */
export const KONTENT_RESOURCE_NOT_FOUND = 100;

export class KontentAPIError extends Error {
	readonly status?: number;
	/** Kontent's `error_code`, such as 105 for an unknown environment. */
	readonly errorCode?: number;
	/** Kontent's `request_id`, which its support asks for. */
	readonly requestId?: string;
	/** Milliseconds from a Retry-After header, when Kontent sent one. */
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
			requestId?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KontentAPIError';
		this.status = options.status;
		this.errorCode = options.errorCode;
		this.requestId = options.requestId;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** The environment ID is wrong, which reads as a config error, not a bad key. */
	get isEnvironmentNotFound(): boolean {
		return this.errorCode === KONTENT_ENVIRONMENT_NOT_FOUND;
	}

	/** A preview token the environment refused. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The entity is not there, or was never published. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

/** The message Kontent sent, with the status and code in front. */
// unknown: an error body is untyped: the envelope above, or HTML from the CDN.
export function describeKontentError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readError(body);
	const text = fields.message ?? fallback;
	const label = [status, fields.errorCode]
		.filter((part) => part !== undefined)
		.join(' ');
	const summary = label ? `Kontent ${label}: ${text}` : text;
	return fields.requestId
		? `${summary} (request ${fields.requestId})`
		: summary;
}

export type KontentQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[];

export type KontentRequest = {
	method: 'GET';
	path: string;
	query?: Record<string, KontentQueryValue | undefined>;
	/** A preview token, sent only when a preview read asks for one. */
	previewToken?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * The Delivery API repeats a key for each value of an array
 * (`elements=facts&elements=price`), which is what `corsair/http` does for an
 * array, so no joining is needed here.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeKontentRequest(
	environmentId: string,
	{ path, query, previewToken }: KontentRequest,
): Promise<unknown> {
	if (!environmentId) {
		throw new KontentAPIError(
			'Kontent needs the environment ID, which is the first path segment of every request',
			{ method: 'GET' },
		);
	}

	const config: OpenAPIConfig = {
		BASE: KONTENT_DELIVERY_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: KONTENT_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			...(previewToken ? { Authorization: `Bearer ${previewToken}` } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${segment(environmentId)}${path}`,
		query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KONTENT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = readError(error.body);
			throw new KontentAPIError(
				describeKontentError(error.status, error.body, error.message),
				{
					status: error.status,
					errorCode: fields.errorCode,
					requestId: fields.requestId,
					retryAfter: error.retryAfter,
					method: 'GET',
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new KontentAPIError(error.message, {
				cause: error,
				method: 'GET',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new KontentAPIError('Unknown Kontent error', {
			method: 'GET',
			transport: true,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, KontentQueryValue | undefined>,
): Record<string, KontentQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, KontentQueryValue] => entry[1] !== undefined,
		),
	);
}

/**
 * The Delivery API answers `pagination.next_page` as a full URL, or an empty
 * string on the last page. A caller only needs the number of the next page, so
 * this reads it out rather than handing back a URL with the environment in it.
 */
export function nextSkipFrom(
	// unknown: the pagination block is untyped until the output schema runs.
	raw: unknown,
	currentSkip: number,
	returned: number,
	limit: number,
): number | null {
	const pagination = asRecord(asRecord(raw)?.pagination);
	const nextPage = pagination?.next_page;
	if (typeof nextPage === 'string') {
		// An empty string is Kontent saying this is the last page, which beats any
		// heuristic about a full page.
		if (nextPage.length === 0) return null;
		try {
			const skip = new URL(nextPage).searchParams.get('skip');
			if (skip !== null) {
				const parsed = Number.parseInt(skip, 10);
				if (Number.isFinite(parsed)) return parsed;
			}
		} catch {
			// A relative URL still carries the query, which is all that matters.
			const match = /[?&]skip=(\d+)/.exec(nextPage);
			if (match?.[1]) return Number.parseInt(match[1], 10);
		}
	}
	// A full page without a next_page at all is worth following, which covers a
	// body missing its pagination block.
	return returned >= limit ? currentSkip + returned : null;
}
