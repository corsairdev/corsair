import type { CorsairErrorHandler } from 'corsair/core';
import { NasaAPIError } from './client';

// NASA documents no retry contract, so the handlers follow its limits: 429 is
// the hourly key limit and clears on its own, 403 is a bad or missing key, and
// a 5xx on a read is worth one more try because every wrapped route is a GET.
export const errorHandlers = {
	// api.nasa.gov enforces 1,000 requests an hour per key and 30 an hour for
	// DEMO_KEY, then answers 429 with `OVER_RATE_LIMIT`. The window is an hour,
	// so a short retry cannot succeed and only burns another call.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof NasaAPIError && error.isRateLimit,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 with API_KEY_INVALID or API_KEY_MISSING. Retrying cannot fix a key.
	AUTH_ERROR: {
		match: (error: Error) => error instanceof NasaAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// science.nasa.gov answers 400 rest_invalid_param for a date code the feed
	// does not have, and images-api.nasa.gov answers 404 for an unknown asset.
	// Neither can succeed on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NasaAPIError &&
				(error.status === 400 || error.status === 404)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// NASA answers 500 when a provider service is down, including EONET's HTML
	// page for an unknown event id and EPIC's for a malformed date. Retrying a
	// read costs one call; no wrapped route writes anything.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NasaAPIError && (error.status ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys go first, then any builtin they did not name, then one DEFAULT.
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
