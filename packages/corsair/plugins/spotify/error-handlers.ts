import { ApiError } from '../../async-core/ApiError';
import type { CorsairErrorHandler } from '../../core/errors';

/**
 * Error Handlers Configuration
 * 
 * CONFIGURATION:
 * Customize these error handlers to match your provider's error patterns.
 * 
 * Each handler has two parts:
 * 1. match: Function that determines if an error matches this handler
 * 2. handler: Function that returns retry configuration
 * 
 * You can:
 * - Add more error patterns to match() functions
 * - Adjust maxRetries based on error type
 * - Add provider-specific error codes
 * - Remove handlers you don't need
 * - Add custom handlers for provider-specific errors
 */
export const errorHandlers = {
	/**
	 * Rate Limit Error Handler
	 * 
	 * CONFIGURATION:
	 * - Update match() to check for your provider's rate limit error patterns
	 * - Adjust maxRetries (default: 5)
	 * - The handler will respect Retry-After headers if available
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				errorMessage.includes('too_many_requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * Authentication Error Handler
	 * 
	 * CONFIGURATION:
	 * - Update match() to check for your provider's auth error patterns
	 * - maxRetries: 0 (no retries for auth errors - they won't succeed)
	 * - Add provider-specific auth error codes/messages
	 */
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication failed') ||
				errorMessage.includes('invalid_token') ||
				errorMessage.includes('token_expired') ||
				errorMessage.includes('invalid_grant')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[SPOTIFY:${context.operation}] Authentication failed - check your access token`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Permission Error Handler
	 * 
	 * CONFIGURATION:
	 * - Update match() to check for your provider's permission error patterns
	 * - maxRetries: 0 (no retries for permission errors)
	 * - Add provider-specific permission error codes/messages
	 */
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('access_denied') ||
				errorMessage.includes('insufficient_permissions') ||
				errorMessage.includes('insufficient_scope')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[SPOTIFY:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0, // No retries for permission errors
			};
		},
	},
	/**
	 * Default Error Handler
	 * 
	 * CONFIGURATION:
	 * - This catches all errors not matched by other handlers
	 * - maxRetries: 0 (default - change if you want to retry unknown errors)
	 * - Consider adding more specific handlers before this one
	 */
	DEFAULT: {
		match: (error, context) => {
			return true; // Matches all errors
		},
		handler: async (error, context) => {
			console.error(
				`[SPOTIFY:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
