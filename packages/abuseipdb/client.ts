import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx AbuseIPDB response. Preserves the HTTP status,
 * response body, and rate-limit headers from the underlying `ApiError` so
 * `error-handlers.ts` can inspect them without re-requesting.
 */
export class AbuseIPDBAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/**
	 * The raw response body. Deliberately `unknown` — AbuseIPDB returns
	 * JSON:API-shaped errors (`{ errors: [{ detail, status, source }] }`)
	 * that don't map to a single known schema, so callers narrow it
	 * themselves (see error-handlers.ts).
	 */
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AbuseIPDBAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists
// for this state, so message matching is the only handle available; kept
// narrow on purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only
 * ever configure the key via plugin options and never touch the key
 * manager, and must resolve to "no stored key" rather than abort the
 * request.
 *
 * Anything else thrown (decryption failure, database error, ...) is a real
 * operational problem, not an absent key, and must propagate.
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

/**
 * AbuseIPDB API v2 base URL. All endpoints live under `/api/v2`.
 */
export const ABUSEIPDB_API_BASE = 'https://api.abuseipdb.com/api/v2';

/**
 * Performs a request against the AbuseIPDB API v2.
 *
 * Auth: the API key is sent in the `Key` header (the recommended method —
 * AbuseIPDB logs the query string, so the `key` query parameter is avoided).
 *
 * GET endpoints take query parameters; the REPORT endpoint expects
 * `application/x-www-form-urlencoded` form fields, which are passed as
 * `formBody` and serialized with `URLSearchParams`.
 */
const READ_MAX_ATTEMPTS = 6;

const NO_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

const MAX_RETRY_DELAY_MS = 30_000;

function isRetryableAbuseError(error: unknown): error is AbuseIPDBAPIError {
	if (!(error instanceof AbuseIPDBAPIError) || error.status === undefined) {
		return false;
	}
	return error.status >= 500;
}

function retryDelayMs(error: AbuseIPDBAPIError, attempt: number): number {
	const fromHeader =
		typeof error.retryAfter === 'number' && error.retryAfter >= 0
			? error.retryAfter
			: 2 ** attempt * 1000;
	return Math.min(fromHeader, MAX_RETRY_DELAY_MS);
}

export async function makeAbuseIPDBRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
		formBody?: Record<string, string | number | undefined>;
		retries?: boolean;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		query,
		formBody,
		retries = method === 'GET',
	} = options;

	const config: OpenAPIConfig = {
		BASE: ABUSEIPDB_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Key: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body: formBody
			? new URLSearchParams(
					Object.entries(formBody)
						.filter(([, value]) => value !== undefined)
						.map(([key, value]) => [key, String(value)] as [string, string]),
				).toString()
			: undefined,
		mediaType: formBody ? 'application/x-www-form-urlencoded' : undefined,
	};

	const send = async (): Promise<T> => {
		try {
			return await request<T>(config, requestOptions, {
				rateLimitConfig: NO_RETRY,
			});
		} catch (error) {
			if (error instanceof ApiError) {
				throw new AbuseIPDBAPIError(error.message, error.status, {
					cause: error,
				});
			}
			if (error instanceof Error) {
				throw new AbuseIPDBAPIError(error.message, undefined, {
					cause: error,
				});
			}
			throw new AbuseIPDBAPIError('Unknown error');
		}
	};

	if (!retries) {
		return await send();
	}

	let lastError: unknown;
	for (let attempt = 0; attempt < READ_MAX_ATTEMPTS; attempt++) {
		try {
			return await send();
		} catch (error) {
			lastError = error;
			if (!isRetryableAbuseError(error) || attempt === READ_MAX_ATTEMPTS - 1) {
				throw error;
			}
			await new Promise((resolve) =>
				setTimeout(resolve, retryDelayMs(error, attempt)),
			);
		}
	}
	throw lastError;
}
