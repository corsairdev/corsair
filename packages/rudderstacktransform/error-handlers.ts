import type { CorsairErrorHandler } from 'corsair/core';
import { RudderStackTransformationAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RudderStackTransformationAPIError
		? error.status
		: undefined;
}

/**
 * RudderStack documents no error catalogue for this API and sends no code in the
 * body, only a `message`, so these handlers work from the status. The documented
 * non-auth failures are a `400` "Transformation is not published" on connect and a
 * `400` from the Publish API when the code fails its test run.
 */
export const errorHandlers = {
	// RudderStack rate-limits this API without documenting a threshold or a
	// Retry-After, so the delay is exponential unless a header happens to arrive.
	// A 429 was refused before it ran, so replaying it is safe.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RudderStackTransformationAPIError
					? error.retryAfter
					: undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: "Invalid Access Token" or "Unauthorised", both captured live. The token
	// may also belong to a workspace in the other region.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token is valid but lacks the scope this resource needs.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such transformation or library in this workspace.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/422: an unpublished transformation being connected, a revision whose
	// test run failed, or a body RudderStack would not accept.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx, and only for an operation that declared itself replayable. A create or
	// update is never replayed, since it would leave a second revision behind.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RudderStackTransformationAPIError &&
			(error.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable =
				error instanceof RudderStackTransformationAPIError && error.replayable;
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
