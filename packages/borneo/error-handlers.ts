import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Matches HTTP 429 responses represented as Corsair ApiError instances.
 */
function matchesRateLimitError(error: Error): boolean {
	return error instanceof ApiError && error.status === 429;
}

/**
 * Describes framework retry metadata for a surfaced rate-limit error.
 */
async function handleRateLimitError(error: Error) {
	return {
		// Safe read retries are handled inside the Borneo transport.
		// Retrying the whole endpoint here could replay write/destructive
		// operations whose upstream side effects may already have occurred.
		maxRetries: 0,
		headersRetryAfterMs:
			error instanceof ApiError ? error.retryAfter : undefined,
	};
}

/**
 * Matches provider authentication and authorization failures.
 */
function matchesAuthError(error: Error): boolean {
	return (
		error instanceof ApiError && (error.status === 401 || error.status === 403)
	);
}

/**
 * Prevents framework-level retries for authentication failures.
 */
async function handleAuthError() {
	return { maxRetries: 0 };
}

/**
 * Matches errors not handled by a more specific Borneo error handler.
 */
function matchesDefaultError(): boolean {
	return true;
}

/**
 * Disables framework-level retries for unspecified Borneo failures.
 */
async function handleDefaultError() {
	return { maxRetries: 0 };
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: matchesRateLimitError,
		handler: handleRateLimitError,
	},
	AUTH_ERROR: {
		match: matchesAuthError,
		handler: handleAuthError,
	},
	DEFAULT: {
		match: matchesDefaultError,
		handler: handleDefaultError,
	},
} satisfies CorsairErrorHandler;
