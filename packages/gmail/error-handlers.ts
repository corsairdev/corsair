import type {
	CorsairErrorHandler,
	ErrorContext,
	ErrorHandlerAndMatchFunction,
} from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Decides whether an operation may be retried. Corsair retries the whole
 * endpoint call, so retrying a write can repeat it: `messages.send` fetches the
 * sent message afterwards, and a failure in that fetch would send the email
 * again. Only read operations are retried.
 */
export type CanRetryOperation = (operation: string) => boolean;

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function messageIncludes(error: Error, phrases: string[]): boolean {
	const msg = error.message.toLowerCase();
	return phrases.some((phrase) => msg.includes(phrase));
}

// Gmail reports per-user and per-project quota limits either as 429 or as 403
// with one of these reasons.
const QUOTA_REASONS = [
	'ratelimitexceeded',
	'userratelimitexceeded',
	'quotaexceeded',
	'rate limit exceeded',
];

/**
 * Matches by HTTP status when the error carries one, and by message only for
 * errors without a status. A status is authoritative: a 404 whose message
 * happens to contain a resource ID with "429" in it is not a rate limit.
 */
function matchStatus(
	statuses: (status: number) => boolean,
	phrases: string[],
): (error: Error) => boolean {
	return (error) => {
		const status = statusOf(error);
		if (status !== undefined) return statuses(status);
		return messageIncludes(error, phrases);
	};
}

export type GmailErrorHandlers = Record<
	| 'RATE_LIMIT_ERROR'
	| 'AUTH_ERROR'
	| 'PERMISSION_ERROR'
	| 'NOT_FOUND_ERROR'
	| 'VALIDATION_ERROR'
	| 'SERVER_ERROR'
	| 'DEFAULT',
	ErrorHandlerAndMatchFunction
>;

export function createErrorHandlers(
	canRetry: CanRetryOperation,
): GmailErrorHandlers {
	return {
		RATE_LIMIT_ERROR: {
			match: (error: Error) => {
				const status = statusOf(error);
				if (status === 429) return true;
				if (status === 403) return messageIncludes(error, QUOTA_REASONS);
				if (status !== undefined) return false;
				return messageIncludes(error, [
					...QUOTA_REASONS,
					'rate limit',
					'too many requests',
				]);
			},
			handler: async (error: Error, context: ErrorContext) => {
				if (!canRetry(context.operation)) return { maxRetries: 0 };
				const retryAfterMs =
					error instanceof ApiError ? error.retryAfter : undefined;
				return {
					maxRetries: 5,
					retryStrategy: 'exponential_backoff_jitter' as const,
					headersRetryAfterMs: retryAfterMs,
				};
			},
		},
		AUTH_ERROR: {
			match: matchStatus(
				(status) => status === 401,
				['unauthorized', 'invalid credentials', 'unauthenticated'],
			),
			handler: async () => ({ maxRetries: 0 }),
		},
		PERMISSION_ERROR: {
			match: matchStatus(
				(status) => status === 403,
				['forbidden', 'insufficient permission', 'permission denied'],
			),
			handler: async () => ({ maxRetries: 0 }),
		},
		NOT_FOUND_ERROR: {
			match: matchStatus((status) => status === 404, ['not found']),
			handler: async () => ({ maxRetries: 0 }),
		},
		VALIDATION_ERROR: {
			match: matchStatus(
				(status) => status === 400,
				['invalid argument', 'bad request'],
			),
			handler: async () => ({ maxRetries: 0 }),
		},
		SERVER_ERROR: {
			match: matchStatus(
				(status) => status >= 500,
				['backend error', 'internal error'],
			),
			handler: async (_error: Error, context: ErrorContext) => {
				if (!canRetry(context.operation)) return { maxRetries: 0 };
				return {
					maxRetries: 3,
					retryStrategy: 'exponential_backoff_jitter' as const,
				};
			},
		},
		DEFAULT: {
			match: (_error: Error) => true,
			handler: async () => ({ maxRetries: 0 }),
		},
	};
}

/**
 * Combines the built-in handlers with caller overrides. Corsair uses the first
 * handler that matches, and `DEFAULT` matches everything, so `DEFAULT` must stay
 * last or a handler the caller adds for a new key would never run.
 */
export function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	custom: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInSpecific } = builtIn;
	const { DEFAULT: customDefault, ...customSpecific } = custom ?? {};
	return {
		...builtInSpecific,
		...customSpecific,
		DEFAULT: customDefault ?? builtInDefault,
	};
}
