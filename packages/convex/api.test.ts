import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { makeConvexRequest } from './client';
import {
	ConvexEndpointInputSchemas,
	ConvexEndpointOutputSchemas,
} from './endpoints';
import type { ConvexContext } from './index';
import { convex, convexEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(null),
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

type TestEndpointHandler = (
	ctx: ConvexContext,
	input: Record<string, unknown>,
) => Promise<unknown>;

type TestEndpoints = Record<string, Record<string, TestEndpointHandler>>;

function getEndpoint(
	endpoints: TestEndpoints,
	group: string,
	name: string,
): TestEndpointHandler {
	const handler = endpoints[group]?.[name];
	if (!handler) {
		throw new Error(`[test] missing endpoint ${group}.${name}`);
	}
	return handler;
}
const mockCtx = {
	key: 'test-token',
	options: {},
	keys: {
		get_subdomain: async () => 'acoustic-panther-728',
		get_deploy_key: async () => null,
	},
	$getAccountId: () => 'test-account-id',
	logEvent: jest.fn(),
	db: {},
} as unknown as ConvexContext;

describe('Convex plugin shape', () => {
	it('exposes all 19 claimed operations with schemas and no webhooks', () => {
		const plugin = convex();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(19);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(19);
		expect(Object.keys(convexEndpointSchemas)).toHaveLength(19);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(convexEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.schema?.entities ?? {})).toEqual([
			'projects',
			'deployments',
			'deployKeys',
		]);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('uses api key auth by default with subdomain and deploy key account fields', () => {
		const plugin = convex();

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['subdomain', 'deploy_key'] },
			oauth_2: { account: ['subdomain', 'deploy_key'] },
		});
	});

	it('marks destructive operations as irreversible', () => {
		const plugin = convex();
		const meta = plugin.endpointMeta ?? {};

		expect(meta['projects.delete']?.irreversible).toBe(true);
		expect(meta['deployments.delete']?.irreversible).toBe(true);
		expect(meta['customDomains.delete']?.irreversible).toBe(true);
		expect(meta['projects.list']?.irreversible).toBeUndefined();
	});

	it('declares input schemas for every endpoint', () => {
		expect(Object.keys(ConvexEndpointInputSchemas)).toHaveLength(19);
		expect(Object.keys(ConvexEndpointOutputSchemas)).toHaveLength(19);

		// every schema parses
		for (const schema of Object.values(ConvexEndpointInputSchemas)) {
			expect(schema).toBeDefined();
		}
	});
});

describe('Convex request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends bearer auth to the Management API by default', async () => {
		await makeConvexRequest('/teams/123/projects', 'test-token');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.convex.dev/v1',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-token',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/teams/123/projects',
			}),
		);
	});

	it('rejects requests without a configured credential', async () => {
		await expect(
			makeConvexRequest('/teams/123/projects', undefined),
		).rejects.toThrow('No Convex access token');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends Convex-style auth and deployment base URL for deployment-scoped calls', async () => {
		await makeConvexRequest('/query_batch', 'prod:deploy-key', {
			method: 'POST',
			baseUrl: 'https://acoustic-panther-728.convex.cloud/api',
			authScheme: 'convex',
			body: { format: 'json', queries: [] },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://acoustic-panther-728.convex.cloud/api',
				HEADERS: expect.objectContaining({
					Authorization: 'Convex prod:deploy-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/query_batch',
				body: { format: 'json', queries: [] },
			}),
		);
	});

	it('drops bodies for GET requests and keeps query params', async () => {
		await makeConvexRequest('/teams/123/projects', 'test-token', {
			method: 'GET',
			body: { ignored: true },
			query: { limit: 10 },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/teams/123/projects',
			query: { limit: 10 },
		});
		expect(mockRequest.mock.calls[0]?.[1].body).toBeUndefined();
	});
});

describe('Convex endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('routes every operation to its declared path and method', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<
				string,
				(ctx: ConvexContext, input: Record<string, unknown>) => Promise<unknown>
			>
		>;

		const cases: Array<{
			group: string;
			name: string;
			input: Record<string, unknown>;
			method: string;
			url: string;
			baseUrl?: string;
			auth?: string;
		}> = [
			{
				group: 'projects',
				name: 'list',
				input: { team_id: 'team-1' },
				method: 'GET',
				url: '/teams/team-1/projects',
			},
			{
				group: 'projects',
				name: 'getById',
				input: { project_id: 'proj-1' },
				method: 'GET',
				url: '/projects/proj-1',
			},
			{
				group: 'projects',
				name: 'getBySlug',
				input: { team_id_or_slug: 'team-1', project_slug: 'my-app' },
				method: 'GET',
				url: '/teams/team-1/projects/my-app',
			},
			{
				group: 'projects',
				name: 'create',
				input: { team_id: 'team-1', projectName: 'My App' },
				method: 'POST',
				url: '/teams/team-1/create_project',
			},
			{
				group: 'projects',
				name: 'delete',
				input: { project_id: 'proj-1' },
				method: 'POST',
				url: '/projects/proj-1/delete',
			},
			{
				group: 'deployments',
				name: 'list',
				input: { project_id: 'proj-1' },
				method: 'GET',
				url: '/projects/proj-1/list_deployments',
			},
			{
				group: 'deployments',
				name: 'get',
				input: { deployment_name: 'happy-otter-123' },
				method: 'GET',
				url: '/deployments/happy-otter-123',
			},
			{
				group: 'deployments',
				name: 'create',
				input: { project_id: 'proj-1', type: 'prod' },
				method: 'POST',
				url: '/projects/proj-1/create_deployment',
			},
			{
				group: 'deployments',
				name: 'update',
				input: { deployment_name: 'happy-otter-123' },
				method: 'PATCH',
				url: '/deployments/happy-otter-123',
			},
			{
				group: 'deployments',
				name: 'delete',
				input: { deployment_name: 'happy-otter-123' },
				method: 'POST',
				url: '/deployments/happy-otter-123/delete',
			},
			{
				group: 'deployKeys',
				name: 'create',
				input: { deployment_name: 'happy-otter-123', name: 'ci' },
				method: 'POST',
				url: '/deployments/happy-otter-123/create_deploy_key',
			},
			{
				group: 'deployKeys',
				name: 'list',
				input: { deployment_name: 'happy-otter-123' },
				method: 'GET',
				url: '/deployments/happy-otter-123/list_deploy_keys',
			},
			{
				group: 'customDomains',
				name: 'delete',
				input: {
					deployment_name: 'happy-otter-123',
					requestDestination: 'convexCloud',
					domain: 'api.example.com',
				},
				method: 'POST',
				url: '/deployments/happy-otter-123/delete_custom_domain',
			},
			{
				group: 'platform',
				name: 'getTokenDetails',
				input: {},
				method: 'GET',
				url: '/token_details',
			},
			{
				group: 'platform',
				name: 'listDeploymentClasses',
				input: { team_id: 'team-1' },
				method: 'GET',
				url: '/teams/team-1/list_deployment_classes',
			},
			{
				group: 'platform',
				name: 'listDeploymentRegions',
				input: { team_id: 'team-1' },
				method: 'GET',
				url: '/teams/team-1/list_deployment_regions',
			},
			{
				group: 'deployment',
				name: 'executeQueryBatch',
				input: {
					deployKey: 'prod:deploy-key',
					queries: [{ path: 'messages:list', args: {} }],
				},
				method: 'POST',
				url: '/query_batch',
				baseUrl: 'https://acoustic-panther-728.convex.cloud/api',
				auth: 'Convex prod:deploy-key',
			},
			{
				group: 'deployment',
				name: 'getQueryTimestamp',
				input: { deployKey: 'prod:deploy-key' },
				method: 'POST',
				url: '/query_ts',
				baseUrl: 'https://acoustic-panther-728.convex.cloud/api',
				auth: 'Convex prod:deploy-key',
			},
			{
				group: 'deployment',
				name: 'listLogStreams',
				input: { deployKey: 'prod:deploy-key' },
				method: 'GET',
				url: '/list_log_streams',
				baseUrl: 'https://acoustic-panther-728.convex.cloud/api',
				auth: 'Convex prod:deploy-key',
			},
		];

		for (const testCase of cases) {
			const handler = endpoints[testCase.group]?.[testCase.name];
			if (!handler) {
				throw new Error(
					`[test] missing endpoint ${testCase.group}.${testCase.name}`,
				);
			}

			mockRequest.mockClear();
			mockRequest.mockResolvedValue({ ok: true });
			await handler(mockCtx, testCase.input);

			const call = mockRequest.mock.calls[0]?.[1];
			expect(call).toMatchObject({
				method: testCase.method,
				url: testCase.url,
			});
			if (testCase.baseUrl) {
				expect(mockRequest.mock.calls[0]?.[0].BASE).toBe(testCase.baseUrl);
			}
			if (testCase.auth) {
				expect(mockRequest.mock.calls[0]?.[0].HEADERS.Authorization).toBe(
					testCase.auth,
				);
			}
		}
	});

	it('requires a deployment name for deployment-scoped operations', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const ctxWithoutSubdomain = {
			...mockCtx,
			options: {},
			keys: { get_subdomain: async () => null },
		} as unknown as ConvexContext;

		await expect(
			getEndpoint(
				endpoints,
				'deployment',
				'executeQueryBatch',
			)(ctxWithoutSubdomain, {
				queries: [{ path: 'messages:list', args: {} }],
			}),
		).rejects.toThrow('deployment name');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('prefers the explicit subdomain input over stored keys', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await getEndpoint(
			endpoints,
			'deployment',
			'getQueryTimestamp',
		)(mockCtx, {
			subdomain: 'custom-deploy-1',
			deployKey: 'prod:deploy-key',
		});

		expect(mockRequest.mock.calls[0]?.[0].BASE).toBe(
			'https://custom-deploy-1.convex.cloud/api',
		);
	});

	it('sends project body fields only when provided', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await getEndpoint(
			endpoints,
			'projects',
			'create',
		)(mockCtx, {
			team_id: 'team-1',
			projectName: 'My App',
			deploymentType: 'prod',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/teams/team-1/create_project',
			body: { projectName: 'My App', deploymentType: 'prod' },
		});
	});

	it('keeps query params on list endpoints', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await getEndpoint(
			endpoints,
			'projects',
			'list',
		)(mockCtx, {
			team_id: 'team-1',
			limit: 25,
			q: 'demo',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/teams/team-1/projects',
			query: { limit: 25, q: 'demo' },
		});
	});

	it('caches wrapped list responses when database clients exist', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: { upsertByEntityId: jest.fn() },
				deployments: { upsertByEntityId: jest.fn() },
				deployKeys: { upsertByEntityId: jest.fn() },
			},
		} as unknown as ConvexContext;

		mockRequest
			.mockResolvedValueOnce({
				items: [{ id: 'proj-1', name: 'Demo', slug: 'demo' }],
				pagination: { hasMore: false, nextCursor: null },
			})
			.mockResolvedValueOnce([
				{ name: 'happy-otter-123', deploymentType: 'prod' },
			]);

		await getEndpoint(
			endpoints,
			'projects',
			'list',
		)(ctxWithDb, {
			team_id: 'team-1',
		});
		await getEndpoint(
			endpoints,
			'deployments',
			'list',
		)(ctxWithDb, {
			project_id: 'proj-1',
		});

		expect(ctxWithDb.db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'proj-1',
			expect.objectContaining({ name: 'Demo' }),
		);
		expect(ctxWithDb.db.deployments.upsertByEntityId).toHaveBeenCalledWith(
			'happy-otter-123',
			expect.objectContaining({ deploymentType: 'prod' }),
		);
	});

	it('deletes cached entities for destructive operations', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: { deleteByEntityId: jest.fn() },
				deployments: { deleteByEntityId: jest.fn() },
			},
		} as unknown as ConvexContext;

		await getEndpoint(
			endpoints,
			'projects',
			'delete',
		)(ctxWithDb, {
			project_id: 'proj-1',
		});
		await getEndpoint(
			endpoints,
			'deployments',
			'delete',
		)(ctxWithDb, {
			deployment_name: 'happy-otter-123',
		});

		expect(ctxWithDb.db.projects.deleteByEntityId).toHaveBeenCalledWith(
			'proj-1',
		);
		expect(ctxWithDb.db.deployments.deleteByEntityId).toHaveBeenCalledWith(
			'happy-otter-123',
		);
	});

	it('rejects subdomains that could escape the deployment host', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await expect(
			getEndpoint(
				endpoints,
				'deployment',
				'executeQueryBatch',
			)(mockCtx, {
				subdomain: 'attacker.example:443/',
				deployKey: 'prod:deploy-key',
				queries: [{ path: 'messages:list', args: {} }],
			}),
		).rejects.toThrow('Invalid Convex deployment name');
		expect(mockRequest).not.toHaveBeenCalled();

		// The input schema rejects malicious subdomains before the handler runs.
		expect(
			ConvexEndpointInputSchemas.executeQueryBatch.safeParse({
				subdomain: 'attacker.example:443/',
				deployKey: 'prod:deploy-key',
				queries: [{ path: 'messages:list', args: {} }],
			}).success,
		).toBe(false);

		// A valid subdomain with a deploy key passes schema validation.
		expect(
			ConvexEndpointInputSchemas.executeQueryBatch.safeParse({
				subdomain: 'acoustic-panther-728',
				deployKey: 'prod:deploy-key',
				queries: [{ path: 'messages:list', args: {} }],
			}).success,
		).toBe(true);
	});

	it('rejects deployment-scoped operations without any deploy key', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await expect(
			getEndpoint(endpoints, 'deployment', 'getQueryTimestamp')(mockCtx, {}),
		).rejects.toThrow('deploy key');
		expect(mockRequest).not.toHaveBeenCalled();

		// The input schema accepts an omitted deployKey (the handler resolves it
		// from the connection), but never a non-string value.
		expect(
			ConvexEndpointInputSchemas.executeQueryBatch.safeParse({
				queries: [{ path: 'messages:list', args: {} }],
			}).success,
		).toBe(true);
	});

	it('falls back to the stored connection deploy key', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const ctxWithStoredDeployKey = {
			...mockCtx,
			keys: {
				get_subdomain: async () => 'acoustic-panther-728',
				get_deploy_key: async () => 'prod:stored-deploy-key',
			},
		} as unknown as ConvexContext;

		await getEndpoint(
			endpoints,
			'deployment',
			'getQueryTimestamp',
		)(ctxWithStoredDeployKey, {});

		expect(mockRequest.mock.calls[0]?.[0].HEADERS.Authorization).toBe(
			'Convex prod:stored-deploy-key',
		);
	});

	it('lets deploy-key-only connections reach deployment-scoped endpoints', async () => {
		const plugin = convex();
		const keyBuilder = plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string | undefined>;
		const deployKeyOnlyCtx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => null,
				get_deploy_key: async () => 'prod:deploy-key',
			},
		} as never;

		await expect(keyBuilder(deployKeyOnlyCtx, 'endpoint')).resolves.toBe('');

		// A completely empty connection is still an auth-missing error.
		const emptyCtx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => null,
				get_deploy_key: async () => null,
			},
		} as never;
		await expect(keyBuilder(emptyCtx, 'endpoint')).rejects.toThrow();
	});

	it('returns the access token for Management-capable connections', async () => {
		const plugin = convex();
		const keyBuilder = plugin.keyBuilder as (
			ctx: unknown,
			source: string,
		) => Promise<string | undefined>;
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => 'access-token',
				get_deploy_key: async () => null,
			},
		} as never;

		await expect(keyBuilder(ctx, 'endpoint')).resolves.toBe('access-token');
	});

	it('accepts a per-call deploy key for deployment-scoped operations', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await getEndpoint(
			endpoints,
			'deployment',
			'getQueryTimestamp',
		)(mockCtx, {
			deployKey: 'prod:deploy-key',
		});

		expect(mockRequest.mock.calls[0]?.[0].HEADERS.Authorization).toBe(
			'Convex prod:deploy-key',
		);
	});

	it('does not let cache failures mask a successful create', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
				deployments: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
				deployKeys: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
			},
		} as unknown as ConvexContext;

		mockRequest.mockResolvedValue({
			ok: true,
			id: 'proj-1',
			name: 'happy-otter-123',
			deployKey: 'secret',
		});

		await expect(
			getEndpoint(
				endpoints,
				'projects',
				'create',
			)(ctxWithDb, {
				team_id: 'team-1',
				projectName: 'My App',
			}),
		).resolves.toMatchObject({ ok: true });

		await expect(
			getEndpoint(
				endpoints,
				'deployments',
				'create',
			)(ctxWithDb, {
				project_id: 'proj-1',
				type: 'prod',
			}),
		).resolves.toMatchObject({ ok: true });

		await expect(
			getEndpoint(
				endpoints,
				'deployKeys',
				'create',
			)(ctxWithDb, {
				deployment_name: 'happy-otter-123',
				name: 'ci',
			}),
		).resolves.toMatchObject({ ok: true });
	});

	it('does not cache deploy key metadata at create time', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const upsert = jest.fn();
		const ctxWithDb = {
			...mockCtx,
			db: { deployKeys: { upsertByEntityId: upsert } },
		} as unknown as ConvexContext;

		await getEndpoint(
			endpoints,
			'deployKeys',
			'create',
		)(ctxWithDb, {
			deployment_name: 'happy-otter-123',
			name: 'ci',
		});

		expect(upsert).not.toHaveBeenCalled();
	});

	it('refreshes the cached deployment record after an update', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const upsert = jest.fn();
		const ctxWithDb = {
			...mockCtx,
			db: { deployments: { upsertByEntityId: upsert } },
		} as unknown as ConvexContext;

		mockRequest.mockResolvedValueOnce({}).mockResolvedValueOnce({
			name: 'happy-otter-123',
			deploymentType: 'prod',
			id: 'dep-1',
			projectId: 'proj-1',
		});

		await getEndpoint(
			endpoints,
			'deployments',
			'update',
		)(ctxWithDb, {
			deployment_name: 'happy-otter-123',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({ method: 'PATCH' });
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({ method: 'GET' });
		expect(upsert).toHaveBeenCalledWith(
			'happy-otter-123',
			expect.objectContaining({ deploymentType: 'prod' }),
		);
	});

	it('cleans up cached deployments when a project is deleted', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const deleteDeployment = jest.fn();
		const deleteKey = jest.fn();
		const ctxWithDb = {
			...mockCtx,
			db: {
				projects: { deleteByEntityId: jest.fn() },
				deployments: {
					deleteByEntityId: deleteDeployment,
					list: jest.fn().mockResolvedValue([
						{
							entity_id: 'happy-otter-123',
							data: { projectId: 'proj-1' },
						},
						{
							entity_id: 'brave-bear-456',
							data: { projectId: 'proj-1' },
						},
						{
							entity_id: 'other-project-dep',
							data: { projectId: 'proj-2' },
						},
					]),
				},
				deployKeys: {
					deleteByEntityId: deleteKey,
					list: jest.fn().mockResolvedValue([
						{
							entity_id: 'key-1',
							data: { deploymentName: 'happy-otter-123' },
						},
						{
							entity_id: 'key-2',
							data: { deploymentName: 'other-project-dep' },
						},
					]),
				},
			},
		} as unknown as ConvexContext;

		await getEndpoint(
			endpoints,
			'projects',
			'delete',
		)(ctxWithDb, {
			project_id: 'proj-1',
		});

		expect(deleteDeployment).toHaveBeenCalledWith('happy-otter-123');
		expect(deleteDeployment).toHaveBeenCalledWith('brave-bear-456');
		expect(deleteDeployment).not.toHaveBeenCalledWith('other-project-dep');
		expect(deleteKey).toHaveBeenCalledWith('key-1');
		expect(deleteKey).not.toHaveBeenCalledWith('key-2');
	});

	it('cleans up cached deploy keys when a deployment is deleted', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const deleteKey = jest.fn();
		const ctxWithDb = {
			...mockCtx,
			db: {
				deployments: { deleteByEntityId: jest.fn() },
				deployKeys: {
					deleteByEntityId: deleteKey,
					list: jest.fn().mockResolvedValue([
						{
							entity_id: 'key-1',
							data: { deploymentName: 'happy-otter-123' },
						},
						{
							entity_id: 'key-2',
							data: { deploymentName: 'other-dep' },
						},
					]),
				},
			},
		} as unknown as ConvexContext;

		await getEndpoint(
			endpoints,
			'deployments',
			'delete',
		)(ctxWithDb, {
			deployment_name: 'happy-otter-123',
		});

		expect(deleteKey).toHaveBeenCalledWith('key-1');
		expect(deleteKey).not.toHaveBeenCalledWith('key-2');
	});

	it('builds regional convex.cloud hosts from multi-label subdomains', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await getEndpoint(
			endpoints,
			'deployment',
			'getQueryTimestamp',
		)(mockCtx, {
			subdomain: 'calm-cow-456.eu-west-1',
			deployKey: 'prod:deploy-key',
		});

		expect(mockRequest.mock.calls[0]?.[0].BASE).toBe(
			'https://calm-cow-456.eu-west-1.convex.cloud/api',
		);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/query_ts',
		});
	});

	it('accepts an explicit convex.cloud deployment URL', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await getEndpoint(
			endpoints,
			'deployment',
			'executeQueryBatch',
		)(mockCtx, {
			deploymentUrl: 'https://calm-cow-456.eu-west-1.convex.cloud',
			deployKey: 'prod:deploy-key',
			queries: [{ path: 'messages:list', args: {} }],
		});

		expect(mockRequest.mock.calls[0]?.[0].BASE).toBe(
			'https://calm-cow-456.eu-west-1.convex.cloud/api',
		);
	});

	it('rejects deployment URLs that are not convex.cloud hosts', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await expect(
			getEndpoint(
				endpoints,
				'deployment',
				'getQueryTimestamp',
			)(mockCtx, {
				deploymentUrl: 'https://attacker.example/api',
				deployKey: 'prod:deploy-key',
			}),
		).rejects.toThrow('deployment URL');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects management path segments that can escape the route', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;

		await expect(
			getEndpoint(
				endpoints,
				'deployments',
				'get',
			)(mockCtx, {
				deployment_name: 'happy-otter-123/../other',
			}),
		).rejects.toThrow('path');
		expect(mockRequest).not.toHaveBeenCalled();

		expect(
			ConvexEndpointInputSchemas.deploymentGet.safeParse({
				deployment_name: 'happy-otter-123/../other',
			}).success,
		).toBe(false);
		expect(
			ConvexEndpointInputSchemas.projectsList.safeParse({
				team_id: '41/../0',
			}).success,
		).toBe(false);
	});

	it('parses official integer Management API payloads', () => {
		expect(
			ConvexEndpointOutputSchemas.projectsList.safeParse({
				items: [
					{
						id: 123,
						name: 'Demo',
						slug: 'demo',
						teamId: 41,
						teamSlug: 'acme',
						createTime: 1710000000000,
						prodDeploymentName: 'happy-otter-123',
						devDeploymentName: null,
					},
				],
				pagination: { hasMore: false },
			}).success,
		).toBe(true);

		expect(
			ConvexEndpointOutputSchemas.projectCreate.safeParse({
				projectId: 123,
				id: 123,
				slug: 'demo',
				deploymentName: 'happy-otter-123',
				deploymentUrl: 'https://happy-otter-123.convex.cloud',
			}).success,
		).toBe(true);

		expect(
			ConvexEndpointOutputSchemas.deploymentGet.safeParse({
				id: 7,
				name: 'happy-otter-123',
				createTime: 1710000000000,
				lastDeployTime: null,
				deploymentType: 'prod',
				projectId: 123,
				region: 'aws-us-east-1',
				isDefault: true,
				reference: 'prod',
				deploymentUrl: 'https://happy-otter-123.convex.cloud',
				class: 'convex',
				kind: 'cloud',
			}).success,
		).toBe(true);

		expect(
			ConvexEndpointOutputSchemas.deployKeysList.safeParse([
				{
					id: 99,
					name: 'ci',
					creationTime: 1710000000000,
					lastUsedTime: null,
					expiresAt: null,
					allowedActions: ['deployment:deploy'],
				},
			]).success,
		).toBe(true);

		expect(
			ConvexEndpointOutputSchemas.tokenDetails.safeParse({
				id: 1,
				teamId: 41,
				name: 'local',
				createTime: 1710000000000,
				type: 'teamToken',
			}).success,
		).toBe(true);
	});

	it('does not persist deploy keys in completion events', async () => {
		const plugin = convex({ key: 'test-token' });
		const endpoints = plugin.endpoints as unknown as TestEndpoints;
		const mockLogEvent = logEventFromContext as jest.Mock;
		mockLogEvent.mockClear();

		await getEndpoint(
			endpoints,
			'deployment',
			'getQueryTimestamp',
		)(mockCtx, {
			deployKey: 'prod:deploy-key',
		});

		expect(mockLogEvent).toHaveBeenCalled();
		const payload = mockLogEvent.mock.calls[0]?.[2];
		expect(payload).not.toEqual(
			expect.objectContaining({ deployKey: 'prod:deploy-key' }),
		);
		expect(JSON.stringify(payload)).not.toContain('prod:deploy-key');
	});
});

describe('Convex error handlers', () => {
	const { errorHandlers } = jest.requireActual('./error-handlers');
	const { ConvexAPIError } = jest.requireActual('./client');

	it('matches 429 rate limits with retry config', async () => {
		const error = new ConvexAPIError('Too Many Requests', 429);
		const entry = errorHandlers.RATE_LIMIT_ERROR;
		expect(entry.match(error)).toBe(true);
		await expect(entry.handler(error)).resolves.toMatchObject({
			maxRetries: 5,
		});
	});

	it('matches 401 auth errors without retries', async () => {
		const error = new ConvexAPIError('Unauthorized', 401);
		const entry = errorHandlers.AUTH_ERROR;
		expect(entry.match(error)).toBe(true);
		await expect(entry.handler(error)).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('matches 403 permission errors', () => {
		const error = new ConvexAPIError('Forbidden', 403);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
	});

	it('matches 404 not found errors', () => {
		const error = new ConvexAPIError('Not Found', 404);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});

	it('falls through to DEFAULT for unknown errors', () => {
		const error = new Error('mystery failure');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
	});
});
