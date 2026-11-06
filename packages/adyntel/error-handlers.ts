import type { CorsairErrorHandler } from 'corsair/core';
import { AdyntelAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof AdyntelAPIError ? error.status : undefined;
}

/**
 * Reads are recognised by operation name, not by HTTP method. Every Adyntel
 * endpoint is a POST, so `method === 'GET'` would leave all of them unretried.
 */
const READ_OPERATIONS = new Set([
	'facebookAds',
	'facebookAdSearch',
	'googleAds',
	'googleShopping',
	'googleShoppingStatus',
	'linkedinAds',
	'linkedinKeywordSearch',
	'tiktokAds',
	'tiktokSearch',
	'tiktokAdDetails',
	'domainKeywords',
]);

function isRead(error: AdyntelAPIError): boolean {
	return error.operation !== undefined && READ_OPERATIONS.has(error.operation);
}

export const errorHandlers = {
	// Adyntel does not publish a rate limit. A 429 with Retry-After is honoured;
	// without the header it backs off and tries again, which is safe for a read.
	// A write is not replayed: every Adyntel call that can 429 has already spent
	// credits by the time it answered, and a second scrape costs another.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && error.isRateLimit,
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof AdyntelAPIError ? error.retryAfter : undefined;
			const retriable = error instanceof AdyntelAPIError && isRead(error);
			return {
				maxRetries: retriable ? 3 : 0,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// 401: "Invalid username and api key". Both the key and the account email
	// are checked, so this is a wrong credential pair, not a transient failure.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the account is out of credits. Retrying spends nothing because there
	// is nothing to spend.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422: an unrecognised country, language or filter combination, rejected
	// before anything is scraped or charged. The same request fails again.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			statusOf(error) === 400 ||
			statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may mean the scrape ran and the response was lost. Only reads are
	// replayed; a write would charge for a second scrape.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && (error.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const retriable = error instanceof AdyntelAPIError && isRead(error);
			return {
				maxRetries: retriable ? 2 : 0,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// Network failures and fetch timeouts never reached Adyntel, so nothing was
	// scraped or charged and a retry is safe for reads. A write is not replayed:
	// a timeout can arrive after the scrape started and the credit was spent.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && error.status === undefined,
		handler: async (error: Error) => {
			const retriable = error instanceof AdyntelAPIError && isRead(error);
			return {
				maxRetries: retriable ? 2 : 0,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last even when a caller adds or overrides handlers. A caller's keys go first
 * so their handler wins over a builtin with an overlapping match, and a caller
 * handler that reuses a builtin's key replaces it in place.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: Record<string, unknown> = { ...userRest };
	for (const [name, handler] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = handler;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged as CorsairErrorHandler;
}
