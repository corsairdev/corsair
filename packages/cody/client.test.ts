import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { CODY_API_BASE, CodyAPIError, makeCodyRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): { config: OpenAPIConfig; options: ApiRequestOptions } {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return { config: call[0], options: call[1] };
}

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/bots' },
		{
			url: `${CODY_API_BASE}/bots`,
			ok: false,
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'Unauthorized',
			body: { message: 'failed' },
		},
		status === 429 ? 'Too Many Requests' : 'Unauthorized',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeCodyRequest', () => {
	it('sends the API key as bearer token in config', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeCodyRequest('/bots', 'test-cody-token', {
			query: { search: 'test' },
		});

		const { config, options } = lastCall();
		expect(config.BASE).toBe(CODY_API_BASE);
		expect(config.TOKEN).toBe('test-cody-token');
		expect(config.HEADERS).toEqual({
			'Content-Type': 'application/json',
		});
		expect(options.query).toEqual({
			search: 'test',
		});
	});

	it('rejects an empty API key before issuing a request', async () => {
		await expect(makeCodyRequest('/bots', '')).rejects.toThrow(CodyAPIError);
		await expect(makeCodyRequest('/bots', '   ')).rejects.toThrow(
			'Cody API key is required',
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('re-throws ApiError directly preserving status and retryAfter metadata', async () => {
		const rateLimitError = apiError(429, 3000);
		mockRequest.mockRejectedValue(rateLimitError);

		try {
			await makeCodyRequest('/bots', 'token');
			throw new Error('should have thrown');
		} catch (error) {
			expect(error).toBe(rateLimitError);
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(429);
			expect((error as ApiError).retryAfter).toBe(3000);
		}
	});

	it('re-throws 401 ApiError directly for auth error handling', async () => {
		const authError = apiError(401);
		mockRequest.mockRejectedValue(authError);

		try {
			await makeCodyRequest('/bots', 'invalid-token');
			throw new Error('should have thrown');
		} catch (error) {
			expect(error).toBe(authError);
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
		}
	});

	it('wraps generic non-ApiError in CodyAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('Network disconnected'));

		await expect(makeCodyRequest('/bots', 'token')).rejects.toThrow(
			CodyAPIError,
		);

		await expect(makeCodyRequest('/bots', 'token')).rejects.toThrow(
			'Network disconnected',
		);
	});

	it('wraps unknown non-Error throws in CodyAPIError', async () => {
		mockRequest.mockRejectedValue('something unexpected');

		await expect(makeCodyRequest('/bots', 'token')).rejects.toThrow(
			new CodyAPIError('Unknown error'),
		);
	});
});
