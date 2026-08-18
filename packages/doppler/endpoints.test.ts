/**
 * Covers every operation: the route and method it calls, and what reaches
 * the event log. The coverage sweep at the end asserts that the operations
 * exercised here are precisely the operations registered, so an operation
 * cannot be added without a test. All ids and values are fictional.
 */
import { logEventFromContext } from 'corsair/core';
import { DOPPLER_V1_SHARE_BASE, DOPPLER_V3_BASE } from './client';
import {
	ActivityLogs,
	Auth,
	ChangeRequests,
	ConfigLogs,
	Configs,
	DynamicSecrets,
	Environments,
	Groups,
	Integrations,
	Invites,
	ProjectMembers,
	ProjectRoles,
	Projects,
	Secrets,
	ServiceTokens,
	Share,
	Webhooks,
	Workplace,
	WorkplaceRoles,
	WorkplaceUsers,
} from './endpoints';
import { auditPayload } from './endpoints/logging';
import { dopplerEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };
function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Workplace.get>[0];

function makeCtx() {
	const db = {
		projects: makeStore(),
		environments: makeStore(),
		configs: makeStore(),
		webhooks: makeStore(),
		workplace: makeStore(),
	};
	const ctx = { key: 'dp.pt.fictional-test-token', db } as unknown as Ctx;
	return { ctx, db };
}

let captured:
	| {
			url: string;
			method: string;
			body?: string;
			headers: Record<string, string>;
	  }
	| undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

function mockFetch(payload: unknown, { status = 200 } = {}) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers)
			raw.forEach((v, k) => {
				headers[k.toLowerCase()] = v;
			});
		else
			for (const [k, v] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			))
				headers[k.toLowerCase()] = v;

		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
			headers,
		};
		const body =
			typeof payload === 'string' ? payload : JSON.stringify(payload);
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => body,
		};
	}) as unknown as typeof global.fetch;
}

function calledPath(): string {
	const url = captured?.url ?? '';
	for (const base of [DOPPLER_V3_BASE, DOPPLER_V1_SHARE_BASE]) {
		if (url.startsWith(`${base}/`))
			return url.slice(base.length + 1).split('?')[0] ?? '';
	}
	return url;
}

function sentBody(): Record<string, unknown> {
	return captured?.body ? JSON.parse(captured.body) : {};
}

type Case = {
	meta: string;
	run: (ctx: Ctx) => Promise<unknown>;
	payload: unknown;
	base: 'v3' | 'share';
	method: string;
	path: string;
	expectBody?: Record<string, unknown>;
};

const cases: Case[] = [
	// ---- workplace ----
	{
		meta: 'workplace.get',
		run: (c) => Workplace.get(c, {}),
		payload: { workplace: { id: 'w-1', name: 'Acme' } },
		base: 'v3',
		method: 'GET',
		path: 'workplace',
	},
	{
		meta: 'workplace.update',
		run: (c) => Workplace.update(c, { name: 'Acme 2' }),
		payload: { workplace: { id: 'w-1', name: 'Acme 2' } },
		base: 'v3',
		method: 'POST',
		path: 'workplace',
		expectBody: { name: 'Acme 2' },
	},

	// ---- workplaceUsers ----
	{
		meta: 'workplaceUsers.list',
		run: (c) => WorkplaceUsers.list(c, {}),
		payload: { workplace_users: [{ id: 'u-1' }], page: 1 },
		base: 'v3',
		method: 'GET',
		path: 'workplace/users',
	},
	{
		meta: 'workplaceUsers.get',
		run: (c) => WorkplaceUsers.get(c, { slug: 'u-1' }),
		payload: { workplace_user: { id: 'u-1' } },
		base: 'v3',
		method: 'GET',
		path: 'workplace/users/u-1',
	},

	// ---- workplaceRoles ----
	{
		meta: 'workplaceRoles.list',
		run: (c) => WorkplaceRoles.list(c, {}),
		payload: { roles: [{ name: 'custom' }] },
		base: 'v3',
		method: 'GET',
		path: 'workplace/roles',
	},
	{
		meta: 'workplaceRoles.get',
		run: (c) => WorkplaceRoles.get(c, { role: 'custom' }),
		payload: { role: { name: 'custom' } },
		base: 'v3',
		method: 'GET',
		path: 'workplace/roles/role/custom',
	},
	{
		meta: 'workplaceRoles.listPermissions',
		run: (c) => WorkplaceRoles.listPermissions(c, {}),
		payload: { permissions: ['team'] },
		base: 'v3',
		method: 'GET',
		path: 'workplace/permissions',
	},

	// ---- activityLogs ----
	{
		meta: 'activityLogs.list',
		run: (c) => ActivityLogs.list(c, {}),
		payload: { page: 1, logs: [{ id: 'log-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'logs',
	},
	{
		meta: 'activityLogs.retrieve',
		run: (c) => ActivityLogs.retrieve(c, { log: 'log-1' }),
		payload: { log: { id: 'log-1' } },
		base: 'v3',
		method: 'GET',
		path: 'logs/log',
	},

	// ---- projects ----
	{
		meta: 'projects.list',
		run: (c) => Projects.list(c, {}),
		payload: { page: 1, projects: [{ id: 'p-1', slug: 'demo' }] },
		base: 'v3',
		method: 'GET',
		path: 'projects',
	},
	{
		meta: 'projects.create',
		run: (c) => Projects.create(c, { name: 'demo' }),
		payload: { project: { id: 'p-1', slug: 'demo' } },
		base: 'v3',
		method: 'POST',
		path: 'projects',
		expectBody: { name: 'demo' },
	},
	{
		meta: 'projects.get',
		run: (c) => Projects.get(c, { project: 'demo' }),
		payload: { project: { id: 'p-1', slug: 'demo' } },
		base: 'v3',
		method: 'GET',
		path: 'projects/project',
	},
	{
		meta: 'projects.update',
		run: (c) => Projects.update(c, { project: 'demo', name: 'Demo 2' }),
		payload: { project: { id: 'p-1', slug: 'demo', name: 'Demo 2' } },
		base: 'v3',
		method: 'POST',
		path: 'projects/project',
		expectBody: { project: 'demo', name: 'Demo 2' },
	},
	{
		meta: 'projects.delete',
		run: (c) => Projects.remove(c, { project: 'demo' }),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'projects/project',
		expectBody: { project: 'demo' },
	},

	// ---- projectRoles ----
	{
		meta: 'projectRoles.list',
		run: (c) => ProjectRoles.list(c, {}),
		payload: { roles: [{ name: 'custom' }] },
		base: 'v3',
		method: 'GET',
		path: 'projects/roles',
	},
	{
		meta: 'projectRoles.get',
		run: (c) => ProjectRoles.get(c, { role: 'custom' }),
		payload: { role: { name: 'custom' } },
		base: 'v3',
		method: 'GET',
		path: 'projects/roles/role/custom',
	},
	{
		meta: 'projectRoles.listPermissions',
		run: (c) => ProjectRoles.listPermissions(c, {}),
		payload: { permissions: ['enclave_config_logs'] },
		base: 'v3',
		method: 'GET',
		path: 'projects/permissions',
	},

	// ---- projectMembers ----
	{
		meta: 'projectMembers.list',
		run: (c) => ProjectMembers.list(c, { project: 'demo' }),
		payload: { page: 1, members: [{ slug: 'u-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'projects/project/members',
	},
	{
		meta: 'projectMembers.get',
		run: (c) =>
			ProjectMembers.get(c, {
				project: 'demo',
				type: 'workplace_user',
				slug: 'u-1',
			}),
		payload: { member: { slug: 'u-1' } },
		base: 'v3',
		method: 'GET',
		path: 'projects/project/members/member/workplace_user/u-1',
	},
	{
		meta: 'projectMembers.delete',
		run: (c) =>
			ProjectMembers.remove(c, {
				project: 'demo',
				type: 'workplace_user',
				slug: 'u-1',
			}),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'projects/project/members/member/workplace_user/u-1',
	},

	// ---- environments ----
	{
		meta: 'environments.list',
		run: (c) => Environments.list(c, { project: 'demo' }),
		payload: { environments: [{ id: 'dev' }] },
		base: 'v3',
		method: 'GET',
		path: 'environments',
	},
	{
		meta: 'environments.get',
		run: (c) => Environments.get(c, { project: 'demo', environment: 'dev' }),
		payload: { environment: { id: 'dev' } },
		base: 'v3',
		method: 'GET',
		path: 'environments/environment',
	},
	{
		meta: 'environments.create',
		run: (c) =>
			Environments.create(c, { project: 'demo', name: 'Dev', slug: 'dev' }),
		payload: { environment: { id: 'dev' } },
		base: 'v3',
		method: 'POST',
		path: 'environments',
		expectBody: { name: 'Dev', slug: 'dev' },
	},
	{
		meta: 'environments.rename',
		run: (c) =>
			Environments.rename(c, {
				project: 'demo',
				environment: 'dev',
				name: 'Dev 2',
			}),
		payload: { environment: { id: 'dev', name: 'Dev 2' } },
		base: 'v3',
		method: 'PUT',
		path: 'environments/environment',
		expectBody: { name: 'Dev 2' },
	},
	{
		meta: 'environments.delete',
		run: (c) => Environments.remove(c, { project: 'demo', environment: 'dev' }),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'environments/environment',
	},

	// ---- configs ----
	{
		meta: 'configs.list',
		run: (c) => Configs.list(c, { project: 'demo' }),
		payload: { page: 1, configs: [{ name: 'dev' }] },
		base: 'v3',
		method: 'GET',
		path: 'configs',
	},
	{
		meta: 'configs.get',
		run: (c) => Configs.get(c, { project: 'demo', config: 'dev' }),
		payload: { config: { name: 'dev' } },
		base: 'v3',
		method: 'GET',
		path: 'configs/config',
	},
	{
		meta: 'configs.create',
		run: (c) =>
			Configs.create(c, { project: 'demo', environment: 'dev', name: 'dev_x' }),
		payload: { config: { name: 'dev_x' } },
		base: 'v3',
		method: 'POST',
		path: 'configs',
		expectBody: { project: 'demo', environment: 'dev', name: 'dev_x' },
	},
	{
		meta: 'configs.update',
		run: (c) =>
			Configs.update(c, { project: 'demo', config: 'dev_x', name: 'dev_y' }),
		payload: { config: { name: 'dev_y' } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config',
		expectBody: { project: 'demo', config: 'dev_x', name: 'dev_y' },
	},
	{
		meta: 'configs.delete',
		run: (c) => Configs.remove(c, { project: 'demo', config: 'dev_x' }),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'configs/config',
	},
	{
		meta: 'configs.clone',
		run: (c) =>
			Configs.clone(c, { project: 'demo', config: 'dev', name: 'dev_clone' }),
		payload: { config: { name: 'dev_clone' } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/clone',
		expectBody: { project: 'demo', config: 'dev', name: 'dev_clone' },
	},
	{
		meta: 'configs.lock',
		run: (c) => Configs.lock(c, { project: 'demo', config: 'dev' }),
		payload: { config: { name: 'dev', locked: true } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/lock',
		expectBody: { project: 'demo', config: 'dev' },
	},
	{
		meta: 'configs.unlock',
		run: (c) => Configs.unlock(c, { project: 'demo', config: 'dev' }),
		payload: { config: { name: 'dev', locked: false } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/unlock',
		expectBody: { project: 'demo', config: 'dev' },
	},

	// ---- configLogs ----
	{
		meta: 'configLogs.list',
		run: (c) => ConfigLogs.list(c, { project: 'demo', config: 'dev' }),
		payload: { page: 1, logs: [{ id: 'cl-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'configs/config/logs',
	},
	{
		meta: 'configLogs.get',
		run: (c) =>
			ConfigLogs.get(c, { project: 'demo', config: 'dev', log: 'cl-1' }),
		payload: { log: { id: 'cl-1' } },
		base: 'v3',
		method: 'GET',
		path: 'configs/config/logs/log',
	},
	{
		meta: 'configLogs.rollback',
		run: (c) =>
			ConfigLogs.rollback(c, { project: 'demo', config: 'dev', log: 'cl-1' }),
		payload: { log: { id: 'cl-2', text: 'Rolled back log cl-1' } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/logs/log/rollback',
	},

	// ---- secrets ----
	{
		meta: 'secrets.list',
		run: (c) => Secrets.list(c, { project: 'demo', config: 'dev' }),
		payload: {
			secrets: { STRIPE: { raw: 'sk_test_x', computed: 'sk_test_x' } },
		},
		base: 'v3',
		method: 'GET',
		path: 'configs/config/secrets',
	},
	{
		meta: 'secrets.get',
		run: (c) =>
			Secrets.get(c, { project: 'demo', config: 'dev', name: 'STRIPE' }),
		payload: {
			name: 'STRIPE',
			value: { raw: 'sk_test_x', computed: 'sk_test_x' },
		},
		base: 'v3',
		method: 'GET',
		path: 'configs/config/secret',
	},
	{
		meta: 'secrets.delete',
		run: (c) =>
			Secrets.remove(c, { project: 'demo', config: 'dev', name: 'STRIPE' }),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'configs/config/secret',
	},
	{
		meta: 'secrets.update',
		run: (c) =>
			Secrets.update(c, {
				project: 'demo',
				config: 'dev',
				secrets: { STRIPE: 'x' },
			}),
		payload: { secrets: { STRIPE: { raw: 'x', computed: 'x' } } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/secrets',
		expectBody: { project: 'demo', config: 'dev', secrets: { STRIPE: 'x' } },
	},
	{
		meta: 'secrets.download',
		run: (c) => Secrets.download(c, { project: 'demo', config: 'dev' }),
		payload: { STRIPE: 'sk_test_x' },
		base: 'v3',
		method: 'GET',
		path: 'configs/config/secrets/download',
	},
	{
		meta: 'secrets.names',
		run: (c) => Secrets.names(c, { project: 'demo', config: 'dev' }),
		payload: { names: ['STRIPE'] },
		base: 'v3',
		method: 'GET',
		path: 'configs/config/secrets/names',
	},
	{
		meta: 'secrets.updateNote',
		run: (c) =>
			Secrets.updateNote(c, {
				project: 'demo',
				secret: 'STRIPE',
				note: 'billing key',
			}),
		payload: { secret: 'STRIPE', note: 'billing key' },
		base: 'v3',
		method: 'POST',
		path: 'projects/project/note',
		expectBody: { secret: 'STRIPE', note: 'billing key' },
	},
	{
		meta: 'secrets.updateNoteViaConfig',
		run: (c) =>
			Secrets.updateNoteViaConfig(c, {
				project: 'demo',
				config: 'dev',
				secret: 'STRIPE',
				note: 'billing key',
			}),
		payload: { secret: 'STRIPE', note: 'billing key' },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/secrets/note',
		expectBody: { secret: 'STRIPE', note: 'billing key' },
	},

	// ---- dynamicSecrets ----
	{
		meta: 'dynamicSecrets.revokeLease',
		run: (c) =>
			DynamicSecrets.revokeLease(c, {
				project: 'demo',
				config: 'dev',
				dynamicSecret: 'rds',
				slug: 'lease-1',
			}),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'configs/config/dynamic_secrets/dynamic_secret/leases/lease',
		expectBody: {
			project: 'demo',
			config: 'dev',
			dynamic_secret: 'rds',
			slug: 'lease-1',
		},
	},

	// ---- serviceTokens ----
	{
		meta: 'serviceTokens.list',
		run: (c) => ServiceTokens.list(c, { project: 'demo', config: 'dev' }),
		payload: { tokens: [{ slug: 'st-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'configs/config/tokens',
	},
	{
		meta: 'serviceTokens.create',
		run: (c) =>
			ServiceTokens.create(c, {
				project: 'demo',
				config: 'dev',
				name: 'CI token',
			}),
		payload: { token: { slug: 'st-1', key: 'dp.st.fictional' } },
		base: 'v3',
		method: 'POST',
		path: 'configs/config/tokens',
		expectBody: { project: 'demo', config: 'dev', name: 'CI token' },
	},
	{
		meta: 'serviceTokens.delete',
		run: (c) =>
			ServiceTokens.remove(c, { project: 'demo', config: 'dev', slug: 'st-1' }),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'configs/config/tokens/token',
		expectBody: { project: 'demo', config: 'dev', slug: 'st-1' },
	},

	// ---- integrations ----
	{
		meta: 'integrations.list',
		run: (c) => Integrations.list(c, {}),
		payload: { integrations: [{ slug: 'int-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'integrations',
	},

	// ---- invites ----
	{
		meta: 'invites.list',
		run: (c) => Invites.list(c, {}),
		payload: { page: 1, invites: [{ slug: 'inv-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'workplace/invites',
	},

	// ---- groups ----
	{
		meta: 'groups.deleteMember',
		run: (c) =>
			Groups.deleteMember(c, {
				group: 'grp-1',
				type: 'workplace_user',
				memberSlug: 'u-1',
			}),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'workplace/groups/group/grp-1/members/workplace_user/u-1',
	},

	// ---- webhooks ----
	{
		meta: 'webhooks.list',
		run: (c) => Webhooks.list(c, { project: 'demo' }),
		payload: { webhooks: [{ id: 'wh-1' }] },
		base: 'v3',
		method: 'GET',
		path: 'webhooks',
	},
	{
		meta: 'webhooks.add',
		run: (c) =>
			Webhooks.add(c, { project: 'demo', url: 'https://example.com/hook' }),
		payload: { webhook: { id: 'wh-1', url: 'https://example.com/hook' } },
		base: 'v3',
		method: 'POST',
		path: 'webhooks',
		expectBody: { url: 'https://example.com/hook' },
	},
	{
		meta: 'webhooks.get',
		run: (c) => Webhooks.get(c, { project: 'demo', slug: 'wh-1' }),
		payload: { webhook: { id: 'wh-1' } },
		base: 'v3',
		method: 'GET',
		path: 'webhooks/webhook/wh-1',
	},
	{
		meta: 'webhooks.update',
		run: (c) =>
			Webhooks.update(c, { project: 'demo', slug: 'wh-1', name: 'new name' }),
		payload: { webhook: { id: 'wh-1', name: 'new name' } },
		base: 'v3',
		method: 'PATCH',
		path: 'webhooks/webhook/wh-1',
		expectBody: { name: 'new name' },
	},
	{
		meta: 'webhooks.delete',
		run: (c) => Webhooks.remove(c, { project: 'demo', slug: 'wh-1' }),
		payload: { success: true },
		base: 'v3',
		method: 'DELETE',
		path: 'webhooks/webhook/wh-1',
	},
	{
		meta: 'webhooks.enable',
		run: (c) => Webhooks.enable(c, { project: 'demo', slug: 'wh-1' }),
		payload: { webhook: { id: 'wh-1', enabled: true } },
		base: 'v3',
		method: 'POST',
		path: 'webhooks/webhook/wh-1/enable',
	},
	{
		meta: 'webhooks.disable',
		run: (c) => Webhooks.disable(c, { project: 'demo', slug: 'wh-1' }),
		payload: { webhook: { id: 'wh-1', enabled: false } },
		base: 'v3',
		method: 'POST',
		path: 'webhooks/webhook/wh-1/disable',
	},

	// ---- changeRequests ----
	{
		meta: 'changeRequests.list',
		run: (c) => ChangeRequests.list(c, {}),
		payload: [{ id: 'cr-1', title: 'Rotate STRIPE', status: 'open' }],
		base: 'v3',
		method: 'GET',
		path: 'workplace/change_requests',
	},

	// ---- share ----
	{
		meta: 'share.createPlain',
		run: (c) => Share.createPlain(c, { secret: 'top secret' }),
		payload: {
			url: 'https://share.doppler.com/s/x',
			authenticated_url: 'https://share.doppler.com/s/x#pw',
			password: 'fictional-password',
		},
		base: 'share',
		method: 'POST',
		path: 'secrets/plain',
		expectBody: { secret: 'top secret' },
	},
	{
		meta: 'share.createEncrypted',
		run: (c) =>
			Share.createEncrypted(c, {
				encryptedSecret: 'ZmFrZS1jaXBoZXJ0ZXh0',
				hashedPassword: 'fictional-sha256-hash',
			}),
		payload: { url: 'https://share.doppler.com/s/y' },
		base: 'share',
		method: 'POST',
		path: 'secrets/encrypted',
		expectBody: {
			encrypted_secret: 'ZmFrZS1jaXBoZXJ0ZXh0',
			hashed_password: 'fictional-sha256-hash',
			encryption_kdf: 'pbkdf2',
			encryption_salt_rounds: 1_000_000,
		},
	},

	// ---- auth ----
	{
		meta: 'auth.me',
		run: (c) => Auth.me(c, {}),
		payload: { slug: 'me-1', type: 'personal' },
		base: 'v3',
		method: 'GET',
		path: 'me',
	},
];

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('every operation calls the route and method it claims to', () => {
	for (const testCase of cases) {
		it(`${testCase.meta} -> ${testCase.base} ${testCase.method} ${testCase.path}`, async () => {
			const { ctx } = makeCtx();
			mockFetch(testCase.payload);

			await testCase.run(ctx);

			expect(captured).toBeDefined();
			expect(captured?.method).toBe(testCase.method);
			expect(calledPath()).toBe(testCase.path);
			const base =
				testCase.base === 'v3' ? DOPPLER_V3_BASE : DOPPLER_V1_SHARE_BASE;
			expect(captured?.url.startsWith(base)).toBe(true);

			if (testCase.expectBody) {
				expect(sentBody()).toEqual(testCase.expectBody);
			}

			expect(mockLogEvent).toHaveBeenCalled();
		});
	}
});

describe('changeRequests.list query construction', () => {
	function query(): URLSearchParams {
		return new URL(captured?.url ?? 'https://x/').searchParams;
	}

	it('sends a joined status filter for a non-empty array', async () => {
		const { ctx } = makeCtx();
		mockFetch([]);
		await ChangeRequests.list(ctx, { status: ['open', 'closed'] });
		expect(query().get('status')).toBe('open,closed');
	});

	/**
	 * `[].join(',')` is `''`, not `undefined` - `compact` only drops
	 * `undefined`, so an empty array would otherwise still reach the request
	 * as a literal `?status=`, filtering for an empty string rather than not
	 * filtering at all.
	 */
	it('omits the status filter entirely for an empty array, rather than sending a literal empty value', async () => {
		const { ctx } = makeCtx();
		mockFetch([]);
		await ChangeRequests.list(ctx, { status: [] });
		expect(query().has('status')).toBe(false);
	});

	it('omits the status filter when not supplied at all', async () => {
		const { ctx } = makeCtx();
		mockFetch([]);
		await ChangeRequests.list(ctx, {});
		expect(query().has('status')).toBe(false);
	});
});

describe('path-segment encoding', () => {
	/**
	 * Every route below builds its path with a plain template literal, not
	 * `corsair/http`'s own `{param}` substitution (which encodes for you) -
	 * so an unencoded `/` in a caller-supplied slug would otherwise change
	 * which path segment (or how many) the request addresses. A slash is
	 * used here rather than a more exotic character because it is the one
	 * most likely to appear in a real identifier and the one most likely to
	 * silently misroute a request instead of just failing loudly.
	 */
	it('encodes a slash in a role identifier', async () => {
		const { ctx } = makeCtx();
		mockFetch({ role: { name: 'weird' } });
		await WorkplaceRoles.get(ctx, { role: 'weird/role' });
		expect(calledPath()).toBe('workplace/roles/role/weird%2Frole');
	});

	it('encodes a slash in a workplace user slug', async () => {
		const { ctx } = makeCtx();
		mockFetch({ workplace_user: { id: 'u-1' } });
		await WorkplaceUsers.get(ctx, { slug: 'weird/slug' });
		expect(calledPath()).toBe('workplace/users/weird%2Fslug');
	});

	it('encodes a slash in a webhook slug', async () => {
		const { ctx } = makeCtx();
		mockFetch({ webhook: { id: 'wh-1' } });
		await Webhooks.get(ctx, { project: 'demo', slug: 'weird/slug' });
		expect(calledPath()).toBe('webhooks/webhook/weird%2Fslug');
	});

	it('encodes a slash in a group member type and slug', async () => {
		const { ctx } = makeCtx();
		mockFetch({ success: true });
		await Groups.deleteMember(ctx, {
			group: 'grp/1',
			type: 'workplace_user',
			memberSlug: 'weird/member',
		});
		expect(calledPath()).toBe(
			'workplace/groups/group/grp%2F1/members/workplace_user/weird%2Fmember',
		);
	});

	it('encodes a slash in a project-member type and slug', async () => {
		const { ctx } = makeCtx();
		mockFetch({ member: { slug: 'u-1' } });
		await ProjectMembers.get(ctx, {
			project: 'demo',
			type: 'workplace_user',
			slug: 'weird/slug',
		});
		expect(calledPath()).toBe(
			'projects/project/members/member/workplace_user/weird%2Fslug',
		);
	});
});

describe('coverage sweep', () => {
	it('exercises precisely the operations that are registered', () => {
		const exercised = [...new Set(cases.map((c) => c.meta))].sort();
		const registered = Object.keys(dopplerEndpointMeta).sort();
		expect(exercised).toEqual(registered);
	});

	it('registers exactly the 62 operations the catalog lists', () => {
		expect(Object.keys(dopplerEndpointMeta)).toHaveLength(62);
	});
});

describe('list envelopes', () => {
	it('activityLogs.list returns the official {logs, page} envelope', async () => {
		const { ctx } = makeCtx();
		mockFetch({ page: 1, logs: [{ id: 'log-1' }] });
		await expect(ActivityLogs.list(ctx, {})).resolves.toEqual({
			page: 1,
			logs: [{ id: 'log-1' }],
		});
	});
});

describe('mirroring', () => {
	it('caches a project it read, keyed by slug (not the opaque id)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ project: { id: 'opaque-id-1', slug: 'demo' } });
		await Projects.get(ctx, { project: 'demo' });
		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'demo',
			expect.objectContaining({ slug: 'demo' }),
		);
	});

	it('caches a project under the addressing slug when GET omits slug (official retrieve schema has no slug)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ project: { id: 'ed0c2a68b6', name: 'Compression' } });
		await Projects.get(ctx, { project: 'demo' });
		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'demo',
			expect.objectContaining({ id: 'ed0c2a68b6' }),
		);
	});

	it('evicts a project by the same slug key used to cache it', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ success: true });
		await Projects.remove(ctx, { project: 'demo' });
		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('demo');
	});

	it('caches a config keyed by project:name, not name alone - config names repeat across projects', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ config: { name: 'dev', project: 'demo' } });
		await Configs.get(ctx, { project: 'demo', config: 'dev' });
		expect(db.configs.upsertByEntityId).toHaveBeenCalledWith(
			'demo:dev',
			expect.objectContaining({ name: 'dev' }),
		);
	});

	it('caches a config under the addressing slug when the response project is the opaque id from official examples', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ config: { name: 'dev', project: 'ed0c2a68b6' } });
		await Configs.get(ctx, { project: 'demo', config: 'dev' });
		expect(db.configs.upsertByEntityId).toHaveBeenCalledWith(
			'demo:dev',
			expect.objectContaining({ name: 'dev' }),
		);
	});

	it('evicts a config by the same project:name composite key', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ success: true });
		await Configs.remove(ctx, { project: 'demo', config: 'dev' });
		expect(db.configs.deleteByEntityId).toHaveBeenCalledWith('demo:dev');
	});

	it('renaming a config to a new name evicts the old composite key, not just caching the new one', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ config: { name: 'dev_new', project: 'demo' } });
		await Configs.update(ctx, {
			project: 'demo',
			config: 'dev_old',
			name: 'dev_new',
		});

		expect(db.configs.upsertByEntityId).toHaveBeenCalledWith(
			'demo:dev_new',
			expect.objectContaining({ name: 'dev_new' }),
		);
		expect(db.configs.deleteByEntityId).toHaveBeenCalledWith('demo:dev_old');
	});

	it('renaming a config to the same name does not evict anything', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ config: { name: 'dev', project: 'demo' } });
		await Configs.update(ctx, { project: 'demo', config: 'dev', name: 'dev' });

		expect(db.configs.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('caches an environment keyed by project:id, not id alone - environment slugs (dev/stg/prd) repeat across projects', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ environment: { id: 'dev', project: 'demo' } });
		await Environments.get(ctx, { project: 'demo', environment: 'dev' });
		expect(db.environments.upsertByEntityId).toHaveBeenCalledWith(
			'demo:dev',
			expect.objectContaining({ id: 'dev' }),
		);
	});

	it('caches an environment under the addressing slug when the response project is the opaque id from official examples', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ environment: { id: 'dev', project: 'ed0c2a68b6' } });
		await Environments.get(ctx, { project: 'demo', environment: 'dev' });
		expect(db.environments.upsertByEntityId).toHaveBeenCalledWith(
			'demo:dev',
			expect.objectContaining({ id: 'dev' }),
		);
	});

	it("two projects' same-slug environments do not collide in the mirror", async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ environment: { id: 'dev', project: 'project-a' } });
		await Environments.get(ctx, { project: 'project-a', environment: 'dev' });
		mockFetch({ environment: { id: 'dev', project: 'project-b' } });
		await Environments.get(ctx, { project: 'project-b', environment: 'dev' });

		expect(db.environments.upsertByEntityId).toHaveBeenCalledWith(
			'project-a:dev',
			expect.objectContaining({ project: 'project-a' }),
		);
		expect(db.environments.upsertByEntityId).toHaveBeenCalledWith(
			'project-b:dev',
			expect.objectContaining({ project: 'project-b' }),
		);
		// Each call used a distinct key - neither overwrote the other.
		const calledKeys = db.environments.upsertByEntityId.mock.calls.map(
			(c: unknown[]) => c[0],
		);
		expect(new Set(calledKeys).size).toBe(calledKeys.length);
	});

	it('evicts an environment by the same project:id composite key used to cache it', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ success: true });
		await Environments.remove(ctx, { project: 'demo', environment: 'dev' });
		expect(db.environments.deleteByEntityId).toHaveBeenCalledWith('demo:dev');
	});

	it('renaming an environment to a new slug evicts the old composite key, not just caching the new one', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ environment: { id: 'develop', project: 'demo' } });
		await Environments.rename(ctx, {
			project: 'demo',
			environment: 'dev',
			slug: 'develop',
		});

		expect(db.environments.upsertByEntityId).toHaveBeenCalledWith(
			'demo:develop',
			expect.objectContaining({ id: 'develop' }),
		);
		expect(db.environments.deleteByEntityId).toHaveBeenCalledWith('demo:dev');
	});

	it('renaming an environment without changing its slug does not evict anything', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ environment: { id: 'dev', project: 'demo' } });
		await Environments.rename(ctx, {
			project: 'demo',
			environment: 'dev',
			name: 'Development 2',
		});

		expect(db.environments.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('caches a webhook, stripping authentication before it reaches the store', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({
			webhook: {
				id: 'wh-1',
				authentication: { type: 'Bearer', token: 'should-not-persist' },
			},
		});
		await Webhooks.get(ctx, { project: 'demo', slug: 'wh-1' });
		expect(db.webhooks.upsertByEntityId).toHaveBeenCalledWith(
			'wh-1',
			expect.not.objectContaining({ authentication: expect.anything() }),
		);
	});

	it('does not strip authentication from the value returned to the caller', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			webhook: { id: 'wh-1', authentication: { type: 'Bearer' } },
		});
		const result = await Webhooks.get(ctx, { project: 'demo', slug: 'wh-1' });
		expect(result.authentication).toEqual({ type: 'Bearer' });
	});

	it('evicts a webhook from the mirror on delete, not just on the remote side', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ success: true });
		await Webhooks.remove(ctx, { project: 'demo', slug: 'wh-1' });
		expect(db.webhooks.deleteByEntityId).toHaveBeenCalledWith('wh-1');
	});

	/**
	 * A cache-then-delete round trip, not two independent literal
	 * assertions: proves the key `remove` evicts by is the *same* key `get`
	 * cached under, by comparing the two recorded calls to each other rather
	 * than to a hardcoded string that could drift out of sync with the code
	 * on both sides at once and still pass. Closes the exact gap a
	 * coincidentally-matching `'wh-1'`/`'wh-1'` fixture could not: cache and
	 * evict deriving their key from two different sources (a response's
	 * `id` field vs. a request's `slug` parameter) that only happen to share
	 * a value because the fixture was written that way.
	 */
	it('evicts a webhook using the exact key it was cached under, proven by round-tripping through both calls', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ webhook: { id: 'wh-round-trip' } });
		await Webhooks.get(ctx, { project: 'demo', slug: 'wh-round-trip' });
		const cachedKey = db.webhooks.upsertByEntityId.mock.calls[0]?.[0];
		expect(typeof cachedKey).toBe('string');

		mockFetch({ success: true });
		await Webhooks.remove(ctx, { project: 'demo', slug: 'wh-round-trip' });
		expect(db.webhooks.deleteByEntityId).toHaveBeenCalledWith(cachedKey);
	});

	it('caches the workplace singleton', async () => {
		const { ctx, db } = makeCtx();
		mockFetch({ workplace: { id: 'w-1' } });
		await Workplace.get(ctx, {});
		expect(db.workplace.upsertByEntityId).toHaveBeenCalledWith(
			'w-1',
			expect.objectContaining({ id: 'w-1' }),
		);
	});
});

describe('privacy: never logged', () => {
	/** Deep-searches a logged event payload's JSON serialization for a needle value, case-sensitively. */
	function payloadContains(needle: string): boolean {
		return mockLogEvent.mock.calls.some(([, , payload]) => {
			const serialised = JSON.stringify(payload ?? {});
			return serialised.includes(needle);
		});
	}

	it('secrets.get never logs the secret value', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			name: 'STRIPE',
			value: {
				raw: 'sk_test_should_not_be_logged',
				computed: 'sk_test_should_not_be_logged',
			},
		});
		await Secrets.get(ctx, { project: 'demo', config: 'dev', name: 'STRIPE' });
		expect(payloadContains('sk_test_should_not_be_logged')).toBe(false);
	});

	it('secrets.update never logs the values it wrote, only the names', async () => {
		const { ctx } = makeCtx();
		mockFetch({ secrets: { STRIPE: { raw: 'x', computed: 'x' } } });
		await Secrets.update(ctx, {
			project: 'demo',
			config: 'dev',
			secrets: { STRIPE: 'sk_test_should_not_be_logged' },
		});
		expect(payloadContains('sk_test_should_not_be_logged')).toBe(false);
		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect((payload as { secretNames?: string[] })?.secretNames).toEqual([
			'STRIPE',
		]);
	});

	it('share.createPlain never logs the generated password', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			url: 'https://share.doppler.com/s/x',
			authenticated_url: 'https://share.doppler.com/s/x#pw',
			password: 'should-not-be-logged',
		});
		await Share.createPlain(ctx, { secret: 'top secret' });
		expect(payloadContains('should-not-be-logged')).toBe(false);
		expect(payloadContains('top secret')).toBe(false);
	});

	it('serviceTokens.create never logs the issued key', async () => {
		const { ctx } = makeCtx();
		mockFetch({ token: { slug: 'st-1', key: 'dp.st.should_not_be_logged' } });
		await ServiceTokens.create(ctx, {
			project: 'demo',
			config: 'dev',
			name: 'CI token',
		});
		expect(payloadContains('dp.st.should_not_be_logged')).toBe(false);
	});

	it('workplaceUsers.list never logs the real name/email embedded per entry', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			workplace_users: [
				{ id: 'u-1', user: { name: 'Real Name', email: 'real@example.com' } },
			],
			page: 1,
		});
		await WorkplaceUsers.list(ctx, {});
		expect(payloadContains('Real Name')).toBe(false);
		expect(payloadContains('real@example.com')).toBe(false);
	});

	it('activityLogs.list never logs the acting user embedded per entry', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			page: 1,
			logs: [
				{ id: 'log-1', user: { name: 'Real Name', email: 'real@example.com' } },
			],
		});
		await ActivityLogs.list(ctx, {});
		expect(payloadContains('Real Name')).toBe(false);
		expect(payloadContains('real@example.com')).toBe(false);
	});

	it('configLogs.get never logs the secret values embedded in its diff', async () => {
		const { ctx } = makeCtx();
		mockFetch({
			log: {
				id: 'cl-1',
				diff: [{ name: 'STRIPE', added: 'sk_test_should_not_be_logged' }],
			},
		});
		await ConfigLogs.get(ctx, { project: 'demo', config: 'dev', log: 'cl-1' });
		expect(payloadContains('sk_test_should_not_be_logged')).toBe(false);
	});

	describe('auditPayload deny-list - a second guarantee independent of call-site care', () => {
		it('drops a denied key even if a call site mistakenly lists it as an identifier', () => {
			const input = { project: 'demo', key: 'dp.st.should_not_be_logged' };
			const payload = auditPayload(input, ['project', 'key']);
			expect(payload.key).toBeUndefined();
			expect(payload.project).toBe('demo');
		});

		it('drops a denied key from the "fields" name list too, not just from its value', () => {
			const input = { project: 'demo', secrets: { STRIPE: 'x' } };
			const payload = auditPayload(input, ['project']);
			expect(payload.fields).toEqual(['project']);
		});

		it('is case-insensitive, so a differently-cased denied key is still caught', () => {
			const input = { project: 'demo', Password: 'should-not-be-logged' };
			const payload = auditPayload(
				input as Record<string, unknown>,
				['project', 'Password'] as never,
			);
			expect(payload.Password).toBeUndefined();
		});

		it('still passes through an allowed identifier normally, so the deny-list is not vacuous', () => {
			const input = { project: 'demo', config: 'dev' };
			const payload = auditPayload(input, ['project', 'config']);
			expect(payload.project).toBe('demo');
			expect(payload.config).toBe('dev');
		});
	});
});
