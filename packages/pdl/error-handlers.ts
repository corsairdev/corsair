import type { CorsairErrorHandler } from 'corsair/core';
import { PdlAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PdlAPIError ? error.status : undefined;
}

// PDL error bodies are {status, error: {type, message}} but degrade to
// strings or nothing.
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
	} ${bodyText(error instanceof PdlAPIError ? error.body : undefined)}`.toLowerCase();
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
		// PDL documents no Retry-After; the transport's exponential backoff
		// (reading x-ratelimit-reset when present) covers the wait. A 429 is
		// rejected before a match runs, so replaying charges nothing.
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof PdlAPIError ? error.retryAfter : undefined;
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
			return messageIncludes(error, ['unauthorized', 'invalid api key']);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		// 402: the account hit its purchased maximum (x-totallimit-remaining is 0).
		match: (error: Error) =>
			statusOf(error) === 402 ||
			messageIncludes(error, ['payment required', 'account maximum']),
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
		// No idempotency keys are documented and enrichment is billed per
		// match, so a 5xx may have already charged the account; no replay.
		handler: async () => ({ maxRetries: 0 }),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			messageIncludes(error, ['timeout', 'timed out', 'aborted']),
		// Same billing rule as a 5xx: the match may have completed server-side.
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
