import type { CorsairErrorHandler } from 'corsair/core';
import { TwelveDataAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TwelveDataAPIError ? error.status : undefined;
}

/**
 * Twelve Data's documented failure set: 400 for a malformed request or an
 * unknown symbol (often inside a 200 body), 401 for an invalid key, 403 for an
 * endpoint the plan does not include, 404 for an unknown route, and 429 for the
 * per-minute limit or an exhausted daily allowance.
 */
export const errorHandlers = {
	// 429 covers both the per-minute throughput limit and an exhausted daily
	// allowance. The provider documents waiting in both cases, and `Retry-After`
	// says how long.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TwelveDataAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TwelveDataAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a missing, wrong or revoked key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the endpoint needs a higher plan, which the message names.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof TwelveDataAPIError && error.isPlanLimit,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for an unknown symbol or a bad parameter, 404 for an unknown route, and
	// the plugin's own rejections: a Zod failure and a 200 body that said
	// `status: error`.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Every route is a GET over market data, so a replay is safe.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TwelveDataAPIError && (statusOf(error) ?? 0) >= 500,
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
