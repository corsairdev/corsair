import { makeConnecteamRequest } from '../client';
import { archiveUsers } from './archive-users';

jest.mock('../client', () => ({
	makeConnecteamRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

describe('Connecteam archive users endpoint', () => {
	it('archives users', async () => {
		const ctx = {
			key: 'test-api-key',
		} as any;

		const input = {
			userIds: [123, 456],
			deletionType: 'archive' as const,
		};

		const mockResponse = {
			requestId: 'request-123',
		};

		(makeConnecteamRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await archiveUsers(ctx, input);

		expect(makeConnecteamRequest).toHaveBeenCalledWith(
			'users/v1/users',
			'test-api-key',
			{
				method: 'DELETE',
				query: {
					deletionType: 'archive',
				},
				body: {
					userIds: [123, 456],
				},
			},
		);

		expect(result).toEqual(mockResponse);
	});
});
