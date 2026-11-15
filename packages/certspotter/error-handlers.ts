import type { CorsairErrorHandler } from 'corsair/core';
import { CertSpotterAPIError } from './client';

function codeOf(error: Error): string | undefined {
	return error instanceof CertSpotterAPIError ? error.code : undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof CertSpotterAPIError ? error.status : undefined;
}

/**
 * Cert Spotter documents every error code it can return. The two that a caller
 * may act on are `rate_limited` (wait and retry) and `timeout` (the query
 * exceeded the plan's limit, which no retry fixes).
 */
export const errorHandlers = {
	// `rate_limited`, or a gateway 429. Both mean the same thing.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof CertSpotterAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof CertSpotterAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// `bad_credentials`, `disabled_credentials`, `unauthorized`: the key is
	// wrong, disabled, or lacks the scope. The same request fails again.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			codeOf(error) === 'bad_credentials' ||
			codeOf(error) === 'disabled_credentials' ||
			codeOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// `payment_required` and `not_allowed_by_plan`: the subscription needs to
	// change before any retry can help.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof CertSpotterAPIError && error.isPaymentRequired,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `timeout`: the search hit the plan's query limit. Cert Spotter suggests a
	// longer timeout plan, not a retry.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof CertSpotterAPIError && error.isTimeout,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `lagging_client`: the firehose consumer fell behind and must restart from
	// the end rather than replay the same cursor.
	CONFLICT_ERROR: {
		match: (error: Error) => codeOf(error) === 'lagging_client',
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
