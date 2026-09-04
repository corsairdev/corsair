import type { CorsairErrorHandler } from 'corsair/core';
import type { TimecampAPIError } from './client';

/**
 * `makeTimecampRequest` wraps every `ApiError` in a `TimecampAPIError`, copying
 * the status and retry metadata across. Handlers therefore have to read those
 * fields off the wrapper — an `instanceof ApiError` check is never true by the
 * time an error reaches here, which would silently drop the provider's
 * Retry-After and fall back to generic backoff.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<TimecampAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<TimecampAPIError>).retryAfter;
}

/**
 * TimeCamp answers with conventional HTTP statuses. The notable case is 403:
 * API access requires a paid plan, so a correctly-formed request with a valid
 * token still fails on a free account. That is a configuration problem, not a
 * transient one, and must not be retried.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 401;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid token');
		},
		handler: async () => {
			console.warn(
				'[TIMECAMP] Authentication failed — check that the API token from ' +
					'Account Settings is valid.',
			);
			return { maxRetries: 0 };
		},
	},
	PLAN_OR_PERMISSION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 403;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden');
		},
		handler: async () => {
			console.warn(
				'[TIMECAMP] Request forbidden — TimeCamp restricts API access to ' +
					'paid plans, so a valid token on a free account still fails.',
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
