import { ApiError, request } from 'corsair/http';
import { makeStreamtimeRequest, StreamtimeAPIError } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/organisation' },
		{
			url: 'https://api.streamtime.net/v2/organisation',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('makeStreamtimeRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends the api key as TOKEN and omits a duplicate Authorization header', async () => {
		mockRequest.mockResolvedValueOnce({ name: 'Acme' });

		await makeStreamtimeRequest('organisation', 'st-key');

		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe('https://api.streamtime.net/v2');
		expect(config?.TOKEN).toBe('st-key');
		expect(
			(config?.HEADERS as Record<string, string> | undefined)?.Authorization,
		).toBeUndefined();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2500);
		mockRequest.mockRejectedValueOnce(rateLimited);

		try {
			await makeStreamtimeRequest('organisation', 'st-key');
			throw new Error('expected the request to reject');
		} catch (error) {
			expect(error).toBe(rateLimited);
			expect(error).toBeInstanceOf(ApiError);
			if (!(error instanceof ApiError)) {
				throw new Error('expected ApiError');
			}
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(2500);
		}
	});

	it('routes a transport 429 through RATE_LIMIT_ERROR and keeps the delay', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2500);
		mockRequest.mockRejectedValueOnce(rateLimited);

		try {
			await makeStreamtimeRequest('roles', 'st-key');
			throw new Error('expected the request to reject');
		} catch (error) {
			if (!(error instanceof Error)) {
				throw new Error('expected Error');
			}
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 2500,
			});
		}
	});

	it('wraps a non-Error rejection', async () => {
		mockRequest.mockRejectedValueOnce('boom');

		await expect(
			makeStreamtimeRequest('roles', 'st-key'),
		).rejects.toBeInstanceOf(StreamtimeAPIError);
	});
});
