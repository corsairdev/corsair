import type { CorsairErrorHandler } from 'corsair/core';
import type { MailboxLayerAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<MailboxLayerAPIError>).status;
}

function getApiCode(error: Error): number | undefined {
	return (error as Partial<MailboxLayerAPIError>).apiCode;
}

export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			if (code === 101 || code === 106) return true;
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid_access_key') || msg.includes('inactive_user')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	QUOTA_ERROR: {
		match: (error: Error) => getApiCode(error) === 104,
		handler: async () => ({ maxRetries: 0 }),
	},
	HTTPS_RESTRICTED_ERROR: {
		match: (error: Error) => getApiCode(error) === 105,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			return code === 103 || code === 210 || code === 211;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: (error as Partial<MailboxLayerAPIError>)
					.retryAfter,
			};
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('500') || msg.includes('internal server error');
		},
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
