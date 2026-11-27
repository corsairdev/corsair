import type { CorsairErrorHandler } from 'corsair/core';
import { DocRaptorAPIError } from './client';

function asDocRaptorError(error: Error): DocRaptorAPIError | undefined {
	return error instanceof DocRaptorAPIError ? error : undefined;
}

// No status means the request never reached DocRaptor: transport failures
// (reset, DNS, abort, timeout) surface here with no HTTP status at all.
function isTransportError(error: Error): boolean {
	const docError = asDocRaptorError(error);
	return docError !== undefined && docError.status === undefined;
}

export const errorHandlers = {
	// DocRaptor's only documented throttle is a 403 naming simultaneous
	// requests (more than 30 at once), not a 429. One retry on GET reads:
	// a queued generation finishes or other requests drain, and polling
	// status again is safe. Writes never replay.
	THROTTLE_ERROR: {
		match: (error: Error) => {
			const docError = asDocRaptorError(error);
			return (
				docError !== undefined &&
				docError.isThrottle &&
				docError.method === 'GET'
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 1,
			headersRetryAfterMs: asDocRaptorError(error)?.retryAfter ?? undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong or missing key.
	AUTH_ERROR: {
		match: (error: Error) => asDocRaptorError(error)?.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 that is not the throttle: no permission for that document, or the
	// empty-body denial of GET /docs.json with a test-mode key. Retrying
	// cannot change either.
	PERMISSION_ERROR: {
		match: (error: Error) => asDocRaptorError(error)?.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid document input (validation errors come back in the body)
	// and 404 a status or download id that does not exist. The request has
	// to change.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = asDocRaptorError(error)?.status;
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx replays reads only. Every create starts a new billed (or test)
	// document and DocRaptor has no idempotency keys, so a replay after a
	// failed-looking create can double-bill; expire permanently removes a
	// hosted document and is never replayed either.
	SERVER_ERROR: {
		match: (error: Error) => {
			const docError = asDocRaptorError(error);
			return (
				docError !== undefined &&
				docError.method === 'GET' &&
				(docError.status ?? 0) >= 500
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection never reached DocRaptor, so replaying a read
	// cannot repeat anything. Writes stay gated on the method check.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			isTransportError(error) && asDocRaptorError(error)?.method === 'GET',
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller keys
// take position first and DEFAULT stays last even when the caller adds or
// overrides handlers.
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
