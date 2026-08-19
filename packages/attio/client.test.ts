import { request } from 'corsair/http';
import { AttioAPIError, makeAttioRequest } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

describe('Attio HTTP Client Error Normalization', () => {
	it('should pass the original error code to AttioAPIError when request fails with a coded error', async () => {
		const codedError = new Error('Rate limit exceeded');
		(codedError as any).code = 'RATE_LIMIT';

		(request as jest.Mock).mockRejectedValueOnce(codedError);

		await expect(makeAttioRequest('/v2/test', 'test-key')).rejects.toThrow(
			new AttioAPIError('Rate limit exceeded', undefined, 'RATE_LIMIT'),
		);

		(request as jest.Mock).mockRejectedValueOnce(codedError);
		try {
			await makeAttioRequest('/v2/test', 'test-key');
		} catch (error: any) {
			expect(error).toBeInstanceOf(AttioAPIError);
			expect(error.message).toBe('Rate limit exceeded');
			expect(error.code).toBe('RATE_LIMIT');
			expect(error.status).toBeUndefined();
		}
	});
});
