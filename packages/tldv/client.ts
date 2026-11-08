import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The documented host is `https://pasta.tldv.io`, not `api.tldv.io`: the latter
 * answers 404 for every `/v1alpha1` path. The docs note the host may change.
 */
export const TLDV_API_BASE = 'https://pasta.tldv.io';

/**
 * tl;dv blocks requests that arrive with a default library User-Agent, before
 * the key is even read: `Python-urllib/3.11` gets a Cloudflare `error code:
 * 1010` and an HTTP 403. The docs ask for a descriptive agent, so every request
 * sends one. Verified live: the same call with `Corsair-tldv` and a bogus key
 * returns a 401 envelope, while the Python agent gets 403 with no JSON body.
 */
export const TLDV_USER_AGENT = 'Corsair-tldv-integration/1.0';

/**
 * tl;dv has two error bodies, and they differ by status:
 *
 * - **400** validation: `{ message, errors: [{ property, constraints }] }`
 * - **401/403/404/500** everything else: `{ name, message }`
 *
 * Both carry a string `message`, so `describeTldvError` reads that and adds the
 * first constraint when one is present.
 */
export class TldvAPIError extends Error {
	readonly status?: number;
	/** `name` from a basic error, e.g. `NotFoundError`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when tl;dv sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;
	/** First validation constraint, when the body is a 400. */
	readonly detail?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			detail?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TldvAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.detail = options.detail;
	}

	/** A rejected key is a 401, or a 403 from the User-Agent filter. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** The User-Agent block is a 403 with no JSON body. */
	get isUserAgentBlocked(): boolean {
		return this.status === 403 && this.code === undefined;
	}
}

/**
 * Reads the first validation constraint out of a 400 body.
 * unknown: the body is untyped until the guard here narrows it.
 */
function validationDetail(body: unknown): string | undefined {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!Array.isArray(errors) || errors.length === 0) return undefined;
	const first = asRecord(errors[0]);
	const constraints = asRecord(first?.constraints);
	if (!constraints) return undefined;
	const values = Object.values(constraints).filter(
		(value): value is string => typeof value === 'string',
	);
	return values[0];
}

/**
 * Builds the message for an error body.
 * unknown: the body is untyped until the reads here narrow it.
 */
export function describeTldvError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const name = typeof record?.name === 'string' ? record.name : undefined;
	const message =
		typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: fallback;
	const detail = validationDetail(body);
	const label = [status, name].filter((part) => part !== undefined).join(' ');
	const summary = label ? `tl;dv ${label}: ${message}` : message;
	return detail ? `${summary} (${detail})` : summary;
}

export type TldvRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	/** unknown: the endpoint's input schema has already validated the body. */
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. Upload completion documents a 429, and leaving
// `headerNames` out throws on the first one.
const TLDV_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: TLDV_API_BASE,
		VERSION: 'v1alpha1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'x-api-key': apiKey,
			'User-Agent': TLDV_USER_AGENT,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTldvRequest(
	apiKey: string,
	{ method, path, query, body }: TldvRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: TLDV_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TldvAPIError(
				describeTldvError(error.status, error.body, error.message),
				{
					cause: error,
					status: error.status,
					code:
						typeof asRecord(error.body)?.name === 'string'
							? (asRecord(error.body)?.name as string)
							: undefined,
					retryAfter: error.retryAfter,
					method,
					detail: validationDetail(error.body),
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TldvAPIError(error.message, { cause: error, method });
		}
		throw new TldvAPIError('Unknown tl;dv error', { method });
	}
}
