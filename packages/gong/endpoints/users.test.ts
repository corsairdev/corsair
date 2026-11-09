import { request } from 'corsair/http';
import { getUser, getUserHistory, listMultipleUsers, listUsers } from './users';
import { GongUsersInputSchemas, GongUsersOutputSchemas } from './users-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
} as never;
describe('Gong Users contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates user inputs and output envelopes', () => {
		expect(GongUsersInputSchemas.getUser.safeParse({ id: '' }).success).toBe(
			false,
		);
		expect(
			GongUsersInputSchemas.listMultipleUsers.safeParse({ filter: {} }).success,
		).toBe(true);
		expect(
			GongUsersOutputSchemas.listUsers.safeParse({ requestId: 'r', users: [] })
				.success,
		).toBe(true);
	});
	it.each([
		[
			listUsers,
			{ cursor: 'c', includeAvatars: false },
			'GET',
			'/v2/users',
			{ cursor: 'c', includeAvatars: false },
			undefined,
		],
		[
			listMultipleUsers,
			{ filter: { userIds: ['u'] } },
			'POST',
			'/v2/users/extensive',
			undefined,
			{ filter: { userIds: ['u'] } },
		],
		[getUser, { id: '123' }, 'GET', '/v2/users/123', undefined, undefined],
		[
			getUserHistory,
			{ id: '123' },
			'GET',
			'/v2/users/123/settings-history',
			undefined,
			undefined,
		],
	] as const)(
		'sends the documented user request',
		async (endpoint, input, method, url, query, body) => {
			mockedRequest.mockResolvedValue({
				requestId: 'r',
				users: [],
				user: {},
				userSettingsHistory: [],
			});
			await endpoint(ctx, input as never);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({ method, url, query, body }),
			);
		},
	);
	it.each(['', '.', '..', '/', '\\', 'a/b', 'a\\b', '"x"', "'x'"])(
		'rejects unsafe user id %s',
		async (id) => {
			await expect(
				Promise.resolve().then(() => getUser(ctx, { id })),
			).rejects.toThrow('Unsafe Gong user id');
			await expect(
				Promise.resolve().then(() => getUserHistory(ctx, { id })),
			).rejects.toThrow('Unsafe Gong user id');
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);
});
