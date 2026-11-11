import type { CorsairErrorHandler } from 'corsair/core';
import { FluxguardAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof FluxguardAPIError ? error.status : undefined;
}

/**
 * Fluxguard is fronted by AWS API Gateway, so the error surface is small:
 * `403 Forbidden` for a bad or missing key (and for a plan without API access),
 * `400 Invalid request body` for a malformed body, and the gateway's
 * `403 Missing Authentication Token` for a route or method that does not exist.
 * No rate-limit contract is documented, but a 429 is handled in case a gateway
 * rule adds one.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof FluxguardAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is not in Fluxguard's own error list, but a proxy can add one.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 covers both a bad key and a route that does not exist ("Missing
	// Authentication Token"). Neither gets better on a retry.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have reached Fluxguard, so only reads are replayed: posting
	// /add-page twice would create a duplicate site.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof FluxguardAPIError &&
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
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
