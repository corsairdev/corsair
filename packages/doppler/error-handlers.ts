import type { CorsairErrorHandler } from 'corsair/core';
import { DopplerAPIError } from './client';

/**
 * Doppler answers every failure - `/v3` and Doppler Share alike - with an
 * ordinary HTTP status and a consistent body,
 * `{"messages": [...], "success": false}`, confirmed live for 400/401/403/404.
 * There is no second failure shape to account for (unlike CircleCI's GraphQL
 * transport, which reports failure as a 200), so every handler here matches
 * on `DopplerAPIError.status` alone.
 *
 * **Every handler is gated on the error having a status at all before
 * falling back to a message-text match.** `ApiError`'s message embeds the
 * response body verbatim for any status this plugin's own status map does
 * not name explicitly, so an unrelated failure whose body happens to mention
 * a project name containing a trigger word could otherwise be misclassified.
 * A `DopplerAPIError` is therefore classified by `.status` alone, never by
 * scanning its message - the message fallback exists only for a bare `Error`
 * that never reached `DopplerAPIError` at all.
 *
 * Confirmed live 2026-08-16:
 * - 403 `"You do not have access to service accounts."` /
 *   `"You do not have access to groups."` - both Team+/Enterprise-gated on
 *   this free Developer-plan account.
 * - 403 on `GET /v3/workplace/change_requests` - matches the catalog's own
 *   stated Team/Enterprise gate for `DOPPLER_LIST_CHANGE_REQUESTS`.
 * - 401 `"Invalid Auth token"` for a garbage token.
 * - 404 `"Could not find requested project '<name>'"` for a nonexistent
 *   project.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof DopplerAPIError) return error.status === 429;
			return error.message.toLowerCase().includes('429');
		},
		/**
		 * Honours the server's own `retry-after` when Doppler sent one, rather
		 * than retrying on a blind backoff. The shared `request` helper already
		 * retries a 429 internally using the same header - this is a second
		 * line of defence for when those internal retries are also exhausted.
		 */
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof DopplerAPIError ? error.retryAfter : undefined,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof DopplerAPIError) return error.status === 401;
			const msg = error.message.toLowerCase();
			return msg.includes('invalid auth') || msg.includes('401');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * A 403 - confirmed live to cover a genuine plan gate (service accounts,
	 * groups, change requests all Team+/Enterprise-only on the Developer
	 * plan this session tested against) rather than an access-control denial
	 * specifically. Not retried either way: retrying cannot change the plan.
	 */
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof DopplerAPIError) return error.status === 403;
			return error.message.toLowerCase().includes('403');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof DopplerAPIError) return error.status === 404;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
