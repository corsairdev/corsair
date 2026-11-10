import type { CorsairErrorHandler } from 'corsair/core';
import { InboxkitAPIError, InboxkitError } from './client';

// ── Read retries ──────────────────────────────────────────────────────────
//
// Reads are retried inside the plugin's request path (withReadRetries, called by
// endpoints/call.ts), not through Corsair's error handlers: core merges root
// handlers ahead of plugin handlers and takes the first match, so a root
// catch-all would stop a plugin retry, and core retries a whole operation with
// no way to tell a read from a purchase. Nothing else is ever retried. InboxKit
// has no idempotency keys, and a purchase that timed out may have gone through
// (its own docs and MCP server say so), so a repeat could charge twice.

// unknown: a catch clause can receive any value; the instanceof check narrows it.
function statusOf(error: unknown): number | undefined {
	return error instanceof InboxkitAPIError ? error.status : undefined;
}

// unknown: as above.
function codeOf(error: unknown): InboxkitError['code'] | undefined {
	return error instanceof InboxkitError ? error.code : undefined;
}

// Longest wait worth sleeping through: a Corsair script has about 25 s in all.
const LONGEST_RETRY_WAIT_MS = 10_000;

const backoff = (attempt: number) => 1_000 * 2 ** (attempt - 1);

/**
 * How long to wait before retry number `attempt` (from 1) of a read that failed
 * with `error`, or undefined to give up.
 */
export function readRetryDelay(
	// unknown: whatever the request threw.
	error: unknown,
	attempt: number,
): number | undefined {
	const status = statusOf(error);
	if (status === 429) {
		if (attempt > 2) return undefined;
		const wait =
			error instanceof InboxkitAPIError ? error.retryAfter : undefined;
		if (wait !== undefined && wait > LONGEST_RETRY_WAIT_MS) return undefined;
		return wait ?? backoff(attempt);
	}
	if (status !== undefined && status >= 500) {
		return attempt > 2 ? undefined : backoff(attempt);
	}
	const code = codeOf(error);
	if (code === 'timeout') return attempt > 1 ? undefined : 1_000;
	if (code === 'network') return attempt > 2 ? undefined : backoff(attempt);
	return undefined;
}

const sleep = (ms: number) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Runs a read, retrying it per readRetryDelay. */
export async function withReadRetries<T>(
	send: () => Promise<T>,
	wait: (ms: number) => Promise<void> = sleep,
): Promise<T> {
	for (let attempt = 1; ; attempt++) {
		try {
			return await send();
		} catch (error) {
			const delay = readRetryDelay(error, attempt);
			if (delay === undefined) throw error;
			await wait(delay);
		}
	}
}

/**
 * Whether a failed write may still have happened: the answer never arrived, or
 * the server failed partway. A 4xx is a refusal, so nothing was done.
 */
// unknown: whatever the request threw.
export function outcomeUnknown(error: unknown): boolean {
	const status = statusOf(error);
	if (status !== undefined) return status >= 500;
	const code = codeOf(error);
	return code === 'timeout' || code === 'network';
}

// ── Corsair error handlers ────────────────────────────────────────────────
//
// What Corsair sees after the plugin's own retries. None asks Corsair to retry.
// They name the error kinds (for overrides) and keep InboxKit errors away from
// Corsair's built-in fallback, which logs the call's input: here that can be a
// mailbox password or a sequencer's API key. Keys are prefixed so they never take
// the position of a root handler with the same name; the catch-all stays last.

const noRetry = async () => ({ maxRetries: 0 });

export const errorHandlers = {
	INBOXKIT_VALIDATION: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			codeOf(error) === 'invalid_input' ||
			codeOf(error) === 'workspace_required' ||
			statusOf(error) === 400 ||
			statusOf(error) === 409 ||
			statusOf(error) === 422,
		handler: noRetry,
	},
	INBOXKIT_AUTH: {
		match: (error: Error) =>
			codeOf(error) === 'invalid_key' || statusOf(error) === 401,
		handler: noRetry,
	},
	INBOXKIT_PAYMENT: {
		match: (error: Error) => statusOf(error) === 402,
		handler: noRetry,
	},
	INBOXKIT_PERMISSION: {
		match: (error: Error) => statusOf(error) === 403,
		handler: noRetry,
	},
	INBOXKIT_NOT_FOUND: {
		match: (error: Error) => statusOf(error) === 404,
		handler: noRetry,
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: noRetry,
	},
	INBOXKIT_SERVER: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: noRetry,
	},
	INBOXKIT_TIMEOUT: {
		match: (error: Error) => codeOf(error) === 'timeout',
		handler: noRetry,
	},
	INBOXKIT_NETWORK: {
		match: (error: Error) => codeOf(error) === 'network',
		handler: noRetry,
	},
	INBOXKIT_FALLBACK: {
		match: () => true,
		handler: noRetry,
	},
} satisfies CorsairErrorHandler;

/**
 * The caller's plugin-level handlers come first; a caller `DEFAULT` (or
 * `INBOXKIT_FALLBACK`) replaces the built-in catch-all and stays last, under the
 * prefixed key so it never lands on a root DEFAULT's position.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const {
		DEFAULT: userDefault,
		INBOXKIT_FALLBACK: userFallback,
		...userRest
	} = user;
	const { INBOXKIT_FALLBACK: builtinFallback, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? userFallback ?? builtinFallback;
	if (fallback) merged.INBOXKIT_FALLBACK = fallback;
	return merged;
}
