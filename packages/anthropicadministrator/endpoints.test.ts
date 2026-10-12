import { AuthMissingError } from 'corsair/core';
import { ZodError } from 'zod';
import { CreateMessageInputSchema } from './endpoints/types/inputs';
import type { AnthropicAdministratorContext } from './index';
import {
	anthropicAdministratorEndpointSchemas,
	anthropicAdministratorEndpointsNested as api,
} from './index';
import {
	ADMIN_KEY,
	INFERENCE_KEY,
	jsonResponse,
	makeContext,
	sentRequest,
	stubFetch,
} from './test-helpers';

const BASE = 'https://api.anthropic.com';

const ORGANIZATION = { id: 'org_1', name: 'Acme', type: 'organization' };
const USER = {
	id: 'user_1',
	added_at: '2026-01-01T00:00:00Z',
	email: 'ada@acme.dev',
	name: 'Ada',
	role: 'developer',
	type: 'user',
};
const INVITE = {
	id: 'invite_1',
	accepted_at: null,
	email: 'new@acme.dev',
	expires_at: '2026-11-01T00:00:00Z',
	invited_at: '2026-10-01T00:00:00Z',
	rbac_group_ids: [],
	role: 'developer',
	status: 'pending',
	type: 'invite',
};
const WORKSPACE = {
	id: 'wrkspc_1',
	archived_at: null,
	compartment_id: 'cmp_1',
	created_at: '2026-01-01T00:00:00Z',
	data_residency: {
		allowed_inference_geos: 'unrestricted',
		default_inference_geo: 'global',
		workspace_geo: 'us',
	},
	display_color: '#6C5BB9',
	external_key_id: null,
	name: 'Prod',
	tags: { env: 'prod' },
	type: 'workspace',
};
const ARCHIVED_WORKSPACE = {
	...WORKSPACE,
	archived_at: '2026-10-02T00:00:00Z',
};
const MEMBER = {
	type: 'workspace_member',
	user_id: 'user_1',
	workspace_id: 'wrkspc_1',
	workspace_role: 'workspace_developer',
};
const API_KEY = {
	id: 'apikey_1',
	created_at: '2026-01-01T00:00:00Z',
	created_by: { id: 'user_1', type: 'user' },
	expires_at: null,
	name: 'ci',
	partial_key_hint: 'sk-ant-api03-R2D...igAA',
	status: 'active',
	type: 'api_key',
	workspace_id: 'wrkspc_1',
};
const MESSAGE = {
	id: 'msg_1',
	type: 'message',
	role: 'assistant',
	content: [{ type: 'text', text: 'Hello.' }],
	model: 'claude-opus-5',
	stop_reason: 'end_turn',
	stop_sequence: null,
	usage: {
		input_tokens: 12,
		output_tokens: 3,
		cache_creation_input_tokens: 2048,
		cache_read_input_tokens: 0,
	},
};
const MODEL = {
	type: 'model',
	id: 'claude-opus-5',
	display_name: 'Claude Opus 5',
	created_at: '2026-07-24T00:00:00Z',
	deprecated_at: null,
	lifecycle: 'active',
	line: 'opus',
	max_input_tokens: 200000,
	max_tokens: 128000,
	retires_at: null,
};

function page(item: object, id: string) {
	return { data: [item], first_id: id, has_more: false, last_id: id };
}

type Case = {
	op: string;
	// Safe: each case's result is compared with toEqual against its literal response fixture.
	// A narrower type is not practical because the table mixes the return types of all 26 operations.
	run: (ctx: AnthropicAdministratorContext) => Promise<unknown>;
	method: 'GET' | 'POST' | 'DELETE';
	url: string;
	body?: object;
	response: object;
};

const CASES: Case[] = [
	{
		op: 'organization.getOrganization',
		run: (c) => api.organization.getOrganization(c, {}),
		method: 'GET',
		url: '/v1/organizations/me',
		response: ORGANIZATION,
	},
	{
		op: 'users.listUsers',
		run: (c) =>
			api.users.listUsers(c, { limit: 5, roles: ['admin', 'developer'] }),
		method: 'GET',
		url: '/v1/organizations/users?limit=5&roles=admin&roles=developer',
		response: page(USER, 'user_1'),
	},
	{
		op: 'users.getUser',
		run: (c) => api.users.getUser(c, { user_id: 'user_1' }),
		method: 'GET',
		url: '/v1/organizations/users/user_1',
		response: USER,
	},
	{
		op: 'users.updateUser',
		run: (c) => api.users.updateUser(c, { user_id: 'user_1', role: 'admin' }),
		method: 'POST',
		url: '/v1/organizations/users/user_1',
		body: { role: 'admin' },
		response: { ...USER, role: 'admin' },
	},
	{
		op: 'users.removeUser',
		run: (c) => api.users.removeUser(c, { user_id: 'user_1' }),
		method: 'DELETE',
		url: '/v1/organizations/users/user_1',
		response: { id: 'user_1', type: 'user_deleted' },
	},
	{
		op: 'invites.listInvites',
		run: (c) =>
			api.invites.listInvites(c, {
				email: 'new@acme.dev',
				statuses: ['pending'],
			}),
		method: 'GET',
		url: '/v1/organizations/invites?email=new%40acme.dev&statuses=pending',
		response: page(INVITE, 'invite_1'),
	},
	{
		op: 'invites.createInvite',
		run: (c) =>
			api.invites.createInvite(c, { email: 'new@acme.dev', role: 'developer' }),
		method: 'POST',
		url: '/v1/organizations/invites',
		body: { email: 'new@acme.dev', role: 'developer' },
		response: INVITE,
	},
	{
		op: 'invites.getInvite',
		run: (c) => api.invites.getInvite(c, { invite_id: 'invite_1' }),
		method: 'GET',
		url: '/v1/organizations/invites/invite_1',
		response: INVITE,
	},
	{
		op: 'invites.deleteInvite',
		run: (c) => api.invites.deleteInvite(c, { invite_id: 'invite_1' }),
		method: 'DELETE',
		url: '/v1/organizations/invites/invite_1',
		response: { id: 'invite_1', type: 'invite_deleted' },
	},
	{
		op: 'workspaces.listWorkspaces',
		run: (c) =>
			api.workspaces.listWorkspaces(c, { include_archived: true, limit: 2 }),
		method: 'GET',
		url: '/v1/organizations/workspaces?include_archived=true&limit=2',
		response: page(WORKSPACE, 'wrkspc_1'),
	},
	{
		op: 'workspaces.createWorkspace',
		run: (c) =>
			api.workspaces.createWorkspace(c, {
				name: 'Prod',
				data_residency: {
					allowed_inference_geos: ['us'],
					default_inference_geo: 'us',
				},
				tags: { env: 'prod' },
			}),
		method: 'POST',
		url: '/v1/organizations/workspaces',
		body: {
			name: 'Prod',
			data_residency: {
				allowed_inference_geos: ['us'],
				default_inference_geo: 'us',
			},
			tags: { env: 'prod' },
		},
		response: WORKSPACE,
	},
	{
		op: 'workspaces.getWorkspace',
		run: (c) => api.workspaces.getWorkspace(c, { workspace_id: 'wrkspc_1' }),
		method: 'GET',
		url: '/v1/organizations/workspaces/wrkspc_1',
		response: WORKSPACE,
	},
	{
		op: 'workspaces.updateWorkspace',
		run: (c) =>
			api.workspaces.updateWorkspace(c, {
				workspace_id: 'wrkspc_1',
				name: 'Production',
			}),
		method: 'POST',
		url: '/v1/organizations/workspaces/wrkspc_1',
		body: { name: 'Production' },
		response: { ...WORKSPACE, name: 'Production' },
	},
	{
		op: 'workspaces.archiveWorkspace',
		run: (c) =>
			api.workspaces.archiveWorkspace(c, { workspace_id: 'wrkspc_1' }),
		method: 'POST',
		url: '/v1/organizations/workspaces/wrkspc_1/archive',
		response: ARCHIVED_WORKSPACE,
	},
	{
		op: 'workspaceMembers.listWorkspaceMembers',
		run: (c) =>
			api.workspaceMembers.listWorkspaceMembers(c, {
				workspace_id: 'wrkspc_1',
				limit: 10,
			}),
		method: 'GET',
		url: '/v1/organizations/workspaces/wrkspc_1/members?limit=10',
		response: page(MEMBER, 'user_1'),
	},
	{
		op: 'workspaceMembers.createWorkspaceMember',
		run: (c) =>
			api.workspaceMembers.createWorkspaceMember(c, {
				workspace_id: 'wrkspc_1',
				user_id: 'user_1',
				workspace_role: 'workspace_developer',
			}),
		method: 'POST',
		url: '/v1/organizations/workspaces/wrkspc_1/members',
		body: { user_id: 'user_1', workspace_role: 'workspace_developer' },
		response: MEMBER,
	},
	{
		op: 'workspaceMembers.getWorkspaceMember',
		run: (c) =>
			api.workspaceMembers.getWorkspaceMember(c, {
				workspace_id: 'wrkspc_1',
				user_id: 'user_1',
			}),
		method: 'GET',
		url: '/v1/organizations/workspaces/wrkspc_1/members/user_1',
		response: MEMBER,
	},
	{
		op: 'workspaceMembers.updateWorkspaceMember',
		run: (c) =>
			api.workspaceMembers.updateWorkspaceMember(c, {
				workspace_id: 'wrkspc_1',
				user_id: 'user_1',
				workspace_role: 'workspace_admin',
			}),
		method: 'POST',
		url: '/v1/organizations/workspaces/wrkspc_1/members/user_1',
		body: { workspace_role: 'workspace_admin' },
		response: { ...MEMBER, workspace_role: 'workspace_admin' },
	},
	{
		op: 'workspaceMembers.deleteWorkspaceMember',
		run: (c) =>
			api.workspaceMembers.deleteWorkspaceMember(c, {
				workspace_id: 'wrkspc_1',
				user_id: 'user_1',
			}),
		method: 'DELETE',
		url: '/v1/organizations/workspaces/wrkspc_1/members/user_1',
		response: {
			type: 'workspace_member_deleted',
			user_id: 'user_1',
			workspace_id: 'wrkspc_1',
		},
	},
	{
		op: 'apiKeys.listApiKeys',
		run: (c) =>
			api.apiKeys.listApiKeys(c, {
				limit: 20,
				status: 'active',
				workspace_id: 'wrkspc_1',
			}),
		method: 'GET',
		url: '/v1/organizations/api_keys?limit=20&status=active&workspace_id=wrkspc_1',
		response: page(API_KEY, 'apikey_1'),
	},
	{
		op: 'apiKeys.getApiKey',
		run: (c) => api.apiKeys.getApiKey(c, { api_key_id: 'apikey_1' }),
		method: 'GET',
		url: '/v1/organizations/api_keys/apikey_1',
		response: API_KEY,
	},
	{
		op: 'apiKeys.updateApiKey',
		run: (c) =>
			api.apiKeys.updateApiKey(c, {
				api_key_id: 'apikey_1',
				name: 'ci-renamed',
				status: 'inactive',
			}),
		method: 'POST',
		url: '/v1/organizations/api_keys/apikey_1',
		body: { name: 'ci-renamed', status: 'inactive' },
		response: { ...API_KEY, name: 'ci-renamed', status: 'inactive' },
	},
	{
		op: 'messages.createMessage',
		run: (c) =>
			api.messages.createMessage(c, {
				model: 'claude-opus-5',
				max_tokens: 64,
				messages: [{ role: 'user', content: 'Hi' }],
				temperature: 0.2,
			}),
		method: 'POST',
		url: '/v1/messages',
		body: {
			model: 'claude-opus-5',
			max_tokens: 64,
			messages: [{ role: 'user', content: 'Hi' }],
			stream: false,
			temperature: 0.2,
		},
		response: MESSAGE,
	},
	{
		op: 'messages.createCachedMessage',
		run: (c) =>
			api.messages.createCachedMessage(c, {
				model: 'claude-opus-5',
				max_tokens: 64,
				system: [{ type: 'text', text: 'Long reference document.' }],
				messages: [{ role: 'user', content: 'Summarize it.' }],
				ttl: '1h',
			}),
		method: 'POST',
		url: '/v1/messages',
		body: {
			model: 'claude-opus-5',
			max_tokens: 64,
			system: [{ type: 'text', text: 'Long reference document.' }],
			messages: [{ role: 'user', content: 'Summarize it.' }],
			cache_control: { type: 'ephemeral', ttl: '1h' },
			stream: false,
		},
		response: MESSAGE,
	},
	{
		op: 'models.getModel',
		run: (c) => api.models.getModel(c, { model_id: 'claude-opus-5' }),
		method: 'GET',
		url: '/v1/models/claude-opus-5',
		response: MODEL,
	},
	{
		op: 'models.listModels',
		run: (c) =>
			api.models.listModels(c, { limit: 2, lifecycle: ['active', 'retired'] }),
		method: 'GET',
		url: '/v1/models?limit=2&lifecycle%5B%5D=active&lifecycle%5B%5D=retired',
		response: page(MODEL, 'claude-opus-5'),
	},
];

afterEach(() => {
	jest.restoreAllMocks();
});

describe('every operation sends its documented request', () => {
	it('covers every registered operation', () => {
		expect(CASES.map((c) => c.op).sort()).toEqual(
			Object.keys(anthropicAdministratorEndpointSchemas).sort(),
		);
	});

	it.each(CASES.map((c) => [c.op, c] as const))('%s', async (_op, c) => {
		const fetchMock = stubFetch(jsonResponse(200, c.response));
		const { ctx } = makeContext();

		const result = await c.run(ctx);

		const sent = sentRequest(fetchMock);
		expect(sent.method).toBe(c.method);
		expect(sent.url).toBe(`${BASE}${c.url}`);
		expect(sent.body).toEqual(c.body);
		expect(sent.headers.get('anthropic-version')).toBe('2023-06-01');
		expect(result).toEqual(c.response);
	});
});

describe('credentials', () => {
	it('sends the Admin key as x-api-key on Admin operations', async () => {
		const fetchMock = stubFetch(jsonResponse(200, ORGANIZATION));
		const { ctx } = makeContext();

		await api.organization.getOrganization(ctx, {});

		const { headers } = sentRequest(fetchMock);
		expect(headers.get('x-api-key')).toBe(ADMIN_KEY);
		expect(headers.get('authorization')).toBeNull();
	});

	it('sends an OAuth token as a bearer credential', async () => {
		const fetchMock = stubFetch(jsonResponse(200, ORGANIZATION));
		const { ctx } = makeContext({
			authType: 'oauth_2',
			admin: 'oauth-access-token',
		});

		await api.organization.getOrganization(ctx, {});

		const { headers } = sentRequest(fetchMock);
		expect(headers.get('authorization')).toBe('Bearer oauth-access-token');
		expect(headers.get('x-api-key')).toBeNull();
	});

	it('sends the inference key, not the Admin key, on Messages and Models', async () => {
		const fetchMock = stubFetch(jsonResponse(200, MODEL));
		const { ctx } = makeContext({ authType: 'oauth_2' });

		await api.models.getModel(ctx, { model_id: 'claude-opus-5' });

		const { headers } = sentRequest(fetchMock);
		expect(headers.get('x-api-key')).toBe(INFERENCE_KEY);
		expect(headers.get('authorization')).toBeNull();
	});

	it('refuses Models without a tenant inference key', async () => {
		const fetchMock = stubFetch();
		const { ctx } = makeContext({ tenantInference: null });

		await expect(
			api.models.getModel(ctx, { model_id: 'claude-opus-5' }),
		).rejects.toThrow(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses an Admin call without an Admin credential', async () => {
		const fetchMock = stubFetch();
		const { ctx } = makeContext({ admin: null });

		await expect(api.users.getUser(ctx, { user_id: 'user_1' })).rejects.toThrow(
			AuthMissingError,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a Messages call without an inference key', async () => {
		const fetchMock = stubFetch();
		const { ctx } = makeContext({ tenantInference: null });

		await expect(
			api.messages.createMessage(ctx, {
				model: 'claude-opus-5',
				max_tokens: 1,
				messages: [{ role: 'user', content: 'Hi' }],
			}),
		).rejects.toThrow(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('messages input', () => {
	const base = {
		model: 'claude-opus-5',
		max_tokens: 0,
		messages: [{ role: 'user', content: 'Hi' }],
	};

	it('rejects stream=true so the response is always a single Message', () => {
		expect(
			CreateMessageInputSchema.safeParse({ ...base, stream: true }).success,
		).toBe(false);
	});

	it('accepts max_tokens 0, which only warms the prompt cache', () => {
		expect(CreateMessageInputSchema.safeParse(base).success).toBe(true);
	});

	it('rejects an unknown cache ttl', () => {
		expect(
			CreateMessageInputSchema.safeParse({
				...base,
				cache_control: { type: 'ephemeral', ttl: '1d' },
			}).success,
		).toBe(false);
	});

	it('sends a 5m default cache breakpoint when no ttl is given', async () => {
		const fetchMock = stubFetch(jsonResponse(200, MESSAGE));
		const { ctx } = makeContext();

		await api.messages.createCachedMessage(ctx, {
			model: 'claude-opus-5',
			max_tokens: 64,
			messages: [{ role: 'user', content: 'Hi' }],
		});

		expect(sentRequest(fetchMock).body?.cache_control).toEqual({
			type: 'ephemeral',
		});
	});
});

describe('response validation', () => {
	it('throws when a response does not match the documented shape', async () => {
		stubFetch(jsonResponse(200, { id: 'user_1', type: 'user' }));
		const { ctx } = makeContext();

		await expect(
			api.users.getUser(ctx, { user_id: 'user_1' }),
		).rejects.toBeInstanceOf(ZodError);
	});
});

describe('cache mirroring', () => {
	it('caches each item of a list page', async () => {
		stubFetch(jsonResponse(200, page(USER, 'user_1')));
		const { ctx, writes } = makeContext();

		await api.users.listUsers(ctx, {});

		expect(writes).toEqual([
			{ op: 'upsert', entity: 'users', id: 'user_1', data: USER },
		]);
	});

	it('keys workspace members by workspace and user', async () => {
		stubFetch(jsonResponse(200, MEMBER));
		const { ctx, writes } = makeContext();

		await api.workspaceMembers.getWorkspaceMember(ctx, {
			workspace_id: 'wrkspc_1',
			user_id: 'user_1',
		});

		expect(writes).toEqual([
			{
				op: 'upsert',
				entity: 'workspaceMembers',
				id: 'wrkspc_1:user_1',
				data: MEMBER,
			},
		]);
	});

	it('evicts a removed user', async () => {
		stubFetch(jsonResponse(200, { id: 'user_1', type: 'user_deleted' }));
		const { ctx, writes } = makeContext();

		await api.users.removeUser(ctx, { user_id: 'user_1' });

		expect(writes).toEqual([{ op: 'delete', entity: 'users', id: 'user_1' }]);
	});

	it('refreshes rather than evicts an archived workspace', async () => {
		stubFetch(jsonResponse(200, ARCHIVED_WORKSPACE));
		const { ctx, writes } = makeContext();

		await api.workspaces.archiveWorkspace(ctx, { workspace_id: 'wrkspc_1' });

		expect(writes).toEqual([
			{
				op: 'upsert',
				entity: 'workspaces',
				id: 'wrkspc_1',
				data: ARCHIVED_WORKSPACE,
			},
		]);
	});

	it('returns the response when no database is bound', async () => {
		stubFetch(jsonResponse(200, USER));
		const { ctx } = makeContext({ withDb: false });

		await expect(
			api.users.getUser(ctx, { user_id: 'user_1' }),
		).resolves.toEqual(USER);
	});
});
