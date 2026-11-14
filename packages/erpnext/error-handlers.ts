import type {
	CorsairErrorHandler,
	EndpointRiskLevel,
	ErrorContext,
} from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ErpnextAPIError } from './client';
import { ERPNEXT_OPERATIONS } from './operations';

function statusOf(error: Error): number | undefined {
	// JSON calls throw core's ApiError unchanged; binary downloads throw
	// ErpnextAPIError with the same status field.
	if (error instanceof ApiError || error instanceof ErpnextAPIError) {
		return error.status;
	}
	return undefined;
}

const riskByOperation = new Map<string, EndpointRiskLevel>(
	ERPNEXT_OPERATIONS.map(({ key, riskLevel }) => [key, riskLevel]),
);

/**
 * A retry decision here replays the *whole endpoint*: the shared binder
 * re-invokes the endpoint function when a handler returns `maxRetries > 0`.
 * Replaying a create/update/delete after an ambiguous failure could apply
 * the change twice, so only operations marked `read` are retried. Unknown
 * paths default to unsafe.
 */
function isReplaySafe(context: ErrorContext): boolean {
	return riskByOperation.get(context.operation) === 'read';
}

// Annotated (not just `satisfies`) so callers see the shared 2-argument
// matcher/handler signatures: a bare `satisfies` keeps the narrower literal
// lambda types (e.g. a 1-parameter match), and a caller passing the full
// (error, context) pair would fail the type check.
export const errorHandlers: CorsairErrorHandler = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Core's request() already retried the 429 three times, honouring
		// Retry-After, so the handler does not replay the endpoint again.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (_error: Error, context: ErrorContext) =>
			isReplaySafe(context)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
