import type { CorsairErrorHandler } from 'corsair/core';
import { ExcelAPIError } from './client';

// First match wins. Conflict and invalid-session codes are checked before
// 429, because a throttled response can still carry accessConflict and must
// not be replayed. 504 is retried only for the calls Graph documents as
// safe to repeat (createSession, table add, add rows).

const CONFLICT_CODES = [
	'accessconflict',
	'conflictuncategorized',
	'invalidsessionaccessconflict',
	'itemalreadyexists',
];

const INVALID_SESSION_CODES = [
	'invalidsessionauthentication',
	'invalidsessionnotfound',
	'invalidsessionrecreatable',
	'invalidsessionrestricted',
	'invalidsessionunexpected',
	'invalidsessionunsupportedworkbook',
];

const COOLDOWN_CODES = [
	'toomanyrequests',
	'toomanyrequestsuncategorized',
	'serviceunavailableuncategorized',
	'transientfailure',
];

// Graph says to repeat a 504 on these operations only.
const RETRYABLE_504 = new Set([
	'sessions.create',
	'tables.add',
	'tables.addRows',
]);

const RETRY_AFTER_CAP_MS = 60_000;

type ErrorFacts = {
	status?: number;
	codes: string[];
};

function facts(error: Error): ErrorFacts {
	if (!(error instanceof ExcelAPIError)) {
		return { codes: [] };
	}
	const codes = [error.code, error.innerCode]
		.filter((code): code is string => typeof code === 'string')
		.map((code) => code.toLowerCase());
	return { status: error.status, codes };
}

function hasCode(error: Error, expected: string[]): boolean {
	const { codes } = facts(error);
	return expected.some((code) => codes.includes(code));
}

// The framework sleeps on headersRetryAfterMs with no cap and no jitter.
export function cooldownMs(retryAfterMs: number): number {
	const capped = Math.min(Math.max(retryAfterMs, 0), RETRY_AFTER_CAP_MS);
	const jitter = Math.floor(Math.random() * 250);
	return capped + jitter;
}

export const errorHandlers: CorsairErrorHandler = {
	CONFLICT_ERROR: {
		match: (error: Error) =>
			facts(error).status === 409 || hasCode(error, CONFLICT_CODES),
		handler: async () => ({ maxRetries: 0 }),
	},
	INVALID_SESSION_ERROR: {
		match: (error: Error) => hasCode(error, INVALID_SESSION_CODES),
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			facts(error).status === 401 || hasCode(error, ['unauthorized']),
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			facts(error).status === 403 || hasCode(error, ['forbidden']),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			facts(error).status === 404 ||
			hasCode(error, ['notfound', 'itemnotfound']),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => facts(error).status === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			facts(error).status === 429 || hasCode(error, COOLDOWN_CODES),
		// maxRetries 3 = the initial call plus 3 retries = 4 attempts.
		handler: async (error: Error) => {
			const retryAfter =
				error instanceof ExcelAPIError ? error.retryAfter : undefined;
			if (retryAfter !== undefined) {
				return {
					maxRetries: 3,
					headersRetryAfterMs: cooldownMs(retryAfter),
				};
			}
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff_jitter',
			};
		},
	},
	GATEWAY_TIMEOUT_ERROR: {
		match: (error: Error, context) =>
			facts(error).status === 504 && RETRYABLE_504.has(context.operation),
		// maxRetries 2 = the initial call plus 2 retries = 3 attempts.
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter',
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = facts(error).status;
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
};
