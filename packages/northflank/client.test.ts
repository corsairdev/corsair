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

const mockRequest = request as jest.Mock;

describe('Northflank client and request construction', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('makes GET requests with Bearer token authorization', async () => {
		mockRequest.mockResolvedValueOnce({ data: { success: true } });

		const result = await makeNorthflankRequest('projects', 'test-api-token');

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
				body: undefined,
			}),
		);
		expect(result).toEqual({ data: { success: true } });
	});

	it('strips leading slash from endpoint path', async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: 'p1' } });

		await makeNorthflankRequest('/projects/p1', 'test-api-token');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				url: 'projects/p1',
			}),
		);
	});

	it('sends JSON body on POST/PATCH/PUT mutations', async () => {
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
	});

	it('passes query parameters properly', async () => {
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

	it('extracts flat message from response body when error is not an object', async () => {
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
});
