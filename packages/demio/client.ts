import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export const DEMIO_API_BASE = 'https://my.demio.com/api/v1';

/**
 * Demio sends two headers on every request and has no token exchange. The
 * account's `api_key` holds the key and its extra `api_secret` field holds the
 * secret, so the resolved `ctx.key` is the pair packed into one string.
 */
export const DemioCredentialsSchema = z.object({
	apiKey: z.string().min(1),
	apiSecret: z.string().min(1),
});

export type DemioCredentials = z.infer<typeof DemioCredentialsSchema>;

export function packDemioCredentials(credentials: DemioCredentials): string {
	return JSON.stringify(credentials);
}

/**
 * Reads back what `packDemioCredentials` wrote. Returns null rather than
 * throwing so the caller can raise `AuthMissingError` in its own terms.
 */
export function parseDemioCredentials(
	key: string | null | undefined,
): DemioCredentials | null {
	if (!key) return null;
	try {
		const parsed = DemioCredentialsSchema.safeParse(JSON.parse(key));
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}

// unknown: an error body is untyped until read, and a proxy can answer with
// HTML or plain text where JSON was expected.
function readMessages(body: unknown): string[] {
	const record = asRecord(body);
	const messages = record?.messages;
	if (!Array.isArray(messages)) return [];
	return messages.filter((entry): entry is string => typeof entry === 'string');
}

// unknown: same open error body as readMessages.
function readErrors(body: unknown): string[] {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!Array.isArray(errors)) return [];
	return errors.filter((entry): entry is string => typeof entry === 'string');
}

/**
 * Demio answers 417, not 429, when the per-minute rate or the account's daily
 * allowance is spent. The transport only recognises 429 on its own, so the
 * config has to name 417 as well; without this a 417 reaches the error
 * handlers with no `retryAfter` read from the headers.
 */
const DEMIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 417,
};

/** Both limits answer 417, so the message is the only way to tell them apart. */
const DAILY_LIMIT_MARKER = 'daily limit';

export class DemioAPIError extends Error {
	readonly status: number;
	statusText?: string;
	/** Milliseconds from a Retry-After header, when Demio sent one. */
	readonly retryAfter?: number;
	/** The pre-endpoint rejection shape, e.g. a bad credential. */
	readonly messages: string[];
	/** The endpoint's own failure shape, e.g. an event id that is not there. */
	readonly errors: string[];
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			messages?: string[];
			errors?: string[];
			method?: string;
		} = {},
	) {
		// The cause stays attached: it holds no request body and no key. Demio
		// keeps both credentials in headers, which ApiError never prints, and its
		// failures carry nothing beyond the message arrays copied below.
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DemioAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status ?? 0;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.messages = options.messages ?? readMessages(cause?.body);
		this.errors = options.errors ?? readErrors(cause?.body);
	}

	/** True for the per-minute rate limit and the spent daily allowance. */
	get isRateLimit(): boolean {
		return this.status === 417;
	}

	/** True only for the allowance, which no retry can restore today. */
	get isDailyLimit(): boolean {
		return this.messages.some((message) =>
			message.toLowerCase().includes(DAILY_LIMIT_MARKER),
		);
	}
}

// unknown: the text is read from whichever array Demio filled, and the status
// alone identifies neither, because 403 serves both shapes.
function describeDemioError(
	status: number,
	body: unknown,
	fallback: string,
): string {
	const text =
		[...readMessages(body), ...readErrors(body)].join('; ') || fallback;
	return `Demio ${status}: ${text}`;
}

export type DemioQuery = Record<string, string | number | boolean | undefined>;

export type DemioRequest = {
	method: 'GET' | 'PUT' | 'POST';
	path: string;
	query?: DemioQuery;
	// unknown: the operation's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the answer with the operation's zod output schema, and
// Demio's success shapes differ per endpoint, so only the schema knows the type.
export async function makeDemioRequest(
	credentials: DemioCredentials,
	{ method, path, query, body }: DemioRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DEMIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Both credentials are header keys, so they belong in HEADERS. TOKEN
		// would render as `Authorization: Bearer`, which Demio ignores.
		HEADERS: {
			Accept: 'application/json',
			'Api-Key': credentials.apiKey,
			'Api-Secret': credentials.apiSecret,
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
		// unknown: the response body's type comes from the calling operation's
		// output schema, which parses it straight after this returns.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DEMIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DemioAPIError(
				describeDemioError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (a fetch timeout) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new DemioAPIError(error.message, { cause: error, method });
		}
		throw new DemioAPIError('Unknown Demio error', { method });
	}
}

/** The transport's error type, re-exported so tests can assert on it. */
export { ApiError };
