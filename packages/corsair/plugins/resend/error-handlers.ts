import { ApiError } from '../../async-core/ApiError';
import type { CorsairErrorHandler } from '../../core/errors';
import { ResendAPIError } from './client';

export const errorHandlers = {
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (
				(error instanceof ApiError && error.status === 403) ||
				(error instanceof ResendAPIError && error.message.includes('Forbidden'))
			) {
				const operation = context.operation.toLowerCase();
				if (
					operation.includes('emails.send') ||
					operation.includes('domains.create')
				) {
					return true;
				}
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission denied') ||
				errorMessage.includes('access denied')
			);
		},
		handler: async (error, context) => {
			return {
				maxRetries: 0,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(`[corsair:${context.pluginId}:${context.operation}]`, {
				error: error.message,
				input: context.input,
			});

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
