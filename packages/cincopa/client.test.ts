import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	CINCOPA_API_BASE,
	CincopaAPIError,
	makeCincopaRequest,
} from './client';

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

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'gallery.list.json' },
		{
			url: `${CINCOPA_API_BASE}gallery.list.json`,
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

describe('makeCincopaRequest', () => {
	it('sends the API key as api_token query parameter and never as a bearer token', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeCincopaRequest('gallery.list.json', 'test-token', {
			query: { search: 'test' },
		});

		const [config, options] = lastCall();
		expect(config.BASE).toBe(CINCOPA_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toEqual({
			'Content-Type': 'application/json',
		});
		expect(options.query).toEqual({
			search: 'test',
			api_token: 'test-token',
		});
	});

	it('rejects an empty API key before issuing a request', async () => {
		await expect(makeCincopaRequest('gallery.list.json', '')).rejects.toThrow(
			CincopaAPIError,
		);
		await expect(
			makeCincopaRequest('gallery.list.json', '   '),
		).rejects.toThrow('Cincopa API key is required');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('re-throws ApiError directly preserving status and retryAfter metadata', async () => {
		const rateLimitError = apiError(429, 3000);
		mockRequest.mockRejectedValue(rateLimitError);

		try {
			await makeCincopaRequest('gallery.list.json', 'token');
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
			await makeCincopaRequest('gallery.list.json', 'invalid-token');
			throw new Error('should have thrown');
		} catch (error) {
			expect(error).toBe(authError);
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
		}
	});

	it('wraps generic non-ApiError in CincopaAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('Network disconnected'));

		await expect(
			makeCincopaRequest('gallery.list.json', 'token'),
		).rejects.toThrow(CincopaAPIError);

		await expect(
			makeCincopaRequest('gallery.list.json', 'token'),
		).rejects.toThrow('Network disconnected');
	});

	it('wraps unknown non-Error throws in CincopaAPIError', async () => {
		mockRequest.mockRejectedValue('something unexpected');

		await expect(
			makeCincopaRequest('gallery.list.json', 'token'),
		).rejects.toThrow(new CincopaAPIError('Unknown error'));
	});
});
