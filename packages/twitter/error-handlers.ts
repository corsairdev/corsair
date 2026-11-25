import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// X answers errors with a meaningful status (401 for a bad or expired token,
// 403 for a missing scope, access tier or app setting, 404, 429 for a rate
// limit or a spent daily cap) and a problem body; client.ts puts X's reason in
// the message. The status is the signal; the message text is a fallback for an
// error that lost it.
function text(error: Error): string {
	return error.message.toLowerCase();
}

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** The longest wait for a rate-limit reset that is retried rather than reported. */
export const X_MAX_RATE_LIMIT_WAIT_MS = 60_000;

/**
 * A 429 for a spent cap rather than a busy window: the monthly usage cap
 * (`UsageCapExceeded`), or a 24-hour or monthly limit such as the DM cap.
 * Waiting a minute doesn't refill it, so it is never retried.
 */
export function isQuotaExhausted(error: Error): boolean {
	const body = error instanceof ApiError ? error.body : undefined;
	const parts: string[] = [error.message];
	if (typeof body === 'string') parts.push(body);
	else if (body && typeof body === 'object') {
		// `unknown` because the problem body's fields are narrowed one by one.
		const fields = body as Record<string, unknown>;
		for (const key of ['title', 'detail', 'type', 'reason']) {
			if (typeof fields[key] === 'string') parts.push(fields[key] as string);
		}
	}
	return /usage ?cap|cap ?exceeded|daily|monthly|24.?hour|quota/i.test(
		parts.join(' '),
	);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 429;
			const msg = text(error);
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		// Core's transport doesn't retry X's 429s (client.ts, X_RATE_LIMIT_CONFIG).
		// A window that resets within a minute is waited out once; a longer one
		// (a 15-minute window, the 24-hour DM cap) goes back to the caller with
		// its reset time instead of holding the call open.
		handler: async (error: Error) => {
			if (isQuotaExhausted(error)) return { maxRetries: 0 };
			const wait = error instanceof ApiError ? error.retryAfter : undefined;
			if (wait !== undefined && wait > 0 && wait <= X_MAX_RATE_LIMIT_WAIT_MS) {
				return { maxRetries: 1, headersRetryAfterMs: wait };
			}
			return { maxRetries: 0 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 401;
			const msg = text(error);
			return msg.includes('unauthorized') || msg.includes('invalid_token');
		},
		// Core refreshes the OAuth token once after a 401 on a read
		// (getOAuthAccessToken's _refreshAuth); a second 401 means reconnect.
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 403;
			const msg = text(error);
			return msg.includes('forbidden') || msg.includes('client-not-enrolled');
		},
		// A missing scope, a route outside the app's access tier (follows, likes
		// and quote posts left self-serve on 2026-04-20), or app-only vs user
		// auth: retrying can't change any of them.
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 404;
			return text(error).includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 400 || code === 409;
			const msg = text(error);
			return msg.includes('bad request') || msg.includes('invalid request');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			return code !== undefined && code >= 500;
		},
		// Not retried: a write (a post, a DM) may already have landed, and the
		// handler can't tell a read from a write.
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
