import { request } from 'corsair/http';
import { AttioAPIError, getValidAccessToken, makeAttioRequest } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

describe('Attio HTTP Client Error Normalization', () => {
	it('should pass the original error code to AttioAPIError when request fails with a coded error', async () => {
		const codedError = new Error('Rate limit exceeded');
		(codedError as { code?: string }).code = 'RATE_LIMIT';
		(request as jest.Mock).mockRejectedValueOnce(codedError);

		await expect(makeAttioRequest('/v2/test', 'test-key')).rejects.toThrow(
			new AttioAPIError('Rate limit exceeded', undefined, 'RATE_LIMIT'),
		);
		(request as jest.Mock).mockRejectedValueOnce(codedError);
		try {
			await makeAttioRequest('/v2/test', 'test-key');
			throw new Error('expected makeAttioRequest to reject');
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(AttioAPIError);
			expect(error).toMatchObject({
				message: 'Rate limit exceeded',
				code: 'RATE_LIMIT',
				status: undefined,
			});
		}
	});

	it('rethrows errors that already have a status', async () => {
		const statusError = Object.assign(new Error('unauthorized'), {
			status: 401,
		});
		(request as jest.Mock).mockRejectedValueOnce(statusError);
		await expect(makeAttioRequest('/v2/self', 'test-key')).rejects.toBe(
			statusError,
		);
	});
});

describe('getValidAccessToken', () => {
	const fetchSpy = jest.spyOn(globalThis, 'fetch');

	afterEach(() => {
		fetchSpy.mockReset();
	});

	afterAll(() => {
		fetchSpy.mockRestore();
	});

	it('returns the existing access token without calling the token endpoint', async () => {
		await expect(
			getValidAccessToken({
				accessToken: 'tok',
			}),
		).resolves.toEqual({
			accessToken: 'tok',
			refreshed: false,
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('throws when no access token is available', async () => {
		await expect(
			getValidAccessToken({
				accessToken: null,
			}),
		).rejects.toThrow();
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});
