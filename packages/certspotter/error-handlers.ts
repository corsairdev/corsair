import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { certSpotterErrorCode } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Cert Spotter documents every error code it can return. The errors are core's
 * ApiError, whose body carries the code. The two a caller may act on are
 * `rate_limited` (wait and retry) and `timeout` (the query exceeded the plan's
 * limit, which no retry fixes).
 */
export const errorHandlers = {
	// `rate_limited`, or a gateway 429. Core's request() already retried it
	// three times with Retry-After, so it is not replayed again here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || certSpotterErrorCode(error) === 'rate_limited',
		handler: async () => ({ maxRetries: 0 }),
	},
	// `bad_credentials`, `disabled_credentials`, `unauthorized`: the key is
	// wrong, disabled, or lacks the scope. The same request fails again.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			certSpotterErrorCode(error) === 'bad_credentials' ||
			certSpotterErrorCode(error) === 'disabled_credentials' ||
			certSpotterErrorCode(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// `payment_required` and `not_allowed_by_plan`: the subscription needs to
	// change before any retry can help.
	QUOTA_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 402 ||
			certSpotterErrorCode(error) === 'payment_required' ||
			certSpotterErrorCode(error) === 'not_allowed_by_plan',
		handler: async () => ({ maxRetries: 0 }),
	},
	// `timeout`: the search hit the plan's query limit. Cert Spotter suggests a
	// longer timeout plan, not a retry.
	TIMEOUT_ERROR: {
		match: (error: Error) => certSpotterErrorCode(error) === 'timeout',
		handler: async () => ({ maxRetries: 0 }),
	},
	// `lagging_client`: the firehose consumer fell behind and must restart from
	// the end rather than replay the same cursor.
	CONFLICT_ERROR: {
		match: (error: Error) => certSpotterErrorCode(error) === 'lagging_client',
		handler: async () => ({ maxRetries: 0 }),
	},
	// `bad_request`, `bad_query`, `missing_field`, `invalid_value`,
	// `out_of_range`, `method_not_allowed`, and the plugin's own Zod rejection.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 403 ||
				status === 404 ||
				status === 405
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// `internal_error` and `service_outage`, which the provider says may be
	// retried with exponential backoff. Only GETs exist here, so a replay is
	// always safe.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys come first and DEFAULT stays last.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
