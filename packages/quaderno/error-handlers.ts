import type { CorsairErrorHandler } from 'corsair/core';
import { QuadernoAPIError, QuadernoTransportError } from './client';

function kindOf(error: Error): string | undefined {
	if (error instanceof QuadernoAPIError) return error.kind;
	if (error instanceof QuadernoTransportError) return error.kind;
	return undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof QuadernoAPIError ? error.status : undefined;
}

/**
 * Reads only. The deliver routes are GETs that send email, so a replay would
 * email the customer twice; they carry their method through as `GET`, which
 * means method alone cannot decide here.
 */
function isReplayableRead(error: Error): boolean {
	return error instanceof QuadernoAPIError && error.method === 'GET';
}

/**
 * Quaderno documents 100 calls per 15 seconds and sends `X-RateLimit-Reset` as a
 * UTC epoch. `corsair/http` turns that into `retryAfter`, so a 429 waits for the
 * real window. The fallback is only used when no header arrives.
 */
const RETRY_AFTER_FALLBACK_MS = 1000;

export const errorHandlers = {
	// A wrong key. Quaderno answers
	// `{"error":"Wrong API key or the user does not exist."}` with 401.
	AUTH_ERROR: {
		match: (error: Error) => kindOf(error) === 'unauthorized',
		handler: async () => ({ maxRetries: 0 }),
	},
	// A missing record, which Quaderno reports as 401 too, with
	// "Unauthorized access or contact does not exist." Repeating it changes
	// nothing, and it is not an auth problem.
	NOT_FOUND_ERROR: {
		match: (error: Error) => kindOf(error) === 'not_found_or_denied',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 406 and 422: a malformed body, an unrecognised tax code, or a state
	// the resource is not in. The request has to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				kindOf(error) === 'invalid_input' ||
				kindOf(error) === 'conflict' ||
				status === 400 ||
				status === 406 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof QuadernoAPIError
					? (error.retryAfter ?? RETRY_AFTER_FALLBACK_MS)
					: RETRY_AFTER_FALLBACK_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx may mean the write already landed, so only reads are replayed.
	SERVER_ERROR: {
		match: (error: Error) =>
			statusOf(error) !== undefined &&
			(statusOf(error) ?? 0) >= 500 &&
			isReplayableRead(error),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	SERVER_ERROR_WRITE: {
		match: (error: Error) =>
			statusOf(error) !== undefined && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A transport failure never reached Quaderno, so a read is safe to replay. A
	// write is not, and neither is a timeout: it may have arrived and completed.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof QuadernoTransportError &&
			error.kind === 'network' &&
			error.method === 'GET',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TRANSPORT_ERROR_WRITE: {
		match: (error: Error) => error instanceof QuadernoTransportError,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Core runs the first handler whose `match` passes, in key order, and DEFAULT
 * matches everything, so it stays last. A caller's handlers go first, which is
 * what makes an override take effect, and their DEFAULT replaces this plugin's.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) {
			// unknown: the entry is a CorsairErrorHandler member, which core
			// declares as a Partial; Object.entries erases that per value.
			merged[name as keyof CorsairErrorHandler] =
				entry as CorsairErrorHandler[keyof CorsairErrorHandler];
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
