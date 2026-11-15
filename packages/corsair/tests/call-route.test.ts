import { z } from 'zod';
import type { CorsairInternalConfig } from '../core';
import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { AuthMissingError } from '../core/auth/errors/auth-missing';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { managementHandler } from '../core/management';
import {
	listRegisteredOps,
	resolveCall,
	resolveTenantClient,
} from '../core/management/call';
import type { ManagementApiError } from '../core/management/errors';
import { errorResponse } from '../core/management/errors';
import { ReadonlyForbiddenError } from '../core/permissions';
import { PermissionRequiredError } from '../core/permissions/errors/permission-required';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

function internalWith(
	plugins: Array<{ id: string; endpoints?: Record<string, unknown> }>,
	multiTenancy = false,
): CorsairInternalConfig {
	return { plugins, multiTenancy } as unknown as CorsairInternalConfig;
}

describe('PermissionRequiredError.reason', () => {
	it('carries the reason passed to it', () => {
		const err = new PermissionRequiredError('nope', 'denied');
		expect(err.reason).toBe('denied');
		expect(err).toBeInstanceOf(PermissionRequiredError);
	});

	it('defaults reason to "pending"', () => {
		expect(new PermissionRequiredError('waiting').reason).toBe('pending');
	});
});

describe('resolveCall — resolution', () => {
	it('single-tenant: invokes client[plugin].api.<op> and returns its result', async () => {
		const create = jest.fn(async (args: unknown) => ({ ok: true, args }));
		const corsair = { github: { api: { issues: { create } } } };
		const out = await resolveCall(corsair, internalWith([{ id: 'github' }]), {
			plugin: 'github',
			op: 'issues.create',
			args: { title: 't' },
		});
		expect(create).toHaveBeenCalledWith({ title: 't' });
		expect(out).toEqual({ ok: true, args: { title: 't' } });
	});

	it('multi-tenant: resolves the client via withTenant(tenant)', async () => {
		const create = jest.fn(async () => ({ ok: true }));
		const withTenant = jest.fn(() => ({
			github: { api: { issues: { create } } },
		}));
		await resolveCall({ withTenant }, internalWith([{ id: 'github' }], true), {
			plugin: 'github',
			op: 'issues.create',
			tenant: 'acme',
			args: {},
		});
		expect(withTenant).toHaveBeenCalledWith('acme');
	});

	it('multi-tenant with no tenant → 400 bad_request', async () => {
		await expect(
			resolveCall(
				{ withTenant: jest.fn() },
				internalWith([{ id: 'github' }], true),
				{ plugin: 'github', op: 'issues.create', args: {} },
			),
		).rejects.toMatchObject({ status: 400, code: 'bad_request' });
	});

	it('unknown plugin → 404 unknown_plugin', async () => {
		await expect(
			resolveCall({}, internalWith([{ id: 'github' }]), {
				plugin: 'slack',
				op: 'x.y',
				args: {},
			}),
		).rejects.toMatchObject({ status: 404, code: 'unknown_plugin' });
	});

	it('unknown op (missing / non-function leaf) → 404 unknown_op', async () => {
		const corsair = { github: { api: { issues: { create: () => {} } } } };
		await expect(
			resolveCall(corsair, internalWith([{ id: 'github' }]), {
				plugin: 'github',
				op: 'issues.nope',
				args: {},
			}),
		).rejects.toMatchObject({ status: 404, code: 'unknown_op' });
	});

	it('inherited/prototype ops → 404 unknown_op (own-property only)', async () => {
		const corsair = { github: { api: { issues: { create: () => {} } } } };
		for (const op of [
			'constructor',
			'toString',
			'__proto__.constructor',
			'issues.constructor',
		]) {
			await expect(
				resolveCall(corsair, internalWith([{ id: 'github' }]), {
					plugin: 'github',
					op,
					args: {},
				}),
			).rejects.toMatchObject({ status: 404, code: 'unknown_op' });
		}
	});

	it('never evicts a tenant with an in-flight op → refresh single-flight survives the LRU cap', async () => {
		let release!: () => void;
		const gate = new Promise<void>((r) => {
			release = r;
		});
		const withTenant = jest.fn((t: string) => ({
			github: {
				api: {
					issues: {
						create: async () => {
							if (t === 'busy') await gate; // hold the op open
							return { ok: true };
						},
					},
				},
			},
		}));
		const corsair = { withTenant };
		const internal = internalWith([{ id: 'github' }], true);
		const call = (tenant: string) =>
			resolveCall(corsair, internal, {
				plugin: 'github',
				op: 'issues.create',
				tenant,
				args: {},
			});
		// 'busy' stays in-flight while we flood the cache well past the 512 cap
		// with unique idle tenants — its client must not be evicted.
		const busy = call('busy');
		for (let i = 0; i < 560; i++) await call(`t${i}`);
		// still in-flight: a fresh call for 'busy' must reuse the cached client
		const busy2 = call('busy');
		release();
		await Promise.all([busy, busy2]);
		expect(withTenant.mock.calls.filter(([t]) => t === 'busy')).toHaveLength(1);
	});

	it('protects the just-inserted tenant when every older client is in-flight', async () => {
		let release!: () => void;
		const gate = new Promise<void>((r) => {
			release = r;
		});
		const withTenant = jest.fn((_t: string) => ({
			github: {
				api: { issues: { create: async () => (await gate, { ok: true }) } },
			},
		}));
		const corsair = { withTenant };
		const internal = internalWith([{ id: 'github' }], true);
		const call = (t: string) =>
			resolveCall(corsair, internal, {
				plugin: 'github',
				op: 'issues.create',
				tenant: t,
				args: {},
			});
		// 512 tenants all held in-flight → cache is at the cap, every client busy
		const busy = Array.from({ length: 512 }, (_, i) => call(`t${i}`));
		// a brand-new tenant is inserted while all 512 older clients are active;
		// it must not be the one evicted — a concurrent call reuses its client
		const newbie = call('newbie');
		const newbie2 = call('newbie');
		release();
		await Promise.all([...busy, newbie, newbie2]);
		expect(withTenant.mock.calls.filter(([t]) => t === 'newbie')).toHaveLength(
			1,
		);
	});

	it('G2: concurrent same-tenant calls build the client once (shared key-manager)', async () => {
		const create = jest.fn(async () => ({}));
		const withTenant = jest.fn(() => ({
			github: { api: { issues: { create } } },
		}));
		const corsair = { withTenant };
		const internal = internalWith([{ id: 'github' }], true);
		await Promise.all([
			resolveCall(corsair, internal, {
				plugin: 'github',
				op: 'issues.create',
				tenant: 'acme',
				args: {},
			}),
			resolveCall(corsair, internal, {
				plugin: 'github',
				op: 'issues.create',
				tenant: 'acme',
				args: {},
			}),
		]);
		expect(withTenant).toHaveBeenCalledTimes(1);
	});
});

describe('listRegisteredOps', () => {
	it('walks each plugin.endpoints to dot-paths of function leaves', () => {
		const plugins = [
			{
				id: 'github',
				endpoints: { issues: { create: () => {}, list: () => {} } },
			},
		];
		expect(listRegisteredOps(internalWith(plugins))).toEqual({
			github: ['issues.create', 'issues.list'],
		});
	});
});

function corsairThrowing(err: unknown) {
	return {
		github: {
			api: {
				issues: {
					create: async () => {
						throw err;
					},
				},
			},
		},
	};
}
const ghInternal = internalWith([{ id: 'github' }]);
const callGh = (corsair: unknown) =>
	resolveCall(corsair, ghInternal, {
		plugin: 'github',
		op: 'issues.create',
		args: {},
	});

describe('resolveCall — error normalization', () => {
	it('AuthMissingError → 401 not_connected', async () => {
		await expect(
			callGh(corsairThrowing(new AuthMissingError('github', 'oauth_2'))),
		).rejects.toMatchObject({ status: 401, code: 'not_connected' });
	});

	it('PermissionRequiredError denied/policy/timeout → 403 permission_denied {reason}', async () => {
		for (const reason of ['denied', 'policy', 'timeout'] as const) {
			await expect(
				callGh(corsairThrowing(new PermissionRequiredError('no', reason))),
			).rejects.toMatchObject({
				status: 403,
				code: 'permission_denied',
				extra: { reason },
			});
		}
	});

	it('PermissionRequiredError pending → 403 approval_required', async () => {
		await expect(
			callGh(corsairThrowing(new PermissionRequiredError('wait', 'pending'))),
		).rejects.toMatchObject({
			status: 403,
			code: 'approval_required',
			extra: { reason: 'pending' },
		});
	});

	it('ReadonlyForbiddenError → 403 permission_denied', async () => {
		await expect(
			callGh(
				corsairThrowing(new ReadonlyForbiddenError('repo.delete', 'write')),
			),
		).rejects.toMatchObject({ status: 403, code: 'permission_denied' });
	});

	it('provider ApiError → 502 {providerStatus, body}, never leaks the Authorization header (G4)', async () => {
		const apiErr = Object.assign(new Error('boom'), {
			name: 'ApiError',
			status: 403,
			body: { message: 'forbidden' },
			request: { headers: { Authorization: 'Bearer super-secret-token' } },
		});
		try {
			await callGh(corsairThrowing(apiErr));
			throw new Error('expected throw');
		} catch (e) {
			const mErr = e as ManagementApiError;
			expect(mErr.status).toBe(502);
			expect(mErr.code).toBe('provider_error');
			expect(mErr.extra).toEqual({
				providerStatus: 403,
				body: { message: 'forbidden' },
			});
			const serialized = JSON.stringify(await errorResponse(mErr).json());
			expect(serialized).not.toContain('Bearer');
			expect(serialized).not.toContain('Authorization');
		}
	});

	it('unknown throw → 500 internal_error with a generic message (no detail leak, original logged)', async () => {
		const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
		try {
			await callGh(corsairThrowing(new Error('db-host:5432 password=hunter2')));
			throw new Error('expected throw');
		} catch (e) {
			const mErr = e as ManagementApiError;
			expect(mErr.status).toBe(500);
			expect(mErr.code).toBe('internal_error');
			expect(mErr.message).toBe('Internal error');
			const serialized = JSON.stringify(await errorResponse(mErr).json());
			expect(serialized).not.toContain('hunter2');
			expect(spy).toHaveBeenCalled(); // original retained for server-side diagnostics
		} finally {
			spy.mockRestore();
		}
	});
});

// Stub plugin whose endpoints expose a no-auth op, so a real bound client tree
// has `github.api.issues.create` without needing a DB or tokens.
const githubStub = {
	id: 'github',
	options: {},
	endpoints: {
		issues: {
			create: async (_ctx: unknown, args: unknown) => ({ echoed: args }),
		},
	},
} as unknown as CorsairPlugin;

async function readJson<T>(res: Response): Promise<T> {
	return (await res.json()) as T;
}

describe('managementHandler — /call route', () => {
	it('POST /:tenant/:plugin/call/:op routes to the op and wraps the result in { data }', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, {
			unsafeAllowUnauthenticated: true,
		});
		const res = await handler(
			new Request('http://x/api/corsair/t1/github/call/issues.create', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ args: { title: 'hi' } }),
			}),
		);
		expect(res.status).toBe(200);
		expect(await readJson(res)).toEqual({ data: { echoed: { title: 'hi' } } });
	});

	it('refuses without unsafeAllowUnauthenticated → 403 call_disabled (G3)', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/t1/github/call/issues.create', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ args: {} }),
			}),
		);
		expect(res.status).toBe(403);
		expect((await readJson<{ error: string }>(res)).error).toBe(
			'call_disabled',
		);
	});

	it('honors a custom basePath', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, {
			basePath: '/v1/corsair',
			unsafeAllowUnauthenticated: true,
		});
		const res = await handler(
			new Request('http://x/v1/corsair/t1/github/call/issues.create', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ args: { title: 'x' } }),
			}),
		);
		expect(res.status).toBe(200);
	});

	it('GET /call returns the registered plugin → op set', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, {
			unsafeAllowUnauthenticated: true,
		});
		const res = await handler(
			new Request('http://x/api/corsair/call', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
		expect(await readJson(res)).toEqual({
			plugins: { github: ['issues.create'] },
		});
	});
});

describe('managementHandler — authenticate hook', () => {
	it('rejects a gated route with 401 when authenticate returns false', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, { authenticate: () => false });
		const res = await handler(
			new Request('http://x/api/corsair/plugins', { method: 'GET' }),
		);
		expect(res.status).toBe(401);
		expect((await readJson<{ error: string }>(res)).error).toBe('unauthorized');
	});

	it('lets a public leg through even when authenticate would reject', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, { authenticate: () => false });
		const res = await handler(
			new Request('http://x/api/corsair/ok', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
	});

	it('/call honors resolveTenant: null → 401 unauthenticated (no cross-tenant bypass)', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, {
			authenticate: () => true,
			resolveTenant: () => null,
		});
		const res = await handler(
			new Request('http://x/api/corsair/t1/github/call/issues.create', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ args: {} }),
			}),
		);
		expect(res.status).toBe(401);
		expect((await readJson<{ error: string }>(res)).error).toBe(
			'unauthenticated',
		);
	});

	it('supplying authenticate enables /call without unsafeAllowUnauthenticated', async () => {
		const corsair = createCorsair({ plugins: [githubStub], kek: 'k' } as any);
		const handler = managementHandler(corsair, { authenticate: () => true });
		const res = await handler(
			new Request('http://x/api/corsair/t1/github/call/issues.create', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ args: { title: 'hi' } }),
			}),
		);
		expect(res.status).toBe(200);
		expect(await readJson(res)).toEqual({ data: { echoed: { title: 'hi' } } });
	});
});

describe('call and db routes with an account', () => {
	const KEK = 'test-kek-with-at-least-32-characters!!';
	const demo = {
		id: 'demo',
		options: { authType: 'oauth_2' as const },
		authConfig: { oauth_2: { account: [] as const } },
		schema: {
			version: '1',
			entities: { notes: z.object({ title: z.string() }) },
		},
		endpoints: {
			token: async (ctx: any) => ctx.keys.get_access_token(),
		},
	} as unknown as CorsairPlugin;

	let env: ReturnType<typeof createTestDatabase>;
	let corsair: any;
	let handler: (r: Request) => Promise<Response>;
	beforeEach(async () => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [demo],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		} as any);
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
		await env.db.deleteFrom('corsair_accounts').execute();
		handler = managementHandler(corsair, { authenticate: () => true });
	});
	afterEach(() => env.cleanup());

	async function addAccount(ref: string, label: string, token: string) {
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'demo')
			.executeTakeFirstOrThrow();
		const dek = generateDEK();
		const at = new Date(ref === 'a' ? '2026-01-01' : '2026-02-01');
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: `acct-${ref}`,
				created_at: at,
				updated_at: at,
				tenant_id: 't1',
				integration_id: integ.id,
				config: encryptConfig({ account_ref: ref, account_label: label }, dek),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
		await createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			tenantId: 't1',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
			account: { ref },
		}).set_access_token(token);
	}

	const post = (path: string, body: unknown) =>
		handler(
			new Request(`https://app.test${path}`, {
				method: 'POST',
				headers: {
					authorization: 'Bearer k',
					'content-type': 'application/json',
				},
				body: JSON.stringify(body),
			}),
		);

	it("call with account binds that account's token", async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const res = await post('/t1/demo/call/token', { account: 'b' });
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toEqual({ data: 'tok-b' });
	});

	it('call without account and two accounts returns the account_required error as a 4xx management error', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const res = await post('/t1/demo/call/token', {});
		expect(res.status).toBe(400);
		expect(await res.json()).toMatchObject({ error: 'account_required' });
		const missing = await post('/t1/demo/call/token', { account: 'zed' });
		expect(missing.status).toBe(404);
		expect(await missing.json()).toMatchObject({ error: 'account_not_found' });
		const blank = await post('/t1/demo/call/token', { account: ' ' });
		expect(blank.status).toBe(400);
		expect(await blank.json()).toMatchObject({ error: 'bad_request' });
	});

	it('cache returns the same client for the same (tenant, account)', () => {
		const withTenant = jest.fn(() => ({}));
		const c = { withTenant };
		const internal = internalWith([{ id: 'demo' }], true);
		const pick = (account?: string) =>
			resolveTenantClient(c, internal, 't1', { plugin: 'demo', account })
				.client;
		expect(pick('a')).toBe(pick('a'));
		expect(pick('a')).not.toBe(pick('b'));
		expect(pick()).toBe(pick());
		expect(withTenant).toHaveBeenCalledTimes(3);
	});

	it('db route read without account fans out and tags rows', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		for (const ref of ['a', 'b']) {
			const res = await post('/t1/demo/db/notes/upsertByEntityId', {
				account: ref,
				args: [`n-${ref}`, { title: ref }],
			});
			expect(res.status).toBe(200);
		}
		const all = await (
			await post('/t1/demo/db/notes/list', { args: [] })
		).json();
		expect(all.data.map((r: any) => [r.data.title, r.account]).sort()).toEqual([
			['a', 'a@x.com'],
			['b', 'b@x.com'],
		]);
		const one = await (
			await post('/t1/demo/db/notes/list', { account: 'a', args: [] })
		).json();
		expect(one.data.map((r: any) => r.data.title)).toEqual(['a']);
	});
});
