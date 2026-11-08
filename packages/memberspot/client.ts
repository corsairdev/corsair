import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * MemberSpot's REST API, documented as an OpenAPI 3.0 spec served at
 * https://api.memberspot.de/api, with the machine-readable copy at
 * https://api.memberspot.de/api-json.
 *
 * Auth is an `X-API-KEY` header. The key is created in the school settings at
 * `/settings/apikeys`, so it is per school, not per user.
 */
export const MEMBERSPOT_API_BASE = 'https://api.memberspot.de';

/**
 * The spec documents a 429 on several write routes but no `Retry-After`, so the
 * fallback matters. `headerNames` is listed even with retries off, because the
 * request layer reads the header through this object before raising the error.
 */
const MEMBERSPOT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Retries belong to error-handlers.ts; the client makes one attempt.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * MemberSpot answers `{ message, statusCode }` on every failure, which is the
 * NestJS default. A missing key is 400 and an invalid one is 401, so the status
 * alone does not tell a caller whether to fix their key.
 */
export class MemberSpotAPIError extends Error {
	/** The HTTP status. */
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** True for a 429. */
	readonly isRateLimit: boolean;
	/**
	 * True when repeating the request cannot apply the operation twice. The API
	 * mixes reads with writes on the same host, so each call declares this.
	 */
	readonly replaySafe: boolean;
	/** True when the request never reached MemberSpot. */
	readonly transport: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			retryAfter?: number;
			replaySafe?: boolean;
			transport?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MemberSpotAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.replaySafe = options.replaySafe ?? false;
		this.transport = options.transport ?? false;
		this.isRateLimit = options.status === 429;
	}
}

// unknown: the body is an untyped error envelope until asRecord narrows it.
function describeMemberSpotError(status: number, body: unknown): string {
	const record = asRecord(body);
	const message = record?.message;
	const text = typeof message === 'string' ? message : 'the call failed';
	return `MemberSpot ${status}: ${text}`;
}

export type MemberSpotQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Sends one request and returns the parsed JSON body, which every endpoint then
 * parses with its own schema. The return type stays unknown for that reason.
 */
export async function makeMemberSpotRequest(
	apiKey: string,
	action: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		query?: MemberSpotQuery;
		// unknown: the endpoint's input schema has already validated the body.
		body?: unknown;
		replaySafe?: boolean;
	} = {},
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MEMBERSPOT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
	};

	const method = options.method ?? 'GET';
	const requestOptions: ApiRequestOptions = {
		method,
		url: action,
		query: options.query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: MEMBERSPOT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is dropped on purpose: ApiError retains the request, and the
			// key is a header on every call. Only actionable fields are copied.
			throw new MemberSpotAPIError(
				describeMemberSpotError(error.status, error.body),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					replaySafe: options.replaySafe,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MemberSpotAPIError(error.message, {
				transport: true,
				replaySafe: options.replaySafe,
				// This came from fetch itself, so it never held the key header.
				cause: error,
			});
		}
		throw new MemberSpotAPIError('Unknown MemberSpot error', {
			replaySafe: options.replaySafe,
		});
	}
}
