import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Core error bodies arrive as unknown because provider failures have no static type.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function providerErrorName(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	// Stack Exchange's HTTP error body is untrusted until the wrapper is narrowed.
	const body: unknown = error.body;
	if (!isRecord(body) || typeof body.error_name !== 'string') return undefined;
	return body.error_name;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			['throttle_violation', 'temporarily_unavailable'].includes(
				providerErrorName(error) ?? '',
			) ||
			/rate limit|too many requests|\b429\b/i.test(error.message),
		handler: async (error: Error) => ({
			// The shared transport owns 429 retries and exposes Retry-After;
			// do not add a second retry loop around its exhausted attempts.
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				[401, 402, 403, 405, 406].includes(error.status)) ||
			[
				'access_token_required',
				'invalid_access_token',
				'access_denied',
				'key_required',
				'access_token_compromised',
			].includes(providerErrorName(error) ?? '') ||
			/unauthorized|forbidden|invalid access token/i.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const name = providerErrorName(error);
			return (
				['bad_parameter', 'write_failed'].includes(name ?? '') ||
				(error instanceof ApiError && error.status === 422) ||
				(error instanceof ApiError &&
					error.status === 400 &&
					name === undefined) ||
				(/bad parameter|bad request|invalid request/i.test(error.message) &&
					name === undefined)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 404) ||
			providerErrorName(error) === 'no_method',
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status >= 500) ||
			providerErrorName(error) === 'internal_error',
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
