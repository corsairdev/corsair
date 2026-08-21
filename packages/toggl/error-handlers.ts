import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Toggl answers a bad or revoked API token with 403 — the same status it uses
 * for a genuine permission failure — so the status code alone cannot separate
 * the two. The response body is what distinguishes them: an invalid credential
 * comes back as "Incorrect username and/or password".
 */
function looksLikeInvalidCredentials(error: Error): boolean {
	const parts: string[] = [error.message];
	if (error instanceof ApiError) {
		parts.push(
			typeof error.body === 'string' ? error.body : JSON.stringify(error.body),
		);
	}

	const haystack = parts.join(' ').toLowerCase();
	return (
		haystack.includes('incorrect username and/or password') ||
		haystack.includes('invalid api token') ||
		haystack.includes('invalid token')
	);
}

export const errorHandlers = {
	/**
	 * Toggl paces requests with a leaky bucket at roughly 1 req/sec per token
	 * per IP and returns 429 once it overflows. The `/me` endpoint is stricter
	 * still: 30 requests per hour per user regardless of plan.
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			// 429 is the leaky bucket. 402 is the separate sliding-window quota
			// Toggl applies per organization, which also clears with time.
			if (
				error instanceof ApiError &&
				(error.status === 429 || error.status === 402)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('too many requests') ||
				errorMessage.includes('quota exceeded') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * Matched before PERMISSION_ERROR so that a 403 carrying an invalid-token
	 * body is reported as an authentication failure rather than a missing
	 * permission. The two handlers are mutually exclusive.
	 */
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			if (looksLikeInvalidCredentials(error)) {
				return true;
			}
			return error.message.toLowerCase().includes('authentication');
		},
		handler: async (error, context) => {
			console.warn(
				`[TOGGL:${context.operation}] Authentication failed - check your API token (Profile Settings > API Token)`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, context) => {
			// A 403 caused by a bad credential belongs to AUTH_ERROR.
			if (looksLikeInvalidCredentials(error)) {
				return false;
			}
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('user does not have access') ||
				errorMessage.includes('insufficient permissions')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TOGGL:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				errorMessage.includes('does not exist')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TOGGL:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	VALIDATION_ERROR: {
		match: (error, context) => {
			return error instanceof ApiError && error.status === 400;
		},
		handler: async (error, context) => {
			console.warn(
				`[TOGGL:${context.operation}] Invalid request: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TOGGL:${context.operation}] Network error: ${error.message}`,
			);

			return {
				maxRetries: 3,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[TOGGL:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
