import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { CraftmypdfAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof CraftmypdfAPIError ? error.status : undefined;
}

/**
 * The operations that destroy provider state. They are excluded from the
 * server-error replay below whatever method they use: CraftMyPDF deletes a
 * template over `GET /delete-template`, so gating on the HTTP method alone
 * would replay a deletion that may already have happened.
 */
const DESTRUCTIVE_OPERATIONS = new Set(['templates.delete']);

function isDestructive(context: ErrorContext | undefined): boolean {
	return context !== undefined && DESTRUCTIVE_OPERATIONS.has(context.operation);
}

/**
 * CraftMyPDF answers a rejected key with HTTP 400 and
 * `{ status: 'error', message: 'Invalid API Key' }`, not 401, so every 400 has
 * to be read by message. The wordings it uses across its two error handlers
 * are collected in client.ts (`isAuthMessage`).
 */
function isAuthFailure(error: Error): boolean {
	return error instanceof CraftmypdfAPIError && error.isAuthFailure;
}

export const errorHandlers = {
	// 100 requests per 10 seconds per IP, plus 100 concurrent generations per
	// account. The IP window is short, so the first two waits cover it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof CraftmypdfAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A wrong or reset key. Retrying sends the same rejected key.
	AUTH_ERROR: {
		match: (error: Error) => isAuthFailure(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 for an unknown route. Repeating it cannot help.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Any other 400: a malformed body, an unknown template, a bad parameter.
	// The request has to change first.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. CraftMyPDF deletes a template over GET, so the
	// method alone is not enough: destructive operations are excluded by name,
	// because a failed delete may already have happened. Generation calls are
	// all POSTs, so they fall through to DEFAULT and are never replayed.
	SERVER_ERROR: {
		match: (error: Error, context: ErrorContext) =>
			error instanceof CraftmypdfAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500 &&
			!isDestructive(context),
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
