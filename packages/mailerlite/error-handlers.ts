import type { CorsairErrorHandler } from 'corsair/core';
import { MailerLiteAPIError, RATE_LIMIT_FALLBACK_MS } from './client';

function asMailerLiteError(error: Error): MailerLiteAPIError | undefined {
	return error instanceof MailerLiteAPIError ? error : undefined;
}

// Error bodies: https://developers.mailerlite.com/docs/getting-started.html
// (Errors section) and the Rate limits page. Every status answers JSON, so a
// body message always rides beside the status.
export const errorHandlers = {
	// 120 requests/minute per account. A 429 carries Retry-After in seconds
	// (docs example: 119); the header is absent on every other response, so
	// the fallback below covers a gateway 429 with no headers. MailerLite
	// refused the request before running it, so any operation can be retried.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => asMailerLiteError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				asMailerLiteError(error)?.retryAfter ?? RATE_LIMIT_FALLBACK_MS,
		}),
	},
	// 401 "Unauthenticated." — a missing, invalid or revoked token. Auth
	// middleware runs before anything else, so a retry cannot help.
	AUTH_ERROR: {
		match: (error: Error) => asMailerLiteError(error)?.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the action is denied for this account or token (docs error table).
	PERMISSION_ERROR: {
		match: (error: Error) => asMailerLiteError(error)?.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 "The given data was invalid." with per-field messages, plus 400 and
	// 404. A route miss 404s with "Resource does not exist.", so a missing
	// resource and a missing route share one handler: the same request would
	// fail again either way.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = asMailerLiteError(error)?.status;
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A transport failure (connection reset, DNS, abort) never reached
	// MailerLite. Repeating it is safe for the operations marked replayable
	// (reads and the email upsert); the flag is set per operation, so a
	// schedule send is never replayed even though the send may or may not
	// have started.
	TRANSPORT_ERROR: {
		match: (error: Error) => asMailerLiteError(error)?.transport === true,
		handler: async (error: Error) => {
			const replayable = asMailerLiteError(error)?.replayable === true;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
	// 5xx after MailerLite accepted the connection. Only replayable
	// operations are retried: subscribers.upsert upserts on email, so a
	// repeat returns the same subscriber; a repeated campaign schedule could
	// send twice.
	SERVER_ERROR: {
		match: (error: Error) => {
			const mailerLiteError = asMailerLiteError(error);
			return (
				mailerLiteError?.transport === false &&
				mailerLiteError.replayable === true &&
				(mailerLiteError.status ?? 0) >= 500
			);
		},
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
