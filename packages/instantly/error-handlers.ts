import type { CorsairErrorHandler } from 'corsair/core';
import { InstantlyAPIError } from './client';

// ── Read retries ──────────────────────────────────────────────────────────
//
// Reads are retried inside the plugin's request path (withReadRetries,
// called by endpoints/call.ts), not through Corsair's error handlers. Core
// merges root handlers ahead of plugin handlers and takes the first match,
// so a root `DEFAULT: { match: () => true }` would otherwise stop every
// plugin retry. Writes are never retried: a failed reply, lead upload or
// campaign change may have gone through.

function statusOf(error: unknown): number | undefined {
	return error instanceof InstantlyAPIError ? error.status : undefined;
}

function causeName(error: unknown): string | undefined {
	if (!(error instanceof Error)) return undefined;
	return (error.cause as Error | undefined)?.name ?? error.name;
}

/** The client's 30 s deadline fired (AbortSignal.timeout). */
function timedOut(error: unknown): boolean {
	return statusOf(error) === undefined && causeName(error) === 'TimeoutError';
}

/** The caller cancelled the request. Never retried. */
function cancelled(error: unknown): boolean {
	return statusOf(error) === undefined && causeName(error) === 'AbortError';
}

/** fetch fails with a TypeError when the connection itself fails. */
function networkFailed(error: unknown): boolean {
	return statusOf(error) === undefined && causeName(error) === 'TypeError';
}

// emails.list allows 20 requests a minute, so one request every 3 seconds.
// Instantly does not always send Retry-After.
const EMAILS_LIST_SPACING_MS = 3_000;
const MAX_RETRY_DELAY_MS = 60_000;

function backoff(attempt: number): number {
	return 1_000 * 2 ** (attempt - 1);
}

/**
 * How long to wait before retry number `attempt` (from 1) of a read that
 * failed with `error`, or undefined to give up. Status codes:
 * https://api.instantly.ai/openapi/api_v2.json (429 on every endpoint; the
 * workspace shares 100 requests/second and 6,000/minute).
 */
export function readRetryDelay(
	// unknown: whatever the request threw.
	error: unknown,
	operation: string,
	attempt: number,
): number | undefined {
	if (cancelled(error)) return undefined;
	const status = statusOf(error);
	if (status === 429) {
		if (attempt > 3) return undefined;
		const retryAfter =
			error instanceof InstantlyAPIError ? error.retryAfter : undefined;
		const delay =
			retryAfter ??
			(operation === 'emails.list' ? EMAILS_LIST_SPACING_MS : backoff(attempt));
		return Math.min(delay, MAX_RETRY_DELAY_MS);
	}
	if (status !== undefined && status >= 500) {
		return attempt > 2 ? undefined : backoff(attempt);
	}
	if (timedOut(error)) return attempt > 1 ? undefined : 2_000;
	if (networkFailed(error)) return attempt > 2 ? undefined : backoff(attempt);
	return undefined;
}

const sleep = (ms: number) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Runs a read, retrying it per readRetryDelay. */
export async function withReadRetries<T>(
	send: () => Promise<T>,
	operation: string,
	wait: (ms: number) => Promise<void> = sleep,
): Promise<T> {
	for (let attempt = 1; ; attempt++) {
		try {
			return await send();
		} catch (error) {
			const delay = readRetryDelay(error, operation, attempt);
			if (delay === undefined) throw error;
			await wait(delay);
		}
	}
}

// ── Corsair error handlers ────────────────────────────────────────────────
//
// What Corsair sees after the plugin's own retries. None asks Corsair to
// retry. They name the error kinds (for overrides) and keep Instantly
// errors away from Corsair's built-in fallback, which logs the call's input
// (lead emails, reply text). Keys are prefixed so they never take the
// position of a root handler with the same name; the catch-all stays last.

const noRetry = async () => ({ maxRetries: 0 });

export const errorHandlers = {
	INSTANTLY_VALIDATION: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			statusOf(error) === 400 ||
			statusOf(error) === 422,
		handler: noRetry,
	},
	INSTANTLY_AUTH: {
		match: (error: Error) => statusOf(error) === 401,
		handler: noRetry,
	},
	INSTANTLY_PLAN: {
		match: (error: Error) => statusOf(error) === 402,
		handler: noRetry,
	},
	INSTANTLY_PERMISSION: {
		match: (error: Error) => statusOf(error) === 403,
		handler: noRetry,
	},
	INSTANTLY_NOT_FOUND: {
		match: (error: Error) => statusOf(error) === 404,
		handler: noRetry,
	},
	INSTANTLY_RATE_LIMIT: {
		match: (error: Error) => statusOf(error) === 429,
		handler: noRetry,
	},
	INSTANTLY_SERVER: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: noRetry,
	},
	INSTANTLY_TIMEOUT: {
		match: (error: Error) => timedOut(error),
		handler: noRetry,
	},
	INSTANTLY_CANCELLED: {
		match: (error: Error) => cancelled(error),
		handler: noRetry,
	},
	INSTANTLY_NETWORK: {
		match: (error: Error) => networkFailed(error),
		handler: noRetry,
	},
	INSTANTLY_FALLBACK: {
		match: () => true,
		handler: noRetry,
	},
} satisfies CorsairErrorHandler;

/**
 * The caller's plugin-level handlers come first; a caller `DEFAULT` (or
 * `INSTANTLY_FALLBACK`) replaces the built-in catch-all and stays last, under
 * the prefixed key so it never lands on a root DEFAULT's position.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const {
		DEFAULT: userDefault,
		INSTANTLY_FALLBACK: userFallback,
		...userRest
	} = user;
	const { INSTANTLY_FALLBACK: builtinFallback, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? userFallback ?? builtinFallback;
	if (fallback) merged.INSTANTLY_FALLBACK = fallback;
	return merged;
}
