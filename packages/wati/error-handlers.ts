import type { CorsairErrorHandler } from 'corsair/core';
import { WatiAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WatiAPIError ? error.status : undefined;
}

/**
 * Errors and limits: https://docs.wati.io/reference/errors
 *
 * The body is `{ error, code, message, timestamp }`, with two distinct 401
 * codes: `missing_token` (no key was sent at all) and `invalid_token` (one was
 * sent and is wrong, malformed or expired).
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WatiAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WatiAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Either token code. The docs are explicit that a scope failure is not the
	// only cause of a 403 — role, plan and channel access each count — so a
	// retry cannot fix this one either.
	AUTH_ERROR: {
		match: (error: Error) => error instanceof WatiAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token lacks a scope, the role, the plan or access to the channel.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422, plus a ZodError from the input schema. A text message sent
	// outside the 24-hour window also lands here, and no retry opens the window.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: a send, a delete or a contact create is not
	// repeatable, and a template send can cost credit.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WatiAPIError &&
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
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
