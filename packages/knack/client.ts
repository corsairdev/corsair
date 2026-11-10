import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export const KNACK_API_BASE = 'https://api.knack.com/v1';

/**
 * Every request carries two headers and there is no token exchange: the
 * application id says which app, the key authorises it. Both belong to one app,
 * so one account talks to one Knack application.
 *
 * `applicationId` is the account's `api_key` field and `apiKey` is its extra
 * `api_secret` field, because the base auth type already owns `api_key`.
 */
export const KnackCredentialsSchema = z.object({
	applicationId: z.string().min(1),
	apiKey: z.string().min(1),
});

export type KnackCredentials = z.infer<typeof KnackCredentialsSchema>;

export function packKnackCredentials(credentials: KnackCredentials): string {
	return JSON.stringify(credentials);
}

/**
 * Reads back what `packKnackCredentials` wrote. Returns null rather than
 * throwing so the caller can raise `AuthMissingError` in its own terms.
 */
export function parseKnackCredentials(
	key: string | null | undefined,
): KnackCredentials | null {
	if (!key) return null;
	try {
		const parsed = KnackCredentialsSchema.safeParse(JSON.parse(key));
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}

/**
 * Knack answers a rate limit with 429 and the plain-text body `Rate limit
 * exceeded`. The transport already treats 429 as a rate limit, so this only
 * names the headers that say when the window resets: Knack sends
 * `X-RateLimit-Reset` as a Unix timestamp, and a Retry-After overrides it when
 * present.
 */
const KNACK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export class KnackAPIError extends Error {
	readonly status: number;
	/** Milliseconds from a Retry-After or X-RateLimit-Reset, when sent. */
	readonly retryAfter?: number;
	/**
	 * Knack's failures are either a plain-text sentence (`Invalid API Key`) or
	 * `{ errors: [...] }` (a bad record id), so both are read into one list.
	 * Assuming JSON would leave the text failures with no message at all.
	 */
	readonly messages: string[];
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			messages?: string[];
			method?: string;
		} = {},
	) {
		// The cause is set only for a transport failure, which never reached
		// Knack and holds no request body. A provider rejection is passed as
		// copied fields instead: ApiError keeps the request on `request.body`,
		// and a failed record write holds whatever fields the caller sent.
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KnackAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status ?? 0;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.messages = options.messages ?? [];
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: a failure body is untyped until read, and Knack answers some
// rejections as plain text where the rest of the API sends JSON.
function readFailureText(body: unknown): string[] {
	if (typeof body === 'string') {
		const text = body.trim();
		return text ? [text] : [];
	}
	const record = asRecord(body);
	const errors = record?.errors;
	if (Array.isArray(errors)) {
		return errors.filter((entry): entry is string => typeof entry === 'string');
	}
	if (typeof errors === 'string') return [errors];
	const message = record?.message ?? record?.error;
	return typeof message === 'string' ? [message] : [];
}

/**
 * Knack's filter parameters are indexed: `filters[0][field]`,
 * `filters[0][operator]`, `filters[0][value]`. The transport's query encoder
 * flattens an array to `filters[field]` and drops the index, which Knack
 * silently ignores and answers with every record. So the indexed names are
 * built here and passed as plain scalar query values, which encode correctly.
 */
export type KnackQuery = Record<string, string | number | boolean | undefined>;

/** Expands filters into the indexed parameter names Knack reads. */
export function buildFilterQuery(
	filters: readonly { field: string; operator: string; value: string }[],
): KnackQuery {
	const query: KnackQuery = {};
	filters.forEach((filter, index) => {
		query[`filters[${index}][field]`] = filter.field;
		query[`filters[${index}][operator]`] = filter.operator;
		query[`filters[${index}][value]`] = filter.value;
	});
	return query;
}

export type KnackRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: KnackQuery;
	// unknown: the operation's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the answer with the operation's zod output schema,
// which is what decides each endpoint's real type.
export async function makeKnackRequest(
	credentials: KnackCredentials,
	{ method, path, query, body }: KnackRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KNACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Both are header keys, so they go in HEADERS. TOKEN would render as
		// `Authorization: Bearer`, which Knack ignores.
		HEADERS: {
			Accept: 'application/json',
			'X-Knack-Application-Id': credentials.applicationId,
			'X-Knack-REST-API-Key': credentials.apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		// Knack silently drops a write body sent with any other content type and
		// still answers 200, so this must be set exactly for POST and PUT.
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the response body's type comes from the calling operation's
		// output schema, which parses it straight after this returns.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KNACK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const messages = readFailureText(error.body);
			throw new KnackAPIError(
				messages.length > 0
					? `Knack ${error.status}: ${messages.join('; ')}`
					: `Knack ${error.status}: ${error.message}`,
				{
					status: error.status,
					retryAfter: error.retryAfter,
					messages,
					method,
				},
			);
		}
		// DOMException (a fetch timeout) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KnackAPIError(error.message, { cause: error, method });
		}
		throw new KnackAPIError('Unknown Knack error', { method });
	}
}

export { ApiError };
