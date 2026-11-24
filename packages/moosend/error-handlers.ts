import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isEnvelopeError } from './client';
import { moosendEndpointMeta } from './endpoints/meta';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** Reads only: a write after a 5xx or a dropped connection may have landed. */
function isRead(context: ErrorContext): boolean {
	const meta = (moosendEndpointMeta as Record<string, { riskLevel: string }>)[
		context.operation
	];
	return meta?.riskLevel === 'read';
}

/**
 * Moosend sends most failures as HTTP 200 envelopes with a nonzero Code; the
 * client turns them into core's ApiError with a mapped status (429 for
 * RATE_LIMITING, 401 for a bad key, 404 for *_NOT_FOUND, 400 otherwise).
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// An HTTP 429 was already retried by corsair/http (three times, with
		// Retry-After). An envelope 429 arrives behind HTTP 200, so core never
		// retried it: back off here. Moosend refuses a rate-limited request
		// before running it, so a write is safe to resend.
		handler: async (error: Error) =>
			isEnvelopeError(error)
				? { maxRetries: 3, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A corrected request fixes these; no retry can.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(status !== undefined && status >= 400 && status < 500)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			(statusOf(error) ?? 0) >= 500 && isRead(context),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection or timeout never got an answer; replay reads only.
	NETWORK_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			!(error instanceof ApiError) &&
			error.name !== 'ZodError' &&
			isRead(context),
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
// last even when the caller adds or overrides handlers.
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
