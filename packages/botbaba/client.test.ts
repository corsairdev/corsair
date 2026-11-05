import { AuthMissingError } from 'corsair/core';
import { BOTBABA_API_BASE, makeBotbabaRequest } from './client';

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

	it('posts to app.botbaba.io with the profile Authorization token', async () => {
		mockRequest.mockResolvedValueOnce({ ok: true });

		const result = await makeBotbabaRequest('api/GetContact', 'test-token', {
			body: { contact_id: 'c1' },
		});

		expect(result).toEqual({ ok: true });
		const [config, requestOptions] = mockRequest.mock.calls[0];
		expect(config.BASE).toBe(BOTBABA_API_BASE);
		expect(config.HEADERS.Authorization).toBe('test-token');
		expect(requestOptions.method).toBe('POST');
		expect(requestOptions.url).toBe('api/GetContact');
		expect(requestOptions.body).toEqual({ contact_id: 'c1' });
	});

	it('forwards extra Shopify headers', async () => {
		mockRequest.mockResolvedValueOnce({});

		await makeBotbabaRequest('api/CartCreationShopifyWebhook', 'token', {
			body: { id: 1 },
			headers: { 'X-Shopify-Topic': 'carts/create' },
		});

		const [config] = mockRequest.mock.calls[0];
		expect(config.HEADERS['X-Shopify-Topic']).toBe('carts/create');
	});

	it('trims the API key', async () => {
		mockRequest.mockResolvedValueOnce({});
		await makeBotbabaRequest('api/ListTags', '  spaced-key  ');
		const [config] = mockRequest.mock.calls[0];
		expect(config.HEADERS.Authorization).toBe('spaced-key');
	});

	it('throws AuthMissingError for an empty key', async () => {
		await expect(makeBotbabaRequest('api/ListTags', '')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('includes rate limit config', async () => {
		mockRequest.mockResolvedValueOnce({});
		await makeBotbabaRequest('api/ListTags', 'key');
		const [, , options] = mockRequest.mock.calls[0];
		expect(options.rateLimitConfig.enabled).toBe(true);
	});
});
