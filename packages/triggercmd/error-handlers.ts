import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { triggerCmdErrorMessage } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * The two routes that start a command on a computer. `panel/trigger` is a GET,
 * so the method alone can't say whether a replay is safe.
 */
function startsCommand(error: ApiError): boolean {
	return /(^|\/)api\/(run|panel)\/trigger(\?|$)/.test(error.request.url);
}

/**
 * TRIGGERcmd has a small error vocabulary: 401 `Invalid Token!` for a bad token,
 * 404 for a route that does not exist, and a JSON body on every list route.
 * Core's request() already retried a 429 three times with Retry-After.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: no token, or a token that does not match an account.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 &&
			/invalid token|no authorization header/i.test(
				triggerCmdErrorMessage(error) ?? '',
			),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: the route does not exist. A retry reaches the same 404.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 404 ||
				status === 400 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Only reads are replayed: `commands.run` and `panels.trigger` start a
	// command on a computer, so a replay could run it twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			!startsCommand(error) &&
			error.status >= 500,
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
