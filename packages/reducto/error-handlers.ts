import type { CorsairErrorHandler } from 'corsair/core';
import { ReductoAPIError } from './client';

function asReductoError(error: Error): ReductoAPIError | undefined {
	return error instanceof ReductoAPIError ? error : undefined;
}

function getStatus(error: Error): number | undefined {
	return asReductoError(error)?.status;
}

// unknown: error bodies are JSON objects, strings, or omitted.
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
	const haystack =
		`${error.message} ${bodyText(asReductoError(error)?.body)}`.toLowerCase();
	return needles.some((needle) => haystack.includes(needle));
}

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || getStatus(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			return messageIncludes(error, ['rate limit', 'too many requests']);
		},
		// Same billing rule as the transport retry: only GET is replayed.
		// A 429 on a write is returned as-is, with no Retry-After wait.
		handler: async (error: Error) => {
			const reductoError = asReductoError(error);
			if (reductoError?.method !== 'GET') {
				return { maxRetries: 0 };
			}
			const retryAfter = reductoError.retryAfter;
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			return messageIncludes(error, ['unauthorized', 'invalid api key']);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => getStatus(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		// Parse, extract, upload, and the other POSTs bill on success. A 500 can
		// arrive after Reducto already created the job, so the call is not retried.
		handler: async () => ({ maxRetries: 0 }),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			messageIncludes(error, ['timeout', 'timed out', 'aborted']),
		// Same as a 500: the request may have been accepted. Retrying would
		// create a second job and a second charge.
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
