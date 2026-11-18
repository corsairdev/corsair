import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class KeenableAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'KeenableAPIError';
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

export const KEENABLE_API_BASE = 'https://api.keenable.ai';

// Transport retries are disabled so that rate-limit retries are handled solely
// by Corsair's plugin-level errorHandlers (avoiding stacked retries multiplying requests).
const KEENABLE_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export async function makeKeenableRequest<T>(
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

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Public callers pass undefined
	// instead, so only keyed requests hit this gate — they fail fast with
	// Corsair's missing-auth error instead of sending a keyless request.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('keenable', 'api_key');
	}

	// The API key goes in X-API-Key; the docs also accept an
	// `Authorization: Bearer keen_...` header, and X-API-Key wins if both are
	// sent (docs /authentication).
	const authHeaders: Record<string, string> = apiKey
		? { 'X-API-Key': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: KEENABLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
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
			rateLimitConfig: KEENABLE_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		// ApiError carries status/retryAfter for the error handlers, so it is
		// rethrown untouched; only non-Error throwables get wrapped.
		if (error instanceof Error) {
			throw error;
		}
		throw new KeenableAPIError('Unknown error');
	}
}
