import {
	assertCarboneSuccess,
	CARBONE_API_BASE,
	CARBONE_API_VERSION,
	CarboneAPIError,
	makeCarboneRequest,
} from './client';

const mockRequest = jest.fn();

jest.mock('corsair/http', () => {
	class ApiError extends Error {
		constructor(
			public readonly message: string,
			public readonly status?: number,
			public readonly statusText?: string,
			// unknown: provider error/response JSON has no single stable schema
			public readonly body?: unknown,
			public readonly retryAfter?: number,
		) {
			super(message);
			this.name = 'ApiError';
		}
	}

	return {
		// unknown: mock captures arbitrary call args without inventing a closed tuple
		request: (...args: unknown[]) => mockRequest(...args),
		ApiError,
	};
});

describe('Carbone client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('defines API constants', () => {
		expect(CARBONE_API_BASE).toBe('https://api.carbone.io');
		expect(CARBONE_API_VERSION).toBe('5');
	});

	it('makes GET requests with correct headers and version', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, message: 'OK' });

		const res = await makeCarboneRequest<{ success: boolean; message: string }>(
			'/status',
			{
				apiKey: 'test-key',
				method: 'GET',
			},
		);

		expect(res.success).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.carbone.io',
				TOKEN: 'test-key',
				HEADERS: expect.objectContaining({
					'carbone-version': '5',
					Authorization: 'Bearer test-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/status',
			}),
		);
	});

	it('makes POST requests with JSON content-type and body', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			data: { renderId: 'rnd_123' },
		});

		const res = await makeCarboneRequest<{
			success: boolean;
			data: { renderId: string };
		}>('/render/template', {
			apiKey: 'test-key',
			method: 'POST',
			body: { data: { name: 'Alice' } },
		});

		expect(res.data.renderId).toBe('rnd_123');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.carbone.io',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/render/template',
				body: { data: { name: 'Alice' } },
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('assertCarboneSuccess passes valid successful response', () => {
		const successRes = { success: true, data: { id: 'tmpl_1' } };
		expect(assertCarboneSuccess(successRes)).toEqual(successRes);

		const textRes = 'raw content';
		expect(assertCarboneSuccess(textRes)).toEqual(textRes);
	});

	it('assertCarboneSuccess throws CarboneAPIError on success: false', () => {
		expect(() =>
			assertCarboneSuccess({
				success: false,
				error: 'Invalid template format',
			}),
		).toThrow(CarboneAPIError);

		expect(() =>
			assertCarboneSuccess({
				success: false,
				message: 'Error message from server',
			}),
		).toThrow('Error message from server');
	});

	it('preserves status and retry-after metadata for binary request errors', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: {
				get: (name: string) =>
					name.toLowerCase() === 'retry-after' ? '2' : null,
			},
			// unknown: test/fixture cast; production types are Zod-validated
		} as unknown as Response);

		await expect(
			makeCarboneRequest('/template/tmpl_123', {
				apiKey: 'test-key',
				responseType: 'binary',
			}),
		).rejects.toMatchObject({
			code: 429,
			status: 429,
			retryAfter: 2000,
		});

		fetchSpy.mockRestore();
	});
});
