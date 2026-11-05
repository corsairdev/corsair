import type { CorsairErrorHandler } from 'corsair/core';
import { CircleCIAPIError, CircleCIGraphQLError } from './client';

/**
 * CircleCI reports failure two different ways depending on transport:
 *
 * - REST (v2, v3, v1.1) uses ordinary HTTP status codes, wrapped as
 *   `CircleCIAPIError` by `client.ts`.
 * - GraphQL answers **200** with an `errors[]` array in the body - wrapped as
 *   `CircleCIGraphQLError`, which carries no status at all. Every handler
 *   below that can plausibly fire from a GraphQL call also matches on the
 *   error message text for this reason.
 *
 * Confirmed live 2026-08-16:
 * - 429 with `x-ratelimit-*` headers (limit 300; the reset header's unit was
 *   not determined and is not relied on - see `client.ts`).
 * - 403 "Permission denied" both for genuine permission failures (group
 *   creation on this account) **and** for a context id that does not exist
 *   at all (confirmed by testing a real deleted context and a
 *   never-existed id side by side - both 403, both "Forbidden"). CircleCI
 *   does not distinguish the two on context routes, so a 403 there means
 *   "not accessible", which covers both causes rather than only one.
 *
 * **Every message-text fallback below is gated on the error having no
 * status at all.** `ApiError`'s message embeds the response body verbatim
 * for any status this plugin's own status map does not name explicitly
 * (`packages/corsair/async-core/request.ts`'s `catchErrorCodes`), and
 * `CircleCIAPIError` carries that message through unchanged - so a genuine
 * 500 whose body happens to mention a job number, org id, or any other
 * digit string containing "429" or "401" could otherwise be misclassified
 * as a rate limit or an auth failure instead of the real error. A
 * `CircleCIAPIError` is therefore classified by `.status` alone, never by
 * scanning its message; the substring fallback only ever runs for
 * `CircleCIGraphQLError` or a bare `Error`, neither of which carries a
 * status to check instead.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof CircleCIAPIError) return error.status === 429;
			return error.message.toLowerCase().includes('429');
		},
		/**
		 * Honours the server's own `Retry-After` when CircleCI sent one, rather
		 * than retrying on a blind backoff - the same pattern `@corsair-dev/slack`
		 * uses. For v2/v3/v1.1 this is a second line of defence: the shared
		 * `request` helper already retries a 429 internally using the same
		 * header, so this only fires if those internal retries are also
		 * exhausted. For GraphQL, which does not go through that helper, this is
		 * the *only* place `Retry-After` is honoured - see `client.ts`.
		 */
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof CircleCIAPIError ? error.retryAfter : undefined,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof CircleCIAPIError) return error.status === 401;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('401');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * A 403 on a REST route, or a GraphQL "Permission denied" - which,
	 * confirmed live, is what CircleCI answers for both a genuine permission
	 * failure and a subject that plain does not exist (a deleted or
	 * never-existed context). Do not read this as "the caller lacks access"
	 * without also considering "the id is wrong" - the API does not let the
	 * two be told apart here.
	 */
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof CircleCIAPIError && error.status === 403)
				return true;
			if (error instanceof CircleCIGraphQLError) {
				return error.errors.some((e) =>
					e.message.toLowerCase().includes('permission denied'),
				);
			}
			return false;
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			// Same gating as RATE_LIMIT_ERROR/AUTH_ERROR above, and the same
			// class of bug: not named in the review that prompted this file's
			// header comment, but the identical pattern - found by enumerating
			// every handler with a message-text fallback rather than fixing
			// only the ones a reviewer happened to point at.
			if (error instanceof CircleCIAPIError) return error.status === 404;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * Any other GraphQL-level failure - bad arguments, a missing required
	 * input key, a validation error. Not retried: none of these are transient.
	 */
	GRAPHQL_ERROR: {
		match: (error: Error) => error instanceof CircleCIGraphQLError,
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
