import { ApiError, request } from 'corsair/http';
import { makeAuthenticatedGoogleAnalyticsRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('callMeasurementProtocol', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('passes a timeout signal on the collect request', async () => {
		const { callMeasurementProtocol } = await import('./client');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));
		await callMeasurementProtocol(
			{ events: [{ name: 'login' }] },
			{
				validate: false,
				apiSecret: 'secret',
				measurementId: 'G-XXXX',
			},
		);
		const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});
});

describe('makeAuthenticatedGoogleAnalyticsRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	function unauthorized(): ApiError {
		return new ApiError(
			{ method: 'GET', url: '/v1beta/accounts' },
			{
				url: '/v1beta/accounts',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {},
			},
			'Unauthorized',
		);
	}

	it('retries once with a refreshed token after 401', async () => {
		const first = unauthorized();
		mockRequest.mockRejectedValueOnce(first);
		mockRequest.mockResolvedValueOnce({ name: 'accounts/1' } as never);
		const refresh = jest.fn().mockResolvedValue('fresh-token');

		const result = await makeAuthenticatedGoogleAnalyticsRequest(
			'/v1beta/accounts',
			{ key: 'stale-token', _refreshAuth: refresh },
		);

		expect(result).toEqual({ name: 'accounts/1' });
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest.mock.calls[1]?.[0]).toEqual(
			expect.objectContaining({ TOKEN: 'fresh-token' }),
		);
	});

	it('does not retry a second 401', async () => {
		const first = unauthorized();
		const second = unauthorized();
		mockRequest.mockRejectedValueOnce(first);
		mockRequest.mockRejectedValueOnce(second);
		const refresh = jest.fn().mockResolvedValue('fresh-token');

		await expect(
			makeAuthenticatedGoogleAnalyticsRequest('/v1beta/accounts', {
				key: 'stale-token',
				_refreshAuth: refresh,
			}),
		).rejects.toBe(second);
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});
});
