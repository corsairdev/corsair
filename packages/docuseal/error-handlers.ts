import type { CorsairErrorHandler } from 'corsair/core';
import { DocuSealAPIError } from './client';

// Statuses observed through probes and the spec; DocuSeal documents no error
// taxonomy beyond the {"error": "<message>"} envelope.
export const errorHandlers = {
	// A 429 means DocuSeal refused the request before running it, so a replay
	// cannot repeat a write. No Retry-After contract is documented; a header,
	// when present, pins the delay.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof DocuSealAPIError && error.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof DocuSealAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong or revoked API key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof DocuSealAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 404 for an id DocuSeal does not know, 422 rejected
	// field. A retry sends the
	// same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status =
				error instanceof DocuSealAPIError ? error.status : undefined;
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// DocuSeal says nothing about 5xx retryability, so only reads are replayed:
	// a failed write may have gone through, and submissions.create with
	// send_email would re-send the signature email.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof DocuSealAPIError &&
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
