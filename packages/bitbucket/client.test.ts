import { request } from 'corsair/http';
import {
	BitbucketAPIError,
	getValidBitbucketAccessToken,
	makeAuthenticatedBitbucketRequest,
	refreshBitbucketAccessToken,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockRequest = request as jest.MockedFunction<typeof request>;
describe('Bitbucket OAuth client', () => {
	beforeEach(() => mockRequest.mockReset());
	it('reuses an access token outside the expiry skew', async () => {
		const result = await getValidBitbucketAccessToken({
			accessToken: 'access',
			expiresAt: String(Math.floor(Date.now() / 1000) + 1800),
		});
		expect(result).toMatchObject({ accessToken: 'access', refreshed: false });
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('refreshes with HTTP Basic client authentication and rotates the refresh token', async () => {
		mockRequest.mockResolvedValueOnce({
			access_token: 'fresh',
			refresh_token: 'rotated',
			expires_in: 3600,
		});
		const result = await refreshBitbucketAccessToken(
			'client',
			'secret',
			'refresh',
		);
		expect(result.refresh_token).toBe('rotated');
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		const headers = config?.HEADERS as Record<string, string> | undefined;
		expect(headers?.Authorization).toBe(
			'Basic ' + Buffer.from('client:secret').toString('base64'),
		);
		expect(options?.body).toContain('grant_type=refresh_token');
		expect(options?.body).toContain('refresh_token=refresh');
	});
	it('retries once with a refreshed token after a 401', async () => {
		const refresh = jest.fn().mockResolvedValue('fresh');
		mockRequest
			.mockRejectedValueOnce(new BitbucketAPIError('unauthorized', 401))
			.mockResolvedValueOnce({ ok: true });
		const result = await makeAuthenticatedBitbucketRequest(
			'/user',
			{ key: 'stale', _refreshAuth: refresh },
			{ method: 'GET', retrySafe: true },
		);
		expect(result).toEqual({ ok: true });
		expect(refresh).toHaveBeenCalledTimes(1);
	});
});
