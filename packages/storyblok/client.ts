import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { UnknownJson } from './json';

/**
 * The Management API host depends on where the space is hosted, so it is a host
 * map rather than one base. A space created in the US answers only on the US
 * host, and a request to the wrong one fails as if the space did not exist.
 * https://www.storyblok.com/docs/api/management (Base URLs)
 */
export const STORYBLOK_HOSTS = {
	eu: 'https://mapi.storyblok.com/v1',
	us: 'https://api-us.storyblok.com/v1',
	ca: 'https://api-ca.storyblok.com/v1',
	ap: 'https://api-ap.storyblok.com/v1',
	cn: 'https://app.storyblokchina.cn/v1',
} as const;

export type StoryblokRegion = keyof typeof STORYBLOK_HOSTS;

/**
 * The region root, without the space. The space is part of each path instead of
 * the base, because `spaces.list` sits above the space and a base that buried
 * the space id would need `..` segments to escape it.
 */
export function storyblokBase(region: StoryblokRegion): string {
	return STORYBLOK_HOSTS[region];
}

/** The prefix every space-scoped route carries. */
export function spacePath(spaceId: number): string {
	return `/spaces/${segment(spaceId)}`;
}

/**
 * Rate limits are plan-based: 3 requests per second on Starter and 6 on the
 * paid plans. Storyblok documents a 429 and asks callers to back off and retry.
 * Retries live in error-handlers.ts, so the client makes one attempt.
 */
const STORYBLOK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Storyblok sends `{ "error": "Unauthorized" }` on a 401, and its validation
 * failures are also a single `error` string rather than a field map. A 404 is
 * `{ "error": "Not Found" }`.
 */
export class StoryblokAPIError extends Error {
	readonly status?: number;
	/** The single message from `error`, when Storyblok sent that shape. */
	readonly reason?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: an error body is `{ error }`, but a proxy can answer HTML.
	readonly body?: UnknownJson;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: UnknownJson;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'StoryblokAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.reason = readString(asRecord(this.body), 'error');
	}

	/** True when the token is missing, invalid or expired. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** True when the token is valid but the space or record is not reachable. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, UnknownJson> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: see StoryblokAPIError.
export function describeStoryblokError(
	status: number | undefined,
	body: UnknownJson,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'error') ?? readString(record, 'message') ?? fallback;
	return status === undefined ? text : `Storyblok ${status}: ${text}`;
}

export type StoryblokQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type StoryblokRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** The route below the space, such as `/stories`. */
	path: string;
	query?: StoryblokQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: UnknownJson; // unknown: the endpoint's input schema validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema, and the
// shape differs per route, which is what that schema is for.
export async function makeStoryblokRequest(
	apiKey: string,
	base: string,
	{ method, path, query, body }: StoryblokRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// A literal header: Storyblok takes the raw personal access token, not
			// a Bearer-prefixed one.
			Authorization: apiKey,
			Accept: 'application/json',
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
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: STORYBLOK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Still core's ApiError (plugin rule R8), so its status and retry fields
			// reach the handlers. It is rebuilt only to drop the request body, which
			// holds story content that can include personal data. The token is in
			// the config headers, never in the request options.
			throw new ApiError(
				{ method: error.request.method, url: error.request.url },
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				describeStoryblokError(error.status, error.body, error.message),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// A transport failure never held a body or headers, so its cause is safe to
		// keep. DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new StoryblokAPIError(error.message, { cause: error, method });
		}
		throw new StoryblokAPIError('Unknown Storyblok error', { method });
	}
}
