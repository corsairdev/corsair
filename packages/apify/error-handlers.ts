import { ApiError } from 'corsair/http';
import type { CorsairErrorHandler } from 'corsair/core';

type ApifyErrorBody = {
	error?: {
		type?: string;
		message?: string;
	};
};

function getApifyErrorType(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = error.body as ApifyErrorBody | undefined;
	return body?.error?.type;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (!(error instanceof ApiError)) return false;
			if (error.status === 429) return true;
			return getApifyErrorType(error) === 'rate-limit-exceeded';
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (!(error instanceof ApiError)) return false;
			if (error.status === 401) return true;
			const type = getApifyErrorType(error);
			return type === 'token-not-provided' || type === 'token-not-valid';
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
