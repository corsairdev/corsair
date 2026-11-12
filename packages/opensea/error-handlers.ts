import type { CorsairErrorHandler } from 'corsair/core';
import { OpenseaAPIError, OpenseaTransportError } from './client';

function kindOf(error: Error): string | undefined {
	if (error instanceof OpenseaAPIError) return error.kind;
	if (error instanceof OpenseaTransportError) return error.kind;
	return undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof OpenseaAPIError ? error.status : undefined;
}

/**
 * Reads only. Every write OpenSea exposes here is an order or fulfilment action
 * that is not documented as idempotent, and a replayed listing or sweep is a
 * second on-chain effect, so a write is never replayed.
 */
function isReplayableRead(error: Error): boolean {
	return error instanceof OpenseaAPIError && error.method === 'GET';
}

/**
 * OpenSea publishes a rate limit but no numbers: the docs say only that "the
 * API is rate-limited". The live response carries `x-ratelimit-limit: 120` and
 * a reset time, which the client folds into `retryAfter`. So the wait is always
 * whatever the provider last said, and the fallback is used only when it said
 * nothing at all.
 */
const RETRY_AFTER_FALLBACK_MS = 1000;

export const errorHandlers = {
	// A missing or rejected key. OpenSea answers 401 with
	// `{"errors":["Missing an API Key, ..."]}` or `["Invalid API key"]`. A
	// different key cannot start working, so this is never retried.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a key that exists but may not do this, for example a route the
	// plan does not include. Repeating it changes nothing.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 404: a bad slug, chain or token id, or an order that is gone. The
	// request has to change before a retry can help.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof OpenseaAPIError
					? (error.retryAfter ?? RETRY_AFTER_FALLBACK_MS)
					: RETRY_AFTER_FALLBACK_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx may mean the request already took effect upstream, so only reads are
	// replayed.
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
	// A transport failure never reached OpenSea, so a read is safe to replay. A
	// write is not, and a timeout is not either: the request may have arrived.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof OpenseaTransportError &&
			error.kind === 'network' &&
			error.method === 'GET',
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TRANSPORT_ERROR_WRITE: {
		match: (error: Error) => error instanceof OpenseaTransportError,
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
