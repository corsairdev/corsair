import type { CorsairErrorHandler } from 'corsair/core';
import { NeuronwriterAPIError } from './client';

// NEURONwriter reports one error: a 401 `{ error }` for a bad or inactive key.
// Its limits are monthly analysis counts rather than request rates, so a 429 is
// not expected, but one from a gateway is handled anyway.
//
// Every method is a POST, so nothing here is replayed on a 5xx.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NeuronwriterAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A bad or inactive key. A retry sends the same key, so it cannot help.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NeuronwriterAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Everything else the provider rejects is a body it could not read, which a
	// retry repeats. A Zod failure counts here too.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NeuronwriterAPIError &&
				(error.status === 400 || error.status === 404 || error.status === 422)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// There is no SERVER_ERROR handler on purpose. Every method is a POST and
	// analysis.start spends a monthly credit, so no wrapped call is safe to
	// replay; a 5xx falls to DEFAULT, which does not retry.
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
