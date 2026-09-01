import { logEventFromContext } from 'corsair/core';
import { makeConnecteamRequest } from '../client';
import { getUsers } from './users';

jest.mock('../client', () => ({
	makeConnecteamRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

describe('Connecteam users endpoints', () => {
	const ctx = {
		key: 'test-api-key',
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('gets users', async () => {
		const response = {
			requestId: 'req-1',
			data: {
				users: [],
			},
		};

		(makeConnecteamRequest as jest.Mock).mockResolvedValue(response);

		const input = {
			limit: 10,
			offset: 0,
		};

		const result = await getUsers(ctx, input);

		expect(makeConnecteamRequest).toHaveBeenCalledWith(
			'users/v1/users',
			'test-api-key',
			{
				method: 'GET',
				query: input,
			},
		);

		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'connecteam.users.get',
			input,
			'completed',
		);

		expect(result).toEqual(response);
	});
});
