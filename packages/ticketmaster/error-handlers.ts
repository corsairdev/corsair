import type { CorsairErrorHandler } from 'corsair/core';
import { TicketmasterAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TicketmasterAPIError ? error.status : undefined;
}

// Status reference:
// https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
// and https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
export const errorHandlers = {
	// 429 once the key passes 5 calls a second or 5,000 calls a day. Every call
	// in this plugin is a GET, so a replay is always safe.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TicketmasterAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TicketmasterAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 for a wrong or deleted key. `steps.oauth.v2.FailedToResolveAPIKey` is
	// what the gateway sends when the query parameter is missing altogether.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TicketmasterAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for a parameter Ticketmaster rejects, and the 404 for an unknown event,
	// attraction, venue or classification ID. Both need a different request.
	// 403 is a key without access to Discovery.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return status === 400 || status === 403 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Reads only, which is every call here, so a replay cannot duplicate a
	// side effect.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Combines the built-in handlers with any the caller supplies, keeping
 * `DEFAULT` last.
 *
 * Core runs the first handler whose `match` returns true, and `DEFAULT` matches
 * everything, so a `DEFAULT` merged in the middle would shadow every handler
 * after it. A caller-supplied `DEFAULT` replaces the built-in one; otherwise the
 * built-in stays.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
