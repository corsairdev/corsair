import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Status codes per https://docs.mixpanel.com/reference/rate-limits and live
 * calls. Core's request() already retries a 429 three times (honouring
 * Retry-After), so no handler here retries again. Query API limits are per
 * hour (60 queries, 5 concurrent), export 60/hour and 3/s, ingestion
 * 2 GB/minute.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: wrong service account, missing project_id, or a GDPR call without
	// its OAuth token ("required scope(s)").
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: the plan does not include the API (the Query API on the free plan
	// answers `query_api.request.plan_restricted`). Retrying cannot help.
	PLAN_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the service account's role cannot do this (org-level calls need an
	// organization admin or owner).
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 (strict import validation, query selector problems), 404, 413 (a
	// batch over 10 MB / 2000 events), 422: the same request fails the same
	// way every time.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				error.name === 'MixpanelConfigError' ||
				status === 400 ||
				status === 404 ||
				status === 413 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
