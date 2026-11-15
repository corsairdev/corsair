import type { CorsairErrorHandler } from 'corsair/core';
import { StoryblokAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof StoryblokAPIError ? error.status : undefined;
}

/**
 * Storyblok answers `{ "error": "…" }` on every failure, including its
 * validation errors, which are a single sentence rather than a field map.
 *
 * Rate limits are plan-based: 3 requests per second on Starter and 6 on the paid
 * plans. Storyblok documents a 429 and asks callers to back off and retry.
 * https://www.storyblok.com/docs/api/management
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Storyblok refused the request before running it, so any method is safe
		// to replay. Storyblok documents no Retry-After, so this falls back.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof StoryblokAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 `{ "error": "Unauthorized" }`: the token is missing, invalid or expired.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof StoryblokAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such story, component, datasource or space, which includes asking
	// the wrong regional host for a space that lives elsewhere.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof StoryblokAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 and 400: a field failed validation, such as a story with no content or
	// a slug already used. 409: a conflict. None improves on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying on a read. A write may already have landed: story
	// create and update are not idempotent, and publish/unpublish are GETs whose
	// replay would repeat a state change.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof StoryblokAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. Caller keys come first so a
 * handler they added actually runs.
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
		if (!(name in merged)) {
			merged[name as keyof CorsairErrorHandler] = entry;
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
