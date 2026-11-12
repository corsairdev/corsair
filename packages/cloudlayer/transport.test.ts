import { ApiError } from 'corsair/http';
import { makeCloudlayerRequest } from './client';
import { errorHandlers } from './error-handlers';

// Unlike client.test.ts, this suite keeps Corsair's real `request` transport so
// the rate-limit configuration Cloudlayer passes to it is exercised end to end.
describe('Cloudlayer transport rate limiting', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('keeps Retry-After on the ApiError the real transport throws', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Too Many Requests' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		// `unknown` because a rejection value has no static type; the
		// assertions below narrow it to ApiError.
		const error = await makeCloudlayerRequest('/jobs', 'unit-test-key').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected the transport to throw ApiError');
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(4000);
		expect(error.isRateLimitError()).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 2, headersRetryAfterMs: 4000 });
	});
});
