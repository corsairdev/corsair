import type { CorsairErrorHandler } from 'corsair/core';
import { KlazifyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof KlazifyAPIError ? error.status : undefined;
}

/**
 * A 401 from Klazify carries two unrelated meanings, and only the body tells
 * them apart: a bad key answers `error: "Unauthorized"`, while an account on a
 * plan without API access answers `error: "Plan free no available"`. Both need
 * a person to act, and neither improves on a retry, so they share a policy but
 * are kept separate so a caller can match one without the other.
 */
export const errorHandlers = {
	// The plan has no API access at all. Nothing about the request can change
	// that, and every endpoint answers it, so it is checked before AUTH_ERROR.
	PLAN_REQUIRED_ERROR: {
		match: (error: Error) =>
			error instanceof KlazifyAPIError && error.isPlanRequired,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof KlazifyAPIError && error.isAuthError) return true;
			const message = error.message.toLowerCase();
			return message.includes('unauthorized');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 is retried with backoff. Klazify documents per-plan rate limits but
	// names no header, so the delay is a fixed backoff rather than a server value.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A classification error arrives inside a 200 with `success: false`, and the
	// docs name two categories: `/Unreachable` and `/No indexable content`.
	// Klazify does not bill for either, and neither improves on a retry. A 5xx
	// is left to SERVER_ERROR even when its body happens to say "unreachable".
	CLASSIFICATION_ERROR: {
		match: (error: Error) => {
			if ((statusOf(error) ?? 0) >= 500) return false;
			const message = error.message.toLowerCase();
			return (
				message.includes('unreachable') ||
				message.includes('no indexable content')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A rejected body, typically a URL or email Klazify will not accept. The same
	// request fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. Every classification endpoint is a POST but has no
	// side effect beyond caching, so POST is not treated as a write here; the
	// discovery search is also a read. A 5xx is retried twice.
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
