/**
 * Error classification.
 *
 * This matters more than it looks because the plugin has **two** transports.
 * Most operations go through the shared `request` helper, which wraps a failure
 * as an `ApiError` carrying a status. The four non-JSON operations - the three
 * `/export/*` documents and the challenge CSV - use `fetch` directly and throw
 * a plain `Error`, because the shared transport parses every body as JSON.
 *
 * So every handler is checked twice: once against an `ApiError`, and once
 * against the plain-`Error` message the raw-fetch path actually produces. A
 * handler that only recognises the first would silently stop retrying rate
 * limits on exactly the operations most likely to be slow.
 */
import { ApiError } from 'corsair/http';
import { HabiticaHttpError } from './client';
import { errorHandlers } from './error-handlers';

/** Builds an ApiError the way the shared transport does. */
function apiError(status: number, body: unknown, message = 'request failed') {
	return new ApiError(
		{ method: 'GET', url: 'user' },
		{
			url: 'https://habitica.com/api/v3/user',
			ok: false,
			status,
			statusText: '',
			body,
		},
		message,
	);
}

/** The message `makeHabiticaExportRequest` throws on a failed export. */
const exportError = (status: number, statusText: string) =>
	new Error(
		`Habitica export userdata.json returned HTTP ${status} ${statusText}`,
	);

/** The message `makeHabiticaTextRequest` throws for the challenge CSV. */
const textError = (status: number, statusText: string) =>
	new Error(
		`Habitica challenges/challenge-1/export/csv returned HTTP ${status} ${statusText}`,
	);

/** The first handler whose `match` accepts the error, in declaration order. */
function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Habitica error handlers', () => {
	describe('rate limiting', () => {
		it('classifies a 429 from the shared transport', () => {
			expect(
				classify(apiError(429, { success: false, error: 'TooManyRequests' })),
			).toBe('RATE_LIMIT_ERROR');
		});

		it('classifies a 429 from the raw-fetch export path', () => {
			// No ApiError here, so only the message can carry the signal.
			expect(classify(exportError(429, 'Too Many Requests'))).toBe(
				'RATE_LIMIT_ERROR',
			);
			expect(classify(textError(429, 'Too Many Requests'))).toBe(
				'RATE_LIMIT_ERROR',
			);
		});

		it("matches Habitica's own error code, not a generic spelling", () => {
			// The scaffold matched 'rate_limited', which Habitica never sends.
			expect(classify(new Error('TooManyRequests'))).toBe('RATE_LIMIT_ERROR');
			expect(classify(new Error('rate_limited'))).not.toBe('RATE_LIMIT_ERROR');
		});

		it('retries, and honours a retry-after when the transport parsed one', async () => {
			const error = apiError(429, {});
			(error as { retryAfter?: number }).retryAfter = 21_000;

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

			expect(result.maxRetries).toBeGreaterThan(0);
			expect(result.headersRetryAfterMs).toBe(21_000);
		});

		it("honours the raw-fetch path's preserved Retry-After", async () => {
			// The point of HabiticaHttpError: without this the delay Habitica sent
			// is discarded and the retries run on a blind backoff.
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new HabiticaHttpError('export failed', 429, 21_069),
			);

			expect(result.headersRetryAfterMs).toBe(21_069);
		});

		it('classifies a HabiticaHttpError 429 by status, not by message text', async () => {
			// A message that says nothing about rate limiting still classifies,
			// because the status travels with the error now.
			expect(classify(new HabiticaHttpError('export failed', 429))).toBe(
				'RATE_LIMIT_ERROR',
			);
		});

		it('still retries when no retry-after was available', async () => {
			// The raw-fetch path never populates retryAfter, so the backoff has to
			// stand on its own.
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				exportError(429, 'Too Many Requests'),
			);

			expect(result.maxRetries).toBeGreaterThan(0);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});
	});

	describe('authentication', () => {
		it('classifies a 401 from either transport', () => {
			expect(classify(apiError(401, { error: 'NotAuthorized' }))).toBe(
				'AUTH_ERROR',
			);
			expect(classify(new Error('NotAuthorized'))).toBe('AUTH_ERROR');
			expect(classify(new Error('invalid_credentials'))).toBe('AUTH_ERROR');
		});

		it('classifies a redacted HabiticaHttpError 401 by status', () => {
			// `withRedactedPathValue` rebuilds an error to strip a secret out of
			// its URL. Without a status branch that would silently downgrade a 401
			// to the DEFAULT handler.
			expect(classify(new HabiticaHttpError('[REDACTED]', 401))).toBe(
				'AUTH_ERROR',
			);
		});

		it('never retries an authentication failure', async () => {
			// The same credential will fail again. The handler takes no argument -
			// there is nothing about the error that could change the answer.
			const result = await errorHandlers.AUTH_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('the missing x-client header', () => {
		it('is a 400, not a 401, and is classified on its own', () => {
			// Worth separating because it is the failure most likely to be misread:
			// it looks like an auth problem and is not.
			expect(classify(new Error('Missing x-client headers.'))).toBe(
				'CLIENT_HEADER_ERROR',
			);
		});

		it('does not retry, because no retry can add the header', async () => {
			const result = await errorHandlers.CLIENT_HEADER_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('everything else', () => {
		it('falls through to DEFAULT without retrying', async () => {
			expect(classify(apiError(404, { error: 'NotFound' }))).toBe('DEFAULT');
			expect(classify(new Error('something unexpected'))).toBe('DEFAULT');

			const result = await errorHandlers.DEFAULT.handler();
			expect(result.maxRetries).toBe(0);
		});

		it('does not misclassify a 404 as a rate limit', () => {
			// A path containing "429" would be a nasty false positive; check the
			// message match is not that loose in practice.
			expect(classify(apiError(404, { error: 'NotFound' }))).not.toBe(
				'RATE_LIMIT_ERROR',
			);
		});
	});
});
