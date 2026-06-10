import type { CorsairErrorHandler } from 'corsair/core';

/**
 * Read an HTTP status off the thrown error. The Zoho client rethrows API
 * failures as `ZohoMailAPIError` (which carries `.status`); raw `ApiError`s from
 * the shared HTTP layer also expose `.status`.
 */
function statusOf(error: Error): number | undefined {
	const status = (error as { status?: unknown }).status;
	return typeof status === 'number' ? status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (statusOf(error) === 429) {
				return true;
			}
			const message = error.message.toLowerCase();
			return (
				message.includes('429') ||
				message.includes('rate limit') ||
				message.includes('ratelimit') ||
				message.includes('throttl') ||
				// Zoho throttling error codes
				message.includes('u0006') ||
				message.includes('limit_exceeded')
			);
		},
		handler: async () => {
			return {
				maxRetries: 5,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (statusOf(error) === 401) {
				return true;
			}
			const message = error.message.toLowerCase();
			return (
				message.includes('invalid_oauthtoken') ||
				message.includes('invalid oauthtoken') ||
				message.includes('invalid_token') ||
				message.includes('unauthorized') ||
				message.includes('authentication')
			);
		},
		handler: async (error, context) => {
			// The Zoho client already retries 401 once with a refreshed token, so a
			// 401 reaching here means the refresh did not resolve it.
			console.warn(
				`[ZOHOMAIL:${context.operation}] Authentication failed — check the access/refresh token and OAuth scopes`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (statusOf(error) === 403) {
				return true;
			}
			const message = error.message.toLowerCase();
			return (
				message.includes('no_permission') ||
				message.includes('forbidden') ||
				message.includes('not authorized')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ZOHOMAIL:${context.operation}] Permission denied: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (statusOf(error) === 404) {
				return true;
			}
			const message = error.message.toLowerCase();
			return (
				message.includes('not found') ||
				message.includes('invalid_zoid') ||
				message.includes('nosuch')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ZOHOMAIL:${context.operation}] Not found: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[ZOHOMAIL:${context.operation}] Unhandled error: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
