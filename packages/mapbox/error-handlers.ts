import type { CorsairErrorHandler } from 'corsair/core';
import { MapboxAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof MapboxAPIError ? error.status : undefined;
}

// Mapbox's rate-limit window is 60 seconds (x-rate-limit-interval). A 429 that
// carries no reset header still means the window is full, so wait it out.
export const MAPBOX_RATE_LIMIT_WINDOW_MS = 60_000;

// A 200 whose body says the request cannot be answered. The client raises
// these as errors; a retry sends the same coordinates and fails the same way.
const ENVELOPE_CODES = new Set(['NoRoute', 'NoSegment', 'NotImplemented']);

// Status codes and bodies: the "errors" table on each product page under
// https://docs.mapbox.com/api/, checked against the live API. Every operation
// is a GET, so a retry never repeats a write.
export const errorHandlers = {
	// 429 on any product. Limits are per product and per minute: 1,000 for
	// geocoding v6, 300 for directions and isochrone, 60 for matrix, 50 for
	// tilequery on this account. x-rate-limit-reset gives the exact wait.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof MapboxAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				(error instanceof MapboxAPIError ? error.retryAfter : undefined) ??
				MAPBOX_RATE_LIMIT_WINDOW_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: no token, an invalid token, or a token without a valid prefix. A
	// retry sends the same token.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the account lacks the product, or the token has URL restrictions or
	// is missing a scope.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: an invalid profile or a missing tileset. Nothing changes between attempts.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422: a request Mapbox rejects, such as too many coordinates.
	// Also this plugin's own input validation.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// HTTP 200 with NoRoute, NoSegment or NotImplemented.
	ROUTING_ERROR: {
		match: (error: Error) =>
			error instanceof MapboxAPIError &&
			error.code !== undefined &&
			ENVELOPE_CODES.has(error.code),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Every Mapbox operation here is a GET, so replaying is safe. The
	// method check keeps that true if a write is ever added.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof MapboxAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A reset, DNS failure or timeout never reached Mapbox, so a read is safe
	// to replay.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof MapboxAPIError &&
			error.transport &&
			error.method === 'GET',
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. Caller handlers come
// first so a caller's rule is reached before an overlapping builtin match.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
