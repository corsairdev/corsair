import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { WhatsappAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof WhatsappAPIError) return error.status;
	if (error instanceof ApiError) return error.status;
	return undefined;
}

function graphCodeOf(error: Error): number | undefined {
	if (error instanceof WhatsappAPIError) return error.code;
	if (!(error instanceof ApiError)) return undefined;

	const body = error.body;
	if (!body || typeof body !== 'object' || !('error' in body)) return undefined;
	const graphError = body.error;
	if (
		!graphError ||
		typeof graphError !== 'object' ||
		!('code' in graphError)
	) {
		return undefined;
	}
	return typeof graphError.code === 'number' ? graphError.code : undefined;
}

function isCode(error: Error, codes: number[]): boolean {
	return codes.includes(graphCodeOf(error) ?? 0);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) =>
			statusOf(error) === 429 || isCode(error, [4, 17, 32, 613, 80007]),
		handler: async (error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error) =>
			statusOf(error) === 401 ||
			isCode(error, [190]) ||
			error.message.toLowerCase().includes('access token'),
		handler: async (error, context) => {
			console.warn(
				`[WHATSAPP:${context.operation}] Authentication failed: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => statusOf(error) === 403 || isCode(error, [10, 200]),
		handler: async (error, context) => {
			console.warn(
				`[WHATSAPP:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error) =>
			/network|connection|econnrefused|enotfound|etimedout|fetch failed/i.test(
				error.message,
			),
		handler: async () => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
