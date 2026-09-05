/**
 * Error policy.
 *
 * `makeTimecampRequest` wraps ApiError in TimecampAPIError, so these assert the
 * handlers read status and Retry-After off the *wrapper*. Matching on
 * `instanceof ApiError` here would silently never fire.
 */
import {
	TIMECAMP_RATE_LIMIT_CONFIG,
	TimecampAPIError,
	tryGetStoredKey,
} from './client';
import { errorHandlers } from './error-handlers';

/** Builds the error shape the client actually throws. */
function wrapped(
	status: number,
	message = 'request failed',
	retryAfter?: number,
) {
	const error = new TimecampAPIError(message, status);
	Object.assign(error, { status, retryAfter });
	return error as Error;
}

describe('tryGetStoredKey', () => {
	it('treats a missing DEK as "no stored key" instead of failing', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('No DEK found for account');
			}),
		).resolves.toBeUndefined();
	});

	it('propagates any other storage failure', async () => {
		const failure = new Error('keychain locked');
		await expect(
			tryGetStoredKey(async () => {
				throw failure;
			}),
		).rejects.toBe(failure);
	});

	it('normalizes a null stored key to undefined', async () => {
		await expect(tryGetStoredKey(async () => null)).resolves.toBeUndefined();
	});
});

describe('rate limiting', () => {
	it('matches a wrapped 429 by status, not by message text', () => {
		// Message deliberately omits "429" — status alone must be enough.
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped(429, 'too many'))).toBe(
			true,
		);
	});

	it('surfaces the provider Retry-After instead of generic backoff', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			wrapped(429, 'too many', 30_000),
		);
		expect(result.headersRetryAfterMs).toBe(30_000);
	});

	it('still retries a rate limit when the status is absent', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('HTTP 429 returned')),
		).toBe(true);
	});

	it('does not treat an unrelated failure as a rate limit', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped(500))).toBe(false);
	});

	it('does not treat a 500 as a rate limit just because the message mentions 429', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				wrapped(500, 'proxy echoed HTTP 429 from an earlier hop'),
			),
		).toBe(false);
	});
});

describe('auth and plan failures', () => {
	it('matches a wrapped 401', () => {
		expect(errorHandlers.AUTH_ERROR.match(wrapped(401))).toBe(true);
	});

	it('does not treat a 500 as auth failure just because the message mentions 401', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				wrapped(500, 'upstream returned 401 from a dependency'),
			),
		).toBe(false);
		expect(
			errorHandlers.SERVER_ERROR.match(
				wrapped(500, 'upstream returned 401 from a dependency'),
			),
		).toBe(true);
	});

	it('never retries an auth failure', async () => {
		// The handler warns operators that the token is bad; that warning is
		// production behaviour, so it is silenced here rather than printed
		// into every test run.
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
			expect(warn).toHaveBeenCalled();
		} finally {
			warn.mockRestore();
		}
	});

	it('matches the 403 a free-plan account receives', () => {
		expect(errorHandlers.PLAN_OR_PERMISSION_ERROR.match(wrapped(403))).toBe(
			true,
		);
	});

	it('never retries a plan failure, since it cannot resolve itself', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			expect(
				(await errorHandlers.PLAN_OR_PERMISSION_ERROR.handler()).maxRetries,
			).toBe(0);
			expect(warn).toHaveBeenCalled();
		} finally {
			warn.mockRestore();
		}
	});
});

describe('server errors', () => {
	it('retries a 5xx', () => {
		expect(errorHandlers.SERVER_ERROR.match(wrapped(503))).toBe(true);
	});

	it('does not classify a 4xx as a server error', () => {
		expect(errorHandlers.SERVER_ERROR.match(wrapped(404))).toBe(false);
	});
});

describe('fallback', () => {
	it('catches anything unclassified without retrying', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		expect((await errorHandlers.DEFAULT.handler()).maxRetries).toBe(0);
	});
});

describe('retry ownership', () => {
	it('leaves retrying entirely to the error policy', () => {
		// With the transport also retrying, the two layers compound: one
		// operation issues several times the intended requests and stacks two
		// independent backoffs.
		expect(TIMECAMP_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
	});

	it('still parses Retry-After so the policy can honour it', () => {
		expect(TIMECAMP_RATE_LIMIT_CONFIG.headerNames?.retryAfter).toBe(
			'Retry-After',
		);
	});
});
