import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { getReplayMeta, ShopifyAPIError, throttleDelayMs } from './client';
import { ShopifyUserError } from './endpoints/call';

/** How long to wait when Shopify throttles and reports no bucket detail. */
export const DEFAULT_THROTTLE_DELAY_MS = 2000;

function isShopifyError(error: Error): error is ShopifyAPIError {
	return error instanceof ShopifyAPIError;
}

/**
 * True when the request can be sent again without changing provider state.
 *
 * Core's `ApiError` passes through unchanged (R8), so replay safety cannot live
 * on it. The client records it in a WeakMap keyed by the error, and this reads
 * it back; an error with no record is treated as unsafe, because replaying a
 * write that may already have landed is worse than failing.
 */
function isReplaySafe(error: Error): boolean {
	const meta = getReplayMeta(error);
	if (meta) return meta.replaySafe;
	return isShopifyError(error) && error.replaySafe;
}

/** True when the request never reached Shopify, whatever the verb. */
function isTransportFailure(error: Error): boolean {
	const meta = getReplayMeta(error);
	if (meta) return meta.transportFailure;
	return isShopifyError(error) && error.transportFailure;
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
	//
	// Two shapes arrive here: a `THROTTLED` body code, and a plain HTTP 429 from
	// the gateway, which core raises as its own `ApiError` and which therefore
	// has no `code`. Matching only the plugin's error would let an HTTP 429 fall
	// through to DEFAULT with no wait at all.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 429;
			return (
				isShopifyError(error) &&
				(error.code === 'THROTTLED' || error.status === 429)
			);
		},
		handler: async (error: Error) => {
			// `retryAfter` is on both types, and it is the delay Shopify asked
			// for; the fixed fallback only applies when neither supplied one.
			const delay =
				error instanceof ApiError || isShopifyError(error)
					? error.retryAfter
					: undefined;
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
		match: (error: Error) => {
			// Core raises its own ApiError for an HTTP 401/403 body.
			if (error instanceof ApiError) {
				return error.status === 401 || error.status === 403;
			}
			return (
				isShopifyError(error) &&
				(error.status === 401 || error.status === 403) &&
				error.code !== 'SHOP_INACTIVE' &&
				// A field-level denial is not an auth failure: the token was
				// accepted and the caller simply cannot read that field.
				error.code !== 'ACCESS_DENIED'
			);
		},
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
	// replayed when the operation marked itself replay-safe.
	SERVER_ERROR: {
		match: (error: Error) => {
			// Core's ApiError and the plugin's own error both carry a status.
			const status =
				error instanceof ApiError
					? error.status
					: isShopifyError(error)
						? error.status
						: undefined;
			return (
				(status !== undefined && status >= 500) ||
				(isShopifyError(error) && error.code === 'INTERNAL_SERVER_ERROR')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: isReplaySafe(error) ? 2 : 0,
		}),
	},
	// A transport failure for a read can be sent again. For a write it cannot,
	// because Shopify may have applied the request before the connection
	// dropped: replaying it could adjust stock twice or create a second
	// product. R8 permits a network retry only for reads and replayable writes.
	TRANSPORT_ERROR: {
		match: (error: Error) => isTransportFailure(error),
		handler: async (error: Error) => ({
			maxRetries: isReplaySafe(error) ? 2 : 0,
		}),
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
