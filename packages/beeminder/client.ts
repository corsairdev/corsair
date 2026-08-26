import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Official API base. Do not drop `www` — Beeminder does not forward POST
 * params on the redirect.
 *
 * @see https://api.beeminder.com
 */
const BEEMINDER_API_BASE = 'https://www.beeminder.com/api/v1';

const BEEMINDER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type BeeminderAuthParam = 'auth_token' | 'access_token';

export type BeeminderRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, string | number | boolean>;
	query?: Record<string, string | number | boolean | undefined>;
	/**
	 * Personal tokens use `auth_token`; OAuth tokens use `access_token`.
	 * Both are also sent as `Authorization: Bearer`.
	 */
	authParam?: BeeminderAuthParam;
};

function buildConfig(authToken: string): OpenAPIConfig {
	return {
		BASE: BEEMINDER_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: authToken,
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

function toFormBody(body: Record<string, string | number | boolean>): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		if (value === undefined) continue;
		params.set(key, String(value));
	}
	return params.toString();
}

/**
 * Authenticated Beeminder request.
 *
 * Docs: personal tokens as `auth_token` query/body; OAuth as `access_token`
 * or `Authorization: Bearer`. POST examples use form fields, not JSON.
 */
export async function makeBeeminderRequest<T>(
	endpoint: string,
	authToken: string,
	options: BeeminderRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, authParam = 'auth_token' } = options;
	const isWrite = method === 'POST' || method === 'PUT';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite && body ? toFormBody(body) : undefined,
		mediaType: isWrite ? 'application/x-www-form-urlencoded' : undefined,
		query: { ...query, [authParam]: authToken },
	};

	return await request<T>(buildConfig(authToken), requestOptions, {
		rateLimitConfig: BEEMINDER_RATE_LIMIT_CONFIG,
	});
}

export { BEEMINDER_API_BASE, BEEMINDER_RATE_LIMIT_CONFIG };
