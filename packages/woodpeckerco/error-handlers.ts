import type { CorsairErrorHandler } from 'corsair/core';
import { WoodpeckerCoAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof WoodpeckerCoAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof WoodpeckerCoAPIError ? error.code : undefined;
}

// Status codes: https://developers.woodpecker.co/docs/getting-started/error-codes.md
// and the Response section of each endpoint's page.
export const errorHandlers = {
	// Limits are per account: one request runs and six can wait, and anything
	// past that is dropped unprocessed, so retrying a write here cannot repeat
	// it. v2 answers 429; v1 answers 409 E_TOO_MANY_REQUESTS.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof WoodpeckerCoAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof WoodpeckerCoAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 on both versions: a wrong or expired key, or on v2 a missing API
	// add-on. v1 labels it E_SESSION.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || codeOf(error) === 'E_SESSION',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the subscription lacks the API add-on or a feature the campaign uses.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 || codeOf(error) === 'E_NO_PERMISSION',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 that is not a rate limit. campaigns.run: VALIDATION_FAILURE or
	// API_UNSUPPORTED_CAMPAIGN_FEATURES. campaigns.deleteStep:
	// BRANCH_NOT_DELETABLE or NOT_EDITABLE_STATUS. The campaign has to change
	// before a retry can work.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input (on prospects.addToCampaign, also "none were added")
	// and 404 unknown campaign or step. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Woodpecker says to try a 500 again later. Only reads are replayed: a
	// failed write may have gone through, and deleteStep is not repeatable.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof WoodpeckerCoAPIError &&
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
