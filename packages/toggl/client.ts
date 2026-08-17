import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const TOGGL_API_BASE = 'https://api.track.toggl.com/api/v9';

/**
 * Webhook subscriptions live on a separate service with its own version, not
 * under the Track v9 path.
 */
const TOGGL_WEBHOOKS_BASE = 'https://api.track.toggl.com/webhooks/api/v1';

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

/**
 * Issues a Toggl request with Basic auth, rate-limit retries and this plugin's
 * error handlers.
 *
 * `options.base` selects the host: the Track v9 API by default, or Toggl's
 * separate webhooks service for subscription management.
 */
export async function makeTogglRequest<T>(
	endpoint: string,
	apiToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		/** Target the webhooks service instead of the Track v9 API. */
		base?: 'track' | 'webhooks';
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, base = 'track' } = options;

	const config: OpenAPIConfig = {
		BASE: base === 'webhooks' ? TOGGL_WEBHOOKS_BASE : TOGGL_API_BASE,
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
