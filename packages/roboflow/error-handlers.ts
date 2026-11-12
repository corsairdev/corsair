import type { CorsairErrorHandler } from 'corsair/core';
import { RoboflowAPIError } from './client';

function apiError(error: Error): RoboflowAPIError | undefined {
	return error instanceof RoboflowAPIError ? error : undefined;
}

/**
 * Status codes: the `ErrorResponse` model in the Platform API spec and the live
 * responses from both hosts.
 */
export const errorHandlers = {
	// 401 and OAuthException: "This API key does not exist (or has been revoked)."
	// The message adds a hint pointing at the dashboard.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key works but cannot reach the workspace or project.
	PERMISSION_ERROR: {
		match: (error: Error) => apiError(error)?.isPermissionError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such workspace, project or version.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.isNotFound === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: a training run already in progress, which a retry does not fix.
	CONFLICT_ERROR: {
		match: (error: Error) => apiError(error)?.isConflict === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422, plus a ZodError or a modelId the operation refused to split. The
	// caller has to change something.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return (
				error.name === 'ZodError' ||
				error.message.includes('Roboflow modelId') ||
				api?.isValidationError === true
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if it arrives; no per-second limit is documented for management.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.status === 429,
		handler: async (error: Error) =>
			apiError(error)?.replayable === true
				? {
						maxRetries: 3,
						headersRetryAfterMs: apiError(error)?.retryAfter,
						retryStrategy: 'exponential_backoff' as const,
					}
				: { maxRetries: 0 },
	},
	// 5xx, and only for an operation that declared itself replayable. Inference is
	// billed per image and an upload is billed per image, so neither is resent.
	SERVER_ERROR: {
		match: (error: Error) => (apiError(error)?.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable = apiError(error)?.replayable === true;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/** Handlers match in key order and DEFAULT matches everything, so it stays last. */
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
