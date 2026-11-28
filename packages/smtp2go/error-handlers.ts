import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isReplayablePath,
	isSmtp2goAuthError,
	Smtp2goTransportError,
	smtp2goErrorCode,
} from './client';

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Core runs the first handler whose match passes, in key order, so the more
// specific matchers sit above the broad 400/404 catch-all.
export const errorHandlers = {
	// 429 arrives with an empty body and no Retry-After (live-verified): the
	// API throttles by IP for at least one minute. Core has already retried
	// once after that minute; error responses feed the throttle, so nothing
	// here retries again.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => status(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Missing/malformed key (403) and unknown key (400) both name api_key in
	// the error text; the docs' claimed 401 is matched too.
	AUTH_ERROR: {
		match: (error: Error) => isSmtp2goAuthError(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Per-key endpoint permissions (error_code
	// E_ApiResponseCodes.ENDPOINT_PERMISSION_DENIED): the key's permission set
	// must change; a retry cannot help.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			smtp2goErrorCode(error) ===
			'E_ApiResponseCodes.ENDPOINT_PERMISSION_DENIED',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 field/model validation, 404 unknown route, an error in a 2xx
	// envelope, and a body the output schema rejects. The request must change
	// before a retry can work.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError' || error.name === 'Smtp2goEnvelopeError') {
				return true;
			}
			const code = smtp2goErrorCode(error);
			return (
				status(error) === 400 ||
				status(error) === 404 ||
				code === 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD' ||
				code === 'E_ApiResponseCodes.INVALID_IN_PAYLOAD'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads retry here: a send or removal may already have taken effect
	// when the 5xx or the dropped connection came back.
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof Smtp2goTransportError) {
				return isReplayablePath(error.path);
			}
			return (
				error instanceof ApiError &&
				error.status >= 500 &&
				isReplayablePath(error.request?.url)
			);
		},
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
