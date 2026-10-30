import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * API Ninjas answers almost every failure with `400`.
 *
 * A missing key, an invalid key, a premium-gated endpoint, an exhausted monthly
 * quota and an ordinary bad parameter all share that status, so the status code
 * on its own cannot say what went wrong - the body has to be read. There is no
 * `401` and no `403` anywhere on this surface.
 *
 * The message also lives under two different keys: `error` on a 400, `message`
 * on a 404 or a 5xx.
 *
 * @see https://api-ninjas.com/error-codes
 */
function errorText(error: Error): string {
	const parts: string[] = [error.message];

	if (error instanceof ApiError) {
		const body = error.body as unknown;
		if (typeof body === 'string') {
			parts.push(body);
		} else if (body && typeof body === 'object') {
			const record = body as Record<string, unknown>;
			for (const key of ['error', 'message', 'detail'] as const) {
				if (typeof record[key] === 'string') {
					parts.push(record[key] as string);
				}
			}
		}
	}

	return parts.join(' ').toLowerCase();
}

const isCredentialFailure = (error: Error): boolean => {
	const text = errorText(error);
	return text.includes('missing api key') || text.includes('invalid api key');
};

/**
 * Quota exhaustion arrives as a 400 reading "Monthly quota exceeded", not as a
 * 429, so a caller that only watched the status would report it as a bad
 * request for the rest of the billing month.
 */
const isQuotaFailure = (error: Error): boolean => {
	const text = errorText(error);
	return text.includes('quota exceeded') || text.includes('quota has been');
};

/**
 * The free tier withholds data in two visible ways: it rejects a whole endpoint,
 * and it rejects an individual parameter. Both are plan problems rather than
 * caller mistakes, so both are reported as a permission failure and never
 * retried - the answer will not change until the plan does.
 */
const isPlanFailure = (error: Error): boolean => {
	const text = errorText(error);
	return (
		text.includes('premium subscriber') ||
		text.includes('premium subscription') ||
		text.includes('is for premium') ||
		text.includes('available to premium') ||
		text.includes('down for free users')
	);
};

const status = (error: Error): number | undefined =>
	error instanceof ApiError ? error.status : undefined;

export const errorHandlers = {
	/**
	 * Matched before the plan and bad-request handlers so an exhausted quota is
	 * never mistaken for either. `maxRetries` is 0 deliberately: the monthly
	 * allowance does not come back within a retry window, and every attempt
	 * spends an hour's worth of goodwill for nothing.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (status(error) === 429) return true;
			return isQuotaFailure(error);
		},
		handler: async (error, context) => {
			if (isQuotaFailure(error)) {
				console.warn(
					`[APININJAS:${context.operation}] Monthly quota exhausted - requests will keep failing until the quota renews or the plan is upgraded`,
				);
				return { maxRetries: 0 };
			}

			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * A missing or invalid key is a 400 here, so this matcher reads the body
	 * rather than the status.
	 */
	AUTH_ERROR: {
		match: (error) => isCredentialFailure(error),
		handler: async (error, context) => {
			console.warn(
				`[APININJAS:${context.operation}] Authentication failed - check the API key from your API Ninjas account page`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Premium gating. Distinct from AUTH_ERROR: the key is valid, the plan is
	 * not sufficient for this endpoint or this parameter.
	 */
	PERMISSION_ERROR: {
		match: (error) => isPlanFailure(error),
		handler: async (error, context) => {
			console.warn(
				`[APININJAS:${context.operation}] Not available on this plan: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (status(error) === 404) return true;
			return errorText(error).includes('endpoint not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[APININJAS:${context.operation}] Endpoint not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Everything else that arrives as a 400: a missing required parameter, a
	 * value the provider rejected, an unsupported currency pair.
	 */
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (
				isQuotaFailure(error) ||
				isPlanFailure(error) ||
				isCredentialFailure(error)
			) {
				return false;
			}
			return status(error) === 400;
		},
		handler: async (error, context) => {
			console.warn(
				`[APININJAS:${context.operation}] Invalid request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * The provider also answers `502` when a parameter name is wrong or a value
	 * cannot be processed - a wrong postal-code parameter and an unsolvable
	 * Sudoku both return one - so a 502 is not retried. Retrying a malformed
	 * request five times only spends quota. A 500 or 503 is a genuine server
	 * fault and is worth two attempts.
	 */
	SERVER_ERROR: {
		match: (error) => {
			const code = status(error);
			return code === 500 || code === 502 || code === 503;
		},
		handler: async (error, context) => {
			if (status(error) === 502) {
				console.warn(
					`[APININJAS:${context.operation}] Provider returned 502 - this is also how it reports an unusable parameter, so the request is not retried: ${error.message}`,
				);
				return { maxRetries: 0 };
			}

			console.warn(
				`[APININJAS:${context.operation}] Provider error: ${error.message}`,
			);
			return { maxRetries: 2, retryStrategy: 'exponential_backoff' };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const text = error.message.toLowerCase();
			return (
				text.includes('network') ||
				text.includes('connection') ||
				text.includes('econnrefused') ||
				text.includes('enotfound') ||
				text.includes('etimedout') ||
				text.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[APININJAS:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[APININJAS:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
