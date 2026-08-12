import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class TogglAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TogglAPIError';
	}
}

const TOGGL_API_BASE = 'https://api.track.toggl.com/api/v9';

/**
 * Toggl enforces roughly one request per second per API token per IP using a
 * leaky bucket, and answers with 429 once the bucket is full. It does not
 * document a Retry-After header, so the exponential backoff below is what
 * normally paces retries; the header name is declared so that a Retry-After is
 * still honoured if one is present.
 */
const TOGGL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Toggl authenticates with HTTP Basic, using the API token as the username and
 * the literal string `api_token` as the password.
 *
 * @see https://engineering.toggl.com/docs/authentication
 */
function buildAuthHeader(apiToken: string): string {
	const encoded = Buffer.from(`${apiToken}:api_token`).toString('base64');
	return `Basic ${encoded}`;
}

export async function makeTogglRequest<T>(
	endpoint: string,
	apiToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TOGGL_API_BASE,
		VERSION: '9',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: buildAuthHeader(apiToken),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: TOGGL_RATE_LIMIT_CONFIG,
	});
}
