import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	ENGINEMAILER_API_BASE,
	ENGINEMAILER_RATE_LIMIT_CONFIG,
	EnginemailerAPIError,
	makeEnginemailerRequest,
} from './client';
import { errorHandlers } from './error-handlers';
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

describe('Enginemailer retry ownership', () => {
	// RATE_LIMIT_ERROR retries five times; a transport retry loop on top would
	// turn one persistent 429 into up to 24 requests.
	it.each([
		[
			'REST',
			() =>
				makeEnginemailerRequest(
					'/restapi/campaign/emcampaign/ListCampaign',
					'k',
				),
		],
		['N8N', () => makeEnginemailerN8nRequest('/connect', 'k')],
	])('%s client turns transport retries off', async (_name, call) => {
		mockRequest.mockResolvedValue({});

		await call();

		expect(mockRequest.mock.calls.at(-1)?.[2]).toEqual({
			rateLimitConfig: ENGINEMAILER_RATE_LIMIT_CONFIG,
		});
		expect(ENGINEMAILER_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
	});
});

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

describe('Enginemailer REST status in the response body', () => {
	// Captured from api.enginemailer.com: failures come back as HTTP 200.
	const apiKeyNotFound = {
		Result: {
			StatusCode: '500',
			Status: 'InternalServerError',
			ErrorMessage: 'API Key Not Found!',
		},
	};

	it('raises a 200 response whose Result.StatusCode is an error', async () => {
		mockRequest.mockResolvedValue(apiKeyNotFound);

		const call = makeEnginemailerRequest(
			'/restapi/subscriber/emsubscriber/getSubscriber',
			'bad-key',
			{ method: 'GET', query: { email: 'person@example.com' } },
		);

		await expect(call).rejects.toBeInstanceOf(EnginemailerAPIError);
		await expect(call).rejects.toMatchObject({
			message: 'API Key Not Found!',
			status: 500,
			code: 'InternalServerError',
		});
	});

	it('lets AUTH_ERROR recognise a rejected key', async () => {
		mockRequest.mockResolvedValue(apiKeyNotFound);

		let error: unknown;
		try {
			await makeEnginemailerRequest(
				'/restapi/campaign/emcampaign/ListCampaign',
				'bad-key',
			);
		} catch (caught) {
			error = caught;
		}

		if (!(error instanceof EnginemailerAPIError)) {
			throw new Error('expected an EnginemailerAPIError');
		}
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('raises a bare batchUpdateStatus error without a Result wrapper', async () => {
		mockRequest.mockResolvedValue({
			Status: 'Records Not Exists',
			StatusCode: '404',
		});

		await expect(
			makeEnginemailerRequest(
				'/restapi/subscriber/emsubscriber/batchUpdateStatus',
				'secret',
				{ method: 'POST', body: { ID: 1 } },
			),
		).rejects.toMatchObject({ message: 'Records Not Exists', status: 404 });
	});

	it.each([
		{ Result: { Status: 'OK', StatusCode: '200', Data: [] } },
		{ Result: { StatusCode: '201', Status: 'Processing', ID: 12345 } },
		{ Status: 'Processing', StatusCode: '201' },
		{ Result: {} },
	])('returns 2xx and status-less bodies unchanged (%j)', async (body) => {
		mockRequest.mockResolvedValue(body);

		await expect(
			makeEnginemailerRequest('/restapi/campaign/emcampaign/ListCampaign', 'k'),
		).resolves.toEqual(body);
	});

	it('sends query parameters on POST for activateSubscriber', async () => {
		mockRequest.mockResolvedValue({ Result: { StatusCode: '200' } });

		await makeEnginemailerRequest(
			'/restapi/subscriber/emsubscriber/activateSubscriber',
			'secret',
			{ method: 'POST', query: { email: 'person@example.com' } },
		);

		expect(lastCall()[1]).toMatchObject({
			method: 'POST',
			query: { email: 'person@example.com' },
			body: undefined,
		});
	});
});

describe('Enginemailer live response quirks', () => {
	it('parses REST JSON that arrives as application/octet-stream text', async () => {
		// Live getCustomField: Content-Type application/octet-stream, so the
		// shared client returns the JSON as a string.
		mockRequest.mockResolvedValue(
			'{\r\n  "Result": {\r\n    "Status": "OK",\r\n    "StatusCode": "200",\r\n    "Data": [{ "customfield_key": "first_name" }]\r\n  }\r\n}',
		);

		await expect(
			makeEnginemailerRequest(
				'/restapi/subscriber/emsubscriber/getCustomField',
				'k',
			),
		).resolves.toEqual({
			Result: {
				Status: 'OK',
				StatusCode: '200',
				Data: [{ customfield_key: 'first_name' }],
			},
		});
	});

	it('still raises a body error that arrives as text', async () => {
		mockRequest.mockResolvedValue(
			'{"Result":{"StatusCode":"500","Status":"InternalServerError","ErrorMessage":"API Key Not Found!"}}',
		);

		await expect(
			makeEnginemailerRequest('/restapi/campaign/emcampaign/ListCampaign', 'k'),
		).rejects.toMatchObject({ message: 'API Key Not Found!', status: 500 });
	});

	it('raises a non-JSON body instead of returning a string', async () => {
		mockRequest.mockResolvedValue('<html>Request Error</html>');

		await expect(
			makeEnginemailerRequest('/restapi/campaign/emcampaign/ListCampaign', 'k'),
		).rejects.toBeInstanceOf(EnginemailerAPIError);
	});

	it('keeps the N8N error message from the response body', async () => {
		// Live findsubscriber for an unknown address: HTTP 500 with this body.
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/findsubscriber' },
				{
					url: `${ENGINEMAILER_N8N_API_BASE}/findsubscriber`,
					ok: false,
					status: 500,
					statusText: 'Internal Server Error',
					body: { status: 'failed', message: 'Email not exists.' },
				},
				'Internal Server Error',
			),
		);

		await expect(
			makeEnginemailerN8nRequest('/findsubscriber', 'k', {
				method: 'POST',
				body: { email: 'nobody@example.com' },
			}),
		).rejects.toMatchObject({
			name: 'EnginemailerAPIError',
			message: 'Email not exists.',
			status: 500,
			code: 'failed',
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
