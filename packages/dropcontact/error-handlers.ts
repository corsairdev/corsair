import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { DropcontactAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof DropcontactAPIError ? error.status : undefined;
}

function reasonOf(error: Error): string | undefined {
	return error instanceof DropcontactAPIError ? error.reason : undefined;
}

/**
 * The one operation that spends credits and creates server-side state.
 *
 * Decided by operation name, not by HTTP method: the bound client knows which
 * endpoint ran, and every handler that decides replay safety asks this.
 */
function isSubmission(context: ErrorContext | undefined): boolean {
	return context?.operation === 'enrichment.enrich';
}

// A 404 from `DELETE /v1/enrich/webhook` means there was nothing to delete,
// which another DELETE cannot change.
function isNothingToDelete(error: Error): boolean {
	const reason = reasonOf(error);
	return (
		statusOf(error) === 404 &&
		typeof reason === 'string' &&
		reason.toLowerCase().includes('no webhook callback found')
	);
}

// Status codes: https://developer.dropcontact.com/en/errors/
export const errorHandlers = {
	// 401: wrong or missing key. Dropcontact answers with its own envelope,
	// `No api key received` or `Invalid api key`.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the account is not set up for the API yet, or the request_id belongs
	// to another account. Signing in once fixes the first; the second needs the
	// right key, not a retry.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422: FastAPI rejecting the body or a parameter. A retry sends the same one.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			// 400 is the malformed-body answer on the enrich route, which includes
			// the "too many records" and "record too big" limits.
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Nothing to delete is already the desired end state.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			isNothingToDelete(error) ||
			// Any other 404 is a route Dropcontact does not serve, which no retry fixes.
			statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 is either the 60-per-second limit or, per the docs, "a temporary
	// problem on our side", and both say to retry in a few seconds. A real
	// Retry-After overrides the fallback; the documented pacing is under a
	// second, so a short fixed delay is the sensible default.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				(error instanceof DropcontactAPIError ? error.retryAfter : undefined) ??
				2_000,
		}),
	},
	// 5xx from Dropcontact or the network in front of it. Reads are replayed; a
	// submission is not, because a 5xx may arrive after Dropcontact accepted the
	// batch, and a replay would spend the credits twice and create a second
	// request_id the caller never learns about.
	SERVER_ERROR: {
		match: (error: Error, context: ErrorContext) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (_error: Error, context: ErrorContext) => ({
			maxRetries: isSubmission(context) ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection never reached the provider, so a GET is replayed and a
	// submission waits for the caller instead. Only this plugin's own error type
	// can tell a transport failure from a schema error, so both handlers require
	// it.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof DropcontactAPIError &&
			(error.status === 408 || error.name === 'TimeoutError'),
		handler: async (_error: Error, context: ErrorContext) => ({
			maxRetries: isSubmission(context) ? 0 : 2,
		}),
	},
	// A connection failure has no status at all. Reads are replayed; a submission
	// is not, because the request may have landed.
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof DropcontactAPIError &&
			error.status === undefined &&
			error.method !== undefined,
		handler: async (_error: Error, context: ErrorContext) => ({
			maxRetries: isSubmission(context) ? 0 : 2,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys come first, so a
// caller handler for a status no builtin covers is the one that runs.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
