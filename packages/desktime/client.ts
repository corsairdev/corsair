import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * DeskTime's API has the shape `/api/v2/{format}/{action}`. `format` supports
 * json, xml, jsonp and plist; this plugin only asks for json, and only calls the
 * read actions. `create-project` (POST), `start-project` and `stop-project`
 * (GET, but they change what is being tracked) are not called here.
 * https://help.desktime.com/hc/en-us/articles/25494558790685
 */
export const DESKTIME_API_BASE = 'https://desktime.com/api/v2/json';

/**
 * DeskTime answers `x-ratelimit-limit: 600` and no `Retry-After`, so a rate
 * limited call has no server-provided wait to honour.
 */
const DESKTIME_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Retries belong to error-handlers.ts; the client makes one attempt.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * DeskTime reports failures as `{"error":{"code":401,"description":"…"}}` with
 * a matching HTTP status, so the status alone is enough to classify most of
 * them. The code is kept because the description distinguishes causes the
 * status cannot, such as a missing key from an invalid one.
 */
export class DeskTimeAPIError extends Error {
	/** The provider error code, e.g. `401`. */
	readonly code?: number;
	/** The HTTP status. */
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when the server sent one. */
	readonly retryAfter?: number;
	/** True for a 429, or for a 403 the provider uses to signal a quota. */
	readonly isRateLimit: boolean;
	/** True when the request is safe to repeat without duplicating an effect. */
	readonly replaySafe: boolean;
	/** True when the request never reached DeskTime: a reset, DNS or abort. */
	readonly transport: boolean;

	constructor(
		message: string,
		options: {
			code?: number;
			status?: number;
			retryAfter?: number;
			replaySafe?: boolean;
			transport?: boolean;
			cause?: Error;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DeskTimeAPIError';
		this.code = options.code;
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.transport = options.transport ?? false;
		// Every operation in this plugin is a GET that changes nothing, so a
		// replay can never duplicate a write. An action that does change state,
		// such as `start-project`, would have to pass `replaySafe: false`.
		this.replaySafe = options.replaySafe ?? true;
		this.isRateLimit = options.status === 429;
	}
}

// unknown: the body is an untyped error envelope until asRecord narrows it.
function readErrorEnvelope(body: unknown): {
	code?: number;
	description?: string;
} {
	const error = asRecord(asRecord(body)?.error);
	const code = error?.code;
	const description = error?.description;
	return {
		code: typeof code === 'number' ? code : undefined,
		description: typeof description === 'string' ? description : undefined,
	};
}

// unknown: the response is untyped JSON until the endpoint's schema parses it.
function describeDeskTimeError(status: number, body: unknown): string {
	const { code, description } = readErrorEnvelope(body);
	const label = code !== undefined ? code : status;
	return description
		? `DeskTime ${label}: ${description}`
		: `DeskTime ${label}: the call failed`;
}

export type DeskTimeQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Sends one action and returns the parsed JSON body. The key travels in the
 * `X-API-Key` header: DeskTime also accepts an `apiKey` query parameter, but a
 * key in a URL is the pattern to avoid.
 *
 * The return type is unknown because each endpoint's output schema parses it
 * immediately; typing it here would mean restating every schema.
 */
export async function makeDeskTimeRequest(
	apiKey: string | undefined,
	action: string,
	query: DeskTimeQuery = {},
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DESKTIME_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: apiKey
			? { Accept: 'application/json', 'X-API-Key': apiKey }
			: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `/${action}`,
		query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DESKTIME_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is dropped on purpose: ApiError retains the request, and
			// the key is attached as a header on every call. Only the parts a
			// caller can act on are copied across.
			throw new DeskTimeAPIError(
				describeDeskTimeError(error.status, error.body),
				{
					code: readErrorEnvelope(error.body).code,
					status: error.status,
					retryAfter: error.retryAfter,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// No HTTP status means the request never got an answer: a reset, DNS
			// failure or abort. Nothing reached DeskTime, so the call cannot have
			// had an effect and is safe to repeat.
			throw new DeskTimeAPIError(error.message, {
				transport: true,
				cause: error,
			});
		}
		throw new DeskTimeAPIError('Unknown DeskTime error');
	}
}
