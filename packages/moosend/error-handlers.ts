import type { CorsairErrorHandler } from 'corsair/core';
import { MoosendAPIError } from './client';

function asMoosendError(error: Error): MoosendAPIError | undefined {
	return error instanceof MoosendAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asMoosendError(error)?.status;
}

/**
 * Moosend answers failures inside a 200 envelope with a nonzero Code, and
 * documents no explicit rate limit. Non-2xx statuses come from the gateway
 * (404 unknown route, 411 missing Content-Length, 5xx upstream).
 */
export const errorHandlers = {
	// No documented rate limit; a gateway 429 is still worth a backoff.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMoosendError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const moosendError = asMoosendError(error);
			return statusOf(error) === 401 || moosendError?.code === 104;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Envelope errors (a nonzero Code behind a 200) and gateway 404s: a
	// corrected request fixes them, no retry can.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const moosendError = asMoosendError(error);
			return (
				error.name === 'ZodError' ||
				statusOf(error) === 404 ||
				(moosendError?.status === undefined && moosendError?.code !== undefined)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			asMoosendError(error)?.replayable === true &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached Moosend, so a
	// read can be replayed without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asMoosendError(error)?.replayable === true &&
			asMoosendError(error)?.status === undefined,
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
