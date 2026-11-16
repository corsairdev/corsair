import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Neutrino sends `{ "api-error": <number>, "api-error-msg": "..." }` with the
 * status. Code 43 is the credential check; other 403s are plan or permission
 * limits. Errors arrive as core's `ApiError`, whose sanitized body carries the
 * numeric code.
 */
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// unknown: the sanitized body is the provider's envelope; read one field.
function codeOf(error: Error): number | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = error.body as { 'api-error'?: unknown } | undefined;
	const code = body?.['api-error'];
	return typeof code === 'number' ? code : undefined;
}

/** The path of the failed request, e.g. `/sms-verify`. */
function pathOf(error: Error): string {
	if (!(error instanceof ApiError)) return '';
	return error.request.url.split('?')[0] ?? error.request.url;
}

/**
 * A plain GET normally replays safely on a 5xx, but messaging.smsVerify is a GET
 * that sends a real SMS, so a 5xx could mean the message already went out.
 */
const SENDS_MESSAGE_PATH = '/sms-verify';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Code 43 is a bad user id or key. Retrying sends the same pair.
	AUTH_ERROR: {
		match: (error: Error) => codeOf(error) === 43 || statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 with another code is a plan or permission limit.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 is a parameter Neutrino refused. A schema failure is caught here
	// before the call is made.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return statusOf(error) === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every wrapped route is a GET, so a 5xx replays safely except on the one
	// route that sends a message.
	SERVER_ERROR: {
		match: (error: Error) =>
			!pathOf(error).endsWith(SENDS_MESSAGE_PATH) &&
			(statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys go first, then any builtin they did not name, then one DEFAULT.
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
