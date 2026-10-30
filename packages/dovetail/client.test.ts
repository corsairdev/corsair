import * as http from 'corsair/http';
import { DovetailAPIError, makeDovetailRequest } from './client';

describe('Dovetail client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('creates a DovetailAPIError instance with properties', () => {
		const error = new DovetailAPIError(
			'Failed to fetch data',
			'NOT_FOUND',
			404,
		);
		expect(error.name).toBe('DovetailAPIError');
		expect(error.message).toBe('Failed to fetch data');
		expect(error.code).toBe('NOT_FOUND');
		expect(error.status).toBe(404);
	});

	it('makes a GET request with proper headers and baseURL', async () => {
		const mockResponse = { data: { id: 'item-123' } };
		const requestSpy = jest
			.spyOn(http, 'request')
			.mockResolvedValue(mockResponse);

		const result = await makeDovetailRequest<typeof mockResponse>(
			'/v1/data/item-123',
			'test-api-token',
			{
				method: 'GET',
			},
		);

		expect(result).toEqual(mockResponse);
		expect(requestSpy).toHaveBeenCalledTimes(1);

		const calls = requestSpy.mock.calls;
		const config = calls[0]?.[0];
		const options = calls[0]?.[1];

		expect(config?.BASE).toBe('https://dovetail.com/api');
		expect(config?.TOKEN).toBe('test-api-token');
		expect(config?.HEADERS).toEqual(
			expect.objectContaining({
				Authorization: 'Bearer test-api-token',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			}),
		);

		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/v1/data/item-123');
		expect(options?.body).toBeUndefined();
	});

	it('makes a POST request with body and query parameters', async () => {
		const mockResponse = { data: { id: 'new-id', title: 'New Item' } };
		const requestSpy = jest
			.spyOn(http, 'request')
			.mockResolvedValue(mockResponse);

		// Justification: unknown is used here for arbitrary payload body data in test
		const requestBody: Record<string, unknown> = {
			title: 'New Item',
			project_id: 'proj-1',
		};

		const result = await makeDovetailRequest<typeof mockResponse>(
			'/v1/data',
			'test-api-token',
			{
				method: 'POST',
				body: requestBody,
				query: { 'page[limit]': 10 },
			},
		);

		expect(result).toEqual(mockResponse);
		expect(requestSpy).toHaveBeenCalledTimes(1);

		const calls = requestSpy.mock.calls;
		const options = calls[0]?.[1];

		expect(options?.method).toBe('POST');
		expect(options?.url).toBe('/v1/data');
		expect(options?.body).toEqual(requestBody);
		expect(options?.query).toEqual({ 'page[limit]': 10 });
	});

	it('handles PATCH and DELETE methods correctly', async () => {
		const mockResponse = { data: { id: 'item-1' } };
		const requestSpy = jest
			.spyOn(http, 'request')
			.mockResolvedValue(mockResponse);

		await makeDovetailRequest<typeof mockResponse>(
			'/v1/data/item-1',
			'test-api-token',
			{
				method: 'PATCH',
				body: { title: 'Updated' },
			},
		);

		await makeDovetailRequest<typeof mockResponse>(
			'/v1/data/item-1',
			'test-api-token',
			{
				method: 'DELETE',
			},
		);

		expect(requestSpy).toHaveBeenCalledTimes(2);
		const patchOptions = requestSpy.mock.calls[0]?.[1];
		const deleteOptions = requestSpy.mock.calls[1]?.[1];

		expect(patchOptions?.method).toBe('PATCH');
		expect(patchOptions?.body).toEqual({ title: 'Updated' });
		expect(deleteOptions?.method).toBe('DELETE');
		expect(deleteOptions?.body).toBeUndefined();
	});
});
