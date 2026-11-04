import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class MagicHourAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MagicHourAPIError';
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

/**
 * The transport's own retry loop is disabled (`maxRetries: 0`) so the plugin's
 * error handlers are the single owner of retries (core drives them in
 * `core/endpoints/bind.ts`); this keeps a sustained 429 to one request per
 * handler attempt instead of stacking the transport's default retries on top.
 * Only 429 is treated as a rate limit: there is no 5xx retry handler, and
 * retrying a 503 would re-send non-idempotent generation requests that may
 * already have been accepted and billed.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
	isRateLimitError: (status) => status === 429,
};

// Magic Hour serves every documented operation from this origin; each path is
// prefixed with `/v1` (https://docs.magichour.ai/api-reference/overview).
export const MAGIC_HOUR_API_BASE = 'https://api.magichour.ai';

export async function makeMagicHourRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic
		// over a JSON record instead of a closed per-endpoint union.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// An explicitly empty key means no credentials are configured. Every Magic
	// Hour operation is scoped to the account that owns the API key, so fail
	// fast with Corsair's missing-auth error instead of sending a keyless
	// request the provider would answer with 401.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('magichour', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: MAGIC_HOUR_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			// Docs: "All API requests must be authenticated by including your
			// API key in the Authorization header: Authorization: Bearer ...".
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
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

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: TRANSPORT_RETRY_CONFIG,
		});
	} catch (error) {
		// Provider failures already arrive as ApiError (with status/retryAfter
		// preserved for the error handlers); only non-Error throws need
		// wrapping.
		if (error instanceof Error) {
			throw error;
		}
		throw new MagicHourAPIError('Unknown error');
	}
}
