import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { finerworksEndpointMeta } from './endpoints';

/**
 * FinerWorks reports credential problems as HTTP 400 carrying an ASP.NET
 * `ModelState` map rather than as 401, so auth detection has to look at the
 * flattened message the client produces as well as the status code.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-test_my_credentials
 */
const CREDENTIAL_FAILURE =
	/unauthorized api credentials|missing or unauthorized/i;

/**
 * The client rethrows transport failures as `FinerWorksAPIError`, which copies
 * the status across and keeps the original `ApiError` as its `cause`. Read the
 * status off any of those shapes so a wrapped 429 or 5xx is still classified
 * correctly instead of falling through to `DEFAULT`.
 */
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;

	// unknown: FinerWorksAPIError copies status, but tests may pass a plain Error.
	const direct = (error as { status?: unknown }).status;
	if (typeof direct === 'number') return direct;

	// unknown: Node Error.cause is untyped; we only use it when it is an ApiError.
	const cause = (error as { cause?: unknown }).cause;
	if (cause instanceof ApiError) return cause.status;

	return undefined;
}

/**
 * `retryAfter` is only ever set on the underlying `ApiError`, so honour the
 * provider's own delay by reading through the wrapper's `cause`.
 */
function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}

	// unknown: Node Error.cause is untyped; we only use it when it is an ApiError.
	const cause = (error as { cause?: unknown }).cause;
	if (cause instanceof ApiError && cause.retryAfter !== undefined) {
		return cause.retryAfter;
	}

	return undefined;
}

function isReadOperation(operation: string | undefined): boolean {
	if (!operation) return false;
	const meta: Record<string, { riskLevel?: string } | undefined> =
		finerworksEndpointMeta;
	return meta[operation]?.riskLevel === 'read';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 429) return true;
			// A real status wins over the message: a 5xx that mentions "rate limit"
			// must reach SERVER_ERROR, which never retries writes.
			if (status !== undefined) return false;
			return /too many requests|rate[ _-]?limit/i.test(error.message);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			return CREDENTIAL_FAILURE.test(error.message);
		},
		// A bad key pair never becomes valid by retrying.
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500 && status < 600;
		},
		// A 5xx can arrive after FinerWorks has already applied a write, so only
		// reads are retried: replaying `orders.savePending` or `images.add` could
		// create duplicates. Unknown operations get no retry.
		handler: async (_error: Error, context?: ErrorContext) => ({
			maxRetries: isReadOperation(context?.operation) ? 3 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
