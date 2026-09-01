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
 * Whether replaying the failed request is safe.
 *
 * A 5xx does not mean the request was rejected - Pushbullet may have created
 * the push, device or chat and then failed to respond. Replaying a POST would
 * duplicate it, so only GET and DELETE (both idempotent) are retried. When the
 * method is unknown, the request is treated as unsafe.
 */
function isIdempotent(error: Error): boolean {
	const method = (error as Partial<PushbulletAPIError>).method;
	return method === 'GET' || method === 'DELETE';
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
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		// corsair/http already retried this 429 three times honoring
		// Retry-After before the error escaped the transport (async-core
		// request(), DEFAULT_RATE_LIMIT_CONFIG). Re-running the endpoint here
		// would multiply those attempts (up to 16) and replay a POST the
		// server may already have applied.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 401 || status === 403;
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
			// Non-idempotent writes are never replayed - see isIdempotent.
			maxRetries: isIdempotent(error) ? 2 : 0,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
