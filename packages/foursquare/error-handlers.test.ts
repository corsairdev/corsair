import {
	describeFoursquareError,
	FOURSQUARE_API_VERSION,
	FoursquareAPIError,
} from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	creditsExhaustedBody,
	notFoundBody,
	serverErrorBody,
} from './test-fixtures';

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

describe('Foursquare error description', () => {
	it('reads the message field', () => {
		expect(describeFoursquareError(404, notFoundBody, 'fallback')).toBe(
			"Foursquare 404: Endpoint '/places/doesnotexist' not found.",
		);
	});

	it('falls back to the errors array when message is absent', () => {
		// Verified live: a 500 answers { errors: [...] } rather than { message }.
		expect(describeFoursquareError(500, serverErrorBody, 'fallback')).toBe(
			'Foursquare 500: internal server error',
		);
	});

	it('uses the fallback when the body carries neither', () => {
		expect(describeFoursquareError(502, {}, 'gateway')).toBe(
			'Foursquare 502: gateway',
		);
	});

	it('omits the status when it is unknown', () => {
		expect(describeFoursquareError(undefined, notFoundBody, 'x')).toContain(
			'Endpoint',
		);
	});
});

describe('Foursquare error classification', () => {
	it('treats 401 and 403 as auth errors', () => {
		expect(new FoursquareAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new FoursquareAPIError('x', { status: 403 }).isAuthError).toBe(true);
	});

	it('recognises the missing-version 400', () => {
		const error = new FoursquareAPIError(
			'Foursquare 400: Please provide a valid version.',
			{ status: 400 },
		);
		expect(error.isVersionError).toBe(true);
	});

	it('does not mistake another 400 for a version error', () => {
		const error = new FoursquareAPIError('Foursquare 400: bad ll', {
			status: 400,
		});
		expect(error.isVersionError).toBe(false);
	});

	it('recognises exhausted credits, which share status 429', () => {
		const error = new FoursquareAPIError(creditsExhaustedBody.message, {
			status: 429,
		});
		expect(error.isCreditExhausted).toBe(true);
	});

	it('does not mistake a plain rate limit for exhausted credits', () => {
		const error = new FoursquareAPIError('Foursquare 429: Too Many Requests', {
			status: 429,
		});
		expect(error.isCreditExhausted).toBe(false);
	});
});

describe('Foursquare error handlers', () => {
	it('matches exhausted credits before the rate-limit handler', () => {
		const error = new FoursquareAPIError(creditsExhaustedBody.message, {
			status: 429,
		});

		expect(handler('CREDITS_EXHAUSTED_ERROR').match(error)).toBe(true);
		// Both match, so key order decides: credits must be listed first or the
		// client burns three retries on a condition no retry can fix.
		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		const keys = Object.keys(errorHandlers);
		expect(keys.indexOf('CREDITS_EXHAUSTED_ERROR')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('never retries exhausted credits', async () => {
		const error = new FoursquareAPIError(creditsExhaustedBody.message, {
			status: 429,
		});
		expect(await handler('CREDITS_EXHAUSTED_ERROR').handler(error)).toEqual({
			maxRetries: 0,
		});
	});

	it('retries a genuine 429 with Retry-After', async () => {
		const error = new FoursquareAPIError('Too Many Requests', {
			status: 429,
			retryAfter: 2000,
		});
		expect(await handler('RATE_LIMIT_ERROR').handler(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never retries a 401, a version error or a 404', async () => {
		for (const name of [
			'AUTH_ERROR',
			'VERSION_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
			'CONFLICT_ERROR',
		] as const) {
			const status =
				name === 'AUTH_ERROR'
					? 401
					: name === 'NOT_FOUND_ERROR'
						? 404
						: name === 'CONFLICT_ERROR'
							? 409
							: 400;
			const error = new FoursquareAPIError('x', { status });
			expect(await handler(name).handler(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('replays a 5xx, since every operation is a read', async () => {
		const error = new FoursquareAPIError('gateway', {
			status: 502,
			method: 'GET',
		});
		expect(handler('SERVER_ERROR').match(error)).toBe(true);
		expect(await handler('SERVER_ERROR').handler(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('keeps DEFAULT last after a caller adds a handler', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names).toContain('CREDITS_EXHAUSTED_ERROR');
	});

	it('pins the documented API version', () => {
		// Changing this silently would break every request with "provide a valid
		// version", so it is asserted rather than left to drift.
		expect(FOURSQUARE_API_VERSION).toBe('2025-06-17');
	});
});
