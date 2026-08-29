import type { CorsairErrorHandler } from 'corsair/core';
import { ArynAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ArynAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		/**
		 * `maxRetries: 0` is deliberate and prevents retry amplification:
		 *
		 * - JSON endpoints go through `corsair/http`'s `request()`, which
		 *   already retries HTTP 429 internally up to 3 times and honors the
		 *   server's Retry-After header (async-core/rate-limit.ts).
		 * - Binary downloads retry 429 inside `makeArynBinaryRequest`
		 *   (also honoring Retry-After).
		 *
		 * Retrying again at the plugin-binding layer would multiply these
		 * loops (e.g. 4 transport attempts x 6 operation attempts = up to 24
		 * provider requests for a single operation), so the binding-level
		 * handler surfaces the error as soon as both inner budgets are spent.
		 */
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ArynAPIError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
