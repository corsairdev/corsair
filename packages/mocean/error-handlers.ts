import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isBodyStatusError } from './client';
import { moceanEndpointMeta } from './endpoints/meta';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** Reads only: a send after a 5xx or a dropped answer may already be charged. */
function isRead(context: ErrorContext): boolean {
	const meta = (moceanEndpointMeta as Record<string, { riskLevel: string }>)[
		context.operation
	];
	return meta?.riskLevel === 'read';
}

/**
 * The client turns Mocean's 2xx body statuses into core's ApiError with the
 * HTTP status they mean: 429 throttled, 401 bad token, 402 out of credit,
 * 503 system down, 500 system error, 400 for a bad request.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// An HTTP 429 was already retried by corsair/http. A throttle in a 2xx
		// body never reached core's retry; Mocean refused the request before
		// running it, so any method can be sent again.
		handler: async (error: Error) =>
			isBodyStatusError(error)
				? { maxRetries: 3, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Out of credit, a bad number, a wrong code: the same input fails again.
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
