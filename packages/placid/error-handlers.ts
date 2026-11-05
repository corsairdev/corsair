import type { CorsairErrorHandler } from 'corsair/core';
import { PlacidAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof PlacidAPIError ? error.status : undefined;
}

// Status codes: https://placid.app/docs/2.0/rest/errors#http
//
// The operations that read state. Placid uses POST for creating renders, but
// the GET calls, the paged listings and the two search-like lists are reads.
const READ_OPERATIONS = new Set([
	'images.get',
	'pdfs.get',
	'videos.get',
	'templates.list',
	'templates.get',
	'collections.list',
	'collections.get',
	'fonts.list',
	'fonts.get',
]);

function isReadOperation(operation: string | undefined): boolean {
	return operation !== undefined && READ_OPERATIONS.has(operation);
}

export const errorHandlers = {
	// 60 requests per minute. Placid queues renders rather than rejecting them,
	// so a 429 means the request never started and a retry cannot duplicate a
	// render. Retry-After is honored when Placid sends it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof PlacidAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong or revoked token, or a token from another project.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the plan does not cover the resource, such as a project without the
	// API add-on.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422: invalid input, and a field the schema let through but Placid
	// rejects. 404: an unknown template, image, PDF, video, font or collection.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx may have run. Only reads are replayed: a repeated create would
	// render and bill a second file.
	SERVER_ERROR: {
		match: (error: Error, context) =>
			error instanceof PlacidAPIError &&
			(error.status ?? 0) >= 500 &&
			isReadOperation(context.operation),
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

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers.
//
// Two separate rules have to hold at once:
// - a user handler under a new name must be reached before a builtin whose
//   match also covers the same error, so user keys come first in key order;
// - a user handler sharing a builtin name must replace that builtin, so the
//   value is taken from the user map.
// Spreading one map over the other satisfies only one of the two.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;

	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;

	const merged: CorsairErrorHandler = {};
	for (const key of Object.keys(userRest)) merged[key] = userRest[key];
	for (const key of Object.keys(builtinRest)) {
		if (!(key in merged)) merged[key] = builtinRest[key];
	}
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
