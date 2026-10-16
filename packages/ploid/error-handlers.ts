import type { CorsairErrorHandler } from 'corsair/core';
import { PloidAPIError } from './client';

function asPloidError(error: Error): PloidAPIError | undefined {
	return error instanceof PloidAPIError ? error : undefined;
}

function getStatus(error: Error): number | undefined {
	return asPloidError(error)?.status;
}

function getCode(error: Error): string | undefined {
	return asPloidError(error)?.code;
}

function hasCode(error: Error, codes: string[]): boolean {
	const code = getCode(error);
	return code !== undefined && codes.includes(code);
}

// Dispatch is first-match, so order is load-bearing:
// - VALIDATION_ERROR first: a zod failure must never be replayed, and a 422
//   body must not fall through to a status-based matcher.
// - PAYMENT_ERROR before RATE_LIMIT_ERROR: budget denials are terminal until
//   the budget window resets, even though the docs group them with limits.
export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || getStatus(error) === 422,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			getStatus(error) === 401 ||
			hasCode(error, [
				'missing_api_key',
				'invalid_api_key',
				'expired_api_key',
				'revoked_api_key',
			]),
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	PAYMENT_ERROR: {
		match: (error: Error) =>
			getStatus(error) === 402 ||
			hasCode(error, [
				'insufficient_acu',
				'daily_budget_exceeded',
				'monthly_budget_exceeded',
			]),
		// A 402 can trigger the workspace's auto-recharge preflight; replaying
		// it is the caller's decision, not ours.
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			getStatus(error) === 429 || getCode(error) === 'rate_limited',
		// 429s are rejected before processing and never billed. The docs
		// require honoring Retry-After with jitter; the framework backoff adds
		// the jitter. 4 attempts total (1 initial + 3 retries).
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asPloidError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			getStatus(error) === 404 || getStatus(error) === 410,
		// 404 is an unknown resource and 410 an expired run; both are facts
		// about the request, not transient states.
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	CONFLICT_ERROR: {
		match: (error: Error) => getStatus(error) === 409,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		// The docs prescribe bounded exponential backoff for transient 5xx, and
		// failed requests are not billed. 3 attempts total. The shared client
		// does not extract Retry-After on 5xx, so none is promised here.
		handler: async (_error: Error) => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			['timeout', 'timed out', 'aborted'].some((needle) =>
				error.message.toLowerCase().includes(needle),
			),
		// A timed-out write may have been accepted; replaying it without an
		// idempotency key could bill twice.
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
