import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * BigMailer's REST API - the only documented surface for this plugin.
 * @see https://docs.bigmailer.io/docs/getting-started-api
 */
const BIGMAILER_API_BASE = 'https://api.bigmailer.io/v1';

/**
 * Confirmed from `docs.bigmailer.io/docs/getting-started-api` (not guessed):
 * "by default accounts can perform 10 API calls per second" and are "limited
 * to making 4 API calls concurrently." Exceeding either returns HTTP 429.
 * BigMailer's docs do not name a `retry-after`-style header, so retries fall
 * back to the shared transport's default backoff rather than reading a
 * provider-specific header name.
 */
const BIGMAILER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	// BigMailer's docs name no custom rate-limit headers, only the documented
	// 10 req/s, 4-concurrent caps. `retry-after` is the one HTTP-standard
	// header safe to check for regardless.
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export class BigmailerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BigmailerAPIError';
	}
}

/**
 * `VERSION` only ever feeds `corsair/http`'s `{api-version}` URL-template
 * substitution - a mechanism this plugin's endpoint paths never use (none of
 * them contain that placeholder) - so its value has no effect on any request
 * this plugin sends. Set to `'1'` only because the base URL itself is `/v1`,
 * for an accurate config rather than because anything reads it.
 */
function buildConfig(apiKey: string): OpenAPIConfig {
	if (!apiKey.trim()) {
		throw new BigmailerAPIError('BigMailer API key is required', 401);
	}
	return {
		BASE: BIGMAILER_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		/**
		 * No `Content-Type` here, deliberately - confirmed by tracing
		 * `corsair/async-core/request.ts`'s `getHeaders`: `config.HEADERS` is
		 * spread into every request's headers unconditionally, before the
		 * per-request `mediaType`/body-shape logic runs, and that logic only
		 * fires when `options.body !== undefined`. The one multipart request
		 * this plugin sends (`formData`, not `body`) would otherwise inherit a
		 * hardcoded `application/json` header that `fetch` cannot override,
		 * silently breaking the multipart boundary. `makeBigmailerRequest`
		 * already sets `mediaType: 'application/json'` per JSON request, so
		 * `getHeaders` derives the right `Content-Type` there without this.
		 */
		HEADERS: {
			'X-API-Key': apiKey,
		},
	};
}

export type BigmailerRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	/**
	 * Set only for the one multipart endpoint this plugin has (uploading a
	 * suppression list's CSV) - mutually exclusive with `body`. Deliberately
	 * NOT combined with `mediaType: 'application/json'` below: `corsair/http`'s
	 * `getHeaders` only derives a `Content-Type` from `options.body`, so
	 * leaving `body` unset when `formData` is present lets `fetch` generate
	 * the correct `multipart/form-data; boundary=...` header itself, the same
	 * reasoning `strava/endpoints/uploads.ts` documents for its own upload.
	 */
	formData?: Record<string, unknown>;
};

function wrapError(error: unknown): BigmailerAPIError {
	if (error instanceof BigmailerAPIError) return error;
	if (error instanceof Error) {
		// The shared `request` helper throws `ApiError`, which carries `status`
		// and (when the server sent one) `retryAfter` in milliseconds. Read
		// structurally rather than importing `ApiError` for an `instanceof`
		// check, matching the Doppler plugin's `client.ts`.
		const carrier = error as unknown as {
			status?: unknown;
			retryAfter?: unknown;
		};
		const status =
			typeof carrier.status === 'number' ? carrier.status : undefined;
		const retryAfter =
			typeof carrier.retryAfter === 'number' ? carrier.retryAfter : undefined;
		return new BigmailerAPIError(error.message, status, retryAfter);
	}
	return new BigmailerAPIError('Unknown error');
}

/** Issues a request against the documented BigMailer REST API. */
export async function makeBigmailerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BigmailerRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;

	const requestOptions: ApiRequestOptions = formData
		? { method, url: endpoint, formData, query }
		: {
				method,
				url: endpoint,
				body: method === 'GET' || method === 'DELETE' ? undefined : body,
				mediaType: 'application/json',
				query,
			};

	try {
		return await request<T>(buildConfig(apiKey), requestOptions, {
			rateLimitConfig: BIGMAILER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw wrapError(error);
	}
}

export { BIGMAILER_RATE_LIMIT_CONFIG, BIGMAILER_API_BASE };
