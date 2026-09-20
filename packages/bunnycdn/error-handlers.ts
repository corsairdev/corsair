import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Operations that persist server-side state.
 *
 * Corsair replays the whole endpoint call when a handler asks for a retry, so
 * a 429 raised after BunnyCDN already committed a write would duplicate it on
 * the next attempt. BunnyCDN offers no idempotency key, so a duplicate cannot
 * be collapsed server-side and these operations are never retried on a rate
 * limit response.
 *
 * Reads (GET), deletes (idempotent by convergence), pure checks
 * (checkAvailability), cache purges (convergent end state) and POST endpoints
 * that only query data (container image lookups) stay retryable.
 *
 * Kept as an explicit set rather than a method pattern so that adding an
 * operation cannot silently opt it into retries; `endpoints.test.ts` asserts
 * every entry is a registered operation.
 */
export const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'pullZone.create',
	'pullZone.update',
	'pullZone.addAllowedReferrer',
	'pullZone.removeAllowedReferrer',
	'pullZone.addBlockedIp',
	'pullZone.removeBlockedIp',
	'pullZone.addBlockedReferrer',
	'pullZone.removeBlockedReferrer',
	'pullZone.resetSecurityKey',
	'pullZone.setForceSSL',
	'pullZone.edgeRuleUpsert',
	'pullZone.edgeRuleSetEnabled',
	'storageZone.create',
	'storageZone.update',
	'dnsZone.createRecord',
	'dnsZone.updateRecord',
	'shield.zoneUpdate',
	'shield.rateLimitCreate',
	'shield.rateLimitUpdate',
	'shield.botDetectionUpdate',
	'shield.uploadScanningUpdate',
	'shield.accessListCreate',
	'shield.accessListUpdate',
	'shield.accessListConfigUpdate',
	'shield.wafRulesReviewTriggeredPost',
]);

export function isNonIdempotent(operation: string): boolean {
	return NON_IDEMPOTENT_OPERATIONS.has(operation);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error, context: ErrorContext) => {
			if (isNonIdempotent(context.operation)) {
				console.warn(
					`[BUNNYCDN:${context.operation}] Rate limited on a non-idempotent write - not retried because the write may already have been applied: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not_found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
