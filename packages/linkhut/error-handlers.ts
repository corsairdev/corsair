import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { linkhutRequestFacts } from './client';

// 406 is also what linkhut answers for a path it has no route for.
const VALIDATION_STATUSES = new Set([400, 404, 406, 422]);

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

const noRetry = async (_error?: Error): Promise<RetryStrategy> => ({
	maxRetries: 0,
});

export const errorHandlers = {
	// Core's request() has already retried the 429 three times, honouring
	// Retry-After, before this sees it (PLUGIN_PR_RULES R8).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: noRetry,
	},
	// "Please watch for 500 or 999 errors and back-off appropriately. It means
	// that you have been throttled." A 999 never arrives with a status: fetch
	// rejects it as a network error, so it comes through NETWORK_ERROR. Only a
	// replayable request is repeated, because a failed write may already have
	// been applied.
	THROTTLED_ERROR: {
		match: (error: Error) =>
			(statusOf(error) ?? 0) >= 500 &&
			linkhutRequestFacts(error)?.replayable === true,
		handler: async (_error?: Error): Promise<RetryStrategy> => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		}),
	},
	// A dropped connection on a replayable request.
	NETWORK_ERROR: {
		match: (error: Error) => {
			const facts = linkhutRequestFacts(error);
			return facts?.transport === true && facts.replayable;
		},
		handler: async (_error?: Error): Promise<RetryStrategy> => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		}),
	},
	// 401 {"errors":[{"message":"Unauthenticated"}]}: no token, a wrong one,
	// an expired or revoked one.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: noRetry,
	},
	// 403: the OAuth token lacks the scope (posts:read, posts:write,
	// tags:read, tags:write) the operation needs.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: noRetry,
	},
	// 404 is posts/get for a url that is not saved; 406 an unknown route or a
	// format linkhut will not serve. 400 and 422 are the conventional refusals.
	// A ZodError is input the schema refused before any request was sent.
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
