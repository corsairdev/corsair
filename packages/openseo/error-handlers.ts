import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { OpenseoAPIError } from './client';

// OpenSEO answers HTTP errors only for the key (401 `invalid_api_key`, 403
// `account_access_revoked`) and rate limits (429 `rate_limited` /
// `usage_exceeded` with Retry-After). Everything else is a tool result with
// `isError: true` whose text is an OpenSEO error code (`NOT_FOUND`,
// `INSUFFICIENT_CREDITS`) or a sentence, so the text is matched too.
//
// No handler retries: core's request() already retries a 429 three times
// (honouring Retry-After), and most tools spend credits, so a failed call is
// never replayed blindly.
function text(error: Error): string {
	// A structured AI visibility error keeps its code apart from its sentence.
	const code = error instanceof OpenseoAPIError ? (error.code ?? '') : '';
	return `${error.message} ${code}`.toLowerCase();
}

export const errorHandlers = {
	// Out of credits or a plan feature (paid plan, payment method): a retry
	// cannot succeed until the account is topped up or upgraded.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = text(error);
			return (
				msg.includes('insufficient_credits') ||
				msg.includes('enough credits') ||
				msg.includes('payment_required') ||
				msg.includes('payment_method_required') ||
				msg.includes('payment_action_required') ||
				msg.includes('usage_exceeded')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 429;
			const msg = text(error);
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = text(error);
			return (
				msg.includes('invalid_api_key') ||
				msg.includes('account_access_revoked') ||
				msg.includes('unauthorized') ||
				// OpenSEO's bare FORBIDDEN code; not any sentence that says "forbidden".
				(error instanceof OpenseoAPIError &&
					(error.code === 'FORBIDDEN' || error.message === 'FORBIDDEN'))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = text(error);
			return msg.includes('not_found') || msg.includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = text(error);
			return (
				msg.includes('validation_error') ||
				msg.includes('input validation error') ||
				msg.includes('unknown_location') ||
				msg.includes('conflict')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// The data provider behind OpenSEO is down; OpenSEO says this is not a
	// problem with the request. Not retried here: the call may be a paid one.
	UPSTREAM_UNAVAILABLE_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status >= 500) return true;
			const msg = text(error);
			return (
				msg.includes('upstream_unavailable') ||
				msg.includes('temporarily unavailable')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
