import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { ApiBibleAPIError, makeApiBibleRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const KEY = 'test-api-key';

describe('makeApiBibleRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('authenticates via the api-key header and uses the transport rate-limit config', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeApiBibleRequest('bibles', KEY);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://rest.api.bible/v1',
				HEADERS: expect.objectContaining({ 'api-key': KEY }),
			}),
			expect.objectContaining({ method: 'GET', url: 'bibles' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 3,
				}),
			}),
		);
	});

	it('converts a transport 429 ApiError into an ApiBibleAPIError that surfaces the status', async () => {
		const response = {
			url: 'https://rest.api.bible/v1/bibles',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: { error: 'rate limited' },
		} satisfies ApiResult;

		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'bibles' } satisfies ApiRequestOptions,
				response,
				'Rate limit exceeded',
				{ retryAfter: 2000 },
			),
		);

		await expect(makeApiBibleRequest('bibles', KEY)).rejects.toMatchObject({
			status: 429,
			code: '429',
			retryAfter: 2000,
		});
	});

	it('wraps non-ApiError failures without a status code', async () => {
		mockRequest.mockRejectedValue(new Error('network down'));

		const rejected = makeApiBibleRequest('bibles', KEY);
		await expect(rejected).rejects.toMatchObject({
			status: undefined,
			code: undefined,
		});
		await expect(rejected).rejects.toBeInstanceOf(ApiBibleAPIError);
	});
});
