import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Kernel answers errors as `{ code, message, details? }` with a meaningful
// HTTP status (https://www.kernel.sh/docs/api-reference). The status is the
// signal; the message text is a fallback for an error that lost it.
function text(error: Error): string {
	return error.message.toLowerCase();
}

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 429;
			const msg = text(error);
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		// Core's request() has already retried this 429 (three times, honouring
		// Retry-After) before it reaches a handler. Retrying the endpoint again
		// would multiply the attempts. A 429 can also mean the org's concurrent
		// browser limit is reached, which only deleting a browser fixes.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 401 || code === 403;
			const msg = text(error);
			return msg.includes('unauthorized') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 404;
			return text(error).includes('not found');
		},
		// A browser that hit its idle timeout is gone: retrying won't bring it back.
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) {
				return code === 400 || code === 409 || code === 422;
			}
			const msg = text(error);
			return msg.includes('bad request') || msg.includes('invalid input');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			return code !== undefined && code >= 500;
		},
		// Not retried: a write (a browser create, a Playwright run) may already
		// have happened, and the handler can't tell a read from a write.
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
