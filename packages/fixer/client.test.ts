import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import { FixerAPIError, makeFixerRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

describe('Fixer Client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('makes GET request with apikey header and query params', async () => {
		const mockResponse = {
			success: true,
			symbols: { USD: 'United States Dollar' },
		};
		(request as jest.Mock).mockResolvedValueOnce(mockResponse);

		const result = await makeFixerRequest('symbols', 'test-api-key', {
			method: 'GET',
			query: { base: 'USD' },
		});

		expect(result).toEqual(mockResponse);
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.apilayer.com/fixer',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					apikey: 'test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/symbols',
				query: { base: 'USD' },
			}),
		);
	});

	it('parses response with schema when provided', async () => {
		const mockResponse = {
			success: true,
			symbols: { USD: 'United States Dollar' },
		};
		(request as jest.Mock).mockResolvedValueOnce(mockResponse);

		const schema = z.object({
			success: z.boolean(),
			symbols: z.record(z.string(), z.string()),
		});

		const result = await makeFixerRequest('symbols', 'test-api-key', {
			method: 'GET',
			schema,
		});

		expect(result).toEqual(mockResponse);
	});

	it('throws FixerAPIError when API returns success: false payload', async () => {
		const errorPayload = {
			success: false,
			error: {
				code: 101,
				type: 'invalid_access_key',
				info: 'You have not supplied an API Key.',
			},
		};
		(request as jest.Mock).mockResolvedValueOnce(errorPayload);

		await expect(
			makeFixerRequest('latest', 'invalid-key', { method: 'GET' }),
		).rejects.toThrow(FixerAPIError);
	});

	it('re-throws ApiError as-is', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: '/latest',
			},
			{
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'Invalid API key' },
				url: 'https://api.apilayer.com/fixer/latest',
				ok: false,
			},
			'Unauthorized',
		);
		(request as jest.Mock).mockRejectedValueOnce(apiError);

		await expect(
			makeFixerRequest('latest', 'bad-key', { method: 'GET' }),
		).rejects.toThrow(apiError);
	});

	it('wraps generic Errors in FixerAPIError', async () => {
		(request as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'));

		await expect(
			makeFixerRequest('latest', 'test-key', { method: 'GET' }),
		).rejects.toThrow(FixerAPIError);
	});
});
