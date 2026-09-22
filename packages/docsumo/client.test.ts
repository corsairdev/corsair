import { ApiError, request } from 'corsair/http';
import { DOCSUMO_API_BASE, makeDocsumoRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeDocsumoRequest', () => {
	it('sends the apikey header against the Docsumo base URL', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });

		await makeDocsumoRequest('/api/v1/eevee/apikey/limit/', 'secret-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: DOCSUMO_API_BASE,
				HEADERS: expect.objectContaining({ apikey: 'secret-key' }),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/v1/eevee/apikey/limit/',
			}),
		);
	});

	it('rethrows ApiError without wrapping', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/api/v1/mew/documents/types/' },
			{
				url: `${DOCSUMO_API_BASE}/api/v1/mew/documents/types/`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeDocsumoRequest('/api/v1/mew/documents/types/', 'secret-key'),
		).rejects.toBe(apiError);
	});

	it('rejects requests without an API key', async () => {
		await expect(
			makeDocsumoRequest('/api/v1/mew/documents/types/', ''),
		).rejects.toThrow('Docsumo API key is required');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
