import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { ENGINEMAILER_API_BASE, makeEnginemailerRequest } from './client';
import {
	ENGINEMAILER_N8N_API_BASE,
	makeEnginemailerN8nRequest,
} from './n8n-client';

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

describe('Enginemailer transport', () => {
	it('uses the APIKey header and official base URL', async () => {
		mockRequest.mockResolvedValue({ Result: {} });

		await makeEnginemailerRequest(
			'/restapi/campaign/emcampaign/ListCampaign',
			'secret',
			{
				method: 'GET',
			},
		);

		const [config, options] = lastCall();
		expect(config.BASE).toBe(ENGINEMAILER_API_BASE);
		expect(config.HEADERS).toMatchObject({ APIKey: 'secret' });
		expect(config.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/restapi/campaign/emcampaign/ListCampaign',
		});
	});

	it('serializes JSON bodies for POST requests', async () => {
		mockRequest.mockResolvedValue({ Result: {} });
		const body = { email: 'person@example.com' };

		await makeEnginemailerRequest(
			'/restapi/subscriber/emsubscriber/insertSubscriber',
			'secret',
			{
				method: 'POST',
				body,
			},
		);

		const [, options] = lastCall();
		expect(options).toMatchObject({ method: 'POST', body });
	});

	it('converts provider ApiError into EnginemailerAPIError without losing status', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'campaigns' },
				{
					url: `${ENGINEMAILER_API_BASE}/campaigns`,
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { message: 'API Key Not Found!' },
				},
				'API Key Not Found!',
			),
		);

		await expect(
			makeEnginemailerRequest('/campaigns', 'secret'),
		).rejects.toMatchObject({
			name: 'EnginemailerAPIError',
			status: 401,
		});
	});

	it('preserves Retry-After when wrapping rate-limit errors', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'campaigns' },
				{
					url: `${ENGINEMAILER_API_BASE}/campaigns`,
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {},
				},
				'Rate limited',
				{ retryAfter: 12_000 },
			),
		);

		await expect(
			makeEnginemailerRequest('/campaigns', 'secret'),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 12_000,
		});
	});
});

describe('Enginemailer N8N transport', () => {
	it('uses the N8N base URL and APIKEY header', async () => {
		mockRequest.mockResolvedValue({});

		await makeEnginemailerN8nRequest('/connect', 'secret');

		const [config, options] = lastCall();
		expect(config.BASE).toBe(ENGINEMAILER_N8N_API_BASE);
		expect(config.HEADERS).toMatchObject({ APIKEY: 'secret' });
		expect(options).toMatchObject({ method: 'GET', url: '/connect' });
	});

	it('serializes N8N POST bodies and GET queries', async () => {
		mockRequest.mockResolvedValue({});
		const body = { email: 'person@example.com' };
		await makeEnginemailerN8nRequest('/findsubscriber', 'secret', {
			method: 'POST',
			body,
		});
		expect(lastCall()[1]).toMatchObject({ method: 'POST', body });

		await makeEnginemailerN8nRequest('/newsubscribers', 'secret', {
			method: 'GET',
			query: { limit: 10 },
		});
		expect(lastCall()[1]).toMatchObject({
			method: 'GET',
			query: { limit: 10 },
		});
	});
});
