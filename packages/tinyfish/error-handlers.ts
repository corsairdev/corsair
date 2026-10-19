import type { CorsairErrorHandler } from 'corsair/core';
import { TinyFishError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TinyFishError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof TinyFishError ? error.code : undefined;
}

// Error bodies are JSON objects, strings, or omitted, so a stricter
// parameter type is not practical.
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
	} ${bodyText(error instanceof TinyFishError ? error.body : undefined)}`.toLowerCase();
	return needles.some((needle) => haystack.includes(needle));
}

// Only the daily-allowance body carries error.details.resets_at. The guard
// already rejected null and non-objects; the rest of the body is open, so a
// stricter record is not practical.
function unknownRecord(value: object): Record<string, unknown> {
	// Guarded object with open provider keys, so a stricter record is not
	// practical.
	return value as Record<string, unknown>;
}

function resetsAtOf(error: TinyFishError): string | undefined {
	if (error.body === null || typeof error.body !== 'object') return undefined;
	const envelope = unknownRecord(error.body).error;
	if (envelope === null || typeof envelope !== 'object') return undefined;
	const details = unknownRecord(envelope).details;
	if (details === null || typeof details !== 'object') return undefined;
	const resetsAt = unknownRecord(details).resets_at;
	return typeof resetsAt === 'string' && resetsAt.length > 0
		? resetsAt
		: undefined;
}

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			statusOf(error) === 422 ||
			codeOf(error) === 'INVALID_INPUT',
		handler: async () => ({ maxRetries: 0 }),
	},
	// Before RATE_LIMIT_ERROR: the daily allowance arrives as a 429 too, but
	// unlike a per-minute cap it is counted for the whole Pacific day, so
	// backing off inside the day never clears it. The framework rethrows this
	// same error when maxRetries is 0, so the surfaced reset reaches the caller.
	DAILY_LIMIT_ERROR: {
		match: (error: Error) => codeOf(error) === 'DAILY_LIMIT_EXCEEDED',
		handler: async (error: Error) => {
			const resetsAt =
				error instanceof TinyFishError ? resetsAtOf(error) : undefined;
			if (resetsAt) {
				error.message = `${error.message} (resets at ${resetsAt})`;
			}
			return { maxRetries: 0 };
		},
	},
	RATE_LIMIT_ERROR: {
		// A retry replays a possibly billed call, so only a confirmed
		// rate-limit response qualifies; message text can say anything.
		match: (error: Error) =>
			statusOf(error) === 429 || codeOf(error) === 'RATE_LIMIT_EXCEEDED',
		// A per-minute rate limit; the request never ran, so it can be
		// replayed. Retry-After wins when sent.
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof TinyFishError ? error.retryAfter : undefined;
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff',
			};
		},
	},
	// 409 RETRY_REQUIRED: a profile setup session is mid-transition and the
	// request never ran. The docs say to wait 1-2s and back off, which
	// exponential_backoff delivers (1s, then 2s).
	RETRY_REQUIRED_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 409 || codeOf(error) === 'RETRY_REQUIRED',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const code = codeOf(error);
			if (
				code === 'MISSING_API_KEY' ||
				code === 'INVALID_API_KEY' ||
				code === 'UNAUTHORIZED' ||
				code === 'VAULT_RECONNECT_REQUIRED'
			)
				return true;
			return messageIncludes(error, [
				'unauthorized',
				'invalid api key',
				'missing api key',
			]);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	FORBIDDEN_ERROR: {
		// 403: the account cannot use this feature (for example Research is not
		// enabled, or the vault needs reconnecting). Retrying cannot change it.
		match: (error: Error) => {
			if (statusOf(error) === 403) return true;
			const code = codeOf(error);
			return code === 'FORBIDDEN' || code === 'FEATURE_NOT_AVAILABLE';
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		// 402: the wallet is too low to start the work; retrying cannot add funds.
		match: (error: Error) => {
			if (statusOf(error) === 402) return true;
			const code = codeOf(error);
			if (
				code === 'INSUFFICIENT_CREDITS' ||
				code === 'FREE_ALLOWANCE_EXHAUSTED'
			)
				return true;
			return messageIncludes(error, ['insufficient credits', 'wallet']);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		// A 5xx can arrive after a run has already started its first billed
		// step; replaying it risks a duplicate run, so it is returned as-is.
		handler: async () => ({ maxRetries: 0 }),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			messageIncludes(error, ['timeout', 'timed out', 'aborted']),
		// Same billing rule as a 5xx: the run may have started server-side.
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
