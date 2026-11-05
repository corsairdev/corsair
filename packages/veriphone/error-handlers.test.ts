import { ApiError } from 'corsair/http';
import { VeriphoneAPIError } from './client';
import { errorHandlers } from './error-handlers';

type HandlerEntry = Exclude<
	(typeof errorHandlers)[keyof typeof errorHandlers],
	undefined
>;

function getHandler(name: keyof typeof errorHandlers): HandlerEntry {
	const entry = errorHandlers[name];
	if (entry === undefined) {
		throw new Error(`missing handler: ${name}`);
	}
	return entry;
}

// Builds a realistic provider failure: VeriphoneAPIError copies status and
// rate-limit headers from the underlying ApiError via instanceof.
function apiErrorWithStatus(status: number): VeriphoneAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: 'v3/verify' },
		{
			url: 'v3/verify',
			ok: false,
			status,
			statusText: 'error',
			body: undefined,
		},
		`provider responded with ${status}`,
	);
	return new VeriphoneAPIError(`provider responded with ${status}`, status, {
		cause,
	});
}

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		const error = apiErrorWithStatus(429);
		expect(getHandler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		expect(getHandler('AUTH_ERROR').match(error)).toBe(false);
	});

	it('retries rate-limit errors honoring the Retry-After header', async () => {
		const error = apiErrorWithStatus(429);
		const result = await getHandler('RATE_LIMIT_ERROR').handler(error);
		// maxRetries must stay > 0: the binder only waits
		// headersRetryAfterMs when it actually retries.
		expect(result.maxRetries).toBe(5);
	});

	it('classifies a 401 as AUTH_ERROR', () => {
		const error = apiErrorWithStatus(401);
		expect(getHandler('AUTH_ERROR').match(error)).toBe(true);
		expect(getHandler('RATE_LIMIT_ERROR').match(error)).toBe(false);
	});

	it('classifies a 402 as PAYMENT_REQUIRED_ERROR', () => {
		const error = apiErrorWithStatus(402);
		expect(getHandler('PAYMENT_REQUIRED_ERROR').match(error)).toBe(true);
	});

	it('classifies a 404 as NOT_FOUND_ERROR', () => {
		const error = apiErrorWithStatus(404);
		expect(getHandler('NOT_FOUND_ERROR').match(error)).toBe(true);
	});

	it('classifies a 500 as SERVER_ERROR', () => {
		const error = apiErrorWithStatus(500);
		expect(getHandler('SERVER_ERROR').match(error)).toBe(true);
	});

	it('falls through to DEFAULT for anything else', () => {
		const error = apiErrorWithStatus(418);
		expect(getHandler('RATE_LIMIT_ERROR').match(error)).toBe(false);
		expect(getHandler('AUTH_ERROR').match(error)).toBe(false);
		expect(getHandler('PAYMENT_REQUIRED_ERROR').match(error)).toBe(false);
		expect(getHandler('NOT_FOUND_ERROR').match(error)).toBe(false);
		expect(getHandler('SERVER_ERROR').match(error)).toBe(false);
		expect(getHandler('DEFAULT').match(error)).toBe(true);
	});

	it('treats a raw message about rate limiting as RATE_LIMIT_ERROR', () => {
		const error = new VeriphoneAPIError('Rate limit exceeded');
		expect(getHandler('RATE_LIMIT_ERROR').match(error)).toBe(true);
	});
});
