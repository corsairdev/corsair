import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx TimeCamp response. The HTTP status is preserved
 * from the underlying `ApiError` so `error-handlers.ts` can classify without
 * re-issuing the request.
 */
export class TimecampAPIError extends Error {
	public readonly status?: number;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'TimecampAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

// Matches only corsair's "no DEK on this account" state, which is a valid
// configuration for accounts that pass the key through plugin options and
// never touch the key manager. Kept narrow so it cannot swallow a real fault.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads the stored API key, treating "this account has no encryption key" as
 * "no stored key" rather than an error. Anything else propagates.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/** TimeCamp's REST API v1 root. */
export const TIMECAMP_API_BASE = 'https://app.timecamp.com/third_party/api';

/**
 * Retrying is owned by the plugin's error policy (`error-handlers.ts`), not by
 * the transport.
 *
 * Left unset, `request` applies its own default retries before the policy
 * starts a second sequence, so the two compound: one operation issues several
 * times the intended number of requests and stacks two independent backoffs.
 * The transport therefore parses `Retry-After` and surfaces it on the error,
 * but never retries.
 */
export const TIMECAMP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Performs a request against the TimeCamp API.
 *
 * Auth: the account API token is sent as `Authorization: Bearer <token>`.
 * TimeCamp also accepts an `api_token` query parameter, which is avoided here
 * so the credential never lands in a URL (and therefore in access logs).
 */
export async function makeTimecampRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TIMECAMP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' ? undefined : body,
		mediaType: method === 'GET' ? undefined : 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TIMECAMP_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TimecampAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new TimecampAPIError(error.message, undefined, { cause: error });
		}
		throw new TimecampAPIError('Unknown error');
	}
}
