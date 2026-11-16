import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { telnyxErrorDetails } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// Error bodies are `{ errors: [{ code, title, detail }] }`.
export const errorHandlers = {
	// A 429 with code 40333 means the messaging profile's daily spend limit is
	// used up; no retry before tomorrow can succeed.
	SPEND_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 &&
			telnyxErrorDetails(error)?.errors.some((e) => e.code === '40333') ===
				true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 429 is throughput. The client makes one attempt (see client.ts),
	// so the retries and the Retry-After wait happen here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's role does not cover this route.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402 and Telnyx's insufficient-funds code: no retry can add balance.
	// 20100 is "Insufficient Funds" in the published error list.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 402 ||
			telnyxErrorDetails(error)?.errors.some((e) => e.code === '20100') ===
				true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 rejected fields, 400 invalid input, 404 unknown resource.
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
	// 409: the number or profile is already in the state the call expects.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A repeated message send or dial places a second
	// call or charges a second message.
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
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Core runs the first handler whose `match` passes and DEFAULT matches
// everything, so caller keys go first, then any builtin the caller did not
// name, and DEFAULT last.
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
