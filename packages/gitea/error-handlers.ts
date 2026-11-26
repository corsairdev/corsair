import type { CorsairErrorHandler } from 'corsair/core';
import { GITEA_RATE_LIMIT_FALLBACK_MS, GiteaAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof GiteaAPIError ? error.status : undefined;
}

// Status vocabulary seen on the built operations, live-probed on gitea.com:
// 400 bad request, 401 missing or bad token, 403 forbidden, 404 missing
// resource (or a route the instance does not have), 409 duplicate name or
// empty repository, 412 feature disabled (issues off), 422 validation,
// 423 repository archived.
export const errorHandlers = {
	// gitea.com answers 429 with `retry-after: 60` on bursts; self-hosted
	// instances vary. The client's rate-limit config passes the header through,
	// and 60s is the fallback when the instance sends none. The provider
	// refused the request before running it, so any method may be retried.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof GiteaAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof GiteaAPIError && error.retryAfter !== undefined
					? error.retryAfter
					: GITEA_RATE_LIMIT_FALLBACK_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: token missing, wrong or expired.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token lacks the scope, or the caller has no permission on the
	// repo. Retrying with the same token cannot change either.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: missing repo, issue, release or hook. A route the instance does not
	// have also answers 404 (as text/plain), and no retry creates a route.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422: the request itself is invalid; resending the same body
	// fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 duplicate repo or release tag, or the commits list on a repo with no
	// commits ("empty repository"). 412 issues disabled. 423 repo archived.
	// All are repo state a retry does not change, so they surface as errors
	// rather than being mapped to an empty result.
	STATE_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 409 || status === 412 || status === 423;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Only operations that declared themselves replayable (the reads) are
	// sent again: a retried issue create would duplicate the issue, and a repo
	// delete that actually ran cannot be redone.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof GiteaAPIError &&
			error.replayable &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Transport failures (reset, DNS, abort) never reached the provider, so a
	// read may be replayed; writes still stay down, bounded at two attempts.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof GiteaAPIError && error.isTransportFailure,
		handler: async (error: Error) => ({
			maxRetries: error instanceof GiteaAPIError && error.replayable ? 2 : 0,
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
