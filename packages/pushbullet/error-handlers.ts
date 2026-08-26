import type { CorsairErrorHandler } from 'corsair/core';
import type { PushbulletAPIError } from './client';

/**
 * `makePushbulletRequest` wraps every `ApiError` in a `PushbulletAPIError`,
 * copying status and retry metadata across. Handlers therefore read those
 * fields off the wrapper — an `instanceof ApiError` check is never true by the
 * time an error reaches here, which would silently drop Retry-After.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<PushbulletAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<PushbulletAPIError>).retryAfter;
}

/**
 * Pushbullet returns conventional HTTP statuses with a JSON `error` body.
 * Requests are metered in units — a plain request costs 1, a database
 * operation 4 — so a 429 means the account's unit budget is exhausted and the
 * reset time matters more than immediate retries.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid_access_token') || msg.includes('unauthorized')
			);
		},
		handler: async () => {
			console.warn(
				'[PUSHBULLET] Authentication failed — check the access token from ' +
					'Account Settings is valid and not revoked.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => getStatus(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
