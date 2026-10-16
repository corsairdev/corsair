import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { Search1APIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof Search1APIError ? error.status : undefined;
}

// an error body arrives as a parsed object, raw text, or nothing at all
function bodyText(body: unknown): string {
	if (body == null) {
		return '';
	}
	if (typeof body === 'string') {
		return body;
	}
	try {
		return JSON.stringify(body);
	} catch {
		return String(body);
	}
}

function messageIncludes(error: Error, needles: string[]): boolean {
	const haystack = `${
		error.message
	} ${bodyText(error instanceof Search1APIError ? error.body : undefined)}`.toLowerCase();
	return needles.some((needle) => haystack.includes(needle));
}

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			return messageIncludes(error, ['rate limit', 'too many requests']);
		},
		// The provider rejects a 429 before the search runs, so nothing was
		// billed and the request can be replayed. Retry-After wins when sent.
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof Search1APIError ? error.retryAfter : undefined;
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			return messageIncludes(error, [
				'unauthorized',
				'invalid api key',
				'invalid token',
			]);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		// 402 is sent both as a payment challenge and for an empty balance.
		// Retrying cannot fix either, so surface the failure.
		match: (error: Error) =>
			statusOf(error) === 402 ||
			messageIncludes(error, ['insufficient credits', 'out of credits']),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		// The provider documents 5xx responses as safe to replay and failures
		// as uncharged (search, crawl, and screenshot have no write side
		// effects). /feedback is the exception: it has no idempotency and a
		// replay can duplicate the report, so it surfaces immediately.
		// Retry-After wins when sent, but the shared request path extracts it
		// only on 429; on 5xx only the screenshot raw fetch populates it.
		handler: async (error: Error, context: ErrorContext) => {
			// corsair passes the bound operation path with no plugin prefix,
			// unlike the 'search1api.*' label callSearch1API logs.
			if (context.operation === 'web.feedback') {
				return { maxRetries: 0 };
			}
			const retryAfter =
				error instanceof Search1APIError ? error.retryAfter : undefined;
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			messageIncludes(error, ['timeout', 'timed out', 'aborted']),
		// Unlike a 5xx response, a timeout leaves it unknown whether the
		// request was received, and the provider's replay guidance only
		// covers documented status codes.
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
