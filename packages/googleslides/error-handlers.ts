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
 * per project and a 429 often carries no Retry-After. The fallback has to be
 * long enough to reach the next window, which a four second wait does not: the
 * four bounded attempts would then all land inside the same exhausted minute.
 * Sixty seconds reaches the next one, and a real Retry-After still wins.
 */
export const RATE_LIMIT_FALLBACK_MS = 60_000;

const QUOTA_EXHAUSTED_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	/**
	 * One 429 answers both a throughput burst and an exhausted daily quota. A
	 * daily cap cannot recover by waiting, so it is not retried at all. Core takes
	 * the first key whose `match` passes, so this is ordered before
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
		// An export reports its own quota state, since a plain Response cannot be
		// inspected by the ApiError path above.
		return (
			error.name === 'GoogleSlidesExportError' &&
			(error as { quotaExhausted?: boolean }).quotaExhausted === true
		);
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
		// Export streams bytes through fetch, so its failures are an export error
		// rather than an ApiError. A 429 is a rate limit, and so is a 403 whose
		// body names rateLimitExceeded or userRateLimitExceeded. Any other 403 is
		// a permission the account lacks, and retrying cannot grant it.
		if (error.name === 'GoogleSlidesExportError') {
			const exportError = error as { status?: number; rateLimited?: boolean };
			return (
				exportError.status === 429 ||
				(exportError.status === 403 && exportError.rateLimited === true)
			);
		}
		// Status and body only. Message text is not read: a 500 whose message
		// mentions a rate limit would otherwise be retried here four times, past
		// SERVER_ERROR's refusal to replay a write.
		return errorStatus(error) === 'resource_exhausted';
	},
	handler: async (error: Error) => {
		// Both error shapes carry Retry-After in milliseconds under this name.
		const retryAfter = (error as { retryAfter?: number }).retryAfter;
		return {
			maxRetries: 4,
			headersRetryAfterMs:
				retryAfter !== undefined ? retryAfter : RATE_LIMIT_FALLBACK_MS,
		};
	},
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
	 * Export streams bytes through `fetch`, so its failures are not ApiErrors and
	 * SERVER_ERROR never sees them. An export changes nothing, so a failure that
	 * might clear is worth repeating; the ones that cannot clear are not.
	 */
	match: (error: Error) => error.name === 'GoogleSlidesExportError',
	handler: async (error: Error) => {
		const status = (error as { status?: number }).status;
		// A transport or body-read failure carries no status: the response never
		// completed, so repeating the read is safe.
		if (status === undefined) return { maxRetries: 2 };
		if (status >= 500) return { maxRetries: 2 };
		// A 4xx is permanent here. The rate-limited 4xx cases were already claimed
		// by RATE_LIMIT_ERROR, which core reaches first.
		return { maxRetries: 0 };
	},
};

const SERVER_ERROR: CorsairErrorHandler[keyof CorsairErrorHandler] = {
	/**
	 * A 5xx is retried only when repeating the endpoint cannot duplicate work.
	 * Core retries the whole endpoint, not the failed request, so the failed
	 * method alone is not enough: `slides.create` POSTs a slide and then GETs it
	 * back, and a 503 on that GET would replay the POST and add a second slide.
	 * `replaySafe` decides, and only pure reads and idempotent writes set it.
	 */
	match: (error: Error) => isApiError(error) && error.status >= 500,
	handler: async (error: Error) => {
		const replaySafe = (error as { replaySafe?: boolean }).replaySafe === true;
		return { maxRetries: replaySafe ? 2 : 0 };
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
