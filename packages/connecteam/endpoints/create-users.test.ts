import { makeConnecteamRequest } from '../client';
import { createUsers } from './create-users';

jest.mock('../client', () => ({
	makeConnecteamRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

describe('Connecteam create users endpoint', () => {
	it('creates users', async () => {
		const ctx = {
			key: 'test-api-key',
		} as any;

		const input = {
			users: [
				{
					firstName: 'Test',
					lastName: 'User',
					email: 'test@example.com',
				},
			],
		};

		const mockResponse = {
			requestId: 'request-123',
			data: {
				results: [
					{
						userId: 123,
						firstName: 'Test',
						lastName: 'User',
						email: 'test@example.com',
					},
				],
			},
		};

		(makeConnecteamRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await createUsers(ctx, input);

		expect(makeConnecteamRequest).toHaveBeenCalledWith(
			'users/v1/users',
			'test-api-key',
			{
				method: 'POST',
				query: {
					sendActivation: false,
				},
				body: input.users,
			},
		);

		expect(result).toEqual(mockResponse);
	});
});
