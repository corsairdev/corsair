import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// ApiError.body is whatever the provider sent, so it is narrowed here before
// reading Publora's { error, code } envelope.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Publora's JSON error body: `{ error, code? }`. `code` is the stable,
 * machine-readable part (e.g. `POST_LIMIT_REACHED`); older routes send
 * `error` only.
 * Spec: `components.schemas.Error` in https://docs.publora.com/openapi.json
 */
export function publoraErrorCode(error: Error): string | undefined {
	if (!(error instanceof ApiError) || !isRecord(error.body)) return undefined;
	return typeof error.body.code === 'string' ? error.body.code : undefined;
}

// Only reads are retried after a 5xx or network error (R8). A write whose
// reply was lost may already have run: retrying a create or a publishNow
// update could post twice.
const READ_OPERATIONS = new Set([
	'accounts.list',
	'accounts.getContext',
	'posts.get',
	'posts.list',
	'webhooks.list',
	'accounts.testConnection',
	'accounts.getPlatformLimits',
	'posts.getLogs',
	'analytics.postStatistics',
	'analytics.profileStatistics',
	'linkedin.postStatistics',
	'linkedin.accountStatistics',
	'linkedin.profileSummary',
	'linkedin.followers',
	'linkedin.mentionables',
	'company.listContexts',
	'company.getWorkspaceContext',
	'company.listConnections',
	'company.listPlatforms',
	'company.posts.get',
	'company.posts.getApproval',
	'company.posts.listMedia',
	'company.webhooks.list',
]);

export const isNonIdempotent = (operation: string): boolean =>
	!READ_OPERATIONS.has(operation);

/** Plan limits Publora reports with a 4xx and a stable code. */
const PLAN_LIMIT_CODES = new Set([
	'POST_LIMIT_REACHED',
	'SCHEDULED_POST_LIMIT_REACHED',
	'SCHEDULE_HORIZON_REACHED',
]);

function rejectionMessage(operation: string, code: string): string {
	return PLAN_LIMIT_CODES.has(code)
		? `[PUBLORA:${operation}] Plan limit reached (${code}); see https://publora.com/pricing`
		: `[PUBLORA:${operation}] Request rejected (${code})`;
}

/**
 * Publora reports failures with ordinary HTTP status codes, a readable
 * `error` and, on newer paths, a string `code`.
 *
 * Docs: https://docs.publora.com
 */
export const errorHandlers = {
	/**
	 * Transport already retries a 429 (client maxRetries: 2). Returning
	 * another budget here would re-invoke the endpoint and multiply that.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/** Missing, invalid or revoked API key. */
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid api key');
		},
		handler: async (_error, context) => {
			console.warn(
				`[PUBLORA:${context.operation}] Authentication failed - check the API key (Publora dashboard, API)`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 403 is a feature the plan does not include (X, webhooks) or a plan
	 * limit. Retrying will not change it.
	 */
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				rejectionMessage(
					context.operation,
					publoraErrorCode(error) ?? 'forbidden',
				),
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 404,
		handler: async (error, context) => {
			console.warn(
				`[PUBLORA:${context.operation}] Resource not found (${publoraErrorCode(error) ?? 'not_found'})`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 400 is a bad body or id (`INVALID_PLATFORM_CONNECTION`,
	 * `PUBLISH_NOW_CONFLICT`, a plan limit). 409 is a conflict such as a post
	 * that is already publishing or an Idempotency-Key reused with another body.
	 */
	VALIDATION_ERROR: {
		match: (error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 409 || error.status === 422),
		handler: async (error, context) => {
			console.warn(
				rejectionMessage(
					context.operation,
					publoraErrorCode(error) ?? 'invalid_request',
				),
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status !== undefined) {
				return error.status >= 500;
			}
			return error.message.toLowerCase().includes('internal server error');
		},
		handler: async (_error, context) => ({
			maxRetries: isNonIdempotent(context.operation) ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('connection') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed')
			);
		},
		handler: async (_error, context) => {
			console.warn(`[PUBLORA:${context.operation}] Network error`);
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 2,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			// The message can carry text from the provider's reply, so only the
			// status and Publora's error code are logged.
			const status = error instanceof ApiError ? error.status : undefined;
			console.error(
				`[PUBLORA:${context.operation}] Unhandled error (${status ?? 'no status'}, ${publoraErrorCode(error) ?? 'no code'})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
