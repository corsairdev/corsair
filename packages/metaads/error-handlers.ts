import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function graphErrorCode(error: Error): number | undefined {
	if (!(error instanceof ApiError)) return undefined;
	// `unknown` because Graph error bodies differ by error family and are untrusted JSON.
	const body: unknown = error.body;
	if (typeof body !== 'object' || body === null || !('error' in body))
		return undefined;
	const detail = body.error;
	if (typeof detail !== 'object' || detail === null || !('code' in detail))
		return undefined;
	const code = detail.code;
	return typeof code === 'number' ? code : undefined;
}

function isRateLimitError(error: Error): boolean {
	if (error instanceof ApiError && error.status === 429) return true;
	const code = graphErrorCode(error);
	return (
		code !== undefined &&
		[4, 17, 613, 80000, 80003, 80004, 80014].includes(code)
	);
}

function isAuthError(error: Error): boolean {
	if (
		error instanceof ApiError &&
		(error.status === 401 || error.status === 403)
	)
		return true;
	const code = graphErrorCode(error);
	return code === 10 || code === 190 || code === 200 || code === 294;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: isRateLimitError,
		// Meta quotas include daily/account exhaustion; callers decide when it is safe to retry.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
