import type { CorsairErrorHandler } from 'corsair/core';
import type { WorkiomAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<WorkiomAPIError>).status;
}

function messageHasCode(message: string, ...codes: number[]): boolean {
	return codes.some((code) => new RegExp(`\\b${code}\\b`).test(message));
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
			return messageHasCode(error.message.toLowerCase(), 429);
		},
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 401 || status === 403;
			const msg = error.message.toLowerCase();
			return messageHasCode(msg, 401, 403) || msg.includes('unauthorized');
		},
		handler: async () => {
			console.error('[WORKIOM] Authentication failed — check the API key.');
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 404;
			return messageHasCode(error.message.toLowerCase(), 404);
		},
		handler: async () => {
			console.warn('[WORKIOM] Resource not found.');
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 400 || status === 422;
			return messageHasCode(error.message.toLowerCase(), 400, 422);
		},
		handler: async () => {
			console.warn('[WORKIOM] Request rejected — check required parameters.');
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status >= 500;
			return messageHasCode(error.message.toLowerCase(), 500);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[WORKIOM] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
