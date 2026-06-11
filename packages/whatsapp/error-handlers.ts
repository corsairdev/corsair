import type { CorsairErrorHandler } from 'corsair/core';
import { WhatsappAPIError } from './client';

function isCode(error: Error, codes: number[]): boolean {
	return error instanceof WhatsappAPIError && codes.includes(error.code ?? 0);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) =>
			(error instanceof WhatsappAPIError && error.status === 429) ||
			isCode(error, [4, 17, 32, 613, 80007]),
		handler: async () => ({ maxRetries: 5 }),
	},
	AUTH_ERROR: {
		match: (error) =>
			(error instanceof WhatsappAPIError &&
				(error.status === 401 || isCode(error, [190]))) ||
			error.message.toLowerCase().includes('access token'),
		handler: async (error, context) => {
			console.warn(
				`[WHATSAPP:${context.operation}] Authentication failed: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) =>
			(error instanceof WhatsappAPIError && error.status === 403) ||
			isCode(error, [10, 200]),
		handler: async (error, context) => {
			console.warn(
				`[WHATSAPP:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => error instanceof WhatsappAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error) =>
			/network|connection|econnrefused|enotfound|etimedout|fetch failed/i.test(
				error.message,
			),
		handler: async () => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
