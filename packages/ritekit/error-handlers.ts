import type { CorsairErrorHandler } from 'corsair/core';
import { RiteKitAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RiteKitAPIError ? error.status : undefined;
}

/**
 * Status codes: the refusal samples in the Postman collection
 * (https://documenter.getpostman.com/view/2010712/SzS7Qku5) and live calls
 * against https://api.ritekit.com.
 */
export const errorHandlers = {
	// 100 calls per second, documented on the pricing page. No Retry-After is
	// documented, so the delay is exponential unless a header happens to arrive.
	// A 429 was refused before it ran, so replaying it is safe even for
	// links.shorten, the one route that creates something.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RiteKitAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: no Client ID at all ("Endpoint is not accessible") or one RiteKit does
	// not recognise ("Verification failed"). Both need a new key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the month's credits are spent. Retrying cannot refill them, and the
	// plan resets on its own anniversary.
	QUOTA_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the Client ID is fine but the plan does not include this endpoint.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an unknown endpoint, or a domain, tag or page RiteKit could not read.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400/422: a parameter RiteKit refused, such as an unusable URL or an email
	// it cannot parse. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Retried only for operations that declare themselves replayable: every
	// route except links.shorten, which creates a new short link on each call.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RiteKitAPIError && (error.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable = error instanceof RiteKitAPIError && error.replayable;
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
