import type { CorsairInternalConfig } from '../core';
import { createCorsair } from '../core';
import { AuthMissingError } from '../core/auth/errors/auth-missing';
import { managementHandler } from '../core/management';
import { listRegisteredOps, resolveCall } from '../core/management/call';
import type { ManagementApiError } from '../core/management/errors';
import { errorResponse } from '../core/management/errors';
import { ReadonlyForbiddenError } from '../core/permissions';
import { PermissionRequiredError } from '../core/permissions/errors/permission-required';
import type { CorsairPlugin } from '../core/plugins';

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
