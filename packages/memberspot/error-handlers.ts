import type { CorsairErrorHandler } from 'corsair/core';
import { MemberSpotAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof MemberSpotAPIError ? error.status : undefined;
}

/**
 * MemberSpot is a NestJS service, so its whole taxonomy is HTTP status codes
 * with a `{ message, statusCode }` body:
 *
 * - `400` for a missing key or a rejected DTO. The missing-key case is 400, not
 *   401, which is the one thing about this API that surprises callers.
 * - `401` for an invalid key.
 * - `429` on several write routes, with no `Retry-After`.
 */
export const errorHandlers = {
	// The spec documents a limit on writes but no wait header, so a minute is the
	// fallback. A real `Retry-After` wins when the server sends one.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof MemberSpotAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof MemberSpotAPIError && error.retryAfter !== undefined
					? error.retryAfter
					: 60_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing key is 400 and an invalid one is 401. Both need a person to act,
	// so a retry only wastes calls. The message distinguishes them.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401) return true;
			return status === 400 && /api.?key|unauthori[sz]ed/i.test(error.message);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A connection reset or timeout never reached MemberSpot, so the call had no
	// effect. Bounded, and only for calls that declared themselves replay-safe.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof MemberSpotAPIError &&
			error.transport &&
			error.replaySafe,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx is only replayed when the call said it was safe, since a write may
	// already have been applied.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof MemberSpotAPIError &&
			error.replaySafe &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Every remaining 4xx is a rejected request: a bad DTO, an unknown user, a
	// delete list over the 10-user cap. Zod failures land here too.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' || (status !== undefined && status < 500)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last.
// Caller keys go first, then any builtin they did not name. A plain
// `{ ...builtin, ...user }` spread would give the builtin the earlier position,
// and core takes the first match in key order, so a caller handler for a status
// no builtin covers would lose to the trailing DEFAULT.
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
