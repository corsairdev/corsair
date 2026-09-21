import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { CannyAPIError, makeCannyRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const REQUEST_OPTIONS: ApiRequestOptions = {
	method: 'POST',
	url: '/boards/list',
};

function apiError(status: number, body: string | object): ApiError {
	const result: ApiResult = {
		url: 'https://canny.io/api/v1/boards/list',
		ok: false,
		status,
		statusText: 'Error',
		body,
	};
	return new ApiError(REQUEST_OPTIONS, result, 'Error');
}

describe('makeCannyRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('prefixes a leading slash on the endpoint path', async () => {
		mockRequest.mockResolvedValue({ boards: [] });
		await makeCannyRequest('boards/list', 'key_123');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://canny.io/api/v1' }),
			expect.objectContaining({ method: 'POST', url: '/boards/list' }),
		);
	});

	it('keeps an endpoint that already starts with a slash', async () => {
		mockRequest.mockResolvedValue({ boards: [] });
		await makeCannyRequest('/boards/list', 'key_123');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: '/boards/list' }),
		);
	});

	it('merges the api key with caller body fields', async () => {
		mockRequest.mockResolvedValue({ posts: [] });
		await makeCannyRequest('posts/list', 'key_123', {
			method: 'POST',
			body: { limit: 10 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: { apiKey: 'key_123', limit: 10 },
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('returns the provider payload unchanged', async () => {
		const payload = { boards: [{ id: 'board_1' }] };
		mockRequest.mockResolvedValue(payload);
		const result = await makeCannyRequest<typeof payload>(
			'boards/list',
			'key_123',
		);
		expect(result).toEqual(payload);
	});

	it('rethrows a 429 ApiError without wrapping', async () => {
		const rateLimited = apiError(429, 'slow down');
		mockRequest.mockRejectedValue(rateLimited);
		await expect(makeCannyRequest('boards/list', 'key_123')).rejects.toBe(
			rateLimited,
		);
	});

	it('uses the provider error envelope message when present', async () => {
		mockRequest.mockRejectedValue(apiError(401, { error: 'bad key' }));
		try {
			await makeCannyRequest('boards/list', 'key_123');
			throw new Error('expected makeCannyRequest to reject');
		} catch (error) {
			expect(error).toBeInstanceOf(CannyAPIError);
			if (error instanceof CannyAPIError) {
				expect(error.message).toBe('bad key');
			} else {
				throw error;
			}
		}
	});

	it('falls back to the transport message without an envelope', async () => {
		mockRequest.mockRejectedValue(apiError(500, 'boom'));
		await expect(makeCannyRequest('boards/list', 'key_123')).rejects.toThrow(
			'Error',
		);
	});

	it('wraps a generic error in CannyAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));
		try {
			await makeCannyRequest('boards/list', 'key_123');
			throw new Error('expected makeCannyRequest to reject');
		} catch (error) {
			expect(error).toBeInstanceOf(CannyAPIError);
			if (error instanceof CannyAPIError) {
				expect(error.message).toBe('socket hang up');
			} else {
				throw error;
			}
		}
	});

	it('preserves a string rejection instead of masking it', async () => {
		mockRequest.mockRejectedValue('socket closed');
		await expect(makeCannyRequest('boards/list', 'key_123')).rejects.toThrow(
			'socket closed',
		);
	});

	it('wraps a non-error rejection as an unknown error', async () => {
		mockRequest.mockRejectedValue(undefined);
		await expect(makeCannyRequest('boards/list', 'key_123')).rejects.toThrow(
			'Unknown error',
		);
	});
});

describe('CannyAPIError', () => {
	it('copies status fields from an ApiError cause', () => {
		const cause = apiError(401, { error: 'bad key' });
		const error = new CannyAPIError('bad key', '401', { cause });
		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('CannyAPIError');
		expect(error.status).toBe(401);
		expect(error.statusText).toBe('Error');
		expect(error.code).toBe('401');
		expect(error.body).toEqual({ error: 'bad key' });
	});

	it('uses direct options when there is no ApiError cause', () => {
		const error = new CannyAPIError('down', '500', {
			status: 500,
			statusText: 'Down',
			body: { error: 'down' },
			retryAfter: 30,
		});
		expect(error.status).toBe(500);
		expect(error.statusText).toBe('Down');
		expect(error.body).toEqual({ error: 'down' });
		expect(error.retryAfter).toBe(30);
	});
});
