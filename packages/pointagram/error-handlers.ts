import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PointagramAPIError, reportsInvalidCredentials } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof PointagramAPIError) return error.status;
	return error instanceof ApiError ? error.status : undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof PointagramAPIError) return error.method;
	return error instanceof ApiError ? error.request.method : undefined;
}

/**
 * A rejected key, which Pointagram reports as a 404 with "Invalid Credentials".
 * A bare 401 or 403 lands here too: no endpoint documents one, so a gateway
 * emitting it is refusing the credential rather than the request.
 */
function isAuthRejection(error: Error): boolean {
	if (error instanceof PointagramAPIError) {
		return (
			error.credentialsRejected || error.status === 401 || error.status === 403
		);
	}
	if (!(error instanceof ApiError)) return false;
	if (error.status === 401 || error.status === 403) return true;
	return error.status === 404 && reportsInvalidCredentials(error.body);
}

// Pointagram documents no rate limit and no Retry-After header. Its 404 doubles
// as the credential rejection, so the body is matched before plain 404s.
export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => isAuthRejection(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A resource the tenant cannot see: a player, team, competition or store item
	// that does not exist. Retrying the same id cannot succeed.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A request Pointagram refuses as written. 400 is undocumented but reachable,
	// 409 is a conflict such as an existing player, and 422 is a rejected field.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached Pointagram, so a read is safe to replay.
	// A write may have landed, so it is not.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PointagramAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: methodOf(error) === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed: Pointagram does not document idempotent writes, and
	// scoreSeries.addPoints is not idempotent without a source_score_id.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so `DEFAULT`
 * stays last. A plain spread would keep a caller's value but a builtin's
 * position, which lets the trailing `DEFAULT` claim errors the caller named.
 */
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
