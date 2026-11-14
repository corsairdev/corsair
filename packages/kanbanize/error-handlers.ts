import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	isKanbanizeRateLimit,
	KanbanizeAPIError,
	kanbanizeErrorCode,
} from './client';

// Businessmap's HTTP errors arrive as core's ApiError; KanbanizeAPIError is a
// request that got no answer, so it has no status.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return kanbanizeErrorCode(error);
}

// Businessmap documents nine statuses and a four-character code on each. The
// limits are two windows, hourly and minutely, with default ceilings of 600 and
// 30 requests. Reference: https://demo.kanbanize.com/openapi/json
export const errorHandlers = {
	// RL01 is the hourly window, RL02 the minutely one; both carry the seconds
	// to wait in `details.retry_after`, which the client turns into
	// `retryAfter`. A gateway's bare 429 has no body code, so the status alone
	// has to match as well.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isKanbanizeRateLimit(error),
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A001 is an invalid key, A002 a request with none. Regenerating a key kills
	// the old one permanently, so a 401 here usually means it was rotated.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = codeOf(error);
			return (
				status === 401 || code === 'A001' || code === 'A002' || code === 'A003'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a permission the key's user lacks: the API checks the user's board
	// roles, so a valid key on a board the user cannot see answers 403 with A004
	// or one of the resource codes.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 is a conflict with the current state, such as a board that cannot
	// hold another workflow of that type. Sending the same body again cannot
	// change the state, so it is not retried.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is an invalid field, 404 an unknown board, card or column, and 422 a
	// value Businessmap will not accept. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay. A write is not: a 503 from a gateway can arrive
	// after Businessmap applied the change, and a retried card create would
	// leave a duplicate.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached Businessmap, so the read can
	// be replayed. TIMEOUT sits first because a timeout is also a transport
	// failure, and the two get different delays.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof KanbanizeAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KanbanizeAPIError && error.method === 'GET' ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof KanbanizeAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof KanbanizeAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
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
