import { getValidBitwardenAccessToken } from './client';

describe('getValidBitwardenAccessToken', () => {
	const fetchSpy = jest.spyOn(globalThis, 'fetch');

	afterEach(() => {
		fetchSpy.mockReset();
	});

	afterAll(() => {
		fetchSpy.mockRestore();
	});

	it('reuses a token outside the 5-minute expiry skew', async () => {
		fetchSpy.mockImplementation(() => {
			throw new Error('fetch should not be called');
		});
		const expiresAt = String(Math.floor(Date.now() / 1000) + 1800);

		const result = await getValidBitwardenAccessToken({
			accessToken: 'live-token',
			expiresAt,
			clientId: 'id',
			clientSecret: 'secret',
		});

		expect(result).toEqual({
			accessToken: 'live-token',
			expiresAt: Number(expiresAt),
			refreshed: false,
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('refreshes when the token is inside the 5-minute skew', async () => {
		fetchSpy.mockResolvedValue({
			ok: true,
			json: async () => ({ access_token: 'fresh-token', expires_in: 3600 }),
		} as Response);
		const expiresAt = String(Math.floor(Date.now() / 1000) + 60);

		const result = await getValidBitwardenAccessToken({
			accessToken: 'stale-token',
			expiresAt,
			clientId: 'id',
			clientSecret: 'secret',
		});

		expect(result.refreshed).toBe(true);
		expect(result.accessToken).toBe('fresh-token');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});
