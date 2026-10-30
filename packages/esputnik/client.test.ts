import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { ESPUTNIK_API_BASE, makeEsputnikRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return [call[0], call[1]];
}

beforeEach(() => mockRequest.mockReset());

describe('eSputnik transport', () => {
	it('uses Basic Auth with the API key as the password', async () => {
		mockRequest.mockResolvedValue({ organisationName: 'Test' });
		await makeEsputnikRequest('/api/v1/account/info', 'secret');

		const [config, options] = lastCall();
		expect(config.BASE).toBe(ESPUTNIK_API_BASE);
		expect(config.HEADERS).toMatchObject({
			Authorization: `Basic ${Buffer.from('api_key:secret').toString('base64')}`,
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/api/v1/account/info',
		});
	});

	it('forwards DELETE query parameters', async () => {
		mockRequest.mockResolvedValue({});
		await makeEsputnikRequest('/api/v1/contact', 'secret', {
			method: 'DELETE',
			query: { externalCustomerId: 'customer-1', erase: true },
		});

		expect(lastCall()[1]).toMatchObject({
			method: 'DELETE',
			query: { externalCustomerId: 'customer-1', erase: true },
		});
	});

	it('preserves status and retry-after from provider errors', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'balance' },
				{
					url: `${ESPUTNIK_API_BASE}/api/v1/balance`,
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Rate limited',
				{ retryAfter: 2500 },
			),
		);

		await expect(
			makeEsputnikRequest('/api/v1/balance', 'secret'),
		).rejects.toMatchObject({
			name: 'EsputnikAPIError',
			status: 429,
			retryAfter: 2500,
		});
	});
});
