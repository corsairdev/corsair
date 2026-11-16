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

/**
 * The only calls that are safe to replay.
 *
 * Adyntel bills one credit per scrape, and every operation except this one
 * scrapes: they start a job, spend a credit, or do both. A retry after an
 * unknown outcome therefore pays twice for the same data, so the retry budget
 * belongs only to calls the provider documents as free. `googleShoppingStatus`
 * is the one endpoint whose docs state "You will not be charged".
 */
const RETRIABLE_OPERATIONS = new Set(['googleShoppingStatus']);

function isRead(error: AdyntelAPIError): boolean {
	return error.operation !== undefined && READ_OPERATIONS.has(error.operation);
}

/** True only for a read the provider never charges for, so a repeat is free. */
function isReplayableRead(error: AdyntelAPIError): boolean {
	return (
		isRead(error) &&
		error.operation !== undefined &&
		RETRIABLE_OPERATIONS.has(error.operation)
	);
}

export const errorHandlers = {
	// Adyntel does not publish a rate limit. A 429 is retried only for a call the
	// provider never charges for: a billed scrape has already spent its credit
	// by the time it answers, so a repeat pays twice.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && error.isRateLimit,
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof AdyntelAPIError ? error.retryAfter : undefined;
			const retriable =
				error instanceof AdyntelAPIError && isReplayableRead(error);
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
	// 402: the account is out of credits, and `/domain-keywords` reports the same
	// condition inside a 500. Retrying spends nothing because there is nothing
	// to spend, and the caller has to top up to make progress.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && error.isInsufficientCredits,
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
	// A 5xx may mean the scrape ran and the response was lost. Only a free call
	// is replayed; anything billed would charge for a second scrape.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && (error.status ?? 0) >= 500,
		handler: async (error: Error) => {
			// A 5xx can arrive after the scrape ran and the credit was spent.
			const retriable =
				error instanceof AdyntelAPIError && isReplayableRead(error);
			return {
				maxRetries: retriable ? 2 : 0,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// A network failure may have happened after Adyntel received the request, so
	// a billed call is not replayed here. Two other failures have no HTTP status
	// and must not reach this handler at all: a provider rejection (a non-zero
	// code with a 200) and a validation error.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError &&
			error.status === undefined &&
			!error.isProviderRejection,
		handler: async (error: Error) => {
			// The request may have reached Adyntel before the connection dropped.
			const retriable =
				error instanceof AdyntelAPIError && isReplayableRead(error);
			return {
				maxRetries: retriable ? 2 : 0,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// The API answered 200 and reported a failure in the body. A retry sends the
	// same request, and the scrape has already been charged.
	PROVIDER_REJECTION_ERROR: {
		match: (error: Error) =>
			error instanceof AdyntelAPIError && error.isProviderRejection,
		handler: async () => ({ maxRetries: 0 }),
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
	// Typed as the real handler map, not Record<string, unknown>: the caller's
	// keys are already this type, and the loop below only adds builtin entries
	// that the caller did not already provide.
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, handler] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = handler;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
