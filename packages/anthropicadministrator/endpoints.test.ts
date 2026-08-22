import { request } from 'corsair/http';
import type { AnthropicAdministratorContext } from './index';
import { anthropicadministrator } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.Mock;

const upserts: Array<[string, string, unknown]> = [];
const deletes: Array<[string, string]> = [];

function entity(name: string) {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push([name, id, data]);
		},
		deleteByEntityId: async (id: string) => {
			deletes.push([name, id]);
			return true;
		},
	};
}

const ctx = {
	key: 'sk-ant-admin-test',
	options: {},
	db: {
		users: entity('users'),
		invites: entity('invites'),
		workspaces: entity('workspaces'),
		workspaceMembers: entity('workspaceMembers'),
		apiKeys: entity('apiKeys'),
	},
	// Test-only partial context; endpoints read `key` and `db` only.
} as unknown as AnthropicAdministratorContext;

function ops() {
	const plugin = anthropicadministrator({ key: 'sk-ant-admin-test' });
	return plugin.endpoints as unknown as Record<
		string,
		Record<
			string,
			(
				c: AnthropicAdministratorContext,
				i: Record<string, unknown>,
			) => Promise<unknown>
		>
	>;
}

function call(
	group: string,
	name: string,
	input: Record<string, unknown> = {},
) {
	const fn = ops()[group]?.[name];
	if (!fn) throw new Error(`missing endpoint ${group}.${name}`);
	return fn(ctx, input);
}

function sent() {
	const c = mockRequest.mock.calls.at(-1);
	if (!c) throw new Error('request was never called');
	return {
		config: c[0] as { BASE: string; HEADERS: Record<string, string> },
		options: c[1] as {
			method: string;
			url: string;
			body?: Record<string, unknown>;
			query?: Record<string, unknown>;
		},
	};
}

const USER = {
	id: 'user_1',
	added_at: '2026-01-01T00:00:00Z',
	email: 'a@b.com',
	name: 'A',
	role: 'developer',
	type: 'user',
};
const WORKSPACE = {
	id: 'wrkspc_1',
	archived_at: null,
	created_at: '2026-01-01T00:00:00Z',
	name: 'W',
	type: 'workspace',
};
const MEMBER = {
	type: 'workspace_member',
	user_id: 'user_1',
	workspace_id: 'wrkspc_1',
	workspace_role: 'workspace_developer',
};

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({});
	upserts.length = 0;
	deletes.length = 0;
});

describe('Admin API transport', () => {
	it('sends x-api-key and anthropic-version against api.anthropic.com', async () => {
		await call('organization', 'getOrganization');

		expect(sent().config.BASE).toBe('https://api.anthropic.com');
		expect(sent().config.HEADERS).toMatchObject({
			'x-api-key': 'sk-ant-admin-test',
			'anthropic-version': '2023-06-01',
		});
		// Anthropic authenticates with x-api-key, not a bearer token.
		expect(sent().config.HEADERS.Authorization).toBeUndefined();
		expect(sent().options.url).toBe('/v1/organizations/me');
	});

	it('sends an oauth token as a bearer credential, not x-api-key', async () => {
		const plugin = anthropicadministrator({
			key: 'oauth-access-token',
			authType: 'oauth_2',
		});
		const groups = plugin.endpoints as unknown as Record<
			string,
			Record<
				string,
				(
					c: AnthropicAdministratorContext,
					i: Record<string, unknown>,
				) => Promise<unknown>
			>
		>;
		const oauthCtx = {
			key: 'oauth-access-token',
			options: { authType: 'oauth_2' },
			db: {},
		} as unknown as AnthropicAdministratorContext;

		const fn = groups.organization?.getOrganization;
		if (!fn) throw new Error('missing endpoint');
		await fn(oauthCtx, {});

		expect(sent().config.HEADERS).toMatchObject({
			authorization: 'Bearer oauth-access-token',
			'anthropic-version': '2023-06-01',
		});
		expect(sent().config.HEADERS['x-api-key']).toBeUndefined();
	});

	it('never sends a body on GET or DELETE', async () => {
		await call('users', 'listUsers', {});
		expect(sent().options.body).toBeUndefined();

		await call('users', 'removeUser', { user_id: 'user_1' });
		expect(sent().options.method).toBe('DELETE');
		expect(sent().options.body).toBeUndefined();
	});
});

describe('Admin API routes', () => {
	it.each([
		['organization', 'getOrganization', {}, 'GET', '/v1/organizations/me'],
		['users', 'listUsers', {}, 'GET', '/v1/organizations/users'],
		[
			'users',
			'getUser',
			{ user_id: 'u 1' },
			'GET',
			'/v1/organizations/users/u%201',
		],
		[
			'users',
			'updateUser',
			{ user_id: 'u1', role: 'developer' },
			'POST',
			'/v1/organizations/users/u1',
		],
		[
			'users',
			'removeUser',
			{ user_id: 'u1' },
			'DELETE',
			'/v1/organizations/users/u1',
		],
		['invites', 'listInvites', {}, 'GET', '/v1/organizations/invites'],
		[
			'invites',
			'createInvite',
			{ email: 'a@b.com', role: 'user' },
			'POST',
			'/v1/organizations/invites',
		],
		[
			'invites',
			'getInvite',
			{ invite_id: 'i1' },
			'GET',
			'/v1/organizations/invites/i1',
		],
		[
			'invites',
			'deleteInvite',
			{ invite_id: 'i1' },
			'DELETE',
			'/v1/organizations/invites/i1',
		],
		['workspaces', 'listWorkspaces', {}, 'GET', '/v1/organizations/workspaces'],
		[
			'workspaces',
			'createWorkspace',
			{ name: 'W' },
			'POST',
			'/v1/organizations/workspaces',
		],
		[
			'workspaces',
			'getWorkspace',
			{ workspace_id: 'w1' },
			'GET',
			'/v1/organizations/workspaces/w1',
		],
		[
			'workspaces',
			'updateWorkspace',
			{ workspace_id: 'w1', name: 'X' },
			'POST',
			'/v1/organizations/workspaces/w1',
		],
		[
			'workspaces',
			'archiveWorkspace',
			{ workspace_id: 'w1' },
			'POST',
			'/v1/organizations/workspaces/w1/archive',
		],
		[
			'workspaceMembers',
			'listWorkspaceMembers',
			{ workspace_id: 'w1' },
			'GET',
			'/v1/organizations/workspaces/w1/members',
		],
		[
			'workspaceMembers',
			'createWorkspaceMember',
			{ workspace_id: 'w1', user_id: 'u1', workspace_role: 'workspace_user' },
			'POST',
			'/v1/organizations/workspaces/w1/members',
		],
		[
			'workspaceMembers',
			'getWorkspaceMember',
			{ workspace_id: 'w1', user_id: 'u1' },
			'GET',
			'/v1/organizations/workspaces/w1/members/u1',
		],
		[
			'workspaceMembers',
			'updateWorkspaceMember',
			{ workspace_id: 'w1', user_id: 'u1', workspace_role: 'workspace_admin' },
			'POST',
			'/v1/organizations/workspaces/w1/members/u1',
		],
		[
			'workspaceMembers',
			'deleteWorkspaceMember',
			{ workspace_id: 'w1', user_id: 'u1' },
			'DELETE',
			'/v1/organizations/workspaces/w1/members/u1',
		],
		['apiKeys', 'listApiKeys', {}, 'GET', '/v1/organizations/api_keys'],
		[
			'apiKeys',
			'getApiKey',
			{ api_key_id: 'k1' },
			'GET',
			'/v1/organizations/api_keys/k1',
		],
		[
			'apiKeys',
			'updateApiKey',
			{ api_key_id: 'k1', name: 'n' },
			'POST',
			'/v1/organizations/api_keys/k1',
		],
	] as const)('%s.%s -> %s', async (group, name, input, method, url) => {
		mockRequest.mockResolvedValueOnce({ data: [] });
		await call(group, name, input as Record<string, unknown>);

		expect(sent().options.method).toBe(method);
		expect(sent().options.url).toBe(url);
	});

	it('sends only the documented body fields, omitting undefined', async () => {
		await call('workspaces', 'updateWorkspace', {
			workspace_id: 'w1',
			name: 'New name',
		});

		expect(sent().options.body).toEqual({ name: 'New name' });
	});

	it('passes list filters through as query parameters', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });
		await call('users', 'listUsers', {
			limit: 50,
			email: 'a@b.com',
			roles: ['admin', 'developer'],
		});

		expect(sent().options.query).toMatchObject({
			limit: 50,
			email: 'a@b.com',
			roles: ['admin', 'developer'],
		});
	});
});

describe('Admin API cache mirroring', () => {
	it('caches each item of a list page', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [USER],
			first_id: 'user_1',
			has_more: false,
			last_id: 'user_1',
		});

		await call('users', 'listUsers', {});

		expect(upserts).toEqual([['users', 'user_1', USER]]);
	});

	it('caches a single fetched entity', async () => {
		mockRequest.mockResolvedValueOnce(WORKSPACE);
		await call('workspaces', 'getWorkspace', { workspace_id: 'wrkspc_1' });

		expect(upserts).toEqual([['workspaces', 'wrkspc_1', WORKSPACE]]);
	});

	it('keys workspace members by workspace and user', async () => {
		mockRequest.mockResolvedValueOnce(MEMBER);
		await call('workspaceMembers', 'getWorkspaceMember', {
			workspace_id: 'wrkspc_1',
			user_id: 'user_1',
		});

		expect(upserts).toEqual([['workspaceMembers', 'wrkspc_1:user_1', MEMBER]]);
	});

	it('evicts on delete', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'user_1', type: 'user_deleted' });
		await call('users', 'removeUser', { user_id: 'user_1' });
		expect(deletes).toEqual([['users', 'user_1']]);

		mockRequest.mockResolvedValueOnce({
			type: 'workspace_member_deleted',
			user_id: 'user_1',
			workspace_id: 'wrkspc_1',
		});
		await call('workspaceMembers', 'deleteWorkspaceMember', {
			workspace_id: 'wrkspc_1',
			user_id: 'user_1',
		});
		expect(deletes).toContainEqual(['workspaceMembers', 'wrkspc_1:user_1']);
	});

	it('refreshes rather than evicts an archived workspace', async () => {
		mockRequest.mockResolvedValueOnce({
			...WORKSPACE,
			archived_at: '2026-02-01T00:00:00Z',
		});
		await call('workspaces', 'archiveWorkspace', { workspace_id: 'wrkspc_1' });

		expect(deletes).toEqual([]);
		expect(upserts[0]?.[0]).toBe('workspaces');
	});

	it('does not throw when no database is bound', async () => {
		const bare = {
			key: 'k',
			options: {},
		} as unknown as AnthropicAdministratorContext;
		mockRequest.mockResolvedValueOnce(WORKSPACE);
		const fn = ops().workspaces?.getWorkspace;
		if (!fn) throw new Error('missing endpoint');

		await expect(fn(bare, { workspace_id: 'wrkspc_1' })).resolves.toBeDefined();
	});
});
