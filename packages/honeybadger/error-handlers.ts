import type { CorsairErrorHandler } from 'corsair/core';
import { HoneybadgerAPIError } from './client';

function failure(error: Error): HoneybadgerAPIError | undefined {
	return error instanceof HoneybadgerAPIError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return failure(error)?.status;
}

function codeOf(error: Error): string | undefined {
	return failure(error)?.code;
}

function replayable(error: Error): boolean {
	return failure(error)?.replayable ?? false;
}

/** `Retry-After` in milliseconds, when Honeybadger sent one. */
function retryAfterMs(error: Error): number | undefined {
	const value = failure(error)?.retryAfter;
	return value !== undefined && value > 0 ? value : undefined;
}

// Codes and statuses: https://docs.honeybadger.io/api/v3/ (Errors) and the
// per-operation Response tables, which list every code each route can answer.
export const errorHandlers = {
	// 401: missing, revoked or wrong-region token. `unsupported_auth_scheme`,
	// `credential_in_query` and `ingestion_key_not_accepted` land here too; the
	// last one means an ingestion key was used where an API token belongs.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token's scopes do not cover the route (`insufficient_scope`), the
	// plan lacks the feature (`feature_unavailable`), a plan limit is reached
	// (`limit_reached`), the account is inactive or parked, or the record is not
	// this token's (`access_denied`). None of them change by sending it again.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 `not_found`: unknown id, or a record this token cannot see.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 `invalid_parameter`: a query value outside its allowed range. A
	// rejected input schema is here too, since that is the caller's mistake.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 `validation_error` or `forbidden_attributes`: the body is wrong.
	// `ambiguous_account` and `delete_failed` also land here.
	VALIDATION_ERROR: {
		match: (error: Error) => statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 `fault_merged`: the fault was merged into another, named in
	// `details.merged_into`. A write has to move to the target fault.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	/**
	 * 429. None of the three codes means Honeybadger acted on the request, so
	 * all of them are safe to repeat whatever the method: `rate_limit_exceeded`
	 * is the hourly budget, `concurrent_request` is another request changing the
	 * same record, and `streams_provisioning` is a new project's Insights
	 * streams still being created. None is a quota the account has run out of,
	 * so no retry is wasted.
	 */
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => {
			const wait = retryAfterMs(error);
			return wait !== undefined
				? { maxRetries: 3, headersRetryAfterMs: wait }
				: {
						maxRetries: 3,
						retryStrategy: 'exponential_backoff' as const,
					};
		},
	},
	/**
	 * 503 `maintenance_mode` or `service_unavailable`: Honeybadger asks for a
	 * later attempt. Only a replayable call is repeated, because a write may
	 * have landed before the failure.
	 */
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries: replayable(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The client's own timeout, which it records as `timedOut` because the name
	// that identified it is lost when the failure is re-thrown. A 408 from a
	// gateway lands here too. Safe to repeat for a read, never for a write,
	// where the request can time out after Honeybadger acted on it.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 408 || failure(error)?.timedOut === true,
		handler: async (error: Error) => ({
			maxRetries: replayable(error) ? 2 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	// A reset connection or a DNS failure: the request never reached
	// Honeybadger, so a read is repeated and a write is left to the caller. A
	// timeout is excluded here, because TIMEOUT_ERROR names it and runs first.
	NETWORK_ERROR: {
		match: (error: Error) => {
			const failed = failure(error);
			return (
				failed !== undefined && failed.status === undefined && !failed.timedOut
			);
		},
		handler: async (error: Error) => ({
			maxRetries: replayable(error) ? 2 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys go first: a
// caller handler for a status no builtin covers would otherwise never run,
// because the trailing DEFAULT claims that error first.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
