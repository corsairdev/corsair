import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { ProviderJson } from './types';

/** Google's own rate-limit reason strings, which arrive inside a 403 body. */
const RATE_LIMIT_REASONS = [
	'ratelimitexceeded',
	'userratelimitexceeded',
	'quotaexceeded',
	'dailylimitexceeded',
];

function isApiError(error: Error): error is ApiError {
	return error instanceof ApiError;
}

/**
 * Google reports most failures as a JSON error envelope whose `status` names
 * the kind: 429 RESOURCE_EXHAUSTED, 403 PERMISSION_DENIED, 401 UNAUTHENTICATED.
 * All of them are read because a gateway in front of the API can answer a 429
 * with no body at all.
 */
function errorStatus(error: Error): string {
	if (isApiError(error) && error.body && typeof error.body === 'object') {
		// Google documents status as a string; the typeof guard below still runs
		// because a proxy can answer with a different envelope.
		const body = error.body as { error?: { status?: string } };
		if (typeof body.error?.status === 'string') {
			return body.error.status.toLowerCase();
		}
	}
	return '';
}

function errorReason(error: Error): string {
	if (isApiError(error) && error.body && typeof error.body === 'object') {
		// Google documents reason as a string and details as an array of objects;
		// details is stringified because its members vary by error kind.
		const body = error.body as {
			error?: { errors?: { reason?: string }[]; details?: ProviderJson[] };
		};
		const reasons = (body.error?.errors ?? [])
			.map((entry) => (typeof entry.reason === 'string' ? entry.reason : ''))
			.join(' ')
			.toLowerCase();
		if (reasons) return reasons;
		// Newer errors carry the reason only inside details.
		return JSON.stringify(body.error?.details ?? {}).toLowerCase();
	}
	return '';
}

/**
 * Google documents no fixed retry window for this API: the quota is per minute
 * per project and the 429 carries no Retry-After. A four second fallback lets a
 * per-minute window recover in one or two attempts instead of spending every
 * attempt inside the same exhausted minute.
 */
export const RATE_LIMIT_FALLBACK_MS = 4000;

const QUOTA_EXHAUSTED_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	/**
	 * One 429 answers both a throughput burst and an exhausted daily quota. A
	 * daily cap cannot recover in four seconds, so it is not retried at all.
	 * Core takes the first key whose `match` passes, so this is ordered before
	 * RATE_LIMIT_ERROR below.
	 */
	match: (error: Error) => {
		if (isApiError(error) && (error.status === 403 || error.status === 429)) {
			const reason = errorReason(error);
			return (
				reason.includes('dailylimitexceeded') ||
				reason.includes('quotaexceeded')
			);
		}
		return false;
	},
	handler: async () => ({ maxRetries: 0 }),
};

const RATE_LIMIT_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	match: (error: Error) => {
		if (isApiError(error) && error.status === 429) return true;
		// rateLimitExceeded arrives as a 403 with the reason in the body, so a
		// status-only match would retry one form and fail the other at once.
		if (isApiError(error) && error.status === 403) {
			const reason = errorReason(error);
			return RATE_LIMIT_REASONS.some((entry) => reason.includes(entry));
		}
		if (errorStatus(error) === 'resource_exhausted') return true;
		const message = error.message.toLowerCase();
		return message.includes('rate limit') || message.includes('quota exceeded');
	},
	handler: async (error: Error) => ({
		maxRetries: 4,
		headersRetryAfterMs:
			isApiError(error) && error.retryAfter !== undefined
				? error.retryAfter
				: RATE_LIMIT_FALLBACK_MS,
	}),
};

const AUTH_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	match: (error: Error) => {
		if (isApiError(error) && error.status === 401) return true;
		if (isApiError(error) && error.status === 403) {
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthenticated') ||
				message.includes('invalid_grant') ||
				message.includes('invalid credentials')
			);
		}
		return errorStatus(error) === 'unauthenticated';
	},
	handler: async () => ({ maxRetries: 0 }),
};

const PERMISSION_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	/**
	 * A 403 that is neither auth nor quota is a permission the deck needs and
	 * the connected account lacks. Retrying cannot grant it.
	 */
	match: (error: Error) =>
		(isApiError(error) && error.status === 403) ||
		errorStatus(error) === 'permission_denied',
	handler: async () => ({ maxRetries: 0 }),
};

const NOT_FOUND_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	match: (error: Error) =>
		(isApiError(error) && error.status === 404) ||
		errorStatus(error) === 'not_found',
	handler: async () => ({ maxRetries: 0 }),
};

const EXPORT_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	/**
	 * Export reads stream bytes through `fetch`, which exposes no status field,
	 * so their failures are matched on the error the client builds. A dropped
	 * connection never reached Google, so replaying a read is safe, and no write
	 * path uses that client.
	 */
	match: (error: Error) => error.name === 'GoogleSlidesExportError',
	handler: async (error: Error) => {
		const status = (error as { status?: number }).status;
		if (status !== undefined && status >= 500) return { maxRetries: 2 };
		return { maxRetries: 0 };
	},
};

const SERVER_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	/**
	 * 5xx is retried only for reads. A batchUpdate that timed out after Google
	 * applied it would double the edit on replay, so the request method decides
	 * whether a retry is safe; ApiError carries the request it was built from.
	 */
	match: (error: Error) => isApiError(error) && error.status >= 500,
	handler: async (error: Error) => {
		if (isApiError(error) && error.request?.method !== 'GET') {
			return { maxRetries: 0 };
		}
		return { maxRetries: 2 };
	},
};

const DEFAULT: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	match: () => true,
	handler: async () => ({ maxRetries: 0 }),
};

export const errorHandlers = {
	QUOTA_EXHAUSTED_ERROR,
	RATE_LIMIT_ERROR,
	AUTH_ERROR,
	PERMISSION_ERROR,
	NOT_FOUND_ERROR,
	EXPORT_ERROR,
	SERVER_ERROR,
	DEFAULT,
} satisfies CorsairErrorHandler;

/**
 * Core runs the first handler whose `match` passes in key order, and DEFAULT
 * matches everything. A plain spread would keep a caller's handler value but
 * the builtin's key position, so a caller handler for an error no builtin
 * covers would never run: DEFAULT would claim that error first. Caller keys
 * therefore go first, unnamed builtins follow, and DEFAULT stays last.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user?: CorsairErrorHandler,
): CorsairErrorHandler {
	if (!user) return builtin;

	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };

	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) {
			merged[name] = entry;
		}
	}

	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
