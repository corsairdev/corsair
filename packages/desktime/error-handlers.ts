import type { CorsairErrorHandler } from 'corsair/core';
import { DeskTimeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof DeskTimeAPIError ? error.status : undefined;
}

function descriptionOf(error: Error): string {
	return error instanceof DeskTimeAPIError ? error.message : error.message;
}

/**
 * DeskTime's taxonomy, from the live API and the help-center articles:
 *
 * - `401` `API Key is missing` or `API Key is invalid`.
 * - `403` the plan does not include API access, or the key was deactivated.
 * - `429`, with `x-ratelimit-limit: 600` and no `Retry-After`.
 *
 * Validation never reaches the provider: a bad `date` or `period` is ignored
 * there and answered with today's data, so the schemas reject it first.
 */
export const errorHandlers = {
	// DeskTime publishes a limit but no wait. A minute is long enough for the
	// counter to recover and short enough not to stall an agent for long.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof DeskTimeAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof DeskTimeAPIError && error.retryAfter !== undefined
					? error.retryAfter
					: 60_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing or invalid key, and a deactivated one, all need the user to act.
	// Resending cannot fix them.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			(statusOf(error) === 403 &&
				/app key|api access|deactivat/i.test(descriptionOf(error))),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every operation here is a GET that changes nothing, so a transient
	// failure is always safe to repeat.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof DeskTimeAPIError &&
			error.replaySafe &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 403 that is not about the key, and any other 4xx, is a rejected request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' || (status !== undefined && status < 500)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last.
// Builtin first, caller second, so a caller override wins on both key and value.
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
