import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeShipEngineRequest } from './client';
import type { ShipEngineKeyBuilderContext } from './index';
import { shipengine } from './index';

function buildKeyContext(): ShipEngineKeyBuilderContext {
	return {
		authType: 'api_key',
		options: { authType: 'api_key' },
		tenantId: 'test-tenant',
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(null),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
	};
}

describe('ShipEngine client', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('fails before network access when the API key is empty', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeShipEngineRequest('carriers.listCarriers', '', {}),
		).rejects.toThrow('ShipEngine API key is required');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a missing tenant API key as Corsair AuthMissingError', async () => {
		const keyBuilder = shipengine().keyBuilder;
		if (!keyBuilder) throw new Error('Expected ShipEngine key builder');
		await expect(
			keyBuilder(buildKeyContext(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('uses the documented EU host and API-Key header without a Bearer token', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					carriers: [],
					request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
					errors: [],
				}),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			),
		);
		const response = await makeShipEngineRequest(
			'carriers.listCarriers',
			'test-api-key',
			{},
			'eu',
		);
		expect(response.carriers).toEqual([]);
		const requestCall = fetchMock.mock.calls[0];
		expect(requestCall).toBeDefined();
		if (!requestCall) throw new Error('Expected ShipEngine request');
		const [requestUrl, requestInit] = requestCall;
		expect(new URL(String(requestUrl)).origin).toBe(
			'https://api.eu.shipengine.com',
		);
		expect(new Headers(requestInit?.headers).get('API-Key')).toBe(
			'test-api-key',
		);
		expect(new Headers(requestInit?.headers).has('Authorization')).toBe(false);
	});

	it('honors Retry-After retries and sanitizes rate-limit errors', async () => {
		jest.useFakeTimers();
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(
					JSON.stringify({
						request_id: 'private-request-id',
						errors: [{ message: 'private account detail' }],
					}),
					{
						status: 429,
						headers: { 'content-type': 'application/json', 'retry-after': '1' },
					},
				),
		);
		const pendingRequest = makeShipEngineRequest(
			'carriers.listCarriers',
			'test-api-key',
			{},
		);
		const errorPromise = pendingRequest.then(
			() => {
				throw new Error('Expected the rate-limited request to fail');
			},
			// `unknown` because a rejected promise may carry any JavaScript value.
			(caught: unknown) => caught,
		);
		await jest.runAllTimersAsync();
		const error = await errorPromise;
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError))
			throw new Error('Expected sanitized ShipEngine ApiError');
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(1000);
		expect(error.message).toBe('ShipEngine API request failed with HTTP 429');
		expect(error.body).toBeUndefined();
		expect(error.message).not.toContain('private');
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});
});
