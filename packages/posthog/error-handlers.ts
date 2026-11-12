import type { CorsairErrorHandler } from 'corsair/core';
import type { PostHogAPIError } from './client';

// Cast to Partial<PostHogAPIError> because the error handler receives a base
// Error type from the Corsair framework; PostHogAPIError fields are optional
// extras that may not be present on every Error subclass, so Partial is the
// safest narrowing without introducing a separate runtime instanceof check.
function getStatus(error: Error): number | undefined {
	return (error as Partial<PostHogAPIError>).status;
}

const CAPTURE_OPERATIONS = new Set([
	'aliasCreate',
	'eventCreate',
	'identityCreate',
	'trackPage',
	'trackScreen',
]);

/**
 * True for actions that create something (`insights.create`,
 * `notebooks.create`, ...) and for the five capture actions (`events.*`).
 */
export function isNonIdempotent(operation: string): boolean {
	const action = operation.split('.').pop() ?? '';
	return action === 'create' || CAPTURE_OPERATIONS.has(action);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('429') || message.includes('rate limit');
		},
		// corsair/http already retried the 429 (3 times, honouring Retry-After)
		// before the error got here; retrying again would multiply the waits.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error) => {
			if (getStatus(error) === 401) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid api key') ||
				message.includes('personal api key (phx_') ||
				message.includes('authentication')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[POSTHOG:${context.operation}] Authentication failed - check your API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (getStatus(error) === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('forbidden') ||
				message.includes('permission') ||
				message.includes('access denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[POSTHOG:${context.operation}] Permission denied: ${error.message}. A personal API key needs the matching scope (for example insight:read).`,
			);
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (getStatus(error) === 400) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('bad request') ||
				message.includes('invalid request') ||
				message.includes('validation')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[POSTHOG:${context.operation}] Bad request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const message = error.message.toLowerCase();
			return message.includes('500') || message.includes('server error');
		},
		// A create or a capture may have gone through before the 5xx, so
		// sending it again could make a duplicate. Reads and updates retry.
		handler: async (_error, context) =>
			isNonIdempotent(context.operation)
				? { maxRetries: 0 }
				: {
						maxRetries: 2,
						retryStrategy: 'exponential_backoff' as const,
					},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[POSTHOG:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
