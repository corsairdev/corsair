import { AuthMissingError } from 'corsair/core';
import { makeBotbabaRequest } from './client';

/* -------------------------------------------------------------------------- */
/* mock corsair/http so no real HTTP calls are made                            */
/* -------------------------------------------------------------------------- */

const mockRequest = jest.fn();
jest.mock('corsair/http', () => ({
	request: (...args: unknown[]) => mockRequest(...args),
	ApiError: class ApiError extends Error {
		status: number;
		constructor(message: string, status: number) {
			super(message);
			this.status = status;
			this.name = 'ApiError';
		}
	},
}));

describe('makeBotbabaRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends a GET request with Bearer auth', async () => {
		const fakeResponse = { bots: [] };
		mockRequest.mockResolvedValueOnce(fakeResponse);

		const result = await makeBotbabaRequest('/v1/bots', 'test-api-key');

		expect(result).toEqual(fakeResponse);
		expect(mockRequest).toHaveBeenCalledTimes(1);

		const [config, requestOptions] = mockRequest.mock.calls[0];
		expect(config.BASE).toBe('https://api.botsbaba.com');
		expect(config.HEADERS.Authorization).toBe('Bearer test-api-key');
		expect(requestOptions.method).toBe('GET');
		expect(requestOptions.url).toBe('/v1/bots');
	});

	it('sends a POST request with body', async () => {
		const fakeResponse = { bot: { id: '1', name: 'test' } };
		mockRequest.mockResolvedValueOnce(fakeResponse);

		const result = await makeBotbabaRequest('/v1/bots', 'test-api-key', {
			method: 'POST',
			body: { name: 'test' },
		});

		expect(result).toEqual(fakeResponse);
		const [, requestOptions] = mockRequest.mock.calls[0];
		expect(requestOptions.method).toBe('POST');
		expect(requestOptions.body).toEqual({ name: 'test' });
	});

	it('trims the API key', async () => {
		mockRequest.mockResolvedValueOnce({});

		await makeBotbabaRequest('/v1/bots', '  spaced-key  ');

		const [config] = mockRequest.mock.calls[0];
		expect(config.HEADERS.Authorization).toBe('Bearer spaced-key');
	});

	it('throws AuthMissingError for empty key', async () => {
		await expect(
			makeBotbabaRequest('/v1/bots', ''),
		).rejects.toThrow(AuthMissingError);
	});

	it('throws AuthMissingError for whitespace-only key', async () => {
		await expect(
			makeBotbabaRequest('/v1/bots', '   '),
		).rejects.toThrow(AuthMissingError);
	});

	it('passes query parameters through', async () => {
		mockRequest.mockResolvedValueOnce({ bots: [] });

		await makeBotbabaRequest('/v1/bots', 'key', {
			query: { page: 1, limit: 10 },
		});

		const [, requestOptions] = mockRequest.mock.calls[0];
		expect(requestOptions.query).toEqual({ page: 1, limit: 10 });
	});

	it('includes rate limit config', async () => {
		mockRequest.mockResolvedValueOnce({});

		await makeBotbabaRequest('/v1/bots', 'key');

		const [, , options] = mockRequest.mock.calls[0];
		expect(options.rateLimitConfig).toBeDefined();
		expect(options.rateLimitConfig.enabled).toBe(true);
		expect(options.rateLimitConfig.maxRetries).toBe(3);
	});
});
