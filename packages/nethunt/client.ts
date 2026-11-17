import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const NETHUNT_API_BASE = 'https://nethunt.com/api/v1';

// Core's request() retries a 429 three times with backoff and honours a
// Retry-After header if one is sent, so the 429 handler in error-handlers.ts
// does not retry again. NetHunt documents no Retry-After.
const NETHUNT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 3,
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

/**
 * The keyBuilder returns the Basic credential as `email:apiKey`, so the
 * per-tenant pair reaches the client through `ctx.key` alone. The key itself
 * holds no colon, so the split is at the last one.
 */
export function joinCredentials({ email, apiKey }: NethuntCredentials): string {
	return `${email}:${apiKey}`;
}

export function splitCredentials(key: string): NethuntCredentials {
	const at = key.lastIndexOf(':');
	if (at <= 0 || at === key.length - 1) {
		throw new Error(
			'NetHunt needs the account email and the API key; set both before calling.',
		);
	}
	return { email: key.slice(0, at), apiKey: key.slice(at + 1) };
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

	// NetHunt answers a bad pair with a 401 plain-text body and has no error
	// codes, so core's ApiError goes through unchanged: its status is what the
	// handlers read.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: NETHUNT_RATE_LIMIT_CONFIG,
	});
}

/** Encodes one path segment. Folder ids are hex, but names can repeat. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
