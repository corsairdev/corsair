import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { z } from 'zod';

// Kling error reference: https://kling.ai/document-api/api/get-started/error-codes
// Non-2xx responses carry an application-level `code` alongside the HTTP status.
const KlingErrorBodySchema = z.object({
	code: z.number().optional(),
	message: z.string().optional(),
});

// `error.body` is unbounded wire JSON on ApiError, so it is parsed through a
// narrow schema instead of being read directly.
function klingErrorCode(error: Error): number | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const parsed = KlingErrorBodySchema.safeParse(error.body);
	return parsed.success ? parsed.data.code : undefined;
}

export const errorHandlers = {
	// Account-level 429 responses (1100 account status, 1101 arrears, 1102
	// resource pack exhausted/expired) share the retryable status code but
	// cannot succeed on retry until the account is funded again, so they are
	// matched before RATE_LIMIT_ERROR (the framework uses first match wins).
	ACCOUNT_ERROR: {
		match: (error: Error) => {
			const code = klingErrorCode(error);
			if (code === 1100 || code === 1101 || code === 1102) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('arrears') ||
				msg.includes('resource pack') ||
				msg.includes('account')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			// 429 covers transient throttling (1302 rate limit, 1303
			// concurrency) and IP whitelist (1304) responses.
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('parallel task')
			);
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
			// 401 = authentication failed (codes 1000-1004); 403 = no access to
			// the requested resource (code 1103). Neither succeeds on retry.
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('authentication failed') ||
				msg.includes('forbidden') ||
				msg.includes('authorization')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			// 400/422 = invalid parameters (codes 1200/1201, 1300/1301);
			// 404 = unknown task (codes 1202/1203). None succeed on retry.
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 404 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid request') ||
				msg.includes('invalid parameters') ||
				msg.includes('not found') ||
				msg.includes('unprocessable')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
