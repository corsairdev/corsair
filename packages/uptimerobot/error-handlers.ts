import type { CorsairErrorHandler } from 'corsair/core';
import { UptimeRobotAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof UptimeRobotAPIError ? error.status : undefined;
}

/**
 * Error codes: https://cdn.uptimerobot.com/api/openapi.yaml
 *
 * Every code is `NNN-NNN` and the leading group identifies the area: `003` is
 * authentication, `009` is resources and validation, `026` is status pages.
 * The HTTP status is the fallback for a code the plugin does not know.
 */
export const errorHandlers = {
	// The free plan allows 10 requests a minute and paid plans monitorLimit * 2.
	// A 429 means the request was refused before it ran, so retrying a write
	// cannot repeat it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof UptimeRobotAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof UptimeRobotAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 or 003-005: a wrong, revoked or expired token. Retrying cannot help.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof UptimeRobotAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the plan does not include the feature, e.g. custom fields, groups or
	// third-party service monitors on the free plan.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404, or 009-002 (resource not found): the monitor, incident or status page
	// is gone or belongs to another account.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof UptimeRobotAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 or 422: the body or query was rejected. Also covers a ZodError from
	// the input schema, which never reaches the network.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: a failed write may have gone through, and
	// monitors.delete and monitors.reset are not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof UptimeRobotAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
