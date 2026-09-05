import { ApiError, request } from 'corsair/http';
import { BenzingaAPIError, makeBenzingaRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.benzinga.com/api/v2/news' },
		{
			url: 'https://api.benzinga.com/api/v2/news',
			ok: false,
			status,
			statusText: `status ${status}`,
			body: `status ${status}`,
		},
		`status ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Benzinga API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue([]);
	});

	it('targets the Benzinga base URL with JSON headers', async () => {
		await makeBenzingaRequest('/api/v2/news', 'test-key', {
			query: { pageSize: 1 },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: 'https://api.benzinga.com',
			WITH_CREDENTIALS: false,
		});
		expect(config?.HEADERS).toMatchObject({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});
		expect(options).toMatchObject({ method: 'GET', url: '/api/v2/news' });
	});

	it('authenticates via the token query parameter only', async () => {
		await makeBenzingaRequest('/api/v2/news', 'test-key', {
			query: { pageSize: 1 },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(options?.query).toMatchObject({ pageSize: 1, token: 'test-key' });
		// Live evidence: any `Authorization` header makes the API answer as
		// anonymous, so neither HEADERS nor TOKEN may set one.
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
		expect(config).not.toHaveProperty('TOKEN');
	});

	it('sends a body only for write methods', async () => {
		await makeBenzingaRequest('/api/v2/news', 'test-key', {
			method: 'POST',
			body: { tickers: 'AAPL' },
		});
		const [, postOptions] = mockRequest.mock.calls[0] ?? [];
		expect(postOptions?.body).toEqual({ tickers: 'AAPL' });
		expect(postOptions?.query).toMatchObject({ token: 'test-key' });

		jest.clearAllMocks();
		await makeBenzingaRequest('/api/v2/news', 'test-key', {
			method: 'GET',
			query: { pageSize: 1 },
		});
		const [, getOptions] = mockRequest.mock.calls[0] ?? [];
		expect(getOptions?.body).toBeUndefined();
	});

	it('rethrows ApiError untouched so status and retryAfter survive', async () => {
		const rateLimited = apiError(429, 45000);
		mockRequest.mockRejectedValue(rateLimited);

		const seen = await makeBenzingaRequest('/api/v2/news', 'test-key').catch(
			(error: unknown) => error,
		);
		expect(seen).toBe(rateLimited);
		expect(seen).toBeInstanceOf(ApiError);
		if (seen instanceof ApiError) {
			expect(seen.status).toBe(429);
			expect(seen.retryAfter).toBe(45000);
		}
	});

	it('wraps generic errors in BenzingaAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const seen = await makeBenzingaRequest('/api/v2/news', 'test-key').catch(
			(error: unknown) => error,
		);
		expect(seen).toBeInstanceOf(BenzingaAPIError);
		if (seen instanceof BenzingaAPIError) {
			expect(seen.message).toBe('fetch failed');
			expect(seen.name).toBe('BenzingaAPIError');
			expect(seen.code).toBeUndefined();
		}
	});

	it('wraps non-error rejections as unknown errors', async () => {
		mockRequest.mockRejectedValue('boom');

		const seen = await makeBenzingaRequest('/api/v2/news', 'test-key').catch(
			(error: unknown) => error,
		);
		expect(seen).toBeInstanceOf(BenzingaAPIError);
		if (seen instanceof BenzingaAPIError) {
			expect(seen.message).toBe('Unknown error');
		}
	});

	it('returns the parsed response unchanged', async () => {
		const payload = [{ id: 1 }];
		mockRequest.mockResolvedValue(payload);

		const result = await makeBenzingaRequest('/api/v2/news', 'test-key');
		expect(result).toEqual([{ id: 1 }]);
	});
});
