import { ApiError, request } from 'corsair/http';
import {
	makeNorthflankRequest,
	NORTHFLANK_API_BASE,
	NorthflankAPIError,
} from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

describe('Northflank client and request construction', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('makes GET requests with Bearer token authorization', async () => {
		mockRequest.mockResolvedValueOnce({ data: { success: true } });

		const result = await makeNorthflankRequest<{ data: { success: boolean } }>(
			'projects',
			'test-api-token',
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: NORTHFLANK_API_BASE,
				TOKEN: 'test-api-token',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-api-token',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'projects',
			}),
		);
		const getCall = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		expect(getCall?.[1]).toBeDefined();
		expect(getCall?.[1]).not.toHaveProperty('body');
		expect(result).toEqual({ data: { success: true } });
	});

	it('strips leading slash from endpoint path', async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: 'p1' } });

		await makeNorthflankRequest('projects/p1', 'test-api-token');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				url: 'projects/p1',
			}),
		);
	});

	it('sends JSON body on POST/PUT/PATCH mutations but not on GET', async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: 'p1', name: 'demo' } });

		const body = { name: 'demo', region: 'europe-west' };
		await makeNorthflankRequest('projects', 'test-api-token', {
			method: 'POST',
			body,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: 'projects',
				body,
			}),
		);

		mockRequest.mockResolvedValueOnce({ data: {} });
		await makeNorthflankRequest('projects', 'test-api-token', {
			method: 'GET',
			body,
		});

		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
			}),
		);
		const lastCall = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		expect(lastCall?.[1]).toBeDefined();
		expect(lastCall?.[1]).not.toHaveProperty('body');
	});

	it('passes query parameters through', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });

		const query = { page: 1, per_page: 20 };
		await makeNorthflankRequest('projects', 'test-api-token', { query });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				query: { page: 1, per_page: 20 },
			}),
		);
	});

	it('supports PUT and DELETE methods', async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: 'p1' } });
		await makeNorthflankRequest('projects', 'test-api-token', {
			method: 'PUT',
			body: { name: 'demo' },
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'PUT' }),
		);

		mockRequest.mockResolvedValueOnce({ data: {} });
		await makeNorthflankRequest('projects/p1', 'test-api-token', {
			method: 'DELETE',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'DELETE', url: 'projects/p1' }),
		);
	});

	it('extracts nested Northflank error message and preserves status', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 400,
				statusText: 'Bad Request',
				body: {
					error: {
						message: 'Project name already in use',
					},
				},
				ok: false,
			},
			'HTTP 400 Bad Request',
		);

		mockRequest.mockRejectedValueOnce(apiError);

		const errorPromise = makeNorthflankRequest('projects', 'test-token');
		await expect(errorPromise).rejects.toBeInstanceOf(NorthflankAPIError);
		await expect(errorPromise).rejects.toMatchObject({
			name: 'NorthflankAPIError',
			message: 'Project name already in use',
			status: 400,
			statusText: 'Bad Request',
		});
	});

	it('extracts flat message from response body', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 403,
				statusText: 'Forbidden',
				body: {
					message: 'Insufficient token permissions',
				},
				ok: false,
			},
			'HTTP 403 Forbidden',
		);

		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeNorthflankRequest('projects', 'test-token'),
		).rejects.toMatchObject({
			name: 'NorthflankAPIError',
			message: 'Insufficient token permissions',
			status: 403,
			statusText: 'Forbidden',
		});
	});

	it('falls back to a generic message for non-API failures', async () => {
		mockRequest.mockRejectedValueOnce(new Error('socket hang up'));

		await expect(
			makeNorthflankRequest('projects', 'test-token'),
		).rejects.toMatchObject({
			name: 'NorthflankAPIError',
			message: 'socket hang up',
		});
	});

	it('merges custom headers with auth headers', async () => {
		mockRequest.mockResolvedValueOnce({ data: {} });

		await makeNorthflankRequest('projects', 'test-api-token', {
			headers: { 'X-Custom-Header': 'yes' },
		});

		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		expect(call?.[0]).toEqual(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-api-token',
					'X-Custom-Header': 'yes',
				}),
			}),
		);
	});

	it('forwards query values including undefined through', async () => {
		mockRequest.mockResolvedValueOnce({ data: {} });

		await makeNorthflankRequest('projects', 'test-api-token', {
			query: { page: 1, cursor: undefined },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				query: { page: 1, cursor: undefined },
			}),
		);
	});

	it('falls back to the provider message when the body is unparseable', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 500,
				statusText: 'Internal Server Error',
				body: ['unexpected', 'shape'],
				ok: false,
			},
			'HTTP 500 Internal Server Error',
		);

		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeNorthflankRequest('projects', 'test-token'),
		).rejects.toMatchObject({
			name: 'NorthflankAPIError',
			message: 'HTTP 500 Internal Server Error',
			status: 500,
			statusText: 'Internal Server Error',
		});
	});

	it('uses a generic message for non-Error rejections', async () => {
		mockRequest.mockRejectedValueOnce('boom');

		await expect(
			makeNorthflankRequest('projects', 'test-token'),
		).rejects.toMatchObject({
			name: 'NorthflankAPIError',
			message: 'Unknown Northflank API error',
		});
	});

	it('prefers explicit details over cause in NorthflankAPIError', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit exceeded' },
				ok: false,
			},
			'Rate limited',
		);

		const explicit = new NorthflankAPIError('Custom message', {
			status: 400,
			statusText: 'Bad Request',
			body: { code: 7 },
			cause,
		});
		expect(explicit.message).toBe('Custom message');
		expect(explicit.status).toBe(400);
		expect(explicit.statusText).toBe('Bad Request');
		expect(explicit.body).toEqual({ code: 7 });

		const fromCause = new NorthflankAPIError('From cause', { cause });
		expect(fromCause.status).toBe(429);
		expect(fromCause.statusText).toBe('Too Many Requests');
		expect(fromCause.body).toEqual({ message: 'Rate limit exceeded' });
	});
});
