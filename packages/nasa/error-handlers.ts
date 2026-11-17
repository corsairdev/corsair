import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { nasaErrorCode } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// NASA documents no retry contract, so the handlers follow its limits. The
// errors are core's ApiError: 429 is the key's hourly limit (DEMO_KEY also has
// a daily one), 403 is a bad or missing key, and a 5xx on a read is worth one
// more try because every wrapped route is a GET.
export const errorHandlers = {
	// api.nasa.gov answers 429 with `OVER_RATE_LIMIT`. Core's request() already
	// retried it three times, so it is not replayed again here: the window is an
	// hour (a day for DEMO_KEY), and another try only spends a request.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || nasaErrorCode(error) === 'OVER_RATE_LIMIT',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 with API_KEY_INVALID or API_KEY_MISSING. A 401 comes from a gateway in
	// front of api.nasa.gov. Retrying cannot fix a key.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = nasaErrorCode(error);
			return (
				status === 401 ||
				status === 403 ||
				code === 'API_KEY_MISSING' ||
				code === 'API_KEY_INVALID'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// science.nasa.gov answers 400 rest_invalid_param for a date code the feed
	// does not have, and images-api.nasa.gov answers 404 for an unknown asset.
	// Neither can succeed on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			const status = statusOf(error);
			return status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// NASA answers 500 when a provider service is down, including EONET's HTML
	// page for an unknown event id and EPIC's for a malformed date. Retrying a
	// read costs one call; no wrapped route writes anything.
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
