import type { CorsairErrorHandler } from 'corsair/core';
import { MixpanelAPIError } from './client';

function asMixpanelError(error: Error): MixpanelAPIError | undefined {
	return error instanceof MixpanelAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asMixpanelError(error)?.status;
}

function hasTransportCause(error: Error): boolean {
	const mixpanelError = asMixpanelError(error);
	return mixpanelError !== undefined && mixpanelError.status === undefined;
}

function isTimeout(error: Error): boolean {
	if (error.name === 'TimeoutError') return true;
	const cause = error.cause;
	return cause instanceof Error && cause.name === 'TimeoutError';
}

/**
 * Matches a timed-out request: the status is 408, or the fetch timeout
 * surfaced as a TimeoutError. Only replayable requests qualify, decided per
 * request in the client (reads, and events.import whose $insert_id keys
 * deduplicate).
 */
function replayableTimeout(error: Error): boolean {
	return (
		asMixpanelError(error)?.replayable === true &&
		(isTimeout(error) || statusOf(error) === 408)
	);
}

/**
 * Status codes and envelopes: https://docs.mixpanel.com/reference/rate-limits
 * plus the probed shapes in client.ts. 429, 502 and 503 are documented as
 * retryable with exponential backoff; 400 validation errors never are.
 */
export const errorHandlers = {
	// Query API: 60 queries/hour, 5 concurrent. Export: 60/hour, 3/s. Import:
	// 2 GB/minute. Mixpanel does not document a Retry-After header, so the
	// backoff below carries the retry and a real header overrides it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMixpanelError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timed-out read or import can be sent again; nothing else retries a
	// timeout, because the first request may have landed.
	TIMEOUT_ERROR: {
		match: (error: Error) => replayableTimeout(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: missing or wrong service account credentials, or a missing
	// project_id, which the query API reports as unauthenticated.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the service account lacks the role the call needs (import wants
	// Owner or Admin), or the project is out of reach for the account.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: import strict validation (with failed_records on the body) and
	// query API selector problems. Mixpanel says not to retry these: they fail
	// identically every time and count against the rate limit. 404: an unknown
	// bookmark_id or project. 422: the export API's date-range rejections.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 413: the import batch passed the 10 MB / 2000 event cap. Splitting the
	// batch is the only fix.
	REQUEST_TOO_LARGE_ERROR: {
		match: (error: Error) => statusOf(error) === 413,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: Mixpanel names 502 and 503 as retryable with backoff. Only
	// replayable requests (reads and events.import) are sent again; nothing
	// else gets a blind replay.
	SERVER_ERROR: {
		match: (error: Error) =>
			asMixpanelError(error)?.replayable === true &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached Mixpanel, so the
	// request can be replayed for reads without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			hasTransportCause(error) && asMixpanelError(error)?.replayable === true,
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
