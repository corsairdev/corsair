import type {
	CorsairErrorHandler,
	ErrorContext,
	ErrorHandler,
	ErrorHandlerAndMatchFunction,
	RetryStrategy,
} from 'corsair/core';
import { UnipileAPIError } from './client';
import { unipileEndpointMeta } from './endpoints/meta';

// Error types: https://developer.unipile.com/v2.0/reference/error-responses
// Rate limits: https://developer.unipile.com/v2.0/docs/rate-limits
//
// Only reads are replayed after a timeout, a 5xx or a dropped connection. A
// write can reach LinkedIn even when the answer is lost, and a second
// invitation or message is worse than a missing one, so those failures are
// surfaced to the caller instead.

/**
 * Calls that spend a LinkedIn daily budget: profile views (about 80-100 a
 * day), company views, post reads and search results (about 1,000 a day,
 * 2,500 on Sales Navigator). A replay after a timeout or 5xx may spend the
 * budget twice, so these are only replayed when Unipile itself refused them
 * with a Retry-After.
 * https://developer.unipile.com/v2.0/docs/provider-limits-and-restrictions
 */
export const LINKEDIN_BUDGET_OPERATIONS: ReadonlySet<string> = new Set([
	'users.getProfile',
	'users.visitProfile',
	'posts.list',
	'posts.get',
	'linkedin.getCompany',
	'linkedin.searchFromUrl',
	'linkedin.searchPeople',
	'linkedin.searchCompanies',
	'linkedin.searchPosts',
	'linkedin.searchJobs',
	'salesNavigator.searchFromUrl',
	'salesNavigator.searchPeople',
	'salesNavigator.searchCompanies',
]);

/**
 * Operations replayed after a timeout, 5xx or dropped connection: every
 * `read` in the endpoint metadata except the budgeted LinkedIn calls above.
 */
export const RETRY_SAFE_OPERATIONS: ReadonlySet<string> = new Set(
	Object.entries(unipileEndpointMeta)
		.filter(([, meta]) => meta.riskLevel === 'read')
		.map(([path]) => path)
		.filter((path) => !LINKEDIN_BUDGET_OPERATIONS.has(path)),
);

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

function isRetrySafe(context: ErrorContext): boolean {
	return RETRY_SAFE_OPERATIONS.has(context.operation);
}

// The client's own deadline (AbortSignal.timeout) rejects with a TimeoutError,
// wrapped as the error's cause. An AbortError means the caller cancelled the
// request, which must not be replayed.
function timedOut(error: Error): boolean {
	const name = (error.cause as Error | undefined)?.name ?? error.name;
	return name === 'TimeoutError';
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

// LinkedIn's own quota wording on a forwarded (provider/…) error. Kept to
// invitation-specific phrases: generic words such as "exceeded", "quota" or
// "not allowed to send" also appear in validation and permission errors
// ("Message length exceeded", "not allowed to send InMail").
const LINKEDIN_LIMIT_PATTERNS = [
	// "You can not resend an invitation to this user yet."
	/\bcan ?not resend\b|\bcannot resend\b|\bresend\b.*\b(?:yet|later)\b/i,
	// "Weekly invitation limit reached", "weekly limit of invitations"
	/\bweekly (?:invitation|connection(?: request)?)s? limit\b|\bweekly limit (?:of|for) (?:invitations|connection requests)\b/i,
	// "Invitation limit reached", "You have reached the invitation limit"
	/\b(?:invitation|connection request) limit (?:has been |was )?(?:reached|exceeded)\b|\breached (?:the |your )?(?:weekly |monthly )?(?:invitation|connection request) limit\b/i,
	// "Too many pending invitations"
	/\btoo many (?:pending |sent )?(?:invitations|connection requests)\b/i,
	// Free accounts get a handful of invitation notes a month.
	/\b(?:custom|personali[sz]ed|invitation) (?:note|message)s? limit\b/i,
];

const LINKEDIN_LIMIT_STATUSES = new Set([400, 403, 409, 422, 429]);

/**
 * True when LinkedIn refused an action because of one of its own limits: a
 * provider 429, the weekly invitation limit, the monthly note limit, or
 * re-inviting someone too soon. These clear on LinkedIn's schedule, not after
 * a short wait, so callers should pause outreach for the account instead.
 */
export function isLinkedInLimitError(error: unknown): boolean {
	if (!(error instanceof UnipileAPIError)) return false;
	if (error.type === 'provider/too_many_requests') return true;
	if (!error.type?.startsWith('provider/')) return false;
	if (
		error.status === undefined ||
		!LINKEDIN_LIMIT_STATUSES.has(error.status)
	) {
		return false;
	}
	const text = `${error.title ?? ''} ${error.detail ?? ''}`;
	return LINKEDIN_LIMIT_PATTERNS.some((pattern) => pattern.test(text));
}

// Every key carries the UNIPILE_ prefix so none collides with a root-level
// handler name (corsair merges `{ ...root, ...plugin }`, so a shared key would
// keep the root's position). Order matters: the first match wins.
const unipileHandlers = {
	// LinkedIn refused because of its own quota. Waiting minutes does not help.
	UNIPILE_LINKEDIN_LIMIT: {
		match: (error: Error) => isLinkedInLimitError(error),
		handler: async () => NO_RETRY,
	},
	// 429 api/too_many_requests: Unipile stopped the request before it reached
	// LinkedIn, so even a send is safe to replay. Retry-After is honoured up to
	// MAX_RETRY_AFTER_MS; a longer window (a daily limit) is surfaced. Budgeted
	// LinkedIn calls need the Retry-After; a 429 without a type only replays
	// reads.
	UNIPILE_RATE_LIMIT: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (
			error: Error,
			context: ErrorContext,
		): Promise<RetryStrategy> => {
			const retryAfter =
				error instanceof UnipileAPIError ? error.retryAfter : undefined;
			const stoppedByUnipile = typeOf(error) === 'api/too_many_requests';
			if (!stoppedByUnipile && !isRetrySafe(context)) return NO_RETRY;
			if (retryAfter === undefined) {
				return LINKEDIN_BUDGET_OPERATIONS.has(context.operation)
					? NO_RETRY
					: { maxRetries: 2, retryStrategy: 'exponential_backoff' };
			}
			if (retryAfter > MAX_RETRY_AFTER_MS) return NO_RETRY;
			return { maxRetries: 2, headersRetryAfterMs: Math.max(retryAfter, 1) };
		},
	},
	// 401: the API key is missing or expired (api/…), or LinkedIn wants the
	// account re-authenticated (provider/invalid_authorization). Use
	// accounts.createAuthLink with account_id to reconnect it.
	UNIPILE_AUTH: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => NO_RETRY,
	},
	// 403: no subscription; the key's access level (webhook endpoints need a
	// Service API Key, account keys get api/insufficient_permissions); or
	// LinkedIn says the account may not do this (InMail without credits).
	UNIPILE_PERMISSION: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => NO_RETRY,
	},
	UNIPILE_NOT_FOUND: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => NO_RETRY,
	},
	// 409: already exists, e.g. an invitation to someone already invited.
	UNIPILE_CONFLICT: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => NO_RETRY,
	},
	// Input the API (or our schema) rejected; the same input fails again.
	// 405 provider/method_not_allowed and 501 api/not_implemented mean the
	// method does not exist for this provider.
	UNIPILE_VALIDATION: {
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
	UNIPILE_TIMEOUT: {
		match: (error: Error) =>
			statusOf(error) === 504 ||
			(statusOf(error) === undefined && timedOut(error)),
		handler: async (_error: Error, context: ErrorContext) =>
			isRetrySafe(context) ? RETRY_READ : NO_RETRY,
	},
	// 500 api/internal_error, 502 provider/server_error or api/proxy_error, 503.
	UNIPILE_SERVER: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500 && status <= 503;
		},
		handler: async (_error: Error, context: ErrorContext) =>
			isRetrySafe(context) ? RETRY_READ : NO_RETRY,
	},
	UNIPILE_NETWORK: {
		match: (error: Error) => networkFailure(error),
		handler: async (_error: Error, context: ErrorContext) =>
			isRetrySafe(context) ? RETRY_READ : NO_RETRY,
	},
} satisfies Record<string, ErrorHandlerAndMatchFunction>;

const noRetry: ErrorHandler = async () => NO_RETRY;

/**
 * Adds the catch-all. It is named DEFAULT on purpose: corsair falls back to
 * `DEFAULT` when nothing matches, and a root-level `DEFAULT` (documented as
 * `match: () => true`) sits ahead of every plugin key in the merged order.
 * Taking that key puts this handler in its place, and because it re-runs the
 * plugin's ordered rules before falling back, its answer is the same wherever
 * in the order it ends up.
 */
function withCatchAll(
	handlers: Record<string, ErrorHandlerAndMatchFunction | undefined>,
	fallback: ErrorHandler,
): CorsairErrorHandler {
	const ordered = Object.entries(handlers).filter(
		(entry): entry is [string, ErrorHandlerAndMatchFunction] =>
			entry[0] !== 'DEFAULT' && entry[1] !== undefined,
	);
	return {
		...Object.fromEntries(ordered),
		DEFAULT: {
			match: () => true,
			handler: async (error, context) => {
				const hit = ordered.find(([, entry]) => entry.match(error, context));
				return hit ? hit[1].handler(error, context) : fallback(error, context);
			},
		},
	};
}

export const errorHandlers: CorsairErrorHandler = withCatchAll(
	unipileHandlers,
	noRetry,
);

/**
 * Plugin-level handlers from `unipile({ errorHandlers })`: the caller's
 * handlers override built-ins with the same key, new keys run after the
 * built-ins, and the caller's DEFAULT (if any) becomes the final fallback.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: _builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	return withCatchAll(
		{ ...builtinRest, ...userRest },
		userDefault?.handler ?? noRetry,
	);
}
