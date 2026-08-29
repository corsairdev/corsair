import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	BotpressBotIdMissingError,
	BotpressWorkspaceIdMissingError,
} from './client';

function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

/**
 * Whether replaying an operation could duplicate a record or a charge.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry, so a
 * network failure raised *after* Botpress committed a POST would create a
 * second bot, integration, workspace or conversation — or, for
 * `billing.chargeUnpaidInvoices`, charge a payment method twice. Botpress
 * accepts no idempotency key on these routes, so the only safe answer is not
 * to retry at all.
 *
 * `runVrl` and `setAccountPreference`/`setWorkspacePreference` are POST but
 * excluded: VRL execution has no persisted side effect (verified live —
 * `POST /v1/admin/helper/vrl` just transforms the supplied `data` and returns
 * a `result`), and the preference routes are absolute setters keyed by name
 * (`body: { value }`), so replaying either leaves the same state rather than
 * duplicating anything.
 *
 * `endpoints.test.ts` asserts this predicate against the full routing table
 * so it cannot drift away from the operations it describes.
 */
export const isNonIdempotent = (operation: string): boolean =>
	[
		'billing.chargeUnpaidInvoices',
		'integrations.create',
		'integrations.requestVerification',
		'workspaces.create',
		'bots.create',
		'chat.createConversation',
		'chat.sendMessage',
	].includes(operation);

export const errorHandlers = {
	/**
	 * A missing workspace or bot id is a configuration fault rather than a
	 * transport failure, so it is matched first and never retried — every
	 * attempt would fail identically.
	 */
	CONFIGURATION_ERROR: {
		match: (error) =>
			error instanceof BotpressWorkspaceIdMissingError ||
			error instanceof BotpressBotIdMissingError,
		handler: async (error, context) => {
			console.warn(`[BOTPRESS:${context.operation}] ${error.message}`);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Botpress answers over-limit requests with a plain 429 and no documented
	 * rate-limit headers to pace against proactively.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 3,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTPRESS:${context.operation}] Authentication failed - check the Personal Access Token`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTPRESS:${context.operation}] Permission denied (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('resourcenotfound');
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTPRESS:${context.operation}] Resource not found (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 400,
		handler: async (error, context) => {
			console.warn(
				`[BOTPRESS:${context.operation}] Invalid request (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BOTPRESS:${context.operation}] Network error (status ${safeStatus(error)})`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[BOTPRESS:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
