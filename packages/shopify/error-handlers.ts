import type { CorsairErrorHandler } from 'corsair/core';
import { ShopifyAPIError, throttleDelayMs } from './client';
import { ShopifyUserError } from './endpoints/call';

/** How long to wait when Shopify throttles and reports no bucket detail. */
export const DEFAULT_THROTTLE_DELAY_MS = 2000;

function isShopifyError(error: Error): error is ShopifyAPIError {
	return error instanceof ShopifyAPIError;
}

/**
 * Core takes the first handler whose `match` passes, in key order, and retries
 * only when the handler returns `maxRetries > 0`. Shopify answers most failures
 * with HTTP 200 and a body code, so matching on `status` alone would misroute
 * every one of them.
 */
export const errorHandlers = {
	// A rejected write is permanent: the same input fails again. Never retried,
	// and kept ahead of RATE_LIMIT_ERROR because it also carries status 200.
	USER_ERROR: {
		match: (error: Error) => error instanceof ShopifyUserError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Out of cost points. Shopify rejects the query before running it, so
	// replaying cannot apply a write twice even for a mutation.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			isShopifyError(error) &&
			(error.code === 'THROTTLED' || error.status === 429),
		handler: async (error: Error) => {
			const delay = isShopifyError(error) ? error.retryAfter : undefined;
			return {
				maxRetries: 3,
				headersRetryAfterMs: delay ?? DEFAULT_THROTTLE_DELAY_MS,
			};
		},
	},
	// The single query asked for more cost than one call may use. Retrying the
	// same query is pointless; the caller has to page or ask for fewer fields.
	MAX_COST_EXCEEDED: {
		match: (error: Error) =>
			isShopifyError(error) && error.code === 'MAX_COST_EXCEEDED',
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			isShopifyError(error) &&
			(error.status === 401 || error.status === 403) &&
			error.code !== 'SHOP_INACTIVE',
		handler: async () => ({ maxRetries: 0 }),
	},
	// The shop is frozen, usually for repeated rate-limit breaches. A token
	// refresh will not help, so this is reported instead of looking like auth.
	SHOP_INACTIVE: {
		match: (error: Error) =>
			isShopifyError(error) && error.code === 'SHOP_INACTIVE',
		handler: async () => ({ maxRetries: 0 }),
	},
	// Shopify's own internal failure. Safe to retry a read; a write is only
	// replayed when the plugin marked it replay-safe, which a mutation never is.
	SERVER_ERROR: {
		match: (error: Error) =>
			isShopifyError(error) &&
			((error.status !== undefined && error.status >= 500) ||
				error.code === 'INTERNAL_SERVER_ERROR'),
		handler: async (error: Error) => {
			const safe = isShopifyError(error) && error.replaySafe;
			return { maxRetries: safe ? 2 : 0 };
		},
	},
	// A reset or abort never reached Shopify, so replaying it is safe even for
	// a write.
	TRANSPORT_ERROR: {
		match: (error: Error) => isShopifyError(error) && error.transportFailure,
		handler: async () => ({ maxRetries: 2 }),
	},
	// Anything else, including an unrecognised body code. Kept last: core stops
	// at the first match.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Caller keys first, then builtins the caller did not name, then DEFAULT last.
 * A plain spread keeps the caller's value but the builtin's position, and core
 * matches in key order, so a caller handler for a status no builtin covers
 * would never run.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}

export { throttleDelayMs };
