import { logEventFromContext } from 'corsair/core';
import { makeConnecteamRequest } from '../client';
import { updateUsers } from './update-users';

jest.mock('../client', () => ({
	makeConnecteamRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

describe('Connecteam update users endpoint', () => {
	const ctx = {
		key: 'test-api-key',
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('updates users', async () => {
		const response = {
			requestId: 'req-update-1',
			data: {
				count: 1,
				users: [],
			},
		};

		(makeConnecteamRequest as jest.Mock).mockResolvedValue(response);

		const input = {
			users: [
				{
					userId: 123,
					firstName: 'Updated',
					lastName: 'User',
				},
			],
			editUsersByPhone: false,
			includeSmartGroupIds: true,
		};

		const result = await updateUsers(ctx, input);

		expect(makeConnecteamRequest).toHaveBeenCalledWith(
			'users/v1/users',
			'test-api-key',
			{
				method: 'PUT',
				body: input.users,
				query: {
					editUsersByPhone: false,
					includeSmartGroupIds: true,
				},
			},
		);

		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'connecteam.users.update',
			input,
			'completed',
		);

		expect(result).toEqual(response);
	});
});
