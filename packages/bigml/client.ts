import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * BigML's REST API - confirmed from the official Python SDK
 * (`bigmlcom/python`, `bigml/domain.py`): base domain `bigml.io`, API
 * version segment `andromeda`.
 * @see https://bigml.com/api
 */
const BIGML_API_BASE = 'https://bigml.io/andromeda';

/**
 * BigML documents no fixed request-per-second cap the way BigMailer does;
 * rate limiting is plan-tiered and returns 429 with a JSON error body, not a
 * documented `retry-after`-style header (confirmed from the SDK's
 * `HTTP_TOO_MANY_REQUESTS` handling). Retries fall back to the shared
 * transport's default backoff.
 */
const BIGML_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	// BigML documents no custom rate-limit headers, only a 429 with a JSON
	// error body. `retry-after` is the one HTTP-standard header safe to check
	// for regardless, the same reasoning BigMailer's client.ts uses.
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export class BigmlAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BigmlAPIError';
	}
}

function buildConfig(): OpenAPIConfig {
	return {
		BASE: BIGML_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};
}

export type BigmlRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	/** Merged with the mandatory `username`/`api_key` pair. */
	query?: Record<string, string | number | boolean | undefined>;
};

function wrapError(error: unknown): BigmlAPIError {
	if (error instanceof BigmlAPIError) return error;
	if (error instanceof Error) {
		const carrier = error as unknown as {
			status?: unknown;
			retryAfter?: unknown;
		};
		const status =
			typeof carrier.status === 'number' ? carrier.status : undefined;
		const retryAfter =
			typeof carrier.retryAfter === 'number' ? carrier.retryAfter : undefined;
		return new BigmlAPIError(error.message, status, retryAfter);
	}
	return new BigmlAPIError('Unknown error');
}

/**
 * Issues a request against the documented BigML REST API.
 *
 * BigML auth is a `username`+`api_key` pair sent as query-string parameters
 * on every request (confirmed from `bigmlconnection.py`'s
 * `_add_credentials` - there is no header-based alternative). `username`
 * travels as this plugin's declared `account` field (see `index.ts`'s
 * `bigmlAuthConfig`, mirroring Twilio's `accountSid`); `apiKey` is the
 * primary stored key.
 */
export async function makeBigmlRequest<T>(
	endpoint: string,
	username: string,
	apiKey: string,
	options: BigmlRequestOptions = {},
): Promise<T> {
	if (!username.trim() || !apiKey.trim()) {
		throw new BigmlAPIError('BigML username and API key are required', 401);
	}

	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType: 'application/json',
		query: { ...query, username, api_key: apiKey },
	};

	try {
		return await request<T>(buildConfig(), requestOptions, {
			rateLimitConfig: BIGML_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw wrapError(error);
	}
}

export { BIGML_RATE_LIMIT_CONFIG, BIGML_API_BASE };
