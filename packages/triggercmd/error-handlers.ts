import type { CorsairErrorHandler } from 'corsair/core';
import { TriggerCmdAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TriggerCmdAPIError ? error.status : undefined;
}

/**
 * TRIGGERcmd has a small error vocabulary: 401 `Invalid Token!` for a bad token,
 * 404 for a route that does not exist, and a JSON body on every list route.
 * It publishes no rate-limit contract, so only a 429 is retried.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TriggerCmdAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TriggerCmdAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: no token, or a token that does not match an account.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TriggerCmdAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the route does not exist. A retry reaches the same 404.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(error instanceof TriggerCmdAPIError && error.isUnknownRoute) ||
				status === 400 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Only reads are replayed: `run.trigger` starts a command on a computer,
	// so a replay could run it twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TriggerCmdAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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
