import { ApiError, request } from 'corsair/http';
import { makeTpscheckRequest, TPSCHECK_API_BASE } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/check' },
		{
			url: 'https://api.tpscheck.uk/check',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeTpscheckRequest', () => {
	it('sends Authorization: Token <apiKey> and does not set TOKEN in config', async () => {
		mockRequest.mockResolvedValue({ valid: true });

		await makeTpscheckRequest('/check', 'test-key-123', {
			method: 'POST',
			body: { phone: '01829 830730' },
			query: { version: '2' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: TPSCHECK_API_BASE,
			HEADERS: {
				Authorization: 'Token test-key-123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/check',
				body: { phone: '01829 830730' },
				query: { version: '2' },
			}),
		);
	});

	it('makes unauthenticated requests without Authorization header', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeTpscheckRequest('/status', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: TPSCHECK_API_BASE,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeTpscheckRequest('/check', 'test-key', { method: 'POST' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});
});
