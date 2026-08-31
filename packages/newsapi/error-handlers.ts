import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NewsApiError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof NewsApiError) return error.status;
	return undefined;
}

function codeOf(error: Error): string | undefined {
	if (error instanceof NewsApiError) return error.code;
	return undefined;
}

// makeNewsApiRequest always wraps ApiError into NewsApiError before it
// reaches error-handlers.ts, so NewsApiError.retryAfter (already in ms) is
// the value actually populated here; the ApiError check is a defensive
// fallback for callers that hit corsair/http directly.
function retryAfterOf(error: Error): number | undefined {
	if (error instanceof NewsApiError) return error.retryAfter;
	if (error instanceof ApiError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			const status = statusOf(error);
			if (status === 429) return true;
			const code = codeOf(error);
			return code === 'rateLimited' || code === 'apiKeyExhausted';
		},
		handler: async (error) => {
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfterOf(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (statusOf(error) === 401) return true;
			const code = codeOf(error);
			return (
				code === 'apiKeyMissing' ||
				code === 'apiKeyInvalid' ||
				code === 'apiKeyDisabled'
			);
		},
		handler: async () => {
			return { maxRetries: 0 };
		},
	},
	UPGRADE_REQUIRED_ERROR: {
		match: (error) => {
			if (statusOf(error) === 426) return true;
			const code = codeOf(error);
			return code === 'upgradeRequired' || code === 'maximumResultsReached';
		},
		handler: async () => {
			// The request exceeds what the caller's News API plan tier allows
			// (e.g. historical date range past the free-tier ~1 month window).
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (statusOf(error) === 400) return true;
			const code = codeOf(error);
			return (
				code === 'parametersMissing' ||
				code === 'parameterInvalid' ||
				code === 'sourcesTooMany' ||
				code === 'sourceDoesNotExist'
			);
		},
		handler: async () => {
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => {
			return { maxRetries: 2, retryStrategy: 'linear_1s' };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(`[corsair:${context.pluginId}:${context.operation}]`, {
				error: error.message,
				input: context.input,
			});
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
