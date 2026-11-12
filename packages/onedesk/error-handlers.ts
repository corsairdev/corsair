import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { OnedeskAPIError, OnedeskTransportError } from './client';

function isOnedesk(error: Error): error is OnedeskAPIError {
	return error instanceof OnedeskAPIError;
}

/**
 * OneDesk's filter endpoints are **POSTs that only read**, and its timer
 * actions are **GETs that write**. The HTTP method therefore says nothing
 * about replay safety here, so the decision comes from the operation name.
 */

/**
 * Operations that leave the account unchanged. Every filter is a POST read;
 * the organization reads are ordinary GETs.
 */
function isReadOperation(context: ErrorContext | undefined): boolean {
	const operation = context?.operation;
	if (!operation) return false;
	return (
		operation.startsWith('organization.') ||
		operation.endsWith('.filter') ||
		operation.endsWith('.filterDetails') ||
		operation.endsWith('.get')
	);
}

/**
 * The timer actions change state over GET. None of them is idempotent: a
 * replayed start bills the same work twice, and a replayed cancel can land
 * after the timer already moved on. They are therefore excluded from **every**
 * retry path, including the rate-limit one.
 */
const TIMER_ACTIONS = new Set([
	'timers.start',
	'timers.pause',
	'timers.resume',
	'timers.cancel',
]);

function isTimerAction(context: ErrorContext | undefined): boolean {
	return context !== undefined && TIMER_ACTIONS.has(context.operation);
}

/** Never replayed: the timer actions and anything else that destroys state. */
const IRREVERSIBLE_OPERATIONS = new Set(['timers.cancel', 'invoices.update']);

function isDestructive(context: ErrorContext | undefined): boolean {
	return (
		context !== undefined && IRREVERSIBLE_OPERATIONS.has(context.operation)
	);
}

export const errorHandlers = {
	// Documented as "Rate limit reached" with a 429. The window is not
	// published, so the header wins and a short fallback applies without one.
	// A timer action is excluded: a throttled start that is sent again bills the
	// same work twice.
	RATE_LIMIT_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			isOnedesk(error) && error.isRateLimit && !isTimerAction(context),
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: isOnedesk(error) ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A throttled timer action has to be reported: the caller can retry it once
	// they know the timer did not move.
	TIMER_THROTTLED_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			isOnedesk(error) && error.isRateLimit && isTimerAction(context),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A wrong, expired or disabled key. 401 arrives with an empty body.
	AUTH_ERROR: {
		match: (error: Error) => isOnedesk(error) && error.isAuthFailure,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403, or a 200 whose code is ERROR_SECURITY_ACCESS: the key is valid but
	// this endpoint or record is out of its reach.
	PERMISSION_ERROR: {
		match: (error: Error) => isOnedesk(error) && error.isPermissionFailure,
		handler: async () => ({ maxRetries: 0 }),
	},
	// ERROR_SERVICE_UNAVAILABLE with HTTP 200. A read is safe to repeat; a
	// write is not, because the record may have been created before the
	// service reported trouble.
	SERVICE_UNAVAILABLE_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			isOnedesk(error) && error.isTransient && isReadOperation(context),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The provider said it could not process the request, on an operation that
	// changes state. It has to be reported, not repeated.
	TRANSIENT_WRITE_ERROR: {
		match: (error: Error) => isOnedesk(error) && error.isTransient,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection or a timeout never reached OneDesk, so a read can
	// be repeated. A write still cannot: the request may have arrived and the
	// response been lost.
	TRANSPORT_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			error instanceof OnedeskTransportError && isReadOperation(context),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 404 on an unknown record or route. Repeating it cannot help.
	NOT_FOUND_ERROR: {
		match: (error: Error) => isOnedesk(error) && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 4xx, or a 200 carrying an error code that the handlers above
	// did not claim (ERROR_INVALID_ID, ERROR_CANNOT_FIND_ITEM and so on). The
	// request has to change first.
	REQUEST_ERROR: {
		match: (error: Error) => {
			const status = isOnedesk(error) ? error.status : undefined;
			const envelopeError =
				isOnedesk(error) && status === 200 && error.code !== undefined;
			return (
				error.name === 'ZodError' ||
				envelopeError ||
				(status !== undefined && status >= 400 && status < 500)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx on a read. A 5xx on a write falls through to DEFAULT. Timer
	// changes are GETs that write, so they are excluded by name.
	SERVER_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			isOnedesk(error) &&
			!isDestructive(context) &&
			isReadOperation(context) &&
			(error.status ?? 0) >= 500,
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
 * Handlers match in key order and DEFAULT matches everything, so it stays
 * last. A plain spread would keep the caller's value at the builtin's
 * position, letting a trailing DEFAULT claim an error the caller handles.
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
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
