import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NETHUNT_API_BASE = 'https://nethunt.com/api/v1';

// Retries belong to error-handlers.ts. NetHunt documents no Retry-After, so the
// header name is kept only so a proxy that sends one is honoured.
const NETHUNT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * NetHunt authenticates with HTTP Basic, where the username is the account's
 * email and the password is the API key. `corsair/http` sends Basic only when
 * both USERNAME and PASSWORD are non-empty, which they are here, so the header
 * is built from the pair rather than passed in directly.
 */
export type NethuntCredentials = { email: string; apiKey: string };

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * NetHunt's documented error answers are thin. A bad credential on any route is
 * a **401 with a plain-text body** ("Your email address or API key does not
 * appear to be valid"), not JSON. A missing record is a 404 with an empty body,
 * and the success bodies are JSON. So a JSON body is the only reliable signal
 * that the error came from the API rather than the edge.
 */
export class NethuntAPIError extends Error {
	readonly status?: number;
	/** The provider's own `message`, when the body was JSON. */
	readonly detail?: string;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			detail?: string;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NethuntAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** NetHunt answers a bad email/key pair with 401, not 403. */
	get isAuthError(): boolean {
		return this.status === 401;
	}
}

// unknown: see NethuntAPIError.
export function describeNethuntError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'message') ??
		readString(record, 'error') ??
		// A 401 body is plain text and arrives as a string.
		(typeof body === 'string' && body.length > 0 ? body : undefined) ??
		fallback;
	const label = status === undefined ? '' : `NetHunt ${status}: `;
	return `${label}${text}`;
}

/**
 * A query value may be an array: `corsair/http` repeats the key for each entry,
 * which is how NetHunt's repeatable `fieldName` filter is sent.
 */
export type NethuntQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type NethuntRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: NethuntQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204.
export async function makeNethuntRequest(
	credentials: NethuntCredentials,
	{ method, path, query, body }: NethuntRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NETHUNT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Both must be non-empty for corsair/http to send the Basic header.
		USERNAME: credentials.email,
		PASSWORD: credentials.apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NETHUNT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new NethuntAPIError(
				describeNethuntError(error.status, error.body, error.message),
				{
					status: error.status,
					detail: readString(asRecord(error.body), 'message'),
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NethuntAPIError(error.message, { cause: error, method });
		}
		throw new NethuntAPIError('Unknown NetHunt error', { method });
	}
}

/** Encodes one path segment. Folder ids are hex, but names can repeat. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
