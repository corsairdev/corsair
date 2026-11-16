import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// TextCortex speaks the OpenAI error shape on chat routes and its own
// `{ detail }` shape elsewhere, and a 402 means the credits ran out.
export const errorHandlers = {
	// 402 is out of funding: no retry adds credits, and TextCortex has already
	// done no work. This sits first so a 402 never reads as a transient failure.
	INSUFFICIENT_CREDITS: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401 and 403: a bad key, or a key whose capabilities do not cover the
	// route. Both are permanent.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 is transient throughput. Core's request() already retried it three
	// times with Retry-After, so it is not replayed again here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422 rejected the request, 404 an unknown model or resource.
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
	// 409 and 423 are insertion or processing states: repeating the upload is
	// not the fix, inspecting the existing state is.
	CONFLICT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 409 || status === 423;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A repeated completion or image generation can
	// produce a second answer and charge for it, and TextCortex promises no
	// idempotency key.
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
