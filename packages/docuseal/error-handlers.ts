import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DocuSealTransportError } from './client';

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function isRead(error: Error): boolean {
	return error instanceof ApiError && error.request?.method === 'GET';
}

// Statuses observed live (self-hosted DocuSeal 3.4.0, 11-28) and in the spec;
// DocuSeal documents no error taxonomy beyond the {"error": "<message>"}
// envelope.
export const errorHandlers = {
	// Core's request() has already retried this 429 three times, honouring
	// Retry-After, before a handler sees it; retrying again would multiply
	// the attempts.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => status(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: a wrong or revoked API key. 403: the key's user may not do this.
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			return code === 401 || code === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 404 an id DocuSeal does not know, 422 a rejected
	// field. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			return (
				error.name === 'ZodError' ||
				code === 400 ||
				code === 404 ||
				code === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read that never reached DocuSeal is safe to replay. A write stays on
	// DEFAULT: submissions.create with send_email would re-send the
	// signature email if the first attempt had landed.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof DocuSealTransportError && error.method === 'GET',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Only reads are replayed after a 5xx: a failed write may have gone
	// through, and DocuSeal has no idempotency keys.
	SERVER_ERROR: {
		match: (error: Error) => (status(error) ?? 0) >= 500,
		handler: async (error: Error) =>
			isRead(error)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. Caller keys keep
// their positions first: core takes the first matching key, so a caller
// handler for a status no builtin covers would never run if builtin keys
// came first.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	return fallback ? { ...merged, DEFAULT: fallback } : merged;
}
