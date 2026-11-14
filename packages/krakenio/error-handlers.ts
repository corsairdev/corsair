import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isKrakenAuthFailure, KrakenAPIError } from './client';

// An HTTP error from Kraken is core's ApiError; KrakenAPIError is a 200 that
// said `success: false`, or a request that got no answer.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Kraken documents 401 for an unknown key, 422 for a missing parameter, and 500
// for its own failure. An optimization that cannot be done answers `success:
// false` inside a 200, which the client turns into an error so a caller never
// reads a failed optimization as a done one.
// Reference: https://kraken.io/docs/http-status-codes
export const errorHandlers = {
	// A 429 is a throughput limit. Core's request() has already retried it
	// three times by the time it gets here, so no more retries are added.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 is an unknown key or an inactive account (and /user_status says 404
	// "User not found" for a wrong pair). Regenerating a key in the
	// dashboard replaces the old one, so a 401 usually means it was rotated.
	AUTH_ERROR: {
		match: (error: Error) => isKrakenAuthFailure(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a spent quota or a plan that does not allow the request.
	QUOTA_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 is a malformed request, such as no `url`, or neither `wait` nor a
	// `callback_url`. A retry sends the same body.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 422 || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every call is a POST, so a 5xx is never replayed: an optimization that
	// failed mid-way may still have been billed, and a retry would spend against
	// the quota again.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection reached no answer. It is still a POST, so it is not
	// replayed either: Kraken may have already fetched and billed the image.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KrakenAPIError && error.timedOut,
		handler: async () => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof KrakenAPIError && error.transport,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
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
