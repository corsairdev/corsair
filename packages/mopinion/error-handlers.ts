import type { CorsairErrorHandler } from 'corsair/core';
import { MopinionAPIError } from './client';

function asMopinionError(error: Error): MopinionAPIError | undefined {
	return error instanceof MopinionAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return asMopinionError(error)?.status;
}

function errorCodeOf(error: Error): number | undefined {
	return asMopinionError(error)?.errorCode;
}

/**
 * Mopinion errors are RFC 7807 problem documents; the docs advise handling
 * on `error_code`/`type` rather than the HTTP status. Error code 18 is
 * invalid credentials (probed on unsigned requests).
 */
export const errorHandlers = {
	// Mopinion documents no rate limit; a gateway 429 is still worth a
	// backoff, honouring Retry-After.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: asMopinionError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the signature did not verify (error_code 18 is the docs' invalid
	// credentials example). 403: forbidden.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			statusOf(error) === 403 ||
			errorCodeOf(error) === 18,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 malformed parameters, 404 unknown resource, 406 unsupported Accept,
	// 422 validation. The same request fails the same way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 406 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: the whole v3 data API is reads, so a replay is safe.
	SERVER_ERROR: {
		match: (error: Error) =>
			asMopinionError(error)?.replayable === true &&
			(statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A transport failure (reset, DNS, abort) never reached Mopinion, so a
	// read can be replayed without a status to gate on.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			asMopinionError(error)?.replayable === true &&
			asMopinionError(error)?.status === undefined,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
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
