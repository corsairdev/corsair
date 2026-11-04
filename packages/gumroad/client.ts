import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GUMROAD_API_BASE = 'https://api.gumroad.com/v2';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const GUMROAD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type GumroadQuery = Record<string, string | undefined>;
export type GumroadForm = Record<string, string | undefined>;

/**
 * Gumroad documents JSON error bodies of `{ success: false, message }`, but
 * 401s arrive with an empty body (live-verified), so the raw body stays
 * untyped until a handler narrows it.
 */
export class GumroadAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	readonly method?: string;
	// unknown: error bodies are the JSON above, empty, or proxy text.
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
		this.name = 'GumroadAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method;
	}
}

// unknown: the body is untrusted until this guard runs.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: raw provider JSON; the message field is narrowed one key at a time.
export function describeGumroadError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message = asRecord(body)?.message;
	const text = typeof message === 'string' && message.length > 0 ? message : fallback;
	return status !== undefined ? `Gumroad ${status}: ${text}` : text;
}

/**
 * A 2xx response whose envelope says `success: false` is a failed call that
 * did not get an error status. Returns the error to throw, or undefined.
 */
// unknown: raw provider JSON before the endpoint's output schema parses it.
export function errorFromEnvelope(body: unknown): GumroadAPIError | undefined {
	const record = asRecord(body);
	if (record?.success !== false) return undefined;
	return new GumroadAPIError(
		describeGumroadError(undefined, record, 'Gumroad request failed'),
		{ body: record },
	);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGumroadRequest(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: GumroadQuery;
		form?: GumroadForm;
	} = {},
): Promise<unknown> {
	const { method = 'GET', query, form } = options;

	const config: OpenAPIConfig = {
		BASE: GUMROAD_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 20_000,
		TOKEN: apiKey,
	};

	// The licenses endpoints take form-encoded bodies per the docs' cURL;
	// values are pre-encoded here so the shared client sends the string
	// verbatim. Undefined (unset) fields never reach the wire.
	const bodyParts: string[] = [];
	for (const [key, value] of Object.entries(form ?? {})) {
		if (value !== undefined) {
			bodyParts.push(
				`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
			);
		}
	}
	const body = bodyParts.length > 0 ? bodyParts.join('&') : undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: form ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GUMROAD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new GumroadAPIError(
				describeGumroadError(error.status, error.body, error.message),
				{ cause: error, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new GumroadAPIError((error as Error).message, {
				cause: error as Error,
				method,
			});
		}
		throw new GumroadAPIError('Unknown Gumroad API error', { method });
	}
}
