import { logEventFromContext } from 'corsair/core';
import { makeConnecteamRequest } from '../client';
import { getUserById } from './get-user-by-id';

jest.mock('../client', () => ({
	makeConnecteamRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

describe('Connecteam get user by ID endpoint', () => {
	const ctx = {
		key: 'test-api-key',
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('gets a user by ID', async () => {
		const response = {
			requestId: 'req-user-1',
			data: {
				user: {
					userId: 123,
					firstName: 'Test',
					lastName: 'User',
					email: 'test@example.com',
				},
			},
		};

		(makeConnecteamRequest as jest.Mock).mockResolvedValue(response);

		const input = {
			userId: 123,
		};

		const result = await getUserById(ctx, input);

		expect(makeConnecteamRequest).toHaveBeenCalledWith(
			'users/v1/users/123',
			'test-api-key',
			{
				method: 'GET',
			},
		);

		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'connecteam.users.getById',
			input,
			'completed',
		);

		expect(result).toEqual(response);
	});
});
