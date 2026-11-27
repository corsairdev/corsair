import type { CorsairErrorHandler } from 'corsair/core';
import { Smtp2goAPIError } from './client';

// Core runs the first handler whose match passes, in key order, so the more
// specific matchers sit above the broad 400/404 catch-all.
export const errorHandlers = {
	// 429 arrives with an empty body and no Retry-After (live-verified): the
	// API throttles by IP for at least one minute after too many requests or
	// too many error responses. One retry, delayed past that documented
	// minimum; a real Retry-After header would override it. Error responses
	// themselves feed the throttle, so nothing here retries a 4xx.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof Smtp2goAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 1,
			headersRetryAfterMs:
				error instanceof Smtp2goAPIError
					? (error.retryAfter ?? 60_000)
					: 60_000,
		}),
	},
	// Missing/malformed key (403) and unknown key (400) both name api_key in
	// the error text; the docs' claimed 401 is matched too.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof Smtp2goAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Per-key endpoint permissions (documented error_code
	// E_ApiResponseCodes.ENDPOINT_PERMISSION_DENIED): re-entering the key or
	// retrying cannot help, the key's permission set must change.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof Smtp2goAPIError &&
			error.code === 'E_ApiResponseCodes.ENDPOINT_PERMISSION_DENIED',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 field/model validation (NON_VALIDATING_IN_PAYLOAD and the shared
	// INVALID_IN_PAYLOAD code when the text is not the api_key complaint),
	// 404 unknown route, and a body the output schema rejects. The request
	// must change before a retry can work.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			if (!(error instanceof Smtp2goAPIError)) return false;
			return (
				error.status === 400 ||
				error.status === 404 ||
				error.code === 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD' ||
				error.code === 'E_ApiResponseCodes.INVALID_IN_PAYLOAD'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only replayable operations retry here: reads re-run safely, while a
	// send or removal may already have taken effect when the 5xx came back.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof Smtp2goAPIError &&
			error.replayable &&
			(error.transport || (error.status ?? 0) >= 500),
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
// last even when the caller adds or overrides handlers. Caller keys win
// their positions too, or a caller handler for a status no builtin covers
// would be claimed by a trailing DEFAULT.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
