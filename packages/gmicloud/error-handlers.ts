import type { CorsairErrorHandler } from 'corsair/core';
import { GmicloudAPIError } from './client';

// Status codes from the GMI Cloud OpenAPI specs and
// https://docs.gmicloud.ai/inference-engine/api-reference/rate-limit
function statusOf(error: Error): number | undefined {
	return error instanceof GmicloudAPIError ? error.status : undefined;
}

export const errorHandlers = {
	// 400 bad request, 409 state conflict (e.g. sandbox not running), 422 invalid template.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 413 ||
				status === 415 ||
				status === 416 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The key's scope (ie_model or ce_resource) or role does not allow the call.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 410 is an expired build log.
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 404 || status === 410;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Limits are per organization (TPM for LLMs, RPH for media models): wait and retry.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof GmicloudAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A failed create can still have provisioned billed GPUs or queued a job,
	// so 5xx is not replayed.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
