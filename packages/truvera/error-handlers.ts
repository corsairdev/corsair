import type { CorsairErrorHandler } from 'corsair/core';
import { TruveraAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TruveraAPIError ? error.status : undefined;
}

/**
 * Truvera's documented failure set: 400 for invalid or missing parameters, 401
 * for a missing or invalid key, 402 when the plan's transaction limit is
 * reached, 404 for an unknown resource, and 429 for a rate limit.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TruveraAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TruveraAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a missing, wrong or revoked API key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the plan's transaction limit. Nothing is charged, and no retry fixes
	// it until the plan changes.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof TruveraAPIError && error.isPaymentRequired,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 for a rejected body or a DID the account does not own, 404 for an
	// unknown credential, schema or registry, and the plugin's Zod rejection.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Only reads are replayed: issuing a credential is not idempotent, and
	// a replay would mint a second one.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TruveraAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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
 * A request the plugin refused before sending. Truvera rejects a credential
 * body with a field-level error map, which a caller cannot act on once it has
 * been flattened into a message, so the plugin checks the same rules first.
 */
export class TruveraOperationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TruveraOperationError';
	}
}

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
