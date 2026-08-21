import { request } from 'corsair/http';
import { BasinAPIError, makeBasinRequest } from '../client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Basin API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('formats Authorization header with Token prefix by default', async () => {
		await makeBasinRequest('forms', 'my-api-key', { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://usebasin.com/api/v1',
				HEADERS: expect.objectContaining({
					Authorization: 'Token my-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'forms',
			}),
		);
	});

	it('preserves Bearer or Token prefix if already present in apiKey', async () => {
		await makeBasinRequest('forms', 'Bearer custom-token', { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer custom-token',
				}),
			}),
			expect.anything(),
		);
	});

	it('passes request body and mediaType on POST/PUT/PATCH requests', async () => {
		await makeBasinRequest('forms', 'test-key', {
			method: 'POST',
			body: { name: 'New Form' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'forms',
				body: { name: 'New Form' },
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('passes query parameters on GET requests', async () => {
		await makeBasinRequest('forms', 'test-key', {
			method: 'GET',
			query: { page: 2, query: 'contact' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				query: { page: 2, query: 'contact' },
			}),
		);
	});

	it('throws BasinAPIError when request fails with API error body', async () => {
		const errorResponse = new Error('Request failed');
		(
			errorResponse as unknown as { status: number; body: { message: string } }
		).status = 404;
		(errorResponse as unknown as { body: { message: string } }).body = {
			message: 'Form not found',
		};
		mockRequest.mockRejectedValueOnce(errorResponse);

		await expect(makeBasinRequest('forms/unknown', 'test-key')).rejects.toThrow(
			BasinAPIError,
		);
	});
});
