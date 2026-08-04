import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { request } from 'corsair/http';
import { makeNeonRequest } from './client';
import { neonOperations } from './endpoints';
import type { NeonContext } from './index';
import { neon, neonEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-token',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as NeonContext;

describe('Neon plugin shape', () => {
	it('keeps endpoint domain files explicit', () => {
		const projectsSource = readFileSync(
			join(__dirname, 'endpoints/projects.ts'),
			'utf8',
		);
		const branchesSource = readFileSync(
			join(__dirname, 'endpoints/branches.ts'),
			'utf8',
		);

		expect(projectsSource).toContain('export const getProject');
		expect(projectsSource).toContain('export const createProject');
		expect(branchesSource).toContain('export const createProjectBranch');
		expect(branchesSource).toContain('export const restoreProjectBranch');
	});

	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = neon();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(110);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(110);
		expect(Object.keys(neonEndpointSchemas)).toHaveLength(110);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(neonEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.schema?.entities ?? {})).toEqual([
			'projects',
			'branches',
			'databases',
			'roles',
			'computeEndpoints',
			'organizations',
			'snapshots',
			'apiKeys',
		]);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('uses api key auth by default', () => {
		const plugin = neon();

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('Neon request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends bearer auth and JSON bodies to the Neon API', async () => {
		await makeNeonRequest('/projects', 'test-token', {
			method: 'POST',
			body: { project: { name: 'demo' } },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://console.neon.tech/api/v2',
				TOKEN: 'test-token',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/projects',
				body: { project: { name: 'demo' } },
				mediaType: 'application/json',
			}),
		);
		// auth flows only through TOKEN; corsair/http derives the bearer
		// header from it, so no explicit Authorization header is set
		expect(
			mockRequest.mock.calls[0]?.[0].HEADERS?.Authorization,
		).toBeUndefined();
	});

	it('drops bodies for GET requests and keeps query params', async () => {
		await makeNeonRequest('/projects', 'test-token', {
			method: 'GET',
			body: { ignored: true },
			query: { limit: 10 },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/projects',
			query: { limit: 10 },
		});
		expect(mockRequest.mock.calls[0]?.[1].body).toBeUndefined();
	});
});

describe('Neon endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('routes every operation to its declared path and method', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<
				string,
				(ctx: NeonContext, input: Record<string, unknown>) => Promise<unknown>
			>
		>;

		// the const-asserted operations array narrows away optional fields per
		// member; widen once so the loop can treat every operation uniformly
		const allOperations = neonOperations as readonly {
			group: string;
			name: string;
			method: string;
			path: string;
			pathParams?: readonly string[];
		}[];

		for (const operation of allOperations) {
			const handler = endpoints[operation.group]?.[operation.name];
			if (!handler) {
				throw new Error(
					`[test] missing endpoint ${operation.group}.${operation.name}`,
				);
			}

			// synthesize one value per declared path param; the factory must
			// substitute all of them and reject none
			const input: Record<string, unknown> = {};
			let expectedUrl: string = operation.path;
			for (const param of operation.pathParams ?? []) {
				const value = `test-${param.replace(/_/g, '-')}`;
				input[param] = value;
				expectedUrl = expectedUrl.replace(`{${param}}`, value);
			}

			mockRequest.mockClear();
			mockRequest.mockResolvedValue({ ok: true });
			await handler(mockCtx, input);

			const call = mockRequest.mock.calls[0]?.[1];
			expect(call).toMatchObject({
				method: operation.method,
				url: expectedUrl,
			});
			// an unresolved placeholder means pathParams and the path template
			// disagree — exactly the typo class this test exists to catch
			expect(call.url).not.toContain('{');
		}
	});

	it('maps auth, endpoints, orgs, dataApi, snapshots, users and regions to official routes', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			| Record<
					string,
					| ((
							ctx: NeonContext,
							input: Record<string, unknown>,
					  ) => Promise<unknown>)
					| undefined
			  >
			| undefined
		>;

		function call(group: string, name: string, input: Record<string, unknown>) {
			const handler = endpoints[group]?.[name];
			if (!handler) throw new Error(`[test] missing endpoint ${group}.${name}`);
			return handler(mockCtx, input);
		}

		const projectId = 'summer-sound-12345678';
		const branchId = 'br-aged-salad-637688';

		await call('auth', 'getAuthDetails', {});
		await call('auth', 'createNeonAuth', {
			project_id: projectId,
			branch_id: branchId,
		});
		await call('auth', 'deleteBranchNeonAuthUser', {
			project_id: projectId,
			branch_id: branchId,
			auth_user_id: 'user-1',
		});
		await call('computeEndpoints', 'listProjectEndpoints', {
			project_id: projectId,
		});
		await call('computeEndpoints', 'startProjectEndpoint', {
			project_id: projectId,
			endpoint_id: 'ep-cool-darkness-123456',
		});
		await call('organizations', 'getOrganization', {
			org_id: 'org-cool-breeze-12345678',
		});
		await call('organizations', 'removeOrganizationMember', {
			org_id: 'org-cool-breeze-12345678',
			member_id: 'member-1',
		});
		await call('dataApi', 'createProjectBranchDataAPI', {
			project_id: projectId,
			branch_id: branchId,
			database_name: 'neondb',
		});
		await call('snapshots', 'createSnapshot', {
			project_id: projectId,
			branch_id: branchId,
		});
		await call('snapshots', 'restoreSnapshot', {
			project_id: projectId,
			snapshot_id: 'snap-1',
		});
		await call('users', 'getCurrentUserInfo', {});
		await call('users', 'getCurrentUserOrganizations', {});
		await call('regions', 'getActiveRegions', {});

		expect(mockRequest.mock.calls.map((c) => c[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ method: 'GET', url: '/auth' }),
				expect.objectContaining({
					method: 'POST',
					url: `/projects/${projectId}/branches/${branchId}/auth`,
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: `/projects/${projectId}/branches/${branchId}/auth/users/user-1`,
				}),
				expect.objectContaining({
					method: 'GET',
					url: `/projects/${projectId}/endpoints`,
				}),
				expect.objectContaining({
					method: 'POST',
					url: `/projects/${projectId}/endpoints/ep-cool-darkness-123456/start`,
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/organizations/org-cool-breeze-12345678',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/organizations/org-cool-breeze-12345678/members/member-1',
				}),
				expect.objectContaining({
					method: 'POST',
					url: `/projects/${projectId}/branches/${branchId}/data-api/neondb`,
				}),
				expect.objectContaining({
					method: 'POST',
					url: `/projects/${projectId}/branches/${branchId}/snapshot`,
				}),
				expect.objectContaining({
					method: 'POST',
					url: `/projects/${projectId}/snapshots/snap-1/restore`,
				}),
				expect.objectContaining({ method: 'GET', url: '/users/me' }),
				expect.objectContaining({
					method: 'GET',
					url: '/users/me/organizations',
				}),
				expect.objectContaining({ method: 'GET', url: '/regions' }),
			]),
		);
	});

	it('maps representative operations to official API routes', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				listProjects: (ctx: NeonContext, input: {}) => Promise<unknown>;
				getProject: (
					ctx: NeonContext,
					input: { project_id: string },
				) => Promise<unknown>;
			};
			branches: {
				createProjectBranch: (
					ctx: NeonContext,
					input: { project_id: string; body: unknown },
				) => Promise<unknown>;
			};
			roles: {
				getProjectBranchRolePassword: (
					ctx: NeonContext,
					input: { project_id: string; branch_id: string; role_name: string },
				) => Promise<unknown>;
			};
			vpc: {
				assignOrganizationVPCEndpoint: (
					ctx: NeonContext,
					input: {
						org_id: string;
						region_id: string;
						vpc_endpoint_id: string;
						body: { label: string };
					},
				) => Promise<unknown>;
			};
			consumption: {
				getConsumptionHistoryPerAccount: (
					ctx: NeonContext,
					input: { query: Record<string, unknown> },
				) => Promise<unknown>;
			};
		};

		await endpoints.projects.listProjects(mockCtx, {});
		await endpoints.projects.getProject(mockCtx, {
			project_id: 'summer-sound-12345678',
		});
		await endpoints.branches.createProjectBranch(mockCtx, {
			project_id: 'summer-sound-12345678',
			body: { branch: { name: 'preview' } },
		});
		await endpoints.roles.getProjectBranchRolePassword(mockCtx, {
			project_id: 'summer-sound-12345678',
			branch_id: 'br-aged-salad-637688',
			role_name: 'casey',
		});
		await endpoints.vpc.assignOrganizationVPCEndpoint(mockCtx, {
			org_id: 'org-cool-breeze-12345678',
			region_id: 'aws-us-east-2',
			vpc_endpoint_id: 'vpce-1234567890abcdef0',
			body: { label: 'prod' },
		});
		await endpoints.consumption.getConsumptionHistoryPerAccount(mockCtx, {
			query: { from: '2024-06-01T00:00:00Z', granularity: 'daily' },
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ method: 'GET', url: '/projects' }),
				expect.objectContaining({
					method: 'GET',
					url: '/projects/summer-sound-12345678',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/projects/summer-sound-12345678/branches',
					body: { branch: { name: 'preview' } },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/projects/summer-sound-12345678/branches/br-aged-salad-637688/roles/casey/reveal_password',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/organizations/org-cool-breeze-12345678/vpc/region/aws-us-east-2/vpc_endpoints/vpce-1234567890abcdef0',
					body: { label: 'prod' },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/consumption_history/account',
					query: { from: '2024-06-01T00:00:00Z', granularity: 'daily' },
				}),
			]),
		);
	});

	it('keeps non-path fields in auto-built request bodies', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			databases: {
				createProjectBranchDatabase: (
					ctx: NeonContext,
					input: {
						project_id: string;
						branch_id: string;
						database: { name: string; owner_name: string };
					},
				) => Promise<unknown>;
			};
		};

		await endpoints.databases.createProjectBranchDatabase(mockCtx, {
			project_id: 'summer-sound-12345678',
			branch_id: 'br-aged-salad-637688',
			database: { name: 'mydb', owner_name: 'casey' },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/projects/summer-sound-12345678/branches/br-aged-salad-637688/databases',
			body: { database: { name: 'mydb', owner_name: 'casey' } },
		});
	});

	it('folds non-path fields into query params for GET requests', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				listProjects: (
					ctx: NeonContext,
					input: { limit: number; search: string },
				) => Promise<unknown>;
			};
			branches: {
				getProjectBranchSchema: (
					ctx: NeonContext,
					input: {
						project_id: string;
						branch_id: string;
						db_name: string;
					},
				) => Promise<unknown>;
			};
		};

		await endpoints.projects.listProjects(mockCtx, {
			limit: 25,
			search: 'demo',
		});
		await endpoints.branches.getProjectBranchSchema(mockCtx, {
			project_id: 'summer-sound-12345678',
			branch_id: 'br-aged-salad-637688',
			db_name: 'neondb',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/projects',
			query: { limit: 25, search: 'demo' },
		});
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
			method: 'GET',
			url: '/projects/summer-sound-12345678/branches/br-aged-salad-637688/schema',
			query: { db_name: 'neondb' },
		});
	});

	it('requires path parameters before sending requests', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				getProject: (ctx: NeonContext, input: {}) => Promise<unknown>;
			};
		};

		await expect(endpoints.projects.getProject(mockCtx, {})).rejects.toThrow(
			'missing required path parameter',
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('caches wrapped list and item responses when database clients exist', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				listProjects: (ctx: NeonContext, input: {}) => Promise<unknown>;
			};
			branches: {
				getProjectBranch: (
					ctx: NeonContext,
					input: { project_id: string; branch_id: string },
				) => Promise<unknown>;
			};
		};
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: { upsertByEntityId: jest.fn() },
				branches: { upsertByEntityId: jest.fn() },
			},
		} as unknown as NeonContext;

		mockRequest
			.mockResolvedValueOnce({
				projects: [{ id: 'summer-sound-12345678', name: 'Demo' }],
			})
			.mockResolvedValueOnce({
				branch: { id: 'br-aged-salad-637688', name: 'main' },
			});

		await endpoints.projects.listProjects(ctxWithDb, {});
		await endpoints.branches.getProjectBranch(ctxWithDb, {
			project_id: 'summer-sound-12345678',
			branch_id: 'br-aged-salad-637688',
		});

		expect(ctxWithDb.db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'summer-sound-12345678',
			expect.objectContaining({ name: 'Demo' }),
		);
		expect(ctxWithDb.db.branches.upsertByEntityId).toHaveBeenCalledWith(
			'br-aged-salad-637688',
			expect.objectContaining({ name: 'main' }),
		);
	});

	it('getOrganization unwraps the organization envelope into the cache', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			organizations: {
				getOrganization: (
					ctx: NeonContext,
					input: { org_id: string },
				) => Promise<unknown>;
			};
		};
		const ctxWithDb = {
			...mockCtx,
			db: {
				organizations: { upsertByEntityId: jest.fn() },
			},
		} as unknown as NeonContext;

		mockRequest.mockResolvedValueOnce({
			organization: { id: 'org-cool-breeze-12345678', name: 'Acme' },
		});

		await endpoints.organizations.getOrganization(ctxWithDb, {
			org_id: 'org-cool-breeze-12345678',
		});

		expect(ctxWithDb.db.organizations.upsertByEntityId).toHaveBeenCalledWith(
			'org-cool-breeze-12345678',
			expect.objectContaining({ name: 'Acme' }),
		);
	});

	it('never caches the plaintext token returned by createApiKey', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			apiKeys: {
				createApiKey: (
					ctx: NeonContext,
					input: { body: unknown },
				) => Promise<unknown>;
			};
		};
		const ctxWithDb = {
			...mockCtx,
			db: {
				apiKeys: { upsertByEntityId: jest.fn() },
			},
		} as unknown as NeonContext;

		mockRequest.mockResolvedValueOnce({
			id: 165434,
			key: 'neon-plaintext-token-shown-once',
			name: 'ci-key',
			created_at: '2022-11-15T20:13:35Z',
			created_by: 'user-id',
		});

		const response = await endpoints.apiKeys.createApiKey(ctxWithDb, {
			body: { key_name: 'ci-key' },
		});

		// callers still get the one-time token from the api response
		expect(response).toMatchObject({ key: 'neon-plaintext-token-shown-once' });
		// but the cached copy must not contain it
		expect(ctxWithDb.db.apiKeys.upsertByEntityId).toHaveBeenCalledWith(
			'165434',
			expect.objectContaining({ id: 165434, name: 'ci-key' }),
		);
		expect(ctxWithDb.db.apiKeys.upsertByEntityId).toHaveBeenCalledWith(
			'165434',
			expect.not.objectContaining({ key: expect.anything() }),
		);
	});

	it('returns api results even when cache writes fail', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				listProjects: (ctx: NeonContext, input: {}) => Promise<unknown>;
			};
		};
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
			},
		} as unknown as NeonContext;

		mockRequest.mockResolvedValueOnce({
			projects: [{ id: 'summer-sound-12345678', name: 'Demo' }],
		});

		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		// the neon api call succeeded; a local cache failure must not make
		// the endpoint throw, or callers could retry a completed operation
		const result = await endpoints.projects.listProjects(ctxWithDb, {});
		warn.mockRestore();

		expect(result).toMatchObject({
			projects: [{ id: 'summer-sound-12345678' }],
		});
		expect(ctxWithDb.db.projects.upsertByEntityId).toHaveBeenCalled();
	});

	it('returns api results even when event logging fails', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				listProjects: (ctx: NeonContext, input: {}) => Promise<unknown>;
			};
		};
		const ctxWithBrokenLogging = {
			...mockCtx,
			$getAccountId: jest.fn().mockRejectedValue(new Error('store down')),
		} as unknown as NeonContext;

		mockRequest.mockResolvedValueOnce({
			projects: [{ id: 'summer-sound-12345678', name: 'Demo' }],
		});

		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await endpoints.projects.listProjects(
			ctxWithBrokenLogging,
			{},
		);
		warn.mockRestore();

		expect(result).toMatchObject({
			projects: [{ id: 'summer-sound-12345678' }],
		});
	});

	it('deletes cached entities for destructive operations', async () => {
		const plugin = neon({ key: 'test-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			projects: {
				deleteProject: (
					ctx: NeonContext,
					input: { project_id: string },
				) => Promise<unknown>;
			};
			branches: {
				deleteProjectBranch: (
					ctx: NeonContext,
					input: { project_id: string; branch_id: string },
				) => Promise<unknown>;
			};
		};
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: { deleteByEntityId: jest.fn() },
				branches: { deleteByEntityId: jest.fn() },
			},
		} as unknown as NeonContext;

		await endpoints.projects.deleteProject(ctxWithDb, {
			project_id: 'summer-sound-12345678',
		});
		await endpoints.branches.deleteProjectBranch(ctxWithDb, {
			project_id: 'summer-sound-12345678',
			branch_id: 'br-aged-salad-637688',
		});

		expect(ctxWithDb.db.projects.deleteByEntityId).toHaveBeenCalledWith(
			'summer-sound-12345678',
		);
		expect(ctxWithDb.db.branches.deleteByEntityId).toHaveBeenCalledWith(
			'br-aged-salad-637688',
		);
	});
});
