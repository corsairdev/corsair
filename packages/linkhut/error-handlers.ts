import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { LinkhutAPIError } from './client';

const VALIDATION_STATUSES = new Set([400, 404, 406, 422]);

function statusOf(error: Error): number | undefined {
	return error instanceof LinkhutAPIError ? error.status : undefined;
}

/** Two more attempts with exponential backoff, or the delay Retry-After names. */
function backOff(error: Error): Promise<RetryStrategy> {
	return Promise.resolve({
		maxRetries: 2,
		retryStrategy: 'exponential_backoff',
		headersRetryAfterMs:
			error instanceof LinkhutAPIError ? error.retryAfter : undefined,
	});
}

const noRetry = async (): Promise<RetryStrategy> => ({ maxRetries: 0 });

export const errorHandlers = {
	// Not documented for linkhut, but the standard signal. Such a request is
	// refused before it runs, so any operation may repeat it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof LinkhutAPIError && error.status === 429,
		handler: backOff,
	},
	// "Please watch for 500 or 999 errors and back-off appropriately. It means
	// that you have been throttled." A 999 never reaches a handler with a
	// status: fetch rejects it as a network error, so it arrives through
	// NETWORK_ERROR. Only a replayable request is repeated, because a failed
	// write may already have been applied.
	THROTTLED_ERROR: {
		match: (error: Error) =>
			error instanceof LinkhutAPIError && error.isThrottled && error.replayable,
		handler: backOff,
	},
	// A dropped connection on a read never reached linkhut.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof LinkhutAPIError &&
			error.isTransportError &&
			error.replayable,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		}),
	},
	// 401: no token, a wrong token or an expired one.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: noRetry,
	},
	// 403. No body for it could be observed without a key.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: noRetry,
	},
	// None of these statuses was observed on an authenticated route: every
	// malformed-parameter probe hit auth first. They are the conventional
	// meanings of 400 (refused input), 404 (no such operation), 406 (a format
	// linkhut will not serve) and 422 (a value it cannot process). A ZodError
	// is input the schema refused before any request was sent.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(status !== undefined && VALIDATION_STATUSES.has(status))
			);
		},
		handler: noRetry,
	},
	DEFAULT: {
		match: () => true,
		handler: noRetry,
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so the caller's
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler in the
// builtin's position.
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
