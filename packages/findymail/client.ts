import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FINDYMAIL_API_BASE = 'https://app.findymail.com';

// Findymail answers 429 for two reasons: a short concurrency throttle ("Too
// Many Attempts.") and a plan-capacity stop that asks the caller to come back
// in minutes (`retry_after: 300`). The request was refused before it ran, so
// nothing was charged: short throttles are retried, long waits are returned to
// the caller straight away instead of holding the call open for minutes.
const MAX_RATE_LIMIT_RETRIES = 3;
const MAX_RETRY_WAIT_MS = 10_000;
const INITIAL_RETRY_DELAY_MS = 1_000;

function retryWaitMs(error: ApiError, attempt: number): number {
	if (error.retryAfter !== undefined) return error.retryAfter;
	// unknown: the 429 body is untyped provider JSON; only a numeric
	// `retry_after` (seconds) is read from it.
	const body: unknown = error.body;
	if (typeof body === 'object' && body !== null && 'retry_after' in body) {
		const seconds = body.retry_after;
		if (typeof seconds === 'number') return seconds * 1000;
	}
	return INITIAL_RETRY_DELAY_MS * 2 ** attempt;
}

// The HTTP response is untrusted JSON, so no narrower type is sound until an
// endpoint's Zod output schema validates it.
export async function makeFindymailRequest(
	key: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('findymail', 'api_key');
	const config: OpenAPIConfig = {
		BASE: FINDYMAIL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: key,
		ENCODE_PATH: encodeURIComponent,
	};
	for (let attempt = 0; ; attempt++) {
		try {
			// Core's own 429 loop sleeps for any Retry-After, however long, so it
			// is turned off here and the bounded loop around it decides instead.
			return await request<unknown>(config, options, {
				rateLimitConfig: {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: INITIAL_RETRY_DELAY_MS,
					backoffMultiplier: 2,
					headerNames: { retryAfter: 'retry-after' },
				},
			});
		} catch (error) {
			if (
				!(error instanceof ApiError) ||
				error.status !== 429 ||
				attempt >= MAX_RATE_LIMIT_RETRIES
			) {
				throw error;
			}
			const wait = retryWaitMs(error, attempt);
			if (wait > MAX_RETRY_WAIT_MS) throw error;
			await new Promise((resolve) => setTimeout(resolve, wait));
		}
	}
}
