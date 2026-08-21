import type { CorsairErrorHandler } from 'corsair/core';
import { AnthropicAdministratorAPIError } from './client';

/**
 * Handlers classify failures for logging and policy; they deliberately do not
 * ask the shared endpoint binder to retry.
 *
 * Retries are performed inside `client.ts`, which returns the successful
 * attempt's result. Delegating them here instead would route a retry through
 * the binder, which awaits the recursive attempt without returning it and then
 * rethrows the original error — so a request that succeeded on retry would
 * still be reported to the caller as a rate-limit failure, leaving mutation
 * outcomes ambiguous.
 *
 * Matching is on the HTTP status carried by `AnthropicAdministratorAPIError`
 * rather than on message text: corsair throws a 429 with the message
 * "Too Many Requests", which contains neither "429" nor "rate_limited".
 */
function asApiError(error: Error): AnthropicAdministratorAPIError | undefined {
	return error instanceof AnthropicAdministratorAPIError ? error : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Already retried in the client (safe for any method — a 429 is rejected
		// before being applied). By the time it surfaces here the budget is spent.
		match: (error: Error) => asApiError(error)?.status === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status === 401 || status === 403;
		},
		handler: async (error: Error) => {
			const type = asApiError(error)?.errorType;
			console.error(
				`[ANTHROPICADMINISTRATOR] Authentication failed${type ? ` (${type})` : ''} — the Admin API requires an Admin API key (sk-ant-admin…), not a standard API key.`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => asApiError(error)?.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	INVALID_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		// GET is retried in the client; mutations are never replayed because the
		// Admin API documents no idempotency key.
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
