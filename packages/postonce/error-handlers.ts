import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * PostOnce's JSON error envelope: `{ error: { code, message, hint? } }`.
 * Spec: `components.schemas.ErrorResponse` in https://postonce.to/api/openapi.json
 */
export function postonceErrorCode(error: Error): string | undefined {
	if (!(error instanceof ApiError) || !isRecord(error.body)) return undefined;
	const envelope = error.body.error;
	if (isRecord(envelope) && typeof envelope.code === 'string') {
		return envelope.code;
	}
	return undefined;
}

/**
 * Whether replaying an operation could publish or cancel twice. Corsair
 * re-invokes the whole endpoint when a handler asks for a retry, so a 5xx or
 * network failure after PostOnce already accepted the write is unsafe to
 * replay. Reads are safe.
 */
const NON_IDEMPOTENT = new Set([
	'posts.create',
	'posts.cancel',
	'posts.publish',
	'posts.retryTarget',
	'drafts.create',
	'media.createUpload',
	'workflows.create',
	'webhooks.create',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT.has(operation);

/**
 * PostOnce reports failures with ordinary HTTP status codes plus a string
 * `error.code` in the JSON body.
 *
 * Docs: https://docs.postonce.to/api-reference
 */
export const errorHandlers = {
	/**
	 * Transport already retries a 429 (client maxRetries: 2). Returning
	 * another budget here would re-invoke the endpoint and multiply that.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const code = postonceErrorCode(error);
			if (code === 'rate_limit_exceeded') return true;
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/** Missing, invalid, revoked or expired API key. */
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid api key');
		},
		handler: async (_error, context) => {
			console.warn(
				`[POSTONCE:${context.operation}] Authentication failed - check the API key (PostOnce dashboard, Preferences, API Keys)`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 403 is `missing_scope` (the key lacks e.g. `posts:write`) or
	 * `plan_not_allowed`. Retrying will not add a scope.
	 */
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				`[POSTONCE:${context.operation}] Permission denied (${postonceErrorCode(error) ?? 'forbidden'})`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const code = postonceErrorCode(error);
			return code !== undefined && code.endsWith('_not_found');
		},
		handler: async (error, context) => {
			console.warn(
				`[POSTONCE:${context.operation}] Resource not found (${postonceErrorCode(error) ?? 'not_found'})`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 400 is a bad body or id (`invalid_media`, `invalid_post_id`, inactive
	 * target account). 409 is a conflict such as an Idempotency-Key whose
	 * first request is still in progress.
	 */
	VALIDATION_ERROR: {
		match: (error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 409 || error.status === 422),
		handler: async (error, context) => {
			console.warn(
				`[POSTONCE:${context.operation}] Request rejected (${postonceErrorCode(error) ?? 'invalid_request'})`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status !== undefined) {
				return error.status >= 500;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('internal server error');
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
			console.warn(`[POSTONCE:${context.operation}] Network error`);
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 2,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			// The message can carry text from the provider's reply, so only the
			// status and PostOnce's error code are logged.
			const status = error instanceof ApiError ? error.status : undefined;
			console.error(
				`[POSTONCE:${context.operation}] Unhandled error (${status ?? 'no status'}, ${postonceErrorCode(error) ?? 'no code'})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
