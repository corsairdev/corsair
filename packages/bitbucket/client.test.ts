import { request } from 'corsair/http';
import { BitbucketAPIError, makeAuthenticatedBitbucketRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockRequest = request as jest.MockedFunction<typeof request>;
describe('Bitbucket OAuth client', () => {
	beforeEach(() => mockRequest.mockReset());
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
	it('propagates a second 401 after a single refresh and retry', async () => {
		const refresh = jest.fn().mockResolvedValue('fresh');
		mockRequest
			.mockRejectedValueOnce(new BitbucketAPIError('unauthorized', 401))
			.mockRejectedValueOnce(new BitbucketAPIError('unauthorized', 401));
		await expect(
			makeAuthenticatedBitbucketRequest(
				'/user',
				{ key: 'stale', _refreshAuth: refresh },
				{ method: 'GET', retrySafe: true },
			),
		).rejects.toThrow('unauthorized');
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});
	it('propagates a 500 without refreshing the token', async () => {
		const refresh = jest.fn().mockResolvedValue('fresh');
		mockRequest.mockRejectedValueOnce(
			new BitbucketAPIError('server error', 500),
		);
		await expect(
			makeAuthenticatedBitbucketRequest(
				'/user',
				{ key: 'stale', _refreshAuth: refresh },
				{ method: 'GET', retrySafe: true },
			),
		).rejects.toThrow('server error');
		expect(refresh).not.toHaveBeenCalled();
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});
