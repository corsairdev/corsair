import { request } from 'corsair/http';
import {
	addUsersAccessToCalls,
	createPermissionProfile,
	deleteUsersAccessToCalls,
	getPermissionProfile,
	getUsersAccessToCalls,
	listPermissionProfile,
	listPermissionProfileUsers,
	updatePermissionProfile,
} from './permissions';
import {
	GongPermissionsInputSchemas,
	GongPermissionsOutputSchemas,
} from './permissions-types';

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
};
const profile = { name: 'Profile', description: 'D' };
const access = { callAccessList: [{ callId: '123', userIds: ['u1'] }] };
const ops: Array<
	[
		string,
		(context: typeof ctx, input: any) => Promise<any>,
		any,
		string,
		string,
		any,
		any,
		any,
	]
> = [
	[
		'getPermissionProfile',
		getPermissionProfile,
		{ profileId: '123' },
		'GET',
		'/v2/permission-profile',
		{ profileId: '123' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'updatePermissionProfile',
		updatePermissionProfile,
		{ profileId: '123', body: profile },
		'PUT',
		'/v2/permission-profile',
		{ profileId: '123' },
		profile,
		{ requestId: 'r' },
	],
	[
		'createPermissionProfile',
		createPermissionProfile,
		{ workspaceId: 'w', body: profile },
		'POST',
		'/v2/permission-profile',
		{ workspaceId: 'w' },
		profile,
		{ requestId: 'r' },
	],
	[
		'addUsersAccessToCalls',
		addUsersAccessToCalls,
		access,
		'PUT',
		'/v2/calls/users-access',
		undefined,
		access,
		{ requestId: 'r' },
	],
	[
		'getUsersAccessToCalls',
		getUsersAccessToCalls,
		{ filter: { callIds: ['123'] } },
		'POST',
		'/v2/calls/users-access',
		undefined,
		{ filter: { callIds: ['123'] } },
		{ requestId: 'r', callAccessList: [] },
	],
	[
		'deleteUsersAccessToCalls',
		deleteUsersAccessToCalls,
		access,
		'DELETE',
		'/v2/calls/users-access',
		undefined,
		access,
		{ requestId: 'r' },
	],
	[
		'listPermissionProfileUsers',
		listPermissionProfileUsers,
		{ profileId: '123' },
		'GET',
		'/v2/permission-profile/users',
		{ profileId: '123' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'listPermissionProfile',
		listPermissionProfile,
		{ workspaceId: 'w' },
		'GET',
		'/v2/all-permission-profiles',
		{ workspaceId: 'w' },
		undefined,
		{ requestId: 'r' },
	],
];
describe('Gong Permissions contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('checks required identifiers and response envelopes', () => {
		expect(
			GongPermissionsInputSchemas.getPermissionProfile.safeParse({}).success,
		).toBe(false);
		expect(
			GongPermissionsInputSchemas.addUsersAccessToCalls.safeParse(access)
				.success,
		).toBe(true);
		expect(
			GongPermissionsOutputSchemas.getPermissionProfile.safeParse({
				requestId: 'r',
				profile: {},
			}).success,
		).toBe(true);
	});
	it.each(ops)(
		'%s sends its documented method, path, query, and body',
		async (_name, endpoint, input, method, url, query, body, output) => {
			mockedRequest.mockResolvedValue(output);
			await endpoint(ctx, input);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({ method, url, query, body }),
			);
		},
	);
});
