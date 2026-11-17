import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SquareNetworkError, squareErrors } from './client';

/**
 * Operations whose request Square's spec requires an `idempotency_key` for.
 * The key is always present, and Square answers a repeated key with the first
 * result instead of acting twice, so a retry cannot charge or create twice.
 * disputes.createEvidenceFile carries the key in its JSON `request` part.
 * plugin.test.ts checks this list against the input schemas.
 */
export const KEY_REQUIRED_OPERATIONS = [
	'cards.create',
	'catalog.upsert',
	'disputes.createEvidenceFile',
	'disputes.createEvidenceText',
	'orders.pay',
	'payments.cancelByIdempotencyKey',
	'payments.create',
	'payments.refund',
	'payments.update',
] as const;

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function hasCategory(error: Error, category: string): boolean {
	return squareErrors(error).some((e) => e.category === category);
}

/**
 * The built-in handlers. Core runs the whole endpoint again on a handler
 * retry, with the same input, so a retry must never repeat a side effect.
 * `replayable` names the operations that may be sent again after a 5xx or a
 * dropped connection, when the first attempt may have run: reads and the
 * KEY_REQUIRED_OPERATIONS. Core's ErrorContext gives the operation as its
 * dot path (core/errors/handler.ts, core/endpoints/bind.ts).
 */
export function squareErrorHandlers(replayable: ReadonlySet<string>) {
	return {
		// A declined card or refund is Square's answer, not a transient fault.
		PAYMENT_METHOD_ERROR: {
			match: (error: Error) =>
				hasCategory(error, 'PAYMENT_METHOD_ERROR') ||
				hasCategory(error, 'REFUND_ERROR'),
			handler: async () => ({ maxRetries: 0 }),
		},
		// Core's request() has already retried this 429 three times, honouring
		// Retry-After when Square sends one. Retrying the endpoint again here
		// would multiply the attempts.
		RATE_LIMIT_ERROR: {
			match: (error: Error) => statusOf(error) === 429,
			handler: async () => ({ maxRetries: 0 }),
		},
		// A 5xx or no response: the request may have run. Replayed only for the
		// operations in `replayable`; every other write is left to the caller.
		SERVER_ERROR: {
			match: (error: Error) => {
				const status = statusOf(error);
				return (
					error instanceof SquareNetworkError ||
					(status !== undefined && status >= 500 && status < 600)
				);
			},
			handler: async (_error: Error, context: ErrorContext) =>
				replayable.has(context.operation)
					? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
					: { maxRetries: 0 },
		},
		// An expired, revoked or under-scoped token: sending it again cannot
		// work. client.ts has already refreshed an OAuth token once on a 401.
		AUTH_ERROR: {
			match: (error: Error) => {
				const status = statusOf(error);
				return (
					status === 401 ||
					status === 403 ||
					hasCategory(error, 'AUTHENTICATION_ERROR')
				);
			},
			handler: async () => ({ maxRetries: 0 }),
		},
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		},
	} satisfies CorsairErrorHandler;
}
