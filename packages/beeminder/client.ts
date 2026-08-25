import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * The Beeminder API base URL.
 *
 * @see https://api.beeminder.com
 */
const BEEMINDER_API_BASE = 'https://www.beeminder.com/api/v1';

/**
 * Beeminder allows 100 requests per minute per user.
 * Observed rate limit: 100 requests per minute, with Retry-After header on 429.
 */
const BEEMINDER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type BeeminderRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/**
	 * The JSON request body, serialised as given.
	 */
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
};

/**
 * Raised when a call needs the account's username and none was available.
 */
export class BeeminderUsernameMissingError extends Error {
	constructor() {
		super(
			'Beeminder requires the account username alongside the auth token. Set ' +
				'`username` in the plugin options, or store one under the `username` key.',
		);
		this.name = 'BeeminderUsernameMissingError';
	}
}

/**
 * A failure from a raw-`fetch` path.
 *
 * The shared transport's `ApiError` carries status and parsed `Retry-After`;
 * this custom error class carries the same for non-JSON paths.
 */
export class BeeminderHttpError extends Error {
	constructor(
		message: string,
		readonly status: number,
		/** Milliseconds to wait, from `Retry-After`, when the server sent one. */
		readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BeeminderHttpError';
	}
}

/**
 * Reads `Retry-After` into milliseconds.
 */
function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number.parseFloat(header);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return Math.ceil(seconds * 1000);
}

/**
 * Builds the request configuration for Beeminder.
 *
 * Beeminder accepts `Authorization: Bearer <token>` for access tokens.
 * Personal auth tokens can also be sent as a query parameter `auth_token=...`,
 * but using the header is preferred.
 */
function buildConfig(authToken: string): OpenAPIConfig {
	return {
		BASE: BEEMINDER_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: authToken,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};
}

/**
 * Issues an authenticated Beeminder request against the API.
 *
 * Beeminder returns errors as `{"errors": "message"}` with appropriate
 * HTTP status codes (400, 401, 403, 404).
 */
export async function makeBeeminderRequest<T>(
	endpoint: string,
	authToken: string,
	options: BeeminderRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	return await request<T>(buildConfig(authToken), requestOptions, {
		rateLimitConfig: BEEMINDER_RATE_LIMIT_CONFIG,
	});
}

export { BEEMINDER_API_BASE, BEEMINDER_RATE_LIMIT_CONFIG, parseRetryAfterMs };
