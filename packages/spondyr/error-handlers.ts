import type { CorsairErrorHandler } from 'corsair/core';
import { SpondyrAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SpondyrAPIError ? error.status : undefined;
}

/**
 * Spondyr's error taxonomy is the `ErrorMessage` text plus one HTTP status.
 * There is no documented rate-limit code, and no documented retry contract, so
 * only a 429 is retried and only reads are replayed.
 *
 * A 401 and a 400 for bad credentials both come back as `APIStatus: ERROR`, so
 * the auth check matches the message as well as the status.
 */
const AUTH_MESSAGE =
	/api key is invalid|application token is invalid|not specified/i;

export const errorHandlers = {
	// 429, if Spondyr sends one. Its documented behaviour is a plain 400 for every
	// failure, so this is a safety net rather than a documented contract.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof SpondyrAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SpondyrAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A wrong key or token is reported as a 400 or a 404 with the reason in the
	// message, so the text is what identifies it. There is no 401 here: Spondyr
	// answers a bad credential with the same 400 a bad field gets.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SpondyrAPIError && AUTH_MESSAGE.test(error.message),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every other 400, plus the 404 Spondyr uses for an unknown ReferenceID,
	// and the plugin's own rejections: a 200 carrying `APIStatus: ERROR` and a
	// Zod rejection of the provider's answer.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				error.name === 'SpondyrOperationError' ||
				status === 400 ||
				status === 404
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Spondyr does not document a transient-failure contract. Only reads are
	// replayed: `POST /Spondyr` generates and may deliver correspondence, so a
	// replay after an unknown outcome could send the document twice.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SpondyrAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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

/**
 * A 2xx whose body says `APIStatus: 'ERROR'`. Spondyr reports most failures
 * this way, and a caller that only checks the status code would read a refused
 * generation as a success.
 */
export class SpondyrOperationError extends Error {
	/** The provider's own message, verbatim, so a caller can act on it. */
	readonly providerMessage: string;

	constructor(providerMessage: string) {
		super(`Spondyr reported an error: ${providerMessage}`);
		this.name = 'SpondyrOperationError';
		this.providerMessage = providerMessage;
	}
}

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys have to come first and DEFAULT stays last. Spreading the builtin first
// keeps a caller handler's value but not its position, and DEFAULT then claims
// every error before it is reached.
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
