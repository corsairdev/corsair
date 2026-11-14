import type { JumpCloudContext } from '../index';
import {
	userGroupsCreate,
	userGroupsDelete,
	userGroupsGet,
	userGroupsList,
	userGroupsListMembers,
	userGroupsListMembership,
	userGroupsManageMembers,
	userGroupsUpdate,
} from './user-groups';

jest.mock('corsair/core', () => {
	// unknown: core's export surface is intentionally opaque to plugin
	// tests; the record cast only preserves requireActual while stubbing
	// the event logger.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// The shared HTTP boundary of this plugin is the client's fetch transport.
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// unknown: fixtures intentionally cover every family's documented response
// shapes; the endpoint output schemas, not this helper, enforce the contract.
function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

const mockCtx = { key: 'jc-test-key' } as never as JumpCloudContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('userGroups family (mocked JumpCloud transport)', () => {
	it('userGroups.list calls API v2 GET /usergroups with pagination query forwarding', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([{ id: 'ug-1', name: 'engineering', type: 'user_group' }]),
			),
		);

		const result = await userGroupsList(mockCtx, { limit: 25, skip: 50 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups?limit=25&skip=50',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });

		expect(result).toEqual([
			{ id: 'ug-1', name: 'engineering', type: 'user_group' },
		]);
	});

	it('userGroups.create posts the attributes body to API v2 /usergroups', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ id: 'ug-2', name: 'contractors', type: 'user_group' }),
			),
		);

		const result = await userGroupsCreate(mockCtx, {
			body: { attributes: { name: 'contractors' } },
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/v2/usergroups');
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			attributes: { name: 'contractors' },
		});

		expect(result).toEqual({
			id: 'ug-2',
			name: 'contractors',
			type: 'user_group',
		});
	});

	it('userGroups.get interpolates the group id into the API v2 path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ id: 'ug-123', name: 'engineering', type: 'user_group' }),
			),
		);

		const result = await userGroupsGet(mockCtx, { id: 'ug-123' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups/ug-123',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });

		expect(result).toEqual({
			id: 'ug-123',
			name: 'engineering',
			type: 'user_group',
		});
	});

	it('userGroups.update puts the group body to the interpolated group path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					id: 'ug-123',
					name: 'engineering-v2',
					type: 'user_group',
				}),
			),
		);

		const result = await userGroupsUpdate(mockCtx, {
			id: 'ug-123',
			body: {
				name: 'engineering-v2',
				description: 'Platform engineering group',
			},
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups/ug-123',
		);
		expect(init).toMatchObject({ method: 'PUT' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			name: 'engineering-v2',
			description: 'Platform engineering group',
		});

		expect(result).toEqual({
			id: 'ug-123',
			name: 'engineering-v2',
			type: 'user_group',
		});
	});

	it('userGroups.delete issues DELETE against the interpolated group path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ id: 'ug-123', name: 'engineering', type: 'user_group' }),
			),
		);

		const result = await userGroupsDelete(mockCtx, { id: 'ug-123' });

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups/ug-123',
		);
		expect(init).toMatchObject({ method: 'DELETE' });
		expect(init?.body).toBeUndefined();

		expect(result).toEqual({
			id: 'ug-123',
			name: 'engineering',
			type: 'user_group',
		});
	});

	it('userGroups.listMembers calls API v2 GET on the interpolated members path with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([
					{
						from: { id: 'ug-123', type: 'user_group' },
						to: { id: 'u9', type: 'user' },
					},
				]),
			),
		);

		const result = await userGroupsListMembers(mockCtx, {
			group_id: 'ug-123',
			limit: 10,
			skip: 20,
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups/ug-123/members?limit=10&skip=20',
		);
		expect(init).toMatchObject({ method: 'GET' });

		expect(result).toEqual([
			{
				from: { id: 'ug-123', type: 'user_group' },
				to: { id: 'u9', type: 'user' },
			},
		]);
	});

	it('userGroups.manageMembers posts the documented graph operation to the interpolated members path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 200 })),
		);

		const result = await userGroupsManageMembers(mockCtx, {
			group_id: 'ug-123',
			body: {
				id: 'u9',
				op: 'add',
				type: 'user',
			},
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups/ug-123/members',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			id: 'u9',
			op: 'add',
			type: 'user',
		});
		expect(result).toBeUndefined();
	});

	it('userGroups.manageMembers rejects malformed member operations before any request', async () => {
		// The spec's GraphOperation-UserGroup-Member requires id, op and the
		// 'user' type; bulk add/remove lists are not a documented body shape.
		await expect(
			userGroupsManageMembers(mockCtx, {
				group_id: 'ug-123',
				body: { add: [{ to: { id: 'u9' } }] } as never,
			}),
		).rejects.toThrow();
		await expect(
			userGroupsManageMembers(mockCtx, {
				group_id: 'ug-123',
				body: { id: 'u9', op: 'merge', type: 'user' } as never,
			}),
		).rejects.toThrow();
		await expect(
			userGroupsManageMembers(mockCtx, {
				group_id: 'ug-123',
				body: { id: 'u9', op: 'add', type: 'system' } as never,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('userGroups.listMembership calls API v2 GET on the interpolated membership path with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse([{ id: 'u9', paths: [[]], type: 'user' }])),
		);

		const result = await userGroupsListMembership(mockCtx, {
			group_id: 'ug-123',
			limit: 5,
			skip: 0,
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/v2/usergroups/ug-123/membership?limit=5&skip=0',
		);
		expect(init).toMatchObject({ method: 'GET' });

		expect(result).toEqual([{ id: 'u9', paths: [[]], type: 'user' }]);
	});

	it('rejects unsafe path parameters before any request', async () => {
		await expect(userGroupsGet(mockCtx, { id: '../admin' })).rejects.toThrow(
			/traversal/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
