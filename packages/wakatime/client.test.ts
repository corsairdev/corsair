import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { WakaTimeAPIError } from './client';
import { makeWakaTimeRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeWakaTimeRequest', () => {
	it('uses WakaTime Basic Auth with the API key only', async () => {
		mockRequest.mockResolvedValue({ id: 'user-1' });

		await makeWakaTimeRequest('users/current', 'secret-key');

		const [config] = lastCall();
		expect(config.BASE).toBe('https://api.wakatime.com/api/v1');
		expect(config.HEADERS).toMatchObject({
			Authorization: `Basic ${Buffer.from('secret-key').toString('base64')}`,
		});
	});

	it('forwards GET query parameters', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'user-1' } });

		await makeWakaTimeRequest('users/current', 'secret-key', {
			query: { include: 'email', page: 1 },
		});

		const [, requestOptions] = lastCall();
		expect(requestOptions).toMatchObject({
			method: 'GET',
			url: 'users/current',
			query: { include: 'email', page: 1 },
		});
	});

	it('preserves HTTP and rate-limit metadata when wrapping ApiError', async () => {
		const original = new ApiError(
			{ method: 'GET', url: 'users/current' },
			{
				url: 'https://api.wakatime.com/api/v1/users/current',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'rate limited' },
			},
			'WakaTime request failed',
			{
				retryAfter: 30,
				rateLimitReset: 60,
				rateLimitRemaining: 0,
				rateLimitLimit: 100,
			},
		);
		mockRequest.mockRejectedValue(original);

		await expect(
			makeWakaTimeRequest('users/current', 'key'),
		).rejects.toMatchObject<Partial<WakaTimeAPIError>>({
			name: 'WakaTimeAPIError',
			code: 429,
			status: 429,
			statusText: 'Too Many Requests',
			body: { error: 'rate limited' },
			retryAfter: 30,
			rateLimitReset: 60,
			rateLimitRemaining: 0,
			rateLimitLimit: 100,
		});
	});

	it('wraps transport errors without inventing HTTP metadata', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		await expect(
			makeWakaTimeRequest('users/current', 'key'),
		).rejects.toMatchObject({
			name: 'WakaTimeAPIError',
			message: 'socket hang up',
			status: undefined,
		});
	});
});
