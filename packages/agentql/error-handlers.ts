import type { CorsairErrorHandler } from 'corsair/core';
import type { AgentQLAPIError } from './client';

// Cast to Partial<AgentQLAPIError> because the error handler receives a base
// Error type from the Corsair framework; AgentQLAPIError fields are optional
// extras that may not be present on every Error subclass.
function getStatus(error: Error): number | undefined {
	return (error as Partial<AgentQLAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AgentQLAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('rate_limited') || message.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') || message.includes('invalid_auth')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
