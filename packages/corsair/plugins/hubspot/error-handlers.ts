import { ApiError } from '../../async-core/ApiError';
import type { CorsairErrorHandler } from '../../core/errors';
import { HubSpotAPIError } from './client';

export const errorHandlers = {
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (
				(error instanceof ApiError && error.status === 403) ||
				(error instanceof HubSpotAPIError && error.code === 403)
			) {
				const operation = context.operation.toLowerCase();
				if (operation.includes('tickets')) {
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
	VALIDATION_ERROR: {
		match: (error, context) => {
			if (
				(error instanceof ApiError && error.status === 400) ||
				(error instanceof HubSpotAPIError && error.code === 400)
			) {
				const operation = context.operation.toLowerCase();
				if (operation.includes('engagements.create')) {
					return true;
				}
			}
			return false;
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
