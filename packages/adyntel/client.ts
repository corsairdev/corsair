import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Every endpoint is a POST under this host, with the path in the body's place. */
export const ADYNTEL_API_BASE = 'https://api.adyntel.com';

// A scrape can take most of a minute: Adyntel's own Google endpoint documents a
// 60 second sync limit, so corsair/http's 20 second default would abort calls
// that the API still answers.
const ADYNTEL_TIMEOUT_MS = 90_000;

// Adyntel puts the key and the account email in the JSON body, not in a header.
// Both are checked on every call, so a key alone is a 401.
const ADYNTEL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	return readString(record, 'message') ?? readString(record, 'detail');
}

function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Adyntel answers errors in two shapes. Most endpoints send
 * `{ message }`, the TikTok ones send `{ detail }`.
 *
 * Docs: https://docs.adyntel.com/openapi-docs/existing-endpoints
 */
export class AdyntelAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Adyntel sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The Adyntel operation name, e.g. `googleAds`, used to pick a retry. */
	readonly operation?: string;
	// unknown: error bodies are usually `{ message }` or `{ detail }`, but a
	// proxy in front of the API can answer with HTML or plain text.
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
			operation?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'AdyntelAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.operation = options.operation;
	}

	/** True for a 429. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: see AdyntelAPIError.
export function describeAdyntelError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const text = readMessage(body) ?? fallback;
	return status === undefined ? text : `Adyntel ${status}: ${text}`;
}

export type AdyntelRequest = {
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body: unknown;
	/** The API's own operationId; it names reads in error-handlers.ts. */
	operation: string;
};

// unknown: the response body has not been parsed by the output schema yet, and
// the same openness covers the `request` call inside.
export async function makeAdyntelRequest(
	credentials: { apiKey: string; email: string },
	{ path, body, operation }: AdyntelRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: ADYNTEL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: ADYNTEL_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/${path}`,
		// Credentials go last so an endpoint's own field cannot overwrite them.
		body: {
			...(asRecord(body) ?? {}),
			email: credentials.email,
			api_key: credentials.apiKey,
		},
		mediaType: 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: ADYNTEL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AdyntelAPIError(
				describeAdyntelError(error.status, error.body, error.message),
				{ cause: error, operation },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new AdyntelAPIError(error.message, {
				cause: error,
				method: 'POST',
				operation,
			});
		}
		throw new AdyntelAPIError('Unknown Adyntel error', {
			method: 'POST',
			operation,
		});
	}
}
