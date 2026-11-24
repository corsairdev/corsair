import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// `unknown` because Graph error bodies differ by family and are untrusted JSON.
function graphErrorCodeFromBody(body: unknown): number | undefined {
	if (typeof body !== 'object' || body === null || !('error' in body))
		return undefined;
	const detail = body.error;
	if (typeof detail !== 'object' || detail === null || !('code' in detail))
		return undefined;
	const code = detail.code;
	return typeof code === 'number' && Number.isInteger(code) ? code : undefined;
}

const graphRateLimitCodes = new Set([4, 17, 613, 80000, 80003, 80004, 80014]);

// `unknown` because the shared transport passes untrusted provider error JSON to this matcher.
export function isMetaGraphRateLimitResponse(
	status: number,
	body: unknown,
): boolean {
	if (status === 429) return true;
	const code = graphErrorCodeFromBody(body);
	return code !== undefined && graphRateLimitCodes.has(code);
}

function isRateLimitError(error: Error): boolean {
	if (!(error instanceof ApiError)) return false;
	return isMetaGraphRateLimitResponse(error.status, error.body);
}

function isAuthError(error: Error): boolean {
	if (!(error instanceof ApiError)) return false;
	if (error.status === 401 || error.status === 403) return true;
	const code = graphErrorCodeFromBody(error.body);
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
