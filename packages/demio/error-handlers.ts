import type { CorsairErrorHandler } from 'corsair/core';
import { DemioAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof DemioAPIError ? error.status : undefined;
}

/**
 * Demio answers 417 for both limits it documents. A per-minute limit clears on
 * its own; the daily allowance does not, so the two need different handlers and
 * the credit check must come first because both match the same status.
 */
export const errorHandlers = {
	// The allowance is spent until Demio's day boundary, which no retry reaches.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof DemioAPIError && error.isDailyLimit,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The documented ceiling is 180 requests a minute and Demio sends no
	// Retry-After, so the delay is the window itself: a shorter one only spends
	// another attempt against a limit that has not reset.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof DemioAPIError && error.isRateLimit) return true;
			const message = error.message.toLowerCase();
			return message.includes('requests rate') || message.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof DemioAPIError ? error.retryAfter : undefined,
		}),
	},
	// 401 is always the credential pair. 403 is the inactive account, which
	// arrives in the same `messages` shape and needs the same fix: a working
	// credential on a plan that is not active.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401) return true;
			if (status === 403) {
				return (
					error instanceof DemioAPIError &&
					error.messages.some((message) =>
						message.toLowerCase().includes('account is not active'),
					)
				);
			}
			return error.message.toLowerCase().includes('authorization failed');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 with `errors` means the id is not one this account may read. Live
	// probes answered exactly this for an id that does not exist, for a date
	// that is not on the event, and for a report on an unknown date, so the
	// resource may be absent rather than forbidden. Re-sending cannot help.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is a rejected registration payload and 422 is Demio's "Not enough
	// params.", which a live account sends and the specification does not list.
	// 404 is a date the filter excluded: `events.get` answers it when
	// `active=true` leaves no date on an event whose dates have all finished.
	// The same request would fail again in every case.
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
	// Rethrows the provider's own fault. Only reads are replayed: a registration
	// that failed this way may already exist, and Demio sends no idempotency key.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof DemioAPIError &&
			error.method === 'GET' &&
			error.status >= 500,
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
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. A caller's handlers go first so one they add for a status no builtin
 * covers actually runs; keeping the builtin order would let `DEFAULT` claim the
 * error before their entry is tried.
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
