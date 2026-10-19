import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class MrscraperAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MrscraperAPIError';
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists for
// this state, so message matching is the only handle available; kept narrow on
// purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only ever
 * configure the key via plugin options and never touch the key manager, and
 * must resolve to "no stored key" rather than abort the call. Anything else
 * thrown (decryption failure, database error, ...) is a real operational
 * problem, not an absent key, and must propagate.
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

/** Scraper API base — the synchronous scrape endpoints (fetch/markdown/…). */
export const MRSCRAPER_API_BASE = 'https://api.mrscraper.com';

/** Platform API base — account, scrapers, results and analytics. */
export const MRSCRAPER_PLATFORM_API_BASE =
	'https://api.app.mrscraper.com/api/v1';

// Scrapes and reruns run for minutes, and the docs allow a per-request
// `timeout` up to ~2000s, so the transport deadline sits well above that.
const MRSCRAPER_REQUEST_TIMEOUT_MS = 1_800_000;

/**
 * The transport's own retry loop is disabled (`maxRetries: 0`) so the plugin's
 * error handlers are the single owner of retries (core drives them in
 * `core/endpoints/bind.ts`); this keeps a sustained 429 to one request per
 * handler attempt instead of stacking the transport's default retries on top.
 * `isRateLimitError` also treats 503 as retryable so the transport still
 * attaches `Retry-After` to the `ApiError` for service-unavailable responses,
 * which the 503 handler needs.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
	isRateLimitError: (status) => status === 429 || status === 503,
};

export type MrscraperRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Bodies are endpoint-specific JSON (already validated by the zod input
	// schemas before send), so the transport stays generic over a JSON record.
	body?: Record<string, unknown>;
	// Query values are scalars or nested filter objects (the transport
	// serializes those as `filters[scraperId]=…`), so this stays generic too.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	// Defaults to the Platform API base; scrape.* operations pass the Scraper
	// API base explicitly.
	base?: string;
	// The Scraper API requires the key both as the `x-api-token` header and a
	// `token` query param.
	includeTokenQuery?: boolean;
};

export async function makeMrscraperRequest<T>(
	endpoint: string,
	apiKey: string,
	options: MrscraperRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers,
		base = MRSCRAPER_PLATFORM_API_BASE,
		includeTokenQuery = false,
	} = options;

	// An empty key means no credentials are configured. The keyBuilder throws
	// AuthMissingError for a missing stored key, but this fast-fail guard still
	// covers a key that resolves empty by any other route. Every MrScraper
	// endpoint requires auth, so fail fast with Corsair's missing-auth error
	// instead of sending a keyless request.
	if (apiKey.length === 0) {
		throw new AuthMissingError('mrscraper', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: MRSCRAPER_REQUEST_TIMEOUT_MS,
		HEADERS: {
			'Content-Type': 'application/json',
			// MrScraper authenticates with `x-api-token`, not `Authorization`.
			'x-api-token': apiKey,
			...(headers ?? {}),
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
		query: includeTokenQuery ? { ...query, token: apiKey } : query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TRANSPORT_RETRY_CONFIG,
		});
	} catch (error) {
		// Rethrow untouched so ApiError status/retryAfter reach errorHandlers.
		if (error instanceof Error) {
			throw error;
		}
		throw new MrscraperAPIError('Unknown error');
	}
}
