import type { CorsairErrorHandler } from 'corsair/core';
import { SpotlightrAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SpotlightrAPIError ? error.status : undefined;
}

/**
 * Spotlightr documents no error taxonomy beyond a plain-text 401 and the web
 * server's HTML 500. A wrong key answers 401 `"Unauthorized."`, a missing one
 * answers 401 `"Missing token."`, so both land in AUTH_ERROR by status.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof SpotlightrAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SpotlightrAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 for a missing, wrong or revoked key. The same request fails again.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 for a video or project the key's account cannot reach, 400 for a body
	// Spotlightr rejects, 404 for an unknown route or id, and a Zod rejection.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 403 ||
				status === 404 ||
				status === 405
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Spotlightr returns an HTML 500 page on a bad `vooKey` for some routes, so
	// a 5xx there is not necessarily transient. Only reads are replayed:
	// createVideo and the uploads are not idempotent.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SpotlightrAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
// keys come first and DEFAULT stays last.
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
