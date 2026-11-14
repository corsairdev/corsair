import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The Rosette API moved to Babel Street, and the host with it.
 *
 * The old `api.rosette.com` still answers, but the docs and the official bindings
 * now point at `analytics.babelstreet.com`, so that is the host used here. The
 * legacy `X-RosetteAPI-Key` header still works, and the binding sends both; this
 * client sends only the current one.
 */
export const ROSETTE_API_BASE = 'https://analytics.babelstreet.com/rest/v1';

/**
 * A refusal is a flat object with a machine `code` and a human `message`:
 *
 * ```json
 * {"code":"forbidden","message":"you have either provided an invalid API key, or are not authorized to call the endpoint, or have exceeded the daily or monthly API call limits"}
 * ```
 *
 * Captured live on every endpoint, sent as `text/plain`. The message covers
 * three causes (four with a profileId the account lacks), so the plugin's
 * accessors do not guess between them beyond the status.
 */
export class RosetteAPIError extends Error {
	readonly status?: number;
	/** The body's `code`, a slug such as "forbidden". */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Rosette sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The endpoint path, so an error names which analysis failed. */
	readonly endpoint?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			endpoint?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RosetteAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.endpoint = options.endpoint;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The key was refused. Rosette answers a bad key with `403 forbidden`, and the
	 * same body also covers an unauthorized endpoint and an exhausted quota, so a
	 * caller should read `code` rather than assume the key is wrong.
	 */
	get isAuthError(): boolean {
		return (
			this.status === 401 || this.status === 403 || this.code === 'forbidden'
		);
	}

	/** The endpoint exists but the plan or role does not include it. */
	get isPermissionError(): boolean {
		return this.code === 'notAuthorized';
	}

	/** The body or parameter Rosette refused. */
	get isValidationError(): boolean {
		return (
			this.status === 400 ||
			this.status === 422 ||
			this.code === 'badRequest' ||
			this.code === 'invalidParameter'
		);
	}

	/** Out of calls for the day or month, which retrying cannot fix. */
	get isQuotaError(): boolean {
		return this.code === 'quotaExceeded';
	}
}

/**
 * The key check answers with JSON text under a `text/plain` content type (live,
 * 11-12), which the HTTP layer returns as a string, so a string body is parsed
 * once more. Anything that is not JSON is left as it is.
 * unknown: the body is provider JSON, or text, until `failure` narrows it.
 */
function parseTextBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		// unknown: JSON.parse returns whatever the text held.
		return JSON.parse(body) as unknown;
	} catch {
		return body;
	}
}

/**
 * Reads a refusal body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): { message?: string; code?: string } {
	const record = asRecord(parseTextBody(body));
	const message = record?.message;
	const code = record?.code;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'string' && code.length > 0 ? code : undefined,
	};
}

/**
 * Builds the message for an error body. The message is long and names every
 * possible cause, so the `code` is what actually distinguishes them, and it goes
 * first.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRosetteError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, code } = failure(body);
	const text = message ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Rosette ${label}: ${text}` : text;
}

/** A query value; the analysis routes take only `profileId` here. */
export type RosetteQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RosetteRequest = {
	method: 'POST' | 'GET';
	/** Path below `/rest/v1`, starting with a slash. */
	path: string;
	query?: RosetteQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Babel Street documents rate limits per plan but no numeric header, and a 429
 * carries nothing the docs describe, so the backoff is exponential. A `403` here is
 * a key or quota problem and is never retried.
 */
const ROSETTE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key goes in `X-BabelStreetAPI-Key`, the header the current bindings use. The
 * legacy `X-RosetteAPI-Key` is accepted by the server but not sent.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: ROSETTE_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-BabelStreetAPI-Key': apiKey,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRosetteRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RosetteRequest,
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
			rateLimitConfig: ROSETTE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the API key, so the fields the
			// handlers need are copied and the cause is dropped.
			throw new RosetteAPIError(
				describeRosetteError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					retryAfter: error.retryAfter,
					method,
					endpoint: path,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RosetteAPIError(error.message, {
				cause: error,
				method,
				endpoint: path,
				replayable,
			});
		}
		throw new RosetteAPIError('Unknown Rosette error', {
			method,
			endpoint: path,
			replayable,
		});
	}
}
