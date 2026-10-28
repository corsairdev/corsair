import type {
	CorsairErrorHandler,
	ErrorContext,
	RetryStrategy,
} from 'corsair/core';
import { UnipileAPIError } from './client';

// Error types: https://developer.unipile.com/v2.0/reference/error-responses
// Rate limits: https://developer.unipile.com/v2.0/docs/rate-limits
//
// Only reads are replayed after a timeout, a 5xx or a dropped connection. A
// write can reach LinkedIn even when the answer is lost, and a second
// invitation or message is worse than a missing one, so those failures are
// surfaced to the caller instead.

/** Operations that only read, so replaying one cannot act twice on LinkedIn. */
export const RETRY_SAFE_OPERATIONS: ReadonlySet<string> = new Set([
	'accounts.list',
	'accounts.get',
	'users.getProfile',
	'users.listRelations',
	'users.getChat',
	'users.listReactions',
	'users.listComments',
	'relationRequests.list',
	'chats.list',
	'chats.get',
	'messages.list',
	'posts.list',
	'posts.listReactions',
	'posts.listComments',
	'webhookEndpoints.list',
	'webhookEndpoints.get',
]);

/** Longest Retry-After the plugin waits out in-process. Longer ones surface. */
export const MAX_RETRY_AFTER_MS = 60_000;

const NO_RETRY: RetryStrategy = { maxRetries: 0 };

const RETRY_READ: RetryStrategy = {
	maxRetries: 2,
	retryStrategy: 'exponential_backoff_jitter',
};

function statusOf(error: Error): number | undefined {
	return error instanceof UnipileAPIError ? error.status : undefined;
}

function typeOf(error: Error): string | undefined {
	return error instanceof UnipileAPIError ? error.type : undefined;
}

function isRead(context: ErrorContext): boolean {
	return RETRY_SAFE_OPERATIONS.has(context.operation);
}

// The client's deadline fires as a TimeoutError, wrapped as the error's cause.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError' || name === 'AbortError';
}

// fetch rejects with a TypeError ("fetch failed") when the connection drops.
function networkFailure(error: Error): boolean {
	const cause = (error.cause as Error | undefined) ?? error;
	return (
		statusOf(error) === undefined &&
		(cause.name === 'TypeError' ||
			/ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|socket hang up/i.test(
				cause.message,
			))
	);
}

// Matches LinkedIn's quota wording in title/detail, not a bad `limit` param.
const LINKEDIN_LIMIT_PATTERN =
	/resend|weekly|quota|exceeded|too many|limit (?:has been |was )?reached|reached (?:the |your )?(?:\w+ )?limit|cannot (?:yet )?(?:send|invite)|not allowed to send/i;

/**
 * True when LinkedIn refused an action because of one of its own limits
 * (weekly invitations, invitation notes, re-sending to someone too soon, or a
 * provider 429). These clear on LinkedIn's schedule, not after a short wait,
 * so callers should pause outreach for the account instead of retrying.
 */
export function isLinkedInLimitError(error: unknown): boolean {
	if (!(error instanceof UnipileAPIError)) return false;
	if (error.type === 'provider/too_many_requests') return true;
	if (!error.type?.startsWith('provider/')) return false;
	const status = error.status;
	if (status !== 400 && status !== 403 && status !== 409 && status !== 422) {
		return false;
	}
	return LINKEDIN_LIMIT_PATTERN.test(
		`${error.title ?? ''} ${error.detail ?? ''}`,
	);
}

export const errorHandlers = {
	// LinkedIn refused because of its own quota. Waiting minutes does not help.
	LINKEDIN_LIMIT_ERROR: {
		match: (error: Error) => isLinkedInLimitError(error),
		handler: async () => NO_RETRY,
	},
	// 429 api/too_many_requests: Unipile stopped the request before it reached
	// LinkedIn, so even a send is safe to replay. Retry-After is honoured up to
	// MAX_RETRY_AFTER_MS; a longer window (a daily limit) is surfaced.
	// A 429 without a type is only replayed for reads.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (
			error: Error,
			context: ErrorContext,
		): Promise<RetryStrategy> => {
			const retryAfter =
				error instanceof UnipileAPIError ? error.retryAfter : undefined;
			const stoppedByUnipile = typeOf(error) === 'api/too_many_requests';
			if (!stoppedByUnipile && !isRead(context)) return NO_RETRY;
			if (retryAfter === undefined) {
				return { maxRetries: 2, retryStrategy: 'exponential_backoff' };
			}
			if (retryAfter > MAX_RETRY_AFTER_MS) return NO_RETRY;
			return { maxRetries: 2, headersRetryAfterMs: Math.max(retryAfter, 1) };
		},
	},
	// 401: the API key is missing or expired (api/…), or LinkedIn wants the
	// account re-authenticated (provider/invalid_authorization). Use
	// accounts.createAuthLink with account_id to reconnect it.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => NO_RETRY,
	},
	// 403: no subscription; the key's access level (webhook endpoints need a
	// Service API Key, account keys get api/insufficient_permissions); or
	// LinkedIn says the account may not do this (InMail without credits).
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => NO_RETRY,
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => NO_RETRY,
	},
	// 409: already exists, e.g. an invitation to someone already invited.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => NO_RETRY,
	},
	// Input the API (or our schema) rejected; the same input fails again.
	// 405 provider/method_not_allowed and 501 api/not_implemented mean the
	// method does not exist for this provider.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 405 ||
				status === 415 ||
				status === 422 ||
				status === 501
			);
		},
		handler: async () => NO_RETRY,
	},
	// 504 provider/timeout or api/proxy_timeout, or the client's own deadline.
	// The request may still have reached LinkedIn, so only reads are replayed.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 504 ||
			(statusOf(error) === undefined && timedOut(error)),
		handler: async (_error: Error, context: ErrorContext) =>
			isRead(context) ? RETRY_READ : NO_RETRY,
	},
	// 500 api/internal_error, 502 provider/server_error or api/proxy_error, 503.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500 && status <= 503;
		},
		handler: async (_error: Error, context: ErrorContext) =>
			isRead(context) ? RETRY_READ : NO_RETRY,
	},
	NETWORK_ERROR: {
		match: (error: Error) => networkFailure(error),
		handler: async (_error: Error, context: ErrorContext) =>
			isRead(context) ? RETRY_READ : NO_RETRY,
	},
	DEFAULT: {
		match: () => true,
		handler: async () => NO_RETRY,
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
