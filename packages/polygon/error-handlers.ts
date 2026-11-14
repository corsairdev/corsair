import type { CorsairErrorHandler } from 'corsair/core';
import { PolygonAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PolygonAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof PolygonAPIError ? error.code : undefined;
}

// OMS error names and numeric codes are documented as stable identifiers, so
// handlers match those rather than message text.
export const errorHandlers = {
	// A rejected or expired bearer token. The client mints a fresh one on the next
	// call, so one retry is worth trying, and the token itself is never replayed.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = codeOf(error);
			return (
				status === 401 ||
				code === 'InvalidCredentials' ||
				code === 'Unauthorized'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// OMS reports its own quota failures with distinct codes: a per-window request
	// limit is retryable, but a spent balance or plan is not.
	QUOTA_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			return (
				code === 'InsufficientFunds' ||
				code === 'InsufficientBalance' ||
				code === 'LimitMisconfigured'
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 carries `Retry-After` in seconds on both the auth and API hosts.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const code = codeOf(error);
			return status === 429 || code === 'RateLimited' || code === 'RateLimit';
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof PolygonAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The provider behind OMS was slow or unreachable. OMS has already accepted the
	// request, so this is only ever retried for a read.
	UPSTREAM_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			return (
				code === 'ProviderUnavailable' ||
				code === 'ProviderUnreachable' ||
				code === 'ProviderTimeout' ||
				code === 'ProviderRequestFailed' ||
				code === 'ServiceUnavailable'
			);
		},
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof PolygonAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A body OMS refused as written: a bad field, a corridor it cannot route, a
	// quote that expired, or a missing risk session. The request must change.
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
	// A resource that does not exist, or a customer OMS can no longer see.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 means the credential is valid but the project or customer is not
	// entitled to this corridor, or KYC is still pending.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached OMS, so a read is safe to replay. A write
	// may have landed even without a response, so it is not.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof PolygonAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof PolygonAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed. A write reaching 5xx may already have moved money,
	// and only a caller-supplied idempotency key could make a replay safe.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof PolygonAPIError &&
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
